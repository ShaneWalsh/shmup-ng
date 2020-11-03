import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.service';
import { PlayerService } from 'src/app/services/player.service';
import { LevelManagerService } from 'src/app/manager/level-manager.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { BulletManagerService } from 'src/app/manager/bullet-manager.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { CanvasContainer } from 'src/app/domain/CanvasContainer';
import { IntroAnimation } from 'src/app/domain/IntroAnimation';
import { OptionsService } from 'src/app/services/options.service';

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
    @ViewChild('canvasGroundShadow') public canvasGroundShadow: ElementRef;
    @ViewChild('canvasGround') public canvasGround: ElementRef;
    @ViewChild('canvasBGShadow') public canvasBGShadow: ElementRef;
    @ViewChild('canvas') public canvasMain: ElementRef;
    @ViewChild('canvasTop') public canvasTop: ElementRef;


    introOver:boolean = false;
    introAnimationInstance:IntroAnimation = null;

    introTicker:number = 0;
    introAnimation:number = 0;
    introAnimationLimit: number = 9; // 15
    introAnimationTimer: number = 0;
    introAnimationBlackScreen : number = 0;
    tickComplete:boolean=true;

    canvasContainer:CanvasContainer;

    @Input() public width = 480;
    @Input() public height = 640;
    @Input() public requestAnimFrame: any;

    constructor(
                private optionsService:OptionsService,
                private resourcesService:ResourcesService,
                private levelManagerService:LevelManagerService,
                private bulletManagerService: BulletManagerService,
                private playerService:PlayerService, private botManagerService:BotManagerService) {
      this.introOver = this.optionsService.isSkipIntro();
      this.subs.push(this.levelManagerService.getGameTickSubject().subscribe(result => {
        if(this.tickComplete){
            this.update();
        }
      }));
      this.playerService.currentPlayer.moveToMiddle();
      if(!this.levelManagerService.getCurrentLevel().hasIntro()){
        this.introOver = true;
      } else {
      this.introAnimationInstance = new IntroAnimation(
        [resourcesService.getRes().get("scene-1-1"),resourcesService.getRes().get("scene-1-2"),resourcesService.getRes().get("scene-1-3"),resourcesService.getRes().get("scene-1-4"),resourcesService.getRes().get("scene-1-5"),resourcesService.getRes().get("scene-1-6"),resourcesService.getRes().get("scene-1-7"),resourcesService.getRes().get("scene-1-8"),resourcesService.getRes().get("scene-1-9"),resourcesService.getRes().get("scene-1-10"),resourcesService.getRes().get("scene-1-11"),resourcesService.getRes().get("scene-1-12"),resourcesService.getRes().get("scene-1-13"),resourcesService.getRes().get("scene-1-14"),resourcesService.getRes().get("scene-1-15"),resourcesService.getRes().get("scene-1-16"),resourcesService.getRes().get("scene-1-17"),resourcesService.getRes().get("scene-1-18"),resourcesService.getRes().get("scene-1-19"),resourcesService.getRes().get("scene-1-20")],
        [resourcesService.getRes().get("scene-2-1"),resourcesService.getRes().get("scene-2-2"),resourcesService.getRes().get("scene-2-3"),resourcesService.getRes().get("scene-2-4"),resourcesService.getRes().get("scene-2-5"),resourcesService.getRes().get("scene-2-6"),resourcesService.getRes().get("scene-2-7"),resourcesService.getRes().get("scene-2-8"),resourcesService.getRes().get("scene-2-9"),resourcesService.getRes().get("scene-2-10"),resourcesService.getRes().get("scene-2-11"),resourcesService.getRes().get("scene-2-12"),resourcesService.getRes().get("scene-2-13"),resourcesService.getRes().get("scene-2-14"),resourcesService.getRes().get("scene-2-15"),
          resourcesService.getRes().get("scene-2-16"),
          resourcesService.getRes().get("scene-2-16"),
          resourcesService.getRes().get("scene-2-16"),
        ],
        [
          resourcesService.getRes().get("scene-3-1"),resourcesService.getRes().get("scene-3-2"),
          resourcesService.getRes().get("scene-3-1"),resourcesService.getRes().get("scene-3-2"),
          resourcesService.getRes().get("scene-3-1"),resourcesService.getRes().get("scene-3-2"),
          resourcesService.getRes().get("scene-3-1"),resourcesService.getRes().get("scene-3-2"),
          resourcesService.getRes().get("scene-3-3"),resourcesService.getRes().get("scene-3-4"),
          resourcesService.getRes().get("scene-3-3"),resourcesService.getRes().get("scene-3-4"),
          resourcesService.getRes().get("scene-3-3"),resourcesService.getRes().get("scene-3-4"),
          resourcesService.getRes().get("scene-3-5"),resourcesService.getRes().get("scene-3-6"),
          resourcesService.getRes().get("scene-3-5"),resourcesService.getRes().get("scene-3-6"),
        ],
        [resourcesService.getRes().get("scene-4-1"),resourcesService.getRes().get("scene-4-2"),resourcesService.getRes().get("scene-4-3"),resourcesService.getRes().get("scene-4-4"),resourcesService.getRes().get("scene-4-5"),resourcesService.getRes().get("scene-4-6"),],
      );
      }
    }

    ngOnInit() {
        this.subs.push(this.levelManagerService.getLevelCompleteSubject().subscribe(result => {

        }));
    }


