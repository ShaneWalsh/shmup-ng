import { Injectable } from '@angular/core';
import { LevelEnum } from '../manager/level-manager/LevelEnum';


@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  /**
   * Default sound effect volume.
   */
  private _soundAffectVolume : number = .2;
  /**
   * Default background volume.
   */
  private _backgroundSoundVolume : number = .1;
  /**
  * Default level order
  */
  private _levelOrder : LevelEnum[] = [
    LevelEnum.LevelOne,
    LevelEnum.LevelTwo,
    LevelEnum.LevelThree,
    LevelEnum.LevelFour,
  ];

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

  getLevelIndex(level:LevelEnum):number {
    return (this._levelOrder.indexOf(level))+1;
  }

  getLevelOrder(){

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

}
