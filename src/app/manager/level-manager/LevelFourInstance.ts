import { CanvasContainer } from "src/app/domain/CanvasContainer";
import { PlayerService } from "src/app/services/player.service";
import { ResourcesService } from "src/app/services/resources.service";
import { BotManagerService } from "../bot-manager.service";
import { LevelEventsService } from "../level-events.service";
import { LevelManagerService } from "../level-manager.service";
import { LevelOneInstance } from "./LevelOneInstance";


export class LevelFourInstance extends LevelOneInstance {

  constructor(resourcesService:ResourcesService, botManagerService:BotManagerService, levelManagerService:LevelManagerService, levelEventsService:LevelEventsService){
    super(resourcesService,botManagerService,levelManagerService,levelEventsService);
    this.backgroundImages = [];
    this.backgroundImages.push(this.resourcesService.getRes().get("level-2-bg-buildings"));
    this.backgroundShadowImage = this.resourcesService.getRes().get("level-2-bg-shadows");
    this.hudImage = this.resourcesService.getRes().get("HUD-resized");
    this.eventArr = this.levelEventsService.getLevel4Events(levelManagerService.difficulty);
    this.scrollHeight = 3840;
  }

  drawShadow(){
    return true;
  }

  hasIntro():boolean {
    return false;
  }

}
