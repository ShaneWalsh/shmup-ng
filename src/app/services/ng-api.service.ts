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
  public medals: any;
  public scoreboards: any;
  public scoreboardId: number;
  public session: any = null;

  constructor() {
    console.log("NgApiService: init");
    this.ngio = new this.mylib.Newgrounds.io.core(
      "51636:KzSDZa4W",
      "ouWD8Gn7AjdZDKC8N969Xw=="
    );
  }

  public initSession() {
    var self = this;
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

  onLoggedIn() {
    console.log("Welcome " + this.ngio.user.name + "!");
    this.loggedIn = true;
  }

  public loadAll() {
    this.startSession();
    this.loadMedals();
    //this.loadScoreBoards();
    //this.loadHighScores();
    this.initSession();
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
      // window.setTopTen(result.scores);
    }
  }

  postScore(topic, { score }) {
    if (!this.ngio.user) return;
    this.ngio.callComponent(
      "ScoreBoard.postScore",
      { id: this.scoreboardId, value: score },
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
    if (!p.ngio.user) return;
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
      this.scoreboards = result.scoreboards;
      //console.log(result.scoreboards);
      this.loadHighScores();
    }
  }

  startSession() {
    this.ngio.queueComponent(
      "App.startSession",
      {},
      this.onSessionLoaded.bind(this)
    );
    this.ngio.executeQueue();
  }

  loadMedals() {
    this.ngio.queueComponent(
      "Medal.getList",
      {},
      this.onMedalsLoaded.bind(this)
    );
    this.ngio.executeQueue();
  }

  loadScoreBoards() {
    this.ngio.queueComponent(
      "ScoreBoard.getBoards",
      {},
      this.onScoreboardsLoaded.bind(this)
    );
    this.ngio.executeQueue();
  }

  loadHighScores() {
    this.ngio.callComponent(
      "ScoreBoard.getScores",
      { id: this.scoreboardId, period: "A" },
      this.onTopTen
    );
  }
}
