declare var libGlobal: any;
declare var require: any;

//import * from "src/assets/js/newgroundsio.min.js";
// https://www.techiediaries.com/use-external-javascript-libraries-typescript-projects/

import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NgApiService {
  // in order for this to work I had to add export.Newgrounds = Newgrounds to the end of the min file so it could be imported as a module.
  public mylib = require("src/assets/js/newgroundsio.min.js");
  public ngio: any;

  public loggedIn: boolean;
  public medals: any = [];
  public scoreboards: ScoreBoard[];
  public session: any = null;
  public setupComplete: boolean;

  constructor() {
    console.log("NgApiService: init");
    const self = this;
    try{
    this.ngio = new this.mylib.Newgrounds.io.core(
      "51636:KzSDZa4W",
      "ouWD8Gn7AjdZDKC8N969Xw=="
    );
    } catch(e){ // non logged in users, this might fail, throwing an error breaking the game code.
      self.setupComplete = false;
      return;
    }
    this.setupComplete = true;
  }

  public initSession() {
    var self = this;
    if(this.setupComplete){
      this.ngio.getValidSession(function () {
        if (self.ngio.user) {
          /*
          * If we have a saved session, and it has not expired,
          * we will also have a user object we can access.
          * We can go ahead and run our onLoggedIn handler here.
          */
          console.log("NgApiService:have a saved session");
          self.onLoggedIn();
        } else {
          /*
          * If we didn't have a saved session, or it has expired
          * we should have been given a new one at this point.
          * This is where you would draw a 'sign in' button and
          * have it execute the following requestLogin function.
          */
          // I dont have to do anything, becasuse its false by default.
          console.log("NgApiService:didn't have a saved session");
        }
      });
    }
  }

  onLoggedIn() {
    console.log("Welcome " + this.ngio.user.name + "!");
    this.loggedIn = true;
  }

  public loadAll() {
    if(this.setupComplete){
      this.startSession();
      this.loadMedals();
      this.loadScoreBoards();
      //this.loadHighScores();
      this.initSession();
    }
  }

  /* handle loaded medals */
  onPostedScore(result) {
    if (result.success) {
      //console.log(result);
    } else {
      //console.log("feck");
      //console.log(result);
    }
  }

  /* handle loaded top 10 */
  onTopTen(result) {
    if (result.success) {
      let board:ScoreBoard = this.scoreboards.find( v => v.id === result.scoreboard.id);
      board.scores = result.scores;
      // window.setTopTen(result.scores);
    }
  }

  public postScore(boardName,score) {
    if (!this.setupComplete || !this.ngio.user) return;
    let board = this.scoreboards.find( v => v.name == boardName);
    this.ngio.callComponent(
      "ScoreBoard.postScore",
      { id: board.id, value: score },
      this.onPostedScore
    );
  }

  onMedalUnlocked(medal) {
    console.log("MEDAL GET:", medal.name);
  }

  unlockMedal(medal_name) {
    console.log("unlocking medal:", medal_name)
    var p = this;
    /* If there is no user attached to our ngio object, it means the user isn't logged in and we can't unlock anything */
    if (!this.setupComplete || !p.ngio.user) return;
    var medal;
    for (var i = 0; i < p.medals.length; i++) {
      medal = p.medals[i];
      /* look for a matching medal name */
      if (medal.name == medal_name) {
        /* we can skip unlocking a medal that's already been earned */
        if (!medal.unlocked) {
          var self = this;
          /* unlock the medal from the server */
          p.ngio.callComponent(
            "Medal.unlock",
            { id: medal.id },
            function (result) {
              if (result.success) self.onMedalUnlocked(result.medal);
            }
          );
        }

        return;
      }
    }
  }

  /* handle loaded medals */
  onSessionLoaded(result) {
    if (result.success) this.session = result.session;
  }

  /* handle loaded medals */
  onMedalsLoaded(result) {
    if (result.success) {
      this.medals = result.medals;
      console.log(this.medals);
    }
  }

  /* handle loaded scores */
  onScoreboardsLoaded(result) {
    if (result.success) {
      this.scoreboards = [];
      for(let board of result.scoreboards){
        this.scoreboards.push(new ScoreBoard(board.id,board.name,[]))
      }
      console.log(this.scoreboards );
      for(let board of this.scoreboards){
        this.loadHighScores(board.id);
      }
    }
  }

  startSession() {
    if(this.setupComplete){
      this.ngio.queueComponent(
        "App.startSession",
        {},
        this.onSessionLoaded.bind(this)
      );
      this.ngio.executeQueue();
    }
  }

  loadMedals() {
    if(this.setupComplete){
      this.ngio.queueComponent(
        "Medal.getList",
        {},
        this.onMedalsLoaded.bind(this)
      );
      this.ngio.executeQueue();
    }
  }

  loadScoreBoards() {
    if(this.setupComplete){
      this.ngio.queueComponent(
        "ScoreBoard.getBoards",
        {},
        this.onScoreboardsLoaded.bind(this)
      );
      this.ngio.executeQueue();
    }
  }

  loadHighScores(scoreboardId:number) {
    if(this.setupComplete){
      this.ngio.callComponent(
        "ScoreBoard.getScores",
        { id: scoreboardId, period: "A" },
        this.onTopTen.bind(this)
      );
    }
  }
}

export class ScoreBoard {
  constructor(
    public id:number,
    public name:string,
    public scores:any[]
  ){

  }
}
