import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.service';
import { PlayerService } from 'src/app/services/player.service';
import { LevelManagerService } from 'src/app/manager/level-manager.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { BulletManagerService } from 'src/app/manager/bullet-manager.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { CanvasContainer } from 'src/app/domain/CanvasContainer';

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

    @ViewChild('canvasBG') public canvasBG: ElementRef;
    @ViewChild('canvasShadow') public canvasShadow: ElementRef;
    @ViewChild('canvas') public canvasMain: ElementRef;
    @ViewChild('canvasTop') public canvasTop: ElementRef;

    introOver:boolean = true; // set to true for testing to skip the intro
    introTicker:number = 0;
    introAnimation:number = 0;
    introAnimationLimit: number = 9; // 15
    introAnimationTimer: number = 0;
    introAnimationBlackScreen : number = 0;
    tickComplete:boolean=true;

    bgCanvasEl: any;
    bgCtx: CanvasRenderingContext2D;
    shadowCanvasEl: any;
    shadowCtx: CanvasRenderingContext2D;
    mainCanvasEl: any;
    mainCtx: CanvasRenderingContext2D;
    topCanvasEl: any;
    topCtx: CanvasRenderingContext2D;

    canvasContainer:CanvasContainer;

    @Input() public width = 480;
    @Input() public height = 640;
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
        this.bgCanvasEl = this.canvasBG.nativeElement;
        this.bgCtx = this.bgCanvasEl.getContext('2d');

        this.bgCanvasEl.width = this.width;
        this.bgCanvasEl.height = this.height;

        this.shadowCanvasEl = this.canvasShadow.nativeElement;
        this.shadowCtx = this.shadowCanvasEl.getContext('2d');

        this.shadowCanvasEl.width = this.width;
        this.shadowCanvasEl.height = this.height;

        this.mainCanvasEl = this.canvasMain.nativeElement;
        this.mainCtx = this.mainCanvasEl.getContext('2d');

        this.mainCanvasEl.width = this.width;
        this.mainCanvasEl.height = this.height;

        this.topCanvasEl = this.canvasTop.nativeElement;
        this.topCtx = this.topCanvasEl.getContext('2d');

        this.topCanvasEl.width = this.width;
        this.topCanvasEl.height = this.height;

        this.canvasContainer = new CanvasContainer(this.bgCanvasEl,this.bgCtx,this.shadowCanvasEl,this.shadowCtx,this.mainCanvasEl,this.mainCtx,this.topCanvasEl,this.topCtx);
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
                this.bgCtx.clearRect(0, 0, this.bgCanvasEl.width, this.bgCanvasEl.height);
                this.shadowCtx.clearRect(0, 0, this.shadowCanvasEl.width, this.shadowCanvasEl.height);
                this.mainCtx.clearRect(0, 0, this.mainCanvasEl.width, this.mainCanvasEl.height);
                const currentLevel = this.levelManagerService.getCurrentLevel();
                // have a level manager, that controls the background and the spawning, updates first. 4 levels, controls boss spawn.
                currentLevel.updateIntro(this.mainCtx);
                if (this.introTicker < 200) {// 275
                    this.mainCtx.fillRect(0, 0, 640, 640);
                    this.mainCtx.fillRect(320, 240, 320, 240);
                } else {
                    this.introAnimationBlackScreen += 5;
                    this.mainCtx.fillRect((-1) * this.introAnimationBlackScreen, 0, 240, 640);
                    this.mainCtx.fillRect(240 + this.introAnimationBlackScreen, 0, 240, 640);
                }

                let res = this.resourcesService.getRes().get("new-intro-1");
                this.mainCtx.drawImage(res, 70, 90, 500, 60, 70, 100, 500, 70);
                let fullInit = this.resourcesService.getRes().get("new-intro-16");
                const xSize = (70) + (this.introAnimation * 15);
                this.mainCtx.drawImage(fullInit, 70, 90, xSize, 60,    70, 100, xSize, 70);

                this.playerService.currentPlayer.updateIntro(this.mainCtx, this.introAnimation);
            }
        } else {
            if(this.levelManagerService.getNotPaused()){
                this.bgCtx.clearRect(0, 0, this.bgCanvasEl.width, this.bgCanvasEl.height);
                this.shadowCtx.clearRect(0, 0, this.shadowCanvasEl.width, this.shadowCanvasEl.height);
                this.mainCtx.clearRect(0, 0, this.mainCanvasEl.width, this.mainCanvasEl.height);

                const currentLevel = this.levelManagerService.getCurrentLevel();
                // have a level manager, that controls the background and the spawning, updates first. 4 levels, controls boss spawn.
                currentLevel.update(this.canvasContainer,this.playerService);

                // have a bot manager to move the bots (gen bullets, patterns etc)
                this.botManagerService.update(currentLevel, this.canvasContainer, this.bulletManagerService, this.playerService);

                // update for the player (Gen bullets)
                this.playerService.currentPlayer.update(currentLevel, this.canvasContainer, this.bulletManagerService, this.botManagerService);

                // have a bullet manager to move the bullets, do collision detection
                    // some bullets should be destructable.
                    // some cannot be destroyed
                this.bulletManagerService.update(currentLevel, this.canvasContainer, this.botManagerService, this.playerService);

                // vertical and horizontal, bare that in mind....

                //clear canvas
            }
        }
        this.tickComplete = true;
    }
}
