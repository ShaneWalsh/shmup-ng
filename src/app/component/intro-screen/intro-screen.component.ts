import { Component, OnInit, OnDestroy } from '@angular/core';
import { KeyboardEventService } from 'src/app/services/keyboard-event.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { LevelManagerService } from 'src/app/manager/level-manager.service';
import { PlayerService} from '../../services/player.service';
import { LevelEnum } from 'src/app/manager/level-manager/LevelEnum';
import { NgApiService } from 'src/app/services/ng-api.service';
import { AudioServiceService } from 'src/app/services/audio-service.service';

@Component({
  selector: 'app-intro-screen',
  templateUrl: './intro-screen.component.html',
  styleUrls: ['./intro-screen.component.css']
})
export class IntroScreenComponent implements OnInit, OnDestroy  {
    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }
    private subs:Subscription[] =[];
    public levelIndex:number[] = []

    public gifTimer:number = 0;
    public gridTop = 50;
    public screenId:number = 0;
    public playerScore:number = 0;
    public playerLives:number = 0;
    public requestAnimFrame:any; // have to ensure this is not created multiple times!

    constructor(private keyboardEventService:KeyboardEventService, private levelManagerService: LevelManagerService, private playerService:PlayerService, private ngApiService:NgApiService, private audioServiceService:AudioServiceService) {
        this.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // this redraws the canvas when the browser is updating. Crome 18 is execllent for canvas, makes it much faster by using os
                           window["mozRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"]
                           || function(callback) { window.setTimeout(callback,1000/60);};
       this.update();

    }

    ngOnInit() {
      this.landedOnTitleScreen();
      this.subs.push(this.keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
        console.log("customKeyboardEvent",customKeyboardEvent);
        if(customKeyboardEvent.event.keyCode == 13) { //  == 'Enter'
          if(this.screenId < 6) {
            this.screenId++;
            if(this.screenId == 6) { // used to be 6 for screen 4+5 but those have been removed
              // lets assume the user picked a player here
              this.screenId = 6;
              this.playerService.initPlayer();
              this.levelManagerService.initLevel(LevelEnum.LevelOne);
            }
          } else if(this.screenId == 20) {
            this.screenId = 1;
            this.landedOnTitleScreen();
          } else if(this.screenId == 30) {
            this.screenId = 35;
            this.playerService.initPlayer(false, this.playerScore, this.playerLives);
            this.levelManagerService.initLevel(LevelEnum.LevelTwo);
          } else if(this.screenId == 40) {
            this.screenId = 45;
            this.playerService.initPlayer(false, this.playerScore, this.playerLives);
            this.levelManagerService.initLevel(LevelEnum.LevelThree);
          }
        }
        if(customKeyboardEvent.event.keyCode == 38 || customKeyboardEvent.event.keyCode == 40 || customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 83){
          if(this.screenId == 1) { // main menu select
            // perform a medal check again
            if (customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38) { // up
              let mainMenuSelection =  this.levelManagerService.mainMenuIndex - 1 ;
              if(mainMenuSelection < 0) mainMenuSelection = 3;
              this.levelManagerService.mainMenuIndex = mainMenuSelection;
            } else { //down 83 40
              let mainMenuSelection =  this.levelManagerService.mainMenuIndex + 1;
              if(mainMenuSelection > 3) mainMenuSelection = 0;
              this.levelManagerService.mainMenuIndex = mainMenuSelection;
            }
          }
          if(this.screenId == 3) { // diff select
            if (customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38) { // up
              let diff =  this.levelManagerService.difficulty -1;
              if(diff < 0) diff = 2;
              this.levelManagerService.difficulty = diff;
            } else {
              let diff =  this.levelManagerService.difficulty +1;
              if(diff > 2) diff = 0;
              this.levelManagerService.difficulty = diff;
            }
          }
          if(this.screenId == 4) { // pilot select
            let pilotSlection =  this.playerService.selectedPilot +1;
            if(pilotSlection > 1) pilotSlection = 0;
            this.playerService.selectedPilot = pilotSlection;
          }
          if(this.screenId == 5) { // ship select
            let shipSelection =  this.playerService.selectedShip +1;
            if(shipSelection > 1) shipSelection = 0;
            this.playerService.selectedShip = shipSelection;
          }
        }
      }));
      this.subs.push(this.playerService.getPlayerLivesGoneSubject().subscribe(playerObj => {
          this.levelManagerService.pauseGame(); // no point in it running for eternity
          this.checkMedals();
          this.playerScore =  playerObj.score;
          this.playerLives =  playerObj.lives;
          this.screenId = 20;
      }));
      this.subs.push(this.levelManagerService.getLevelCompleteSubject().subscribe(result => {
        this.levelManagerService.pauseGame(); // no point in it running for eternity
        this.checkMedals();
        this.playerScore =  this.playerService.currentPlayer.score;
        this.playerLives =  this.playerService.currentPlayer.lives;
        if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelOne){
          this.screenId = 30;
        } else if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelTwo){
          this.screenId = 40;
        } else if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelThree){
          // game over? You win?
        }
      }));
    }

  checkMedals() {
    // todo replace this with a medal check function, see if the user has any medals to unlock. This is a test
    this.ngApiService.unlockMedal('CompleteLevel1onEasy');
  }

    update() {
      this.gifTimer++;
      if(this.gifTimer > 60){this.gifTimer=0}
      this.levelManagerService.getGameTickSubject().next();
      this.requestAnimFrame(this.update.bind(this)); // takes a function as para, it will keep calling loop over and over again
    }

    landedOnTitleScreen(){
      this.audioServiceService.stopAllAudio(true);
      this.audioServiceService.update();
      this.audioServiceService.playAudio("titlescreen", true);
    }

  // // load image
  // try {
  //     // get input stream
  //     InputStream ims = getAssets().open("avatar.jpg");
  //     // load image as Drawable
  //     Drawable d = Drawable.createFromStream(ims, null);
  //     // set image to ImageView
  //     mImage.setImageDrawable(d);
  // }
  // catch(IOException ex) {
  //     return;
  // }

}
