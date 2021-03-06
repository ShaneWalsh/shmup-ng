import { Injectable } from '@angular/core';
import { LevelEnum } from '../manager/level-manager/LevelEnum';


@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  /**
   * Default sound effect volume.
   */
  private _soundAffectVolume : number = 0; //.2
  /**
   * Default background volume.
   */
  private _backgroundSoundVolume : number = 0; // .1
  /**
  * Default level order, Just change the index value to change the order they are played in.
  */
  private _levelOrder : {level:LevelEnum,levelIndex:number}[] = [
    {level:LevelEnum.LevelOne, levelIndex:1},
    {level:LevelEnum.LevelTwo, levelIndex:2},
    {level:LevelEnum.LevelThree, levelIndex:3},
    {level:LevelEnum.LevelFour, levelIndex:4}
  ];

  constructor() { }

  /**
   * skip the game introduction vid
   */
  isSkipIntro() :boolean {
    return true;
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
    return (this._levelOrder.find(lev => lev.level == level).levelIndex);
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
