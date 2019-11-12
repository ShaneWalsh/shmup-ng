import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { PlayerService } from '../services/player.service';
import { BulletManagerService } from './bullet-manager.service';

export enum LevelEnum{
    LevelOne='LevelOne',
    LevelTwo='LevelTwo',
    LevelThree='LevelThree',
    LevelFour='LevelFour',
}

@Injectable({
  providedIn: 'root'
})
export class LevelManagerService {
    drawHitBox(): boolean {
        return false;
    }
    private gameTickSubject:Subject<boolean> = new Subject();
    private levelLoaded: Subject<LevelInstance> = new Subject();
    private levelComplete: Subject<LevelInstance> = new Subject();
    private currentLevel:LevelInstance;

    private paused:boolean = false;

    constructor(private resourcesService:ResourcesService, private botManagerService:BotManagerService, private bulletManagerService: BulletManagerService,) { }

    initLevel(level:LevelEnum){
        // clear down the managers
        this.botManagerService.clean();
        this.bulletManagerService.clean();
        if(level == LevelEnum.LevelOne){
            this.currentLevel = new LevelOneInstance(this.resourcesService, this.botManagerService, this);
            this.levelLoaded.next(this.currentLevel);
        }
    }

    pauseGame() {
        this.paused = true;
    }

    unPauseGame(){
        this.paused = false;
    }

    getCurrentLevel():LevelInstance{
        return this.currentLevel;
    }

    getPaused():boolean{
        return this.paused;
    }

    getNotPaused():boolean{
        return !this.paused;
    }

    getLevelLoadedSubject() : Subject<LevelInstance>{
        return this.levelLoaded;
    }

    getLevelCompleteSubject(): Subject<LevelInstance> {
        return this.levelComplete;
    }
    getGameTickSubject(): Subject<boolean> {
        return this.gameTickSubject;
    }
}

export interface LevelInstance {
    update(ctx:CanvasRenderingContext2D);
    getMapWidth():number;
    getMapHeight():number;
    isVertical():boolean;
    drawHitBox():boolean;
}

class LevelOneInstance implements LevelInstance{
    public mapWidth:number=640;
    public mapHeight:number=480;
    private backgroundImage = new Image();

    // keeps track of the infinite scrolling of the background.
    private scrollerXIncrement:number = 0;
    private scrollerYIncrement:number = 0;

    private ticker:number = 0;
    private stage:number = 0; // keep track of the different stages in bot generation.

    // event array to mark when things should happen. Spawning(fixed/random), Boss, Mini Boss, LevelOver?
    private eventArr:any[]=[];
    private eventArrPosition:number=0;

    constructor(public resourcesService:ResourcesService, private botManagerService:BotManagerService, private levelManagerService:LevelManagerService){
        this.backgroundImage = this.resourcesService.getRes().get("level-1-background");
    }

    update(ctx:CanvasRenderingContext2D) {
        // infinite scroller
        const seconds:number = this.ticker/60;

        ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, this.scrollerYIncrement, this.mapWidth, this.mapHeight);
        if(this.isVertical()) {
            ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.mapHeight), this.mapWidth, this.mapHeight);
            this.scrollerYIncrement++;
            if(this.scrollerYIncrement > this.mapHeight){this.scrollerYIncrement = 0};
        } else {
            ctx.drawImage(this.backgroundImage, (this.scrollerXIncrement-this.mapWidth), this.scrollerYIncrement, this.mapWidth, this.mapHeight);
            this.scrollerXIncrement++;
            if(this.scrollerXIncrement > this.mapWidth){this.scrollerXIncrement = 0};
        }

        // this is how I want the spawning etc to be controlled, a level will be an array of events basically.
        if(this.eventArrPosition < this.eventArr.length) {
            const event = this.eventArr[this.eventArrPosition];
            if(event.canFire()){
                this.eventArrPosition++;
                // make the event happen
                // e.g this.botManagerService.generateDiver();
                // but with position specified etc
            }
        }

        // temp
        this.ticker++;
        if(seconds > 3){
            //this.stage++;
            this.ticker = 0;
            this.botManagerService.generateDiver(this);
            this.botManagerService.generateFighter(this);
        }
    }

    getMapHeight() {
        return this.mapHeight;
    }

    getMapWidth() {
        return this.mapWidth;
    }

    isVertical() {
        return true;
    }

    drawHitBox(){
        return this.levelManagerService.drawHitBox();
    }
}
