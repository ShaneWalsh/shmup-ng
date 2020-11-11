import { Component, OnInit, OnDestroy } from '@angular/core';
import { KeyboardEventService } from 'src/app/services/keyboard-event.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { LevelManagerService, LevelEnum } from 'src/app/manager/level-manager.service';
import { PlayerService} from '../../services/player.service';

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
    public gifTimer:number = 0;
    public gridTop = 50;
    public screenId:number = 1;
    public playerScore:number = 0;
    public playerLives:number = 0;
    public requestAnimFrame:any; // have to ensure this is not created multiple times!

    constructor(private keyboardEventService:KeyboardEventService, private levelManagerService: LevelManagerService, private playerService:PlayerService) {
        this.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // this redraws the canvas when the browser is updating. Crome 18 is execllent for canvas, makes it much faster by using os
                           window["mozRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"]
                           || function(callback) { window.setTimeout(callback,1000/60);};
       this.update();

    }

    ngOnInit() {
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
                this.screenId = 3;
            } else if(this.screenId == 30) {
              this.screenId = 35;
              this.playerService.initPlayer(false, this.playerScore, this.playerLives);
              this.levelManagerService.initLevel(LevelEnum.LevelTwo);
            }
        }
        if(customKeyboardEvent.event.keyCode == 38 || customKeyboardEvent.event.keyCode == 40 || customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 83){ //  == 'Enter'
          if(this.screenId == 3) { // diff select
            let diff =  this.levelManagerService.difficulty +1;
            if(diff > 2) diff = 0;
            this.levelManagerService.difficulty = diff;
          }
          if(this.screenId == 4) { // pilot select
            let diff =  this.playerService.selectedPilot +1;
            if(diff > 1) diff = 0;
            this.playerService.selectedPilot = diff;
          }
          if(this.screenId == 5) { // ship select
            let diff =  this.playerService.selectedShip +1;
            if(diff > 1) diff = 0;
            this.playerService.selectedShip = diff;
          }
        }
      }));
        this.subs.push(this.playerService.getPlayerLivesGoneSubject().subscribe(playerObj => {
            this.levelManagerService.pauseGame(); // no point in it running for eternity
            this.playerScore =  playerObj.score;
            this.playerLives =  playerObj.lives;
            this.screenId = 20;
        }));
		this.subs.push(this.levelManagerService.getLevelCompleteSubject().subscribe(result => {
			this.levelManagerService.pauseGame(); // no point in it running for eternity
			this.playerScore =  this.playerService.currentPlayer.score;
			this.playerLives =  this.playerService.currentPlayer.lives;
			this.screenId = 30;
        }));
    }

    update(){
		this.gifTimer++;
		if(this.gifTimer > 60){this.gifTimer=0}
        this.levelManagerService.getGameTickSubject().next();
        this.requestAnimFrame(this.update.bind(this)); // takes a function as para, it will keep calling loop over and over again
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
