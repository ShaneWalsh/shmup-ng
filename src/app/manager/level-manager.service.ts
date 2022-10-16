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
import { LevelOneInstance } from './level-manager/LevelOneInstance';
import { LevelTwoInstance } from './level-manager/LevelTwoInstance';
import { LevelThreeInstance } from './level-manager/LevelThreeInstance';
import { LevelEnum } from './level-manager/LevelEnum';
import { AudioServiceService } from '../services/audio-service.service';
import { DeathManagerService } from './death-manager.service';
import { LevelFourInstance } from './level-manager/LevelFourInstance';
import { LevelFiveInstance } from './level-manager/LevelFiveInstance';
import { LevelSixInstance } from './level-manager/LevelSixInstance';

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
  displayAbilityTimer(): boolean {
      return this.optionsService.displayAbilityTimer();
  }
  private gameTickSubject:Subject<boolean> = new Subject();
  private levelLoaded: Subject<LevelInstance> = new Subject();
  private levelComplete: Subject<LevelInstance> = new Subject();
  private menuQuitSubject: Subject<boolean> = new Subject();
  private currentLevel:LevelInstance;
  private currentLevelEnum:LevelEnum;

  private paused:boolean = false;
  public difficulty:number = 0;
  public playingBossRush:boolean = false;
  public mainMenuIndex:number = 0;

  public opsMenuIndex:number = 0;

  // ingame menu
  public showPauseMenu:boolean = false;
  public showPauseMenuIndex:number = 0;

  public showOptionsMenu:boolean = false;

  constructor(
    private optionsService:OptionsService, private resourcesService:ResourcesService, private botManagerService:BotManagerService,
    private bulletManagerService: BulletManagerService, private levelEventsService:LevelEventsService,
    private keyboardEventService:KeyboardEventService, private audioServiceService:AudioServiceService,
    private deathManagerService:DeathManagerService ) {
    this.loadEvents();
    keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
      if(customKeyboardEvent.event.keyCode == 80){ // p
        if(this.getNotPaused()){
          this.pauseGame();
          this.showPauseMenu = true;
          this.showOptionsMenu = false;
        } else {
          this.unPauseGame();
          this.showPauseMenu = false;
          this.showOptionsMenu = false;
        }
      }
      else if(this.getPaused() && this.showPauseMenu == true){
        if (customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38) { // up
          this.audioServiceService.playAudioNewInstance("menu-click-converted", true);
          let diff =  this.showPauseMenuIndex - 1 ;
          if(diff < 0) diff = 2;
          this.showPauseMenuIndex = diff;
        } else if (customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ //down 83 40
          this.audioServiceService.playAudioNewInstance("menu-click-converted", true);
          let diff =  this.showPauseMenuIndex + 1;
          if(diff > 2) diff = 0;
          this.showPauseMenuIndex = diff;
        } else if(customKeyboardEvent.event.keyCode == 13) { // enter
          this.audioServiceService.playAudioNewInstance("menu-back-converted", true);
          if(this.showPauseMenuIndex == 2) { // quit
            this.menuQuitSubject.next(true);
            this.showPauseMenuIndex = 0;
            this.showPauseMenu = false;
            this.showOptionsMenu = false;
          } else if(this.showPauseMenuIndex == 1) { // options
            this.showOptionsMenu = true;
          } else { // return
            this.unPauseGame();
          }
          this.showPauseMenu = false;
        } else if (customKeyboardEvent.event.key == 'Escape' || customKeyboardEvent.event.keyCode == 27){
          this.unPauseGame();
          this.showPauseMenu = false;
        }
      }
    });
    this.optionsService.optionsQuitSubject.subscribe(() => {
        this.unPauseGame();
        this.showPauseMenu = false;
        this.showOptionsMenu = false;
    });
  }

  loadEvents(): any {

  }

  initLevel(level:LevelEnum){
    // clear down the managers
    this.botManagerService.clean();
    this.bulletManagerService.clean();
    this.deathManagerService.clean();
    this.currentLevelEnum = level;

    let index = this.optionsService.getLevelIndex(level);
    if(index == 1) {
      this.currentLevel = new LevelOneInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.playingBossRush = false;
    } else if(index == 2) {
      this.currentLevel = new LevelTwoInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.playingBossRush = false;
    } else if(index == 3) {
      this.currentLevel = new LevelThreeInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.playingBossRush = false;
    } else if(index == 4) {
      this.currentLevel = new LevelFourInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.playingBossRush = true;
    } else if(index == 5) {
      this.currentLevel = new LevelFiveInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.playingBossRush = true;
    } else if(index == 6) {
      this.currentLevel = new LevelSixInstance(this.resourcesService, this.botManagerService, this, this.levelEventsService);
      this.playingBossRush = true;
    }

    this.levelLoaded.next(this.currentLevel);
  }

  pauseGame() {
      this.paused = true;
      this.audioServiceService.stopAllAudio();
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

  getMenuQuitSubject(): Subject<boolean> {
      return this.menuQuitSubject;
  }

  getCurrentLevelEnum():LevelEnum {
    return this.currentLevelEnum;
  }
}

export interface LevelInstance {
    unlockMedal();
    update(canvasContainer:CanvasContainer,playerService:PlayerService, levelManagerService:LevelManagerService,audioServiceService:AudioServiceService);
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
    updateMusic(audioServiceService:AudioServiceService);
}
