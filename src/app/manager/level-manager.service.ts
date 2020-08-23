import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { PlayerService } from '../services/player.service';
import { BulletManagerService } from './bullet-manager.service';
import { LevelEventsService } from 'src/app/manager/level-events.service';
import { LevelEvent } from 'src/app/domain/events/level-events';
import { SpriteSheet } from '../domain/SpriteSheet';
import { CanvasContainer } from '../domain/CanvasContainer';
import { LogicService } from '../services/logic.service';

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
  public difficulty:number = 0;

  constructor(private resourcesService:ResourcesService, private botManagerService:BotManagerService, private bulletManagerService: BulletManagerService,private levelEventsService:LevelEventsService) {
      this.loadEvents();
  }

  loadEvents(): any {

  }

  initLevel(level:LevelEnum){
    // clear down the managers
    this.botManagerService.clean();
    this.bulletManagerService.clean();
    if(level == LevelEnum.LevelTwo){ // todo flip these back, it just for testing.
      this.currentLevel = new LevelOneInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.levelLoaded.next(this.currentLevel);
    } else if(level == LevelEnum.LevelOne){
      this.currentLevel = new LevelTwoInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
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
    update(canvasContainer:CanvasContainer,playerService:PlayerService);
    updateIntro(ctx: CanvasRenderingContext2D);
    getMapWidth():number;
    getMapHeight():number;
    isVertical():boolean;
    drawHitBox():boolean;
    updatePhaseCounter();
    drawShadow():boolean;
}

class LevelOneInstance implements LevelInstance{
  public mapWidth:number=480;
  public mapHeight:number=640;
  protected backgroundImage = new Image();
  protected hudImage:HTMLImageElement;

  // keeps track of the infinite scrolling of the background.
  private scrollerXIncrement:number = 0;
  private scrollerYIncrement:number = 0;

  // event array to mark when things should happen. Spawning(fixed/random), Boss, Mini Boss, LevelOver?
  protected eventArr:LevelEvent[]=[];
  private repeatEvents:LevelEvent[]=[]; // triggered events are removed from the events ary so they dont trigger twce by accident and then reinserted.
  private tickCounter:number = 0;
  private phaseCounter:number = 0; // when phase updates, tick counter goes back to zero


  constructor(public resourcesService:ResourcesService, protected botManagerService:BotManagerService, protected levelManagerService:LevelManagerService, public levelEventsService:LevelEventsService){
      this.backgroundImage = this.resourcesService.getRes().get("level-1-background");
      this.hudImage = this.resourcesService.getRes().get("HUD-resized");
      this.eventArr = this.levelEventsService.getLevel1Events(levelManagerService.difficulty);
  }

  update(canvasContainer:CanvasContainer, playerService:PlayerService) {
    // infinite scroller
    canvasContainer.bgCtx.drawImage(this.backgroundImage, this.scrollerXIncrement, this.scrollerYIncrement, this.mapWidth, this.mapHeight);
    if(this.isVertical()) {
      canvasContainer.bgCtx.drawImage(this.backgroundImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.mapHeight), this.mapWidth, this.mapHeight);
      this.scrollerYIncrement++;
      if(this.scrollerYIncrement > this.mapHeight){this.scrollerYIncrement = 0};
    } else {
      canvasContainer.bgCtx.drawImage(this.backgroundImage, (this.scrollerXIncrement-this.mapWidth), this.scrollerYIncrement, this.mapWidth, this.mapHeight);
      this.scrollerXIncrement++;
      if(this.scrollerXIncrement > this.mapWidth){this.scrollerXIncrement = 0};
    }
    canvasContainer.bgCtx.drawImage(this.hudImage, 0, 0 , this.mapWidth, this.mapHeight);
    LogicService.writeOnCanvas(90,27,playerService.currentPlayer.score,24,"#ff00ff",canvasContainer.bgCtx);
    LogicService.writeOnCanvas(80,628,playerService.currentPlayer.lives,24,"#ff00ff",canvasContainer.bgCtx);
    //then fire the normal events
    this.repeatEvents = [];
    for(let i =0 ; i <  this.eventArr.length; i++){
        let eventI = this.eventArr[i];
        if(eventI.canTrigger(this.tickCounter, this.phaseCounter)){
            eventI.triggerEvent(this.botManagerService,this.levelManagerService);
            if(eventI.repeatUntilPhaseEnd){
                eventI.happenAfterTicks = eventI.getRepeatLoopTicks();
                eventI.lastRepeatTickFire = this.tickCounter;
                // now next time canTrigger is called, lastRepeatTickFire + happenAfterTicks(now RepeatLoopTicks) will be used
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

  drawShadow(){
    return false;
  }
}

class LevelTwoInstance extends LevelOneInstance{

  constructor(resourcesService:ResourcesService, botManagerService:BotManagerService, levelManagerService:LevelManagerService, levelEventsService:LevelEventsService){
      super(resourcesService,botManagerService,levelManagerService,levelEventsService);
      this.backgroundImage = this.resourcesService.getRes().get("level-2-background");
      this.hudImage = this.resourcesService.getRes().get("HUD-resized");
      this.eventArr = this.levelEventsService.getLevel2Events(levelManagerService.difficulty);
  }

  drawShadow(){
    return true;
  }
}