//https://stackoverflow.com/questions/51214548/angular-5-with-canvas-drawimage-not-showing-up
    public ngAfterViewInit() {

        this.canvasContainer = new CanvasContainer(
            this.getCanvasEl(this.canvasBG, this.width, this.height),
            this.getCanvasEl(this.canvasGroundShadow, this.width, this.height),
            this.getCanvasEl(this.canvasGround, this.width, this.height),
            this.getCanvasEl(this.canvasBGShadow, this.width, this.height),
            this.getCanvasEl(this.canvasMain, this.width, this.height),
            this.getCanvasEl(this.canvasTop, this.width, this.height)
        );
        if (this.introOver) {
            this.levelManagerService.unPauseGame();
        }
    }

    getCanvasEl(ref:ElementRef, width, height):any{
      var el = ref.nativeElement;
      el.width = width;
      el.height = height;
      return el;
    }

    update() {
        let cc = this.canvasContainer;
        this.tickComplete = false;
        if(!this.introOver){
            this.levelManagerService.pauseGame();
            if(this.introAnimationInstance.isComplete()) {
              this.introOver = true;
              this.levelManagerService.unPauseGame();
            } else {
              this.introAnimationInstance.update(this.canvasContainer);
            }
            // deprecated old introduction
            // if (this.introAnimationTimer == this.introAnimationLimit) {
            //     this.introAnimation++;
            //     this.introAnimationTimer = 0;
            // }
            // this.introAnimationTimer++;
            // this.introTicker++;
            // if (this.introTicker > 250){ // 325
            //     this.introOver = true;
            //     this.levelManagerService.unPauseGame();
            // } else {
            //     cc.bgCtx.clearRect(0, 0, cc.canvasBGEl.width, cc.canvasBGEl.height);
            //     cc.groundShadowCtx.clearRect(0, 0, cc.canvasGroundShadowEl.width, cc.canvasGroundShadowEl.height);
            //     cc.groundCtx.clearRect(0, 0, cc.canvasGroundEl.width, cc.canvasGroundEl.height);
            //     cc.shadowCtx.clearRect(0, 0, cc.canvasBGShadowEl.width, cc.canvasBGShadowEl.height);
            //     cc.mainCtx.clearRect(0, 0, cc.canvasMainEl.width, cc.canvasMainEl.height);
            //     cc.topCtx.clearRect(0, 0, cc.canvasMainEl.width, cc.canvasMainEl.height);
            //     const currentLevel = this.levelManagerService.getCurrentLevel();
            //     // have a level manager, that controls the background and the spawning, updates first. 4 levels, controls boss spawn.
            //     currentLevel.updateIntro(cc.mainCtx);
            //     if (this.introTicker < 200) {// 275
            //       cc.mainCtx.fillRect(0, 0, 640, 640);
            //       cc.mainCtx.fillRect(320, 240, 320, 240);
            //     } else {
            //       this.introAnimationBlackScreen += 5;
            //       cc.mainCtx.fillRect((-1) * this.introAnimationBlackScreen, 0, 240, 640);
            //       cc.mainCtx.fillRect(240 + this.introAnimationBlackScreen, 0, 240, 640);
            //     }

            //     let res = this.resourcesService.getRes().get("new-intro-1");
            //     cc.mainCtx.drawImage(res, 70, 90, 500, 60, 70, 100, 500, 70);
            //     let fullInit = this.resourcesService.getRes().get("new-intro-16");
            //     const xSize = (70) + (this.introAnimation * 15);
            //     cc.mainCtx.drawImage(fullInit, 70, 90, xSize, 60,    70, 100, xSize, 70);

            //     this.playerService.currentPlayer.updateIntro(cc.mainCtx, this.introAnimation);
            // }
        } else {
            if(this.levelManagerService.getNotPaused()) {
              //clear canvas
              cc.bgCtx.clearRect(0, 0, cc.canvasBGEl.width, cc.canvasBGEl.height);
              cc.groundShadowCtx.clearRect(0, 0, cc.canvasGroundShadowEl.width, cc.canvasGroundShadowEl.height);
              cc.groundCtx.clearRect(0, 0, cc.canvasGroundEl.width, cc.canvasGroundEl.height);
              cc.shadowCtx.clearRect(0, 0, cc.canvasBGShadowEl.width, cc.canvasBGShadowEl.height);
              cc.mainCtx.clearRect(0, 0, cc.canvasMainEl.width, cc.canvasMainEl.height);
              cc.topCtx.clearRect(0, 0, cc.canvasMainEl.width, cc.canvasMainEl.height);

              const currentLevel = this.levelManagerService.getCurrentLevel();
              // have a level manager, that controls the background and the spawning, updates first. 4 levels, controls boss spawn.
              currentLevel.update(this.canvasContainer,this.playerService, this.levelManagerService);

              // have a bot manager to move the bots (gen bullets, patterns etc)
              this.botManagerService.update(currentLevel, this.canvasContainer, this.bulletManagerService, this.playerService);

              // update for the player (Gen bullets)
              this.playerService.currentPlayer.update(currentLevel, this.canvasContainer, this.bulletManagerService, this.botManagerService);
              // todo we have to find a nice way to move the player to the middle of the screen here. Maybe disable the player controls until this value is set?

              // have a bullet manager to move the bullets, do collision detection
                // some bullets should be destructable.
                // some cannot be destroyed
              this.bulletManagerService.update(currentLevel, this.canvasContainer, this.botManagerService, this.playerService);

              // vertical and horizontal, bare that in mind....
            }
        }
        this.tickComplete = true;
    }
}
