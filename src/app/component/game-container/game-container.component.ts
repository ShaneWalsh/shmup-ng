import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.service';
import { PlayerService } from 'src/app/services/player.service';
import { LevelManagerService } from 'src/app/manager/level-manager.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { BulletManagerService } from 'src/app/manager/bullet-manager.service';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }
    private subs:Subscription[] = [];

    @ViewChild('canvas') public canvas: ElementRef;

    introOver:boolean = false; // set to true for testing to skip the intro
    introTicker:number = 0;
    introAnimation:number = 0;
    introAnimationLimit: number = 9; // 15
    introAnimationTimer: number = 0;
    introAnimationBlackScreen : number = 0;
    tickComplete:boolean=true;
    canvasEl: any;
    ctx: CanvasRenderingContext2D;
    @Input() public width = 640;
    @Input() public height = 480;
    @Input() public requestAnimFrame: any;

    constructor(private resourcesService:ResourcesService,
                private levelManagerService:LevelManagerService,
                private bulletManagerService: BulletManagerService,
                private playerService:PlayerService, private botManagerService:BotManagerService) {
        // check if an existing game has been loaded
        // subscribe to the level loader

       //this.imageObj = this.resourcesService.getRes().get("level-1-background");
       this.subs.push(this.levelManagerService.getGameTickSubject().subscribe(result => {
           if(this.tickComplete){
               this.update();
           }
       }));
    }

    ngOnInit() {
        this.subs.push(this.levelManagerService.getLevelCompleteSubject().subscribe(result => {

        }));

    }


//https://stackoverflow.com/questions/51214548/angular-5-with-canvas-drawimage-not-showing-up
    public ngAfterViewInit() {
        this.canvasEl = this.canvas.nativeElement;
        this.ctx = this.canvasEl.getContext('2d');

        this.canvasEl.width = this.width;
        this.canvasEl.height = this.height;

        if (this.introOver) {
            this.levelManagerService.unPauseGame();
        }
    }

    update() {
        this.tickComplete = false; 
        if(!this.introOver){
            this.levelManagerService.pauseGame();
            if (this.introAnimationTimer == this.introAnimationLimit) {
                this.introAnimation++;
                this.introAnimationTimer = 0;
            }
            this.introAnimationTimer++;
            this.introTicker++;
            if (this.introTicker > 250){ // 325
                this.introOver = true;
                this.levelManagerService.unPauseGame();
            } else {
                this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
                const currentLevel = this.levelManagerService.getCurrentLevel();
                // have a level manager, that controls the background and the spawning, updates first. 4 levels, controls boss spawn.
                currentLevel.updateIntro(this.ctx);
                if (this.introTicker < 200) {// 275
                    this.ctx.fillRect(0, 0, 640, 480);
                    this.ctx.fillRect(320, 240, 320, 240);
                } else {
                    this.introAnimationBlackScreen += 10; 
                    this.ctx.fillRect((-1) * this.introAnimationBlackScreen, 0, 320, 480);
                    this.ctx.fillRect(320 + this.introAnimationBlackScreen, 0, 320, 480);
                }

                let res = this.resourcesService.getRes().get("intro0");
                this.ctx.drawImage(res, 70, 100, 500, 60, 70, 100, 500, 70);
                let fullInit = this.resourcesService.getRes().get("intro15");
                const xSize = (70) + (this.introAnimation * 25);
                this.ctx.drawImage(fullInit, 70, 100, xSize, 60,    70, 100, xSize, 70);
                
                this.playerService.currentPlayer.updateIntro(this.ctx, this.introAnimation);
            } 
        } else {
            if(this.levelManagerService.getNotPaused()){
                this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
                const currentLevel = this.levelManagerService.getCurrentLevel();
                // have a level manager, that controls the background and the spawning, updates first. 4 levels, controls boss spawn.
                currentLevel.update(this.ctx);

                // have a bot manager to move the bots (gen bullets, patterns etc)
                this.botManagerService.update(currentLevel, this.ctx, this.bulletManagerService, this.playerService.currentPlayer);

                // update for the player (Gen bullets)
                this.playerService.currentPlayer.update(currentLevel, this.ctx, this.bulletManagerService);

                // have a bullet manager to move the bullets, do collision detection
                    // some bullets should be destructable.
                    // some cannot be destroyed
                this.bulletManagerService.update(currentLevel, this.ctx, this.botManagerService, this.playerService);

                // vertical and horizontal, bare that in mind....

                //clear canvas
            }
        }
        this.tickComplete = true;
    }
}
