
import { Fighter } from "./Fighter";
import { HitBox } from "../HitBox";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { BulletDirection, BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj } from "src/app/services/player.service";


export class Swordfish extends Fighter {

    constructor(
        config: any = {},
        posX: number = 0,
        posY: number = 0,
        imageObj1: HTMLImageElement = null,
        imageObjDamaged: HTMLImageElement = imageObj1,
        imageSizeX: number = 118,
        imageSizeY: number = 186,
        public hitBox: HitBox = new HitBox(0, 0, imageSizeX, imageSizeY)
    ) {
        super(config, posX,posY,imageObj1,imageObj1,imageSizeX,imageSizeY,hitBox,imageObjDamaged);
        this.imageObj = imageObj1;
    }

    fireSomething(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, bulletManagerService: BulletManagerService, currentPlayer: PlayerObj) {
      let bullDirection: BulletDirection;
      if (levelInstance.isVertical()) {
        bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 25, this.posY + 140, this.posX + 25, this.posY + 250, this.bulletSpeed, true);
        bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, this.posX + 25, this.posY + 140, -1);

        bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 70, this.posY + 140, this.posX + 70, this.posY + 250, this.bulletSpeed, true);
        bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, this.posX + 70, this.posY + 140, -1);
      } else {
        // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
        // bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
      }
    }

    getPlayerCollisionHitBoxes(): HitBox[] {
        return [this.hitBox];
    }
}
