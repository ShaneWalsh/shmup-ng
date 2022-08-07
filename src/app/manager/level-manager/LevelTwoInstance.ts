import { AudioServiceService } from "src/app/services/audio-service.service";
import { ProfileService, ProfileValuesEnum } from "src/app/services/profile.service";
import { ResourcesService } from "src/app/services/resources.service";
import { BotManagerService } from "../bot-manager.service";
import { LevelEventsService } from "../level-events.service";
import { LevelManagerService } from "../level-manager.service";
import { LevelOneInstance } from "./LevelOneInstance";

export class LevelTwoInstance extends LevelOneInstance {

  constructor(resourcesService:ResourcesService, botManagerService:BotManagerService, levelManagerService:LevelManagerService, levelEventsService:LevelEventsService){
      super(resourcesService,botManagerService,levelManagerService,levelEventsService);
      this.backgroundImages = [];
      this.backgroundImages.push(this.resourcesService.getRes().get("level-2-bg-buildings"));
      this.backgroundShadowImage = this.resourcesService.getRes().get("level-2-bg-shadows");
      this.hudImage = this.resourcesService.getRes().get("HUD-resized");
      this.eventArr = this.levelEventsService.getLevel2Events(levelManagerService.difficulty);
      this.scrollHeight = 3840;
  }

  unlockMedal() {
    ProfileService.setProfileValue(ProfileValuesEnum.BOTKILLER_LEVEL2_COMPLETED,"true");
  }

  updateMusic(audioServiceService:AudioServiceService) {
    audioServiceService.update();
    audioServiceService.playAudio("1055571_Mellow-Freeze_lvl2", true);
  }

  drawShadow(){
    return true;
  }

  hasIntro():boolean { // Set to false for no intro 2/2
    return false;
  }
}
