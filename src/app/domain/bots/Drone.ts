
import { Fighter } from "./Fighter";
import { HitBox } from "../HitBox";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { BulletDirection, BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj } from "src/app/services/player.service";


export class Drone extends Fighter {

    constructor(
        public config: any = {},
        public posX: number = 0,
        public posY: number = 0,
        public imageObj1: HTMLImageElement = null,
        public imageObj2: HTMLImageElement = null,
        public imageSizeX: number = 56,
        public imageSizeY: number = 78,
        public hitBox: HitBox = new HitBox(0, 0, imageSizeX, imageSizeY),
        public imageObjDamaged: HTMLImageElement = imageObj1
    ) {
        super(config, posX,posY,imageObj1,imageObj2,imageSizeX,imageSizeY,hitBox,imageObjDamaged);
        this.imageObj = imageObj1;
    }

    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireTracker(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, bulletManagerService: BulletManagerService, currentPlayer: PlayerObj) {
        let bullDirection: BulletDirection;
        if (levelInstance.isVertical()) {
            // to check that the player is not above us, we dont want bullets travelling upwards at him, that makes no sense.
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 18, this.posY + 50, this.posX + 18, this.posY + 90, this.bulletSpeed, true);
            bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, this.posX + 18, this.posY + 50, -1);
        } else {
            // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
            // bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
        }
    }

    getPlayerCollisionHitBoxes(): HitBox[] {
        return [this.hitBox];
    }
}
