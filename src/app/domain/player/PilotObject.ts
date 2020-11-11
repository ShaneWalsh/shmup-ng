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
    public abilityCooldownLimit:number = 900,
    public extraLives:number = 0,
  ){

  }

  playerInit(currentPlayer) {
    // abstracted to subclass
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
