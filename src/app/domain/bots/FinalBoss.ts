import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";

export class FinalBoss extends BotInstanceImpl {

    // todo make these config values
    public health: number = 50;
    public bulletSpeed: number = 6; // 6
    public moveSpeed: number = 5; // 5

    public bTimer: number = 0; // bullet timer
    public bTimerLimit: number = 20; // 30

    public animationTimer:number = 0;
    public animationTimerLimit:number =8;
    public animationIndex:number= 0;

    public damAnaimationTimer: number = 8;
    public damAnaimationTimerLimit: number = 8;

    public score: number = 100;
    public angle: number;

    public hitBox: HitBox = new HitBox(105, 65, this.imageHeadSizeX, this.imageHeadSizeY);

    public imageObjWing: HTMLImageElement = null;
    public angleDirection:BulletDirection;

    constructor(
        public config: any = {},
        public posX: number = 0,
        public posY: number = 0,
        public imageObjHead: HTMLImageElement = null,
        public imageObjHeadDamanged: HTMLImageElement = null,
        public imageObjBody: HTMLImageElement = null,
        public imageObjBodyDamanged: HTMLImageElement = null,
        public imageObjWingsArr: HTMLImageElement[] = [],
        public imageObjWingsDamagedArr: HTMLImageElement[] = [],

        public imageHeadSizeX: number = 66,
        public imageHeadSizeY: number = 68,
        public imageBodySizeX: number = 264,
        public imageBodySizeY: number = 472,
        public imageWingsSizeX: number = 608,
        public imageWingsSizeY: number = 384,
        public imageSizeX:number=608,
        public imageSizeY:number=472,
    ) {
      super(config);
      this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score"]);
      this.imageObjWing = this.imageObjWingsArr[0];
    }

    update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService, ) {
      let currentPlayer = playerService.currentPlayer;
      let ctx = canvasContainer.mainCtx;
      this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+105+(this.imageHeadSizeX/2), this.posY+65+(this.imageHeadSizeY/2), currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);

      if(this.posY < 0) {
        this.posY += this.moveSpeed;
      }
      this.updateAnimation(ctx);
      this.updateDamageAnimation(ctx);
      this.updateBulletTimer(levelInstance, ctx, botManagerService, bulletManagerService,currentPlayer);
    }

    updateAnimation(ctx){
      if(this.animationTimer >= this.animationTimerLimit) {
        this.animationTimer = 0;
        this.animationIndex++;
        if(this.animationIndex >= this.imageObjWingsArr.length) {
          this.animationIndex = 0;
        }
        this.imageObjWing = this.imageObjWingsArr[this.animationIndex];
      } else {
        this.animationTimer++;
      }
      ctx.drawImage(this.imageObjWing, 0, 0, this.imageWingsSizeX, this.imageWingsSizeY, this.posX-165, this.posY-50,this.imageWingsSizeX, this.imageWingsSizeY);
      LogicService.drawRotateImage(this.imageObjHead,ctx,this.angleDirection.angle,this.posX+105,this.posY+65,this.imageHeadSizeX,this.imageHeadSizeY);
      ctx.drawImage(this.imageObjBody, 0, 0, this.imageBodySizeX, this.imageBodySizeY, this.posX, this.posY,this.imageBodySizeX, this.imageBodySizeY);
    }

    updateDamageAnimation(ctx){
      if(this.damAnaimationTimer < this.damAnaimationTimerLimit) {
        this.damAnaimationTimer++;
        if(this.damAnaimationTimer %2 == 1) {
          var damImage = this.imageObjWingsDamagedArr[0]
          if(this.animationIndex < this.imageObjWingsDamagedArr.length){
            damImage = this.imageObjWingsDamagedArr[this.animationIndex];
          }
          ctx.drawImage(damImage, 0, 0, this.imageWingsSizeX, this.imageWingsSizeY, this.posX-165, this.posY-50,this.imageWingsSizeX, this.imageWingsSizeY);
          LogicService.drawRotateImage(this.imageObjHeadDamanged,ctx,this.angleDirection.angle,this.posX+105,this.posY+65,this.imageHeadSizeX,this.imageHeadSizeY);
          ctx.drawImage(this.imageObjBodyDamanged, 0, 0, this.imageBodySizeX, this.imageBodySizeY, this.posX, this.posY,this.imageBodySizeX, this.imageBodySizeY);
        }
      }
    }

    fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
      let bullDirection:BulletDirection;
      if(levelInstance.isVertical()) {
        let headX = this.posX+105;
        let headY = this.posY+65;
        let headXCenter = this.posX+(this.imageHeadSizeX/2)+105;
        let headYCenter = this.posY+(this.imageHeadSizeY/2)+65;
        let cords :{x:number,y:number} = LogicService.pointAfterRotation(headXCenter, headYCenter, headX+this.imageHeadSizeX, headY+(this.imageHeadSizeY/2), this.angleDirection.angle)
        bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, null);
        bulletManagerService.generateGuardianTracker(levelInstance, bullDirection, cords.x, cords.y, 500);
      } else {
        // todo
      }
    }

    /**
     * Common method for looping a firing timer for single firing bots.
     * @param levelInstance
     * @param ctx
     * @param bulletManagerService
     * @param currentPlayer
     */
    updateBulletTimer(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,botManagerService:BotManagerService, bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
      if(this.bTimer >= this.bTimerLimit && this.canShoot(levelInstance,currentPlayer)) {
        this.bTimer = 0;
        this.fireSomething(levelInstance,ctx,bulletManagerService,currentPlayer);
      } else {
        this.bTimer++;
      }
    }

    hasBotBeenHit(hitter: any, hitterBox: HitBox): boolean {
      return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
    }

    hasBotArmorBeenHit(hitter: any, hitterBox: HitBox) {
      return false
    }

    applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService: PlayerService, levelInstance: LevelInstance) {
        this.health -= damage;
        this.triggerDamagedAnimation();
        if (this.health < 1) {
            playerService.currentPlayer.addScore(this.score);
            botManagerService.removeBot(this,1);
            levelInstance.updatePhaseCounter();
        }
    }

    triggerDamagedAnimation(): any {
        this.damAnaimationTimer = 1;// trigger damage animation
    }

    canShoot(levelInstance: LevelInstance, currentPlayer: PlayerObj) {
        if (levelInstance.isVertical()) {
            return true;
        } else if (!levelInstance.isVertical()) {
            return true;
        }
        return false;
    }

    getCenterX(): number {
        return this.posX + (this.imageSizeX / 2);
    }

    getCenterY(): number {
        return this.posY + (this.imageSizeY / 2);
    }

    isWithin(sourceX, tarX, distance): boolean {
        let val = sourceX - tarX;
        if (val < 0)
            val = val * -1;
        return (val < distance)
    }

    getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox];
    }

    isDeathOnColision():boolean{
      return false;
    }
}

