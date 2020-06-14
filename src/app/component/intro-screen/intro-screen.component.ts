import { Component, OnInit, OnDestroy } from '@angular/core';
import { KeyboardEventService } from 'src/app/services/keyboard-event.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { LevelManagerService, LevelEnum } from 'src/app/manager/level-manager.service';
import { PlayerService } from '../../services/player.service';

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
    public screenId:number = 1;
    public playerScore:number = 0;
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
            if(customKeyboardEvent.event.keyCode == 13){ //  == 'Enter'
                if(this.screenId < 5){
                    this.screenId++;
                    if(this.screenId == 5){ // boom, load up level one.
                        // lets assume the user picked a player here
                        this.playerService.initPlayer();
                        this.levelManagerService.initLevel(LevelEnum.LevelOne);
                    }
                } else if(this.screenId == 6 || this.screenId == 7){
                    this.screenId = 3;
                }
            }
        }));
        this.subs.push(this.playerService.getPlayerLivesGoneSubject().subscribe(playerObj => {
            this.levelManagerService.pauseGame(); // no point in it running for eternity
            this.playerScore =  playerObj.score;
            this.screenId = 6;
        }));
		this.subs.push(this.levelManagerService.getLevelCompleteSubject().subscribe(result => {
			this.levelManagerService.pauseGame(); // no point in it running for eternity
			this.playerScore =  this.playerService.currentPlayer.score;
			this.screenId = 7;
        }));
    }

    update(){
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
