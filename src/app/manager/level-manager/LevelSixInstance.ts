import { ResourcesService } from "src/app/services/resources.service";
import { BotManagerService } from "../bot-manager.service";
import { LevelEventsService } from "../level-events.service";
import { LevelManagerService } from "../level-manager.service";
import { LevelOneInstance } from "./LevelOneInstance";

export class LevelSixInstance extends LevelOneInstance {

  constructor(resourcesService:ResourcesService, botManagerService:BotManagerService, levelManagerService:LevelManagerService, levelEventsService:LevelEventsService){
      super(resourcesService,botManagerService,levelManagerService,levelEventsService);
      this.backgroundImages = [];
      this.backgroundImages.push(this.resourcesService.getRes().get("level-1-bg-1"));
      this.backgroundImages.push(this.resourcesService.getRes().get("level-1-bg-2"));
      this.hudImage = this.resourcesService.getRes().get("HUD-resized");
      this.eventArr = this.levelEventsService.getLevel6Events(levelManagerService.difficulty);
  }

  drawShadow(){
    return false;
  }

  hasIntro():boolean { // Set to false for no intro 2/2
    return true;
  }
}
