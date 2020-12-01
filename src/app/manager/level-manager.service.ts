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
import { OptionsService } from '../services/options.service';
import { KeyboardEventService } from '../services/keyboard-event.service';

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
      return this.optionsService.isDrawHitBox();
  }
  displayTicksAndPhases(): boolean {
      return this.optionsService.isDisplayTicksAndPhases();
  }
  private gameTickSubject:Subject<boolean> = new Subject();
  private levelLoaded: Subject<LevelInstance> = new Subject();
  private levelComplete: Subject<LevelInstance> = new Subject();
  private currentLevel:LevelInstance;
  private currentLevelEnum:LevelEnum;

  private paused:boolean = false;
  public difficulty:number = 0;
  public mainMenuIndex:number = 0;

  // ingame menu
  public showPauseMenu:boolean = false;
  public showPauseMenuIndex:number = 0;

  constructor(private optionsService:OptionsService, private resourcesService:ResourcesService, private botManagerService:BotManagerService, private bulletManagerService: BulletManagerService,private levelEventsService:LevelEventsService, private keyboardEventService:KeyboardEventService) {
    this.loadEvents();
    keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
      if(customKeyboardEvent.event.keyCode == 80){ // p
        if(this.getNotPaused()){
          this.pauseGame();
          this.showPauseMenu = true;
        } else {
          this.unPauseGame();
          this.showPauseMenu = false;
        }
      }
      else if(this.getPaused()){
        if (customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38) { // up
          let diff =  this.showPauseMenuIndex - 1 ;
          if(diff < 0) diff = 2;
          this.showPauseMenuIndex = diff;
        } else if (customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ //down 83 40
          let diff =  this.showPauseMenuIndex + 1;
          if(diff > 2) diff = 0;
          this.showPauseMenuIndex = diff;
        } else if(customKeyboardEvent.event.keyCode == 13) { // enter
          this.unPauseGame();
          this.showPauseMenu = false;
        }
      }
    });
  }

  loadEvents(): any {

  }

  initLevel(level:LevelEnum){
    // clear down the managers
    this.botManagerService.clean();
    this.bulletManagerService.clean();
    this.currentLevelEnum = level;
    if(level == LevelEnum.LevelOne) {
      //this.currentLevel = new LevelOneInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);  // todo flip these back, it just for testing.
      // this.currentLevel = new LevelTwoInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.currentLevel = new LevelThreeInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.levelLoaded.next(this.currentLevel);
    } else if(level == LevelEnum.LevelTwo) {
      this.currentLevel = new LevelOneInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.levelLoaded.next(this.currentLevel);
    } else if(level == LevelEnum.LevelThree) {
      this.currentLevel = new LevelThreeInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
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

  getCurrentLevelEnum():LevelEnum {
    return this.currentLevelEnum;
  }
}

export interface LevelInstance {
    update(canvasContainer:CanvasContainer,playerService:PlayerService, levelManagerService:LevelManagerService);
    updateBackground(canvasContainer:CanvasContainer,playerService:PlayerService, levelManagerService:LevelManagerService);
    updateHud(canvasContainer:CanvasContainer,playerService:PlayerService, levelManagerService:LevelManagerService);
    updateEvent(canvasContainer:CanvasContainer,playerService:PlayerService, levelManagerService:LevelManagerService);
    updateIntro(ctx: CanvasRenderingContext2D);
    getMapWidth():number;
    getMapHeight():number;
    getScrollWidth():number;
    getScrollHeight():number;
    isVertical():boolean;
    drawHitBox():boolean;
    updatePhaseCounter();
    drawShadow():boolean;
    hasIntro():boolean;
}

class LevelOneInstance implements LevelInstance{
  public mapWidth:number=480;
  public mapHeight:number=640;
  public scrollWidth:number=this.mapWidth;
  public scrollHeight:number=this.mapHeight;
  protected backgroundImage = new Image();
  protected backgroundShadowImage = null;
  protected hudImage:HTMLImageElement;

  // keeps track of the infinite scrolling of the background.
  protected scrollerXIncrement:number = 0;
  protected scrollerYIncrement:number = 0;

  // event array to mark when things should happen. Spawning(fixed/random), Boss, Mini Boss, LevelOver?
  protected eventArr:LevelEvent[]=[];
  protected repeatEvents:LevelEvent[]=[]; // triggered events are removed from the events ary so they dont trigger twce by accident and then reinserted.
  protected tickCounter:number = 0;
  protected phaseCounter:number = 0; // when phase updates, tick counter goes back to zero


  constructor(public resourcesService:ResourcesService, protected botManagerService:BotManagerService, protected levelManagerService:LevelManagerService, public levelEventsService:LevelEventsService){
    this.backgroundImage = this.resourcesService.getRes().get("level-1-background");
    this.hudImage = this.resourcesService.getRes().get("HUD-resized");
    this.eventArr = this.levelEventsService.getLevel1Events(levelManagerService.difficulty);
  }

  update(canvasContainer:CanvasContainer, playerService:PlayerService, levelManagerService:LevelManagerService) {
    // infinite scroller
    this.updateBackground(canvasContainer, playerService, levelManagerService);
    this.updateHud(canvasContainer, playerService, levelManagerService);
    this.updateEvent(canvasContainer, playerService, levelManagerService);
  }

  updateIntro(ctx: CanvasRenderingContext2D) {
    // just for the intro for displaying the background
    ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    if (this.isVertical()) {
      ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
      this.scrollerYIncrement++;
      if (this.scrollerYIncrement > this.getScrollHeight()) { this.scrollerYIncrement = 0 };
    } else {
      ctx.drawImage(this.backgroundImage, (this.scrollerXIncrement - this.getScrollWidth()), this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
      this.scrollerXIncrement++;
      if (this.scrollerXIncrement > this.getScrollWidth()) { this.scrollerXIncrement = 0 };
    }
  }
  updateBackground(canvasContainer:CanvasContainer, playerService:PlayerService, levelManagerService:LevelManagerService) {
    canvasContainer.bgCtx.drawImage(this.backgroundImage, this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    if(this.backgroundShadowImage) {
      canvasContainer.shadowCtx.drawImage(this.backgroundShadowImage, this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    }
    if(this.isVertical()) {
      canvasContainer.bgCtx.drawImage(this.backgroundImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
      if(this.backgroundShadowImage) {
        canvasContainer.shadowCtx.drawImage(this.backgroundShadowImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
      }
      this.scrollerYIncrement++;
      if(this.scrollerYIncrement > this.getScrollHeight()){this.scrollerYIncrement = 0};
    } else {
      canvasContainer.bgCtx.drawImage(this.backgroundImage, (this.scrollerXIncrement-this.getScrollWidth()), this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
      if(this.backgroundShadowImage) {
        canvasContainer.shadowCtx.drawImage(this.backgroundShadowImage, (this.scrollerXIncrement-this.getScrollWidth()), this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
      }
      this.scrollerXIncrement++;
      if(this.scrollerXIncrement > this.getScrollWidth()){this.scrollerXIncrement = 0};
    }
  }
  updateHud(canvasContainer:CanvasContainer, playerService:PlayerService, levelManagerService:LevelManagerService) {
    canvasContainer.topCtx.drawImage(this.hudImage, 0, 0 , this.mapWidth, this.mapHeight);
    LogicService.writeOnCanvas(90,27,playerService.currentPlayer.score,24,"#ff00ff",canvasContainer.topCtx);
    LogicService.writeOnCanvas(80,628,playerService.currentPlayer.lives,24,"#ff00ff",canvasContainer.topCtx);
    if(levelManagerService.displayTicksAndPhases()){
      LogicService.writeOnCanvas(400,27,this.tickCounter,24,"#ff00ff",canvasContainer.topCtx);
      LogicService.writeOnCanvas(400,60,this.phaseCounter,24,"#ff00ff",canvasContainer.topCtx);
    }
  }
  updateEvent(canvasContainer:CanvasContainer, playerService:PlayerService, levelManagerService:LevelManagerService) {
    //then fire the normal events
    this.repeatEvents = [];
    for(let i =0 ; i <  this.eventArr.length; i++) {
      let eventI = this.eventArr[i];
      if(eventI.canTrigger(this.tickCounter, this.phaseCounter)) {
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

  getScrollWidth(): number {
    return this.scrollWidth;
  }
  getScrollHeight(): number {
    return this.scrollHeight;
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

  hasIntro():boolean { // Set to false for no intro 1/2
    return true;
  }
}

class LevelTwoInstance extends LevelOneInstance{

  constructor(resourcesService:ResourcesService, botManagerService:BotManagerService, levelManagerService:LevelManagerService, levelEventsService:LevelEventsService){
      super(resourcesService,botManagerService,levelManagerService,levelEventsService);
      this.backgroundImage = this.resourcesService.getRes().get("level-2-bg-buildings");
      this.backgroundShadowImage = this.resourcesService.getRes().get("level-2-bg-shadows");
      this.hudImage = this.resourcesService.getRes().get("HUD-resized");
      this.eventArr = this.levelEventsService.getLevel2Events(levelManagerService.difficulty);
      this.scrollHeight = 3840;
  }

  drawShadow(){
    return true;
  }

  hasIntro():boolean { // Set to false for no intro 2/2
    return false;
  }
}

class LevelThreeInstance extends LevelOneInstance{

  protected backgroundImageSlowScroll = new Image();
  protected scrollHeightSlowScroll:number = 0;

  protected scrollInterval:number = 0;
  protected scrollIntervalLimit:number = 1;

  protected slowScrollInterval:number = 0;
  protected slowScrollIntervalLimit:number = 3;

  protected scrollerYIncrementSlowScroll:number = 0;

  constructor(resourcesService:ResourcesService, botManagerService:BotManagerService, levelManagerService:LevelManagerService, levelEventsService:LevelEventsService){
      super(resourcesService,botManagerService,levelManagerService,levelEventsService);
      this.backgroundImage = this.resourcesService.getRes().get("level-3-bg-2");
      this.backgroundImageSlowScroll = this.resourcesService.getRes().get("level-3-bg-1");
      this.hudImage = this.resourcesService.getRes().get("HUD-resized");
      this.eventArr = this.levelEventsService.getLevel3Events(levelManagerService.difficulty);
      this.scrollHeight = 640;
      this.scrollHeightSlowScroll = 640;
  }

  updateBackground(canvasContainer:CanvasContainer, playerService:PlayerService, levelManagerService:LevelManagerService) {
    canvasContainer.bgCtx.drawImage(this.backgroundImageSlowScroll, this.scrollerXIncrement, this.scrollerYIncrementSlowScroll, this.getScrollWidth(), this.getScrollHeight());
    if(this.isVertical()) {
      canvasContainer.bgCtx.drawImage(this.backgroundImageSlowScroll, this.scrollerXIncrement, (this.scrollerYIncrementSlowScroll - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
    } else {
      console.log("NO IMPLEMTENTED");
    }
    canvasContainer.bgCtx.drawImage(this.backgroundImage, this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    if(this.isVertical()) {
      canvasContainer.bgCtx.drawImage(this.backgroundImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
    } else {
      console.log("NO IMPLEMTENTED");
    }

    this.scrollInterval++;
    if (this.scrollInterval >= this.scrollIntervalLimit) {
      this.scrollInterval = 0;
      this.scrollerYIncrement += 0.7;
      if (this.scrollerYIncrement > this.getScrollHeight()) { this.scrollerYIncrement = 0 };
    }

    this.slowScrollInterval++;
    if (this.slowScrollInterval >= this.slowScrollIntervalLimit) {
      this.slowScrollInterval = 0;
      this.scrollerYIncrementSlowScroll++;
      if (this.scrollerYIncrementSlowScroll > this.getScrollHeight()) { this.scrollerYIncrementSlowScroll = 0 };
    }
  }

  drawShadow(){
    return false;
  }

  hasIntro():boolean { // Set to false for no intro 2/2
    return false;
  }
}
