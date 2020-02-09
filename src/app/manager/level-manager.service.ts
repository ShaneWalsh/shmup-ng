import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { PlayerService } from '../services/player.service';
import { BulletManagerService } from './bullet-manager.service';
import { LevelEventsService } from 'src/app/manager/level-events.service';
import { LevelEvent } from 'src/app/domain/events/level-events';
import { SpriteSheet } from '../domain/SpriteSheet';

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

    constructor(private resourcesService:ResourcesService, private botManagerService:BotManagerService, private bulletManagerService: BulletManagerService,private levelEventsService:LevelEventsService) {
        this.loadEvents();
    }

    loadEvents(): any {

    }

    initLevel(level:LevelEnum){
        // clear down the managers
        this.botManagerService.clean();
        this.bulletManagerService.clean();
        if(level == LevelEnum.LevelOne){
            this.currentLevel = new LevelOneInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
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
    updateIntro(ctx: CanvasRenderingContext2D);
    getMapWidth():number;
    getMapHeight():number;
    isVertical():boolean;
    drawHitBox():boolean;
	updatePhaseCounter();
}

class LevelOneInstance implements LevelInstance{
    public mapWidth:number=640;
    public mapHeight:number=480;
    private backgroundImage = new Image();

    // keeps track of the infinite scrolling of the background.
    private scrollerXIncrement:number = 0;
    private scrollerYIncrement:number = 0;

    // event array to mark when things should happen. Spawning(fixed/random), Boss, Mini Boss, LevelOver?
    private eventArr:LevelEvent[]=[];
    private repeatEvents:LevelEvent[]=[]; // triggered events are removed from the events ary so they dont trigger twce by accident and then reinserted.
    private tickCounter:number = 0;
    private phaseCounter:number = 0; // when phase updates, tick counter goes back to zero

    constructor(public resourcesService:ResourcesService, private botManagerService:BotManagerService, private levelManagerService:LevelManagerService, public levelEventsService:LevelEventsService){
        this.backgroundImage = this.resourcesService.getRes().get("level-1-background");
        this.eventArr = this.levelEventsService.getLevel1Events();
    }

    update(ctx:CanvasRenderingContext2D) {
        // infinite scroller
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

        //todo fire repeat events first.
        // tickCounter - lastRepeatTickFire == happenAfterTicks then fire again.

        //then fire the normal events
		this.repeatEvents = [];
        for(let i =0 ; i <  this.eventArr.length; i++){
            let eventI = this.eventArr[i];
            if(eventI.canTrigger(this.tickCounter, this.phaseCounter)){
                eventI.triggerEvent(this.botManagerService,this.levelManagerService);
                if(eventI.repeatUntilPhaseEnd){
                    eventI.lastRepeatTickFire = this.tickCounter;
                    this.repeatEvents.push(eventI);
                }
            	this.eventArr.splice(i--,1);
            }
        }
		this.eventArr = this.eventArr.concat(...this.repeatEvents);

        this.updateTickCounter();
    }

    updateIntro(ctx: CanvasRenderingContext2D) {
        // just for the intro for displaying the background
        ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, this.scrollerYIncrement, this.mapWidth, this.mapHeight);
        if (this.isVertical()) {
            ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.mapHeight), this.mapWidth, this.mapHeight);
            this.scrollerYIncrement++;
            if (this.scrollerYIncrement > this.mapHeight) { this.scrollerYIncrement = 0 };
        } else {
            ctx.drawImage(this.backgroundImage, (this.scrollerXIncrement - this.mapWidth), this.scrollerYIncrement, this.mapWidth, this.mapHeight);
            this.scrollerXIncrement++;
            if (this.scrollerXIncrement > this.mapWidth) { this.scrollerXIncrement = 0 };
        }
    }

    updateTickCounter(){
        this.tickCounter++;
    }

	updatePhaseCounter(){
		this.phaseCounter++;
        this.tickCounter = 0;
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
