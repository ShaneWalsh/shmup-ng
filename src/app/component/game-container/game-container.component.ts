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

    tickComplete:boolean=true;
    canvasEl: any;
    ctx: CanvasRenderingContext2D;
    @Input() public width = 640;
    @Input() public height = 480;
    @Input() public requestAnimFrame: any;

    constructor(private resourcesService:ResourcesService,private levelManagerService:LevelManagerService,
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

        this.levelManagerService.unPauseGame();
    }

    update() {
        this.tickComplete = false; 
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
        this.tickComplete = true;
    }
}
