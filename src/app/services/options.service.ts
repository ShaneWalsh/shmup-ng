import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LevelEnum } from '../manager/level-manager/LevelEnum';


@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  public optionsQuitSubject: Subject<boolean> = new Subject();
  public volumeUpdate: Subject<boolean> = new Subject();

  /**
   * Default sound effect volume.
   */
  private _soundAffectVolume : number = 0.5; //.2
  /**
   * Default background volume.
   */
  private _backgroundSoundVolume : number = .5; // .1
  /**
  * Default level order, Just change the index value to change the order they are played in.
  */
  private _levelOrder : {level:LevelEnum,levelIndex:number}[] = [
    {level:LevelEnum.LevelOne, levelIndex:1},
    {level:LevelEnum.LevelTwo, levelIndex:2},
    {level:LevelEnum.LevelThree, levelIndex:3},
    {level:LevelEnum.LevelFour, levelIndex:4},
    {level:LevelEnum.LevelFive, levelIndex:5},
    {level:LevelEnum.LevelSix, levelIndex:6}
  ];

  // logic for screen
  opsMenuIndex: number = 0;
  _skipIntro: boolean = false;
  _drawHitBox: boolean = false;

  constructor() { }

  /**
   * skip the game introduction vid
   */
  isSkipIntro() :boolean {
    return this._skipIntro;
  }

  /**
   * draw the hit boxes
   */
  isDrawHitBox(): boolean {
    return this._drawHitBox;
  }

  /**
   * display the games ticks
   */
  isDisplayTicksAndPhases(): boolean {
    return false;
  }

  /**
   * display the ability timer
   */
  displayAbilityTimer(): boolean {
    return true;
  }

  getLevelIndex(level:LevelEnum):number {
    return (this._levelOrder.find(lev => lev.level == level).levelIndex);
  }

  getLevelOrder(){

  }

  /**
   * Configurable Values For the Blade ship (Shield one)
   */
  getBladeConfig(): any {
    return {
      lifeSpanLimit:150,  // how many ticks the shield stays up for 60 ticks a second.
      speed:3
    };
  }

  /**
   * Configurable Values For the spear ship (Missile one)
   */
  getSpearConfig(): any {
    return {
      missilesToCreate : 5,
      missileSpeed : 12,
      speed:5,
    };
  }

  getInvincibilityTime(): number {
    return 180;
  }

  extraLifeOnLevelComplete(){
    return true;
  }

  get backgroundSoundVolume(){
    return this._backgroundSoundVolume;
  }

  set backgroundSoundVolume(bg:number){
    this._backgroundSoundVolume = bg;
  }

  get soundAffectVolume(){
    return this._soundAffectVolume;
  }

  set soundAffectVolume(v:number){
    this._soundAffectVolume = v;
  }

  opsMenuIncrease() {
    if(this.opsMenuIndex == 0){
      if(this.backgroundSoundVolume < 0.91){
        this._backgroundSoundVolume += .1;
        this.volumeUpdate.next(true);
      }
    } else if(this.opsMenuIndex == 1){
      if(this.soundAffectVolume < 0.91){
        this._soundAffectVolume += .1;
        this.volumeUpdate.next(true);
      }
    } else if(this.opsMenuIndex == 2){
      this._drawHitBox = true;
    } else if(this.opsMenuIndex == 3){
      this._skipIntro = true;
    }
  }
  opsMenuDecrease() {
    if(this.opsMenuIndex == 0){
      if(this.backgroundSoundVolume > 0.01){
        this._backgroundSoundVolume -= .1;
        this.volumeUpdate.next(true);
      }
    } else if(this.opsMenuIndex == 1){
      if(this.soundAffectVolume > 0.01){
        this._soundAffectVolume -= .1;
        this.volumeUpdate.next(true);
      }
    } else if(this.opsMenuIndex == 2){
      this._drawHitBox = false;
    } else if(this.opsMenuIndex == 3){
      this._skipIntro = false;
    }
  }

}
