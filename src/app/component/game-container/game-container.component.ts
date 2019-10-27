import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.service';
import { PlayerService } from 'src/app/services/player.service';
import { LevelManagerService } from 'src/app/manager/level-manager.service';

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit {
    @ViewChild('canvas') public canvas: ElementRef;

    gameLoaded:boolean=false;
    canvasEl: any;
    ctx: CanvasRenderingContext2D;
    @Input() public width = 640;
    @Input() public height = 480;
    requestAnimFrame: any;


//    imageObj = new Image();
    //imageName = "../../../assets/img/player/player-1-ship.png";
    //imageName = "../../../assets/img/levels/level1/level-1-background.png";


    constructor(private resourcesService:ResourcesService,private levelManagerService:LevelManagerService, private playerService:PlayerService) {
        // check if an existing game has been loaded
        // subscribe to the level loader
        this.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // this redraws the canvas when the browser is updating. Crome 18 is execllent for canvas, makes it much faster by using os
						   window["mozRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"]
						   || function(callback) { window.setTimeout(callback,1000/60);};

       //this.imageObj = this.resourcesService.getRes().get("level-1-background");
    }

    ngOnInit() {

    }


//https://stackoverflow.com/questions/51214548/angular-5-with-canvas-drawimage-not-showing-up
    public ngAfterViewInit() {
        this.canvasEl = this.canvas.nativeElement;
        this.ctx = this.canvasEl.getContext('2d');

        this.canvasEl.width = this.width;
        this.canvasEl.height = this.height;

        this.update();
        //setTimeout(e => this.update(), 500);
    }

    update() {
        if(this.levelManagerService.getNotPaused()){
            this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
            const currentLevel = this.levelManagerService.getCurrentLevel();
            // have a level manager, that controls the background and the spawning, updates first. 4 levels, controls boss spawn.
            currentLevel.update(this.ctx);
            // have a bot manager to move the bots (gen bullets, patterns etc)
            // update for the player (Gen bullets)
            // have a bullet manager to move the bullets, do collision detection
                // some bullets should be destructable.
                // some cannot be destroyed

            // vertical and horizontal, bare that in mind....

            //clear canvas


            this.playerService.currentPlayer.update(currentLevel, this.ctx);
        }
        this.requestAnimFrame(this.update.bind(this)); // takes a function as para, it will keep calling loop over and over again
    }
}
