import { Component, OnInit, OnDestroy } from '@angular/core';
import { KeyboardEventService } from 'src/app/services/keyboard-event.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { LevelInstance, LevelManagerService } from 'src/app/manager/level-manager.service';
import { PlayerService} from '../../services/player.service';
import { LevelEnum } from 'src/app/manager/level-manager/LevelEnum';
import { NgApiService } from 'src/app/services/ng-api.service';
import { AudioServiceService } from 'src/app/services/audio-service.service';
import { ProfileService } from 'src/app/services/profile.service';
import { OptionsService } from 'src/app/services/options.service';

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

    constructor(private profileService:ProfileService, private keyboardEventService:KeyboardEventService, private levelManagerService: LevelManagerService, private playerService:PlayerService, private audioServiceService:AudioServiceService, private optionsService:OptionsService) {
        this.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // this redraws the canvas when the browser is updating. Crome 18 is execllent for canvas, makes it much faster by using os
                           window["mozRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"]
                           || function(callback) { window.setTimeout(callback,1000/60);};
       this.update();
    }

    ngOnInit() {
      //this.landedOnTitleScreen();
      this.subs.push(this.keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
        console.log("customKeyboardEvent",customKeyboardEvent);
        //var key = customKeyboardEvent.event.key || customKeyboardEvent.event.keyCode;
        // todo fix this deprecation.
        var key:any = customKeyboardEvent.event.keyCode;
        // keyboard-event.service.ts:37 ArrowUp
        // keyboard-event.service.ts:37 ArrowDown
        // keyboard-event.service.ts:37 ArrowLeft
        // keyboard-event.service.ts:37 ArrowRight
        // keyboard-event.service.ts:37 a
        // keyboard-event.service.ts:37 d
        // keyboard-event.service.ts:37 s
        // keyboard-event.service.ts:37 w
        // Enter

        if(key == 'Enter' || key == 13) { //  == 'Enter'
          if(this.screenId < 6) {
            if(this.screenId == 0) {
              this.landedOnTitleScreen();
              this.setScreenId(this.screenId+1);
            } else { // we are past the title screen, on one of the menus
              if(this.screenId == 1 && this.levelManagerService.mainMenuIndex == 2){
                this.setScreenId(10);
              } else { // will have to add credits at some point
                this.setScreenId(this.screenId+1);
                if(this.screenId == 6) { // used to be 6 for screen 4+5 but those have been removed
                  // lets assume the user picked a player here

                  this.playerService.initPlayer();
                  if(this.levelManagerService.mainMenuIndex == 0){
                    this.setScreenId(6);
                    this.levelManagerService.initLevel(LevelEnum.LevelOne);
                  } else if(this.levelManagerService.mainMenuIndex == 1){
                    this.setScreenId(55);
                    this.levelManagerService.initLevel(LevelEnum.LevelFour);
                  }
                }
              }
            }
          } else if(this.screenId == 10) { // ops screen, back to MM.
            // handled with subject.
            this.setScreenId(1);
            this.landedOnTitleScreen();
          }else if(this.screenId == 20) { // game over screen
            this.setScreenId(1);
            this.landedOnTitleScreen();
          } else if(this.screenId == 30) {
            this.setScreenId(35);
            this.playerService.initPlayer(false, this.playerScore, this.playerLives);
            this.levelManagerService.initLevel(LevelEnum.LevelTwo);
          } else if(this.screenId == 40) {
            this.setScreenId(45);
            this.playerService.initPlayer(false, this.playerScore, this.playerLives);
            this.levelManagerService.initLevel(LevelEnum.LevelThree);
          } else if(this.screenId == 47) { // Game over for the whole game. P1
            this.setScreenId(48);
          } else if(this.screenId == 48) { // Game over for the whole game. P2
            this.profileService.checkMedals();
            this.setScreenId(1); // Return to main menu and let them play again!
            this.levelManagerService.mainMenuIndex = 0;
            this.landedOnTitleScreen();
          } else if(this.screenId == 60) {
            this.setScreenId(65);
            this.playerService.initPlayer(false, this.playerScore, this.playerLives);
            this.levelManagerService.initLevel(LevelEnum.LevelFive);
          } else if(this.screenId == 70) {
            this.setScreenId(75);
            this.playerService.initPlayer(false, this.playerScore, this.playerLives);
            this.levelManagerService.initLevel(LevelEnum.LevelSix);
          }

        }
        if(key == 'Escape' || key == 27) {
          if(this.screenId < 6) {
            this.setScreenId((this.screenId > 1)? this.screenId -1 : 1);
          }
        }
        if(key == 38 || key == 40 || key == 87 || key == 83){
          if(this.screenId == 1) { // main menu select
            // perform a medal check again
            if (key == 87 || key == 38) { // up
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
            if (key == 87 || key == 38) { // up
              let diff =  this.levelManagerService.difficulty -1;
              if(diff < 0) diff = 1;
              this.levelManagerService.difficulty = diff;
            } else {
              let diff =  this.levelManagerService.difficulty +1;
              if(diff > 1) diff = 0;
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
          this.profileService.checkMedals();
          this.playerScore =  playerObj.score;
          this.playerLives =  playerObj.lives;
          this.setScreenId(20);
      }));
      // Quitting from the options menu.
      this.subs.push(this.levelManagerService.getMenuQuitSubject().subscribe(bool => {
        this.levelManagerService.pauseGame(); // no point in it running for eternity
        this.profileService.checkMedals();
        this.setScreenId(1);
        this.levelManagerService.mainMenuIndex = 0;
        this.landedOnTitleScreen();
      }));
      this.subs.push(this.levelManagerService.getLevelCompleteSubject().subscribe(result => {
        this.levelManagerService.pauseGame(); // no point in it running for eternity
        result.unlockMedal();
        this.profileService.checkMedals();
        this.playerScore =  this.playerService.currentPlayer.score;
        if(this.optionsService.extraLifeOnLevelComplete()){
          this.playerLives =  this.playerService.currentPlayer.lives +1;
        } else {
          this.playerLives =  this.playerService.currentPlayer.lives;
        }
        if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelOne){
          this.setScreenId(30);
        } else if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelTwo){
          this.setScreenId(40);
        } else if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelThree){
          // game over? You win?
          this.setScreenId(47);
        } else if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelFour){
          this.setScreenId(60);
        } else if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelFive){
          this.setScreenId(70);
        } else if(this.levelManagerService.getCurrentLevelEnum() == LevelEnum.LevelSix){
          // game over? You win?
          this.setScreenId(47);
        }
      }));
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

    setScreenId(value:number) {
      this.screenId = value;
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
