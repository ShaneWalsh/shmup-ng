import { Fighter } from "./Fighter";
import { HitBox } from "../HitBox";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { BulletDirection, BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";


export class Rock extends Fighter {

    public driftXDistance = 40;
    public driftXDistanceCounter = this.driftXDistance/2;
    public driftXDistanceRight = true;

    public posYSpeed:number = 2;
    public posXSpeed:number = 1.5;
    public health:number=20;
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

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
  		let currentPlayer = playerService.currentPlayer;
      this.posY += this.posYSpeed;
      if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)){
          botManagerService.removeBot(this);
      } else {
          ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
					if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
						this.damAnaimationTimer++;
						if(this.damAnaimationTimer %2 == 1){
							ctx.drawImage(this.imageObjDamaged, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
						}
					}
      }

      this.driftXDistanceCounter++;
      if(this.driftXDistanceCounter >= this.driftXDistance) {
          this.driftXDistanceCounter = 0;
          this.driftXDistanceRight = !this.driftXDistanceRight;
      }
      if(this.driftXDistanceRight){
        this.posX += this.posXSpeed;
      } else {
        this.posX -= this.posXSpeed;
      }

      if(levelInstance.drawHitBox()){
          this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
      }

      if(this.anaimationTimer >= this.anaimationTimerLimit){
  			this.anaimationTimer = 0;
  			if(this.imageObj == this.imageObj1){
            this.imageObj = this.imageObj2;
        } else {
            this.imageObj = this.imageObj1;
        }
  		}
  		else{
  			this.anaimationTimer++;
  		}
    }
    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireTracker(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, bulletManagerService: BulletManagerService, currentPlayer: PlayerObj) {
        // this chap dont fire
    }

    getPlayerCollisionHitBoxes(): HitBox[] {
        return [this.hitBox];
    }
}
