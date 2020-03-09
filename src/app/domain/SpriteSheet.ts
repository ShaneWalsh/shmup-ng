import { LevelInstance } from "../manager/level-manager.service";
import { BotManagerService } from "../manager/bot-manager.service";
import { BulletManagerService } from "../manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "../services/player.service";

export class SpriteSheet {
    public animationTimer: number = 0;
    public spritePosition : number = 0;

    public complete:boolean = false;

    constructor(
        public posX: number = 0,
        public posY: number = 0,
        public imageObjs: HTMLImageElement[] = null,
        public imageSizeX: number = 640,
        public imageSizeY: number = 480,
        public animationTimerLimit: number = 10,
        public holdLastFrameLimit:number = 10,
    ) {

    }

    update(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
        let currentPlayer = playerService.currentPlayer;
        // fire weapon
        if (this.animationTimer >= this.animationTimerLimit) {
            this.animationTimer = 0;
            this.spritePosition++;
            if (this.spritePosition >= this.imageObjs.length){
                this.complete = true;
            }
        }
        else {
            this.animationTimer++;
        }
        if (!this.complete){
            ctx.drawImage(this.imageObjs[this.spritePosition], 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
        } else {
            botManagerService.removeSpriteSheet(this);
        }
    }
}
