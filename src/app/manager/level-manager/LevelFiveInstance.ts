import { CanvasContainer } from "src/app/domain/CanvasContainer";
import { AudioServiceService } from "src/app/services/audio-service.service";
import { PlayerService } from "src/app/services/player.service";
import { ResourcesService } from "src/app/services/resources.service";
import { BotManagerService } from "../bot-manager.service";
import { LevelEventsService } from "../level-events.service";
import { LevelManagerService } from "../level-manager.service";
import { LevelOneInstance } from "./LevelOneInstance";

export class LevelFiveInstance extends LevelOneInstance {
  protected backgroundImageSlowScroll = new Image();
  protected scrollHeightSlowScroll:number = 0;

  protected scrollInterval:number = 0;
  protected scrollIntervalLimit:number = 1;

  protected slowScrollInterval:number = 0;
  protected slowScrollIntervalLimit:number = 3;

  protected scrollerYIncrementSlowScroll:number = 0;
  constructor(resourcesService:ResourcesService, botManagerService:BotManagerService, levelManagerService:LevelManagerService, levelEventsService:LevelEventsService){
    super(resourcesService,botManagerService,levelManagerService,levelEventsService);
    this.backgroundImages = [];
    this.backgroundImages.push(this.resourcesService.getRes().get("level-3-bg-2"));
    this.backgroundImageSlowScroll = this.resourcesService.getRes().get("level-3-bg-1");
    this.hudImage = this.resourcesService.getRes().get("HUD-resized");
    this.eventArr = this.levelEventsService.getLevel5Events(levelManagerService.difficulty);
    this.scrollHeight = 640;
    this.scrollHeightSlowScroll = 640;
  }

  unlockMedal() {
    // TODO medal?
  }

  updateMusic(audioServiceService:AudioServiceService) {
    audioServiceService.update();
    audioServiceService.playAudio("level1", true);
  }

  updateBackground(canvasContainer:CanvasContainer, playerService:PlayerService, levelManagerService:LevelManagerService) {
    canvasContainer.bgCtx.drawImage(this.backgroundImageSlowScroll, this.scrollerXIncrement, this.scrollerYIncrementSlowScroll, this.getScrollWidth(), this.getScrollHeight());
    if(this.isVertical()) {
      canvasContainer.bgCtx.drawImage(this.backgroundImageSlowScroll, this.scrollerXIncrement, (this.scrollerYIncrementSlowScroll - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
    } else {
      console.log("NO IMPLEMTENTED");
    }
    canvasContainer.bgCtx.drawImage(this.getNextDrawImage(), this.scrollerXIncrement, this.scrollerYIncrement, this.getScrollWidth(), this.getScrollHeight());
    if(this.isVertical()) {
      canvasContainer.bgCtx.drawImage(this.getNextDrawImage(), this.scrollerXIncrement, (this.scrollerYIncrement - this.getScrollHeight()), this.getScrollWidth(), this.getScrollHeight());
    } else {
      console.log("NO IMPLEMTENTED");
    }

    this.scrollInterval++;
    if (this.scrollInterval >= this.scrollIntervalLimit) {
      this.scrollInterval = 0;
      this.scrollerYIncrement += 1.5;
      if (this.scrollerYIncrement > this.getScrollHeight()) { this.scrollerYIncrement = 0 };
    }

    this.slowScrollInterval++;
    if (this.slowScrollInterval >= this.slowScrollIntervalLimit) {
      this.slowScrollInterval = 0;
      this.scrollerYIncrementSlowScroll += 2.5;
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
