import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { CanvasContainer } from "../CanvasContainer";




export enum PilotEnum {
  NAOMI1,
  MYRA2
}


export class PilotObject {
  constructor(
    public abilityCooldownLimit:{ab1:number, ab2:number} = {ab1:900, ab2:900},
    public extraLives:number = 0,
    public speed:number = 4,
    public endingCodeNumber:number = 47
  ){

  }

  playerInit(currentPlayer) {
    // abstracted to subclass
  }

  clearAbility(){
    // abstracted to subclass
  }

  getSpeed():number {
    return this.speed;
  }

  getAbilityLimit(code){
    return this.abilityCooldownLimit[code];
  }

  endingCode(): number {
    return this.endingCodeNumber;
  }

}

export class Pilot1 extends PilotObject {

  playerInit(currentPlayer) {
    currentPlayer.lives += this.extraLives;
  }

}

export class Pilot2 extends PilotObject {

  playerInit(currentPlayer) {
    currentPlayer.lives += this.extraLives;
  }

}
