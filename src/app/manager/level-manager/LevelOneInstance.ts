import { CanvasContainer } from "src/app/domain/CanvasContainer";
import { LevelEvent } from "src/app/domain/events/level-events";
import { LogicService } from "src/app/services/logic.service";
import { PlayerService } from "src/app/services/player.service";
import { ResourcesService } from "src/app/services/resources.service";
import { BotManagerService } from "../bot-manager.service";
import { LevelEventsService } from "../level-events.service";
import { LevelInstance, LevelManagerService } from "../level-manager.service";

export class LevelOneInstance implements LevelInstance{
  public mapWidth:number=480;
  public mapHeight:number=640;
  public scrollWidth:number=this.mapWidth;
  public scrollHeight:number=this.mapHeight;
  protected backgroundImages:any[] = [];
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

  protected dTimer: number = 0;
  protected dTimerLimit: number = 4;
  protected drawSequence: number = 0;

  constructor(public resourcesService:ResourcesService, protected botManagerService:BotManagerService, protected levelManagerService:LevelManagerService, public levelEventsService:LevelEventsService){
    this.backgroundImages = [];
    this.backgroundImages.push(this.resourcesService.getRes().get("level-1-bg-1"));
    this.backgroundImages.push(this.resourcesService.getRes().get("level-1-bg-2"));
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
    let drawImage = this.getNextDrawImage();
    ctx.drawImage(drawImage, this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    if (this.isVertical()) {
      ctx.drawImage(drawImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
      this.scrollerYIncrement++;
      if (this.scrollerYIncrement > this.getScrollHeight()) { this.scrollerYIncrement = 0 };
    } else {
      ctx.drawImage(drawImage, (this.scrollerXIncrement - this.getScrollWidth()), this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
      this.scrollerXIncrement++;
      if (this.scrollerXIncrement > this.getScrollWidth()) { this.scrollerXIncrement = 0 };
    }
  }
  updateBackground(canvasContainer:CanvasContainer, playerService:PlayerService, levelManagerService:LevelManagerService) {
    let drawImage = this.getNextDrawImage();
    canvasContainer.bgCtx.drawImage(drawImage, this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    if(this.backgroundShadowImage) {
      canvasContainer.shadowCtx.drawImage(this.backgroundShadowImage, this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    }
    if(this.isVertical()) {
      canvasContainer.bgCtx.drawImage(drawImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
      if(this.backgroundShadowImage) {
        canvasContainer.shadowCtx.drawImage(this.backgroundShadowImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
      }
      this.scrollerYIncrement++;
      if(this.scrollerYIncrement > this.getScrollHeight()){this.scrollerYIncrement = 0};
    } else {
      canvasContainer.bgCtx.drawImage(drawImage, (this.scrollerXIncrement-this.getScrollWidth()), this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
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
    if(levelManagerService.displayAbilityTimer()){
      LogicService.writeOnCanvas(440,628,Math.round(playerService.currentPlayer.abilityCooldown/60),24,"#ff00ff",canvasContainer.topCtx);
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

  updateTickCounter() {
      this.tickCounter++;
  }

  updatePhaseCounter() {
      this.phaseCounter++;
      this.tickCounter = 0;
  }

  getNextDrawImage():HTMLImageElement {
    if(this.dTimer >= this.dTimerLimit) {
      this.dTimer = 0;
      this.drawSequence++;
      if ( this.drawSequence >= this.backgroundImages.length ) {
        this.drawSequence = 0;
      }
    }
    else {
      this.dTimer++;
    }
    return this.backgroundImages[this.drawSequence];
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
