import { Fighter } from "./Fighter";
import { HitBox } from "../HitBox";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { BulletDirection, BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { CanvasContainer } from "../CanvasContainer";
import { DeathConfig } from "../DeathDetails";


export class Rock extends Fighter {
  public driftXDistance = 50;
  public driftXDistanceCounter = this.driftXDistance/2;
  public driftXDistanceRight = true;

  constructor(
      config: any = {},
      posX: number = 0,
      posY: number = 0,
      imageObj1: HTMLImageElement = null,
      imageObj2: HTMLImageElement = null,
      imageSizeX: number = 56,
      imageSizeY: number = 78,
      public hitBox: HitBox = new HitBox(0, 0, imageSizeX, imageSizeY),
      imageObjDamaged: HTMLImageElement = imageObj1
  ) {
    super(config, posX,posY,imageObj1,imageObj2,imageSizeX,imageSizeY,hitBox,imageObjDamaged);
    this.posXSpeed = 3;
    this.posYSpeed = 2;
    this.health = 24;
    this.imageObj = imageObj1;
    this.tryConfigValues(["driftXDistance","driftXDistanceCounter","driftXDistanceRight","posYSpeed","bTimerLimit","score","health"]);
  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let ctx = canvasContainer.mainCtx;
    this.posY += this.posYSpeed;
    if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)){
      botManagerService.removeBot(this);
    } else {
      ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      this.updateDamageAnimation(ctx);
    }

    this.driftXDistanceCounter++;
    if(this.driftXDistanceCounter >= this.driftXDistance) {
      this.driftXDistanceCounter = 0;
      this.driftXDistanceRight = !this.driftXDistanceRight;
    }
    if(this.driftXDistanceRight) {
      this.posX += this.posXSpeed;
    } else {
      this.posX -= this.posXSpeed;
    }

    if(levelInstance.drawHitBox()) {
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }

    this.updateAnimation();
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox];
  }

  getDeathConfig(): DeathConfig {
    return new DeathConfig(6);
  }
}
