import { Injectable } from '@angular/core';
import { BotManagerService } from '../manager/bot-manager.service';
import { LevelEventsService } from '../manager/level-events.service';
import { LevelEnum, LevelInstance, LevelManagerService } from '../manager/level-manager.service';
import { LevelOneInstance } from '../manager/level-manager/LevelOneInstance';
import { LevelThreeInstance } from '../manager/level-manager/LevelThreeInstance';
import { LevelTwoInstance } from '../manager/level-manager/LevelTwoInstance';
import { ResourcesService } from './resources.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor() { }

  /**
   * skip the game introduction vid
   */
  isSkipIntro() :boolean {
    return false;
  }

  /**
   * draw the hit boxes
   */
  isDrawHitBox(): boolean {
    return false;
  }

  /**
   * display the games ticks
   */
  isDisplayTicksAndPhases(): boolean {
    return true;
  }

  initLevel(level:LevelEnum, resourcesService: ResourcesService, botManagerService: BotManagerService, levelManagerService: LevelManagerService, levelEventsService: LevelEventsService):LevelInstance {
    if(level == LevelEnum.LevelOne) {
      return new LevelOneInstance(resourcesService, botManagerService, levelManagerService, levelEventsService);
    } else if(level == LevelEnum.LevelTwo) {
      return new LevelTwoInstance(resourcesService, botManagerService, levelManagerService, levelEventsService);
    } else if(level == LevelEnum.LevelThree) {
      return new LevelThreeInstance(resourcesService, botManagerService, levelManagerService, levelEventsService);
    }
  }

}
