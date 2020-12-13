import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { PlayerService } from '../services/player.service';
import { BulletManagerService } from './bullet-manager.service';
import { LevelEventsService } from 'src/app/manager/level-events.service';
import { CanvasContainer } from '../domain/CanvasContainer';
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
      if(customKeyboardEvent.event.keyCode == 80 || customKeyboardEvent.event.keyCode == 27){ // p || esc
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

    this.currentLevel = this.optionsService.initLevel(level, this.resourcesService, this.botManagerService, this, this.levelEventsService);
    this.levelLoaded.next(this.currentLevel);
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
