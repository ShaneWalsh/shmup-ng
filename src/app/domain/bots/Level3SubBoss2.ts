import { FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";
import { Turret } from "./Turret";
import { DeathDetails } from "../DeathDetails";

export class Level3SubBoss2 extends  FlyingBotImpl {
    public phaseCounter = 0;
    public moveSpeed = 4;
    public bTimerLimit = 60;
    public turretHealthTrigger = 150;

    public angle:number;
    public moveDirection: BulletDirection;
    public movePositions: {x:number,y:number}[] = [
        { x: 240, y: 45 },
        { x: 140, y: 52 },
        { x: 80, y: 101 },
        { x: 58, y: 186 },
        { x: 70, y: 244 },
        { x: 104, y: 292 },
        { x: 173, y: 329 },
        { x: 261, y: 348 },
        { x: 344, y: 387 },
        { x: 394, y: 454 },
        { x: 404, y: 541 },
        { x: 337, y: 598 },
        { x: 241, y: 612 },
        { x: 135, y: 593 },
        { x: 89, y: 532 },
        { x: 108, y: 460 },
        { x: 170, y: 401 },
        { x: 244, y: 384 },
        { x: 317, y: 362 },
        { x: 381, y: 296 },
        { x: 414, y: 209 },
        { x: 402, y: 129 },
        { x: 356, y: 74 },
        { x: 295, y: 49 }
    ];

    public rotationCenterX = 48;
    public rotationCenterY = 66;

    public turret:Turret;
    public turretXoffset:number=0;
    public turretYoffset:number=0;

    constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public images:HTMLImageElement[]=null,
        public imageObj4Damaged: HTMLImageElement = null,
        public imageObjTurret: HTMLImageElement = null,
        public imageObjMuzzleFlash: HTMLImageElement = null,
        public imageSizeX:number=118,
        public imageSizeY:number=134,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ) {
      super(config, posX, posY, imageSizeX, imageSizeY, images, [imageObj4Damaged], null, true);
      this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","moveSpeed","bulletSpeed"]);
      this.turretHealthTrigger = this.health/2;

      this.turret = new Turret (
        this.posX+this.turretXoffset,
        this.posY+this.turretYoffset,
        [this.imageObjTurret],
        imageObjTurret,
        null,
        imageSizeX,//imageSizeX
        imageSizeY,
        this.rotationCenterX,this.rotationCenterY, // rotation offsets
        "bullet",
        [{muzzlePosXOffset:88, muzzlePosYOffset:64}], // Muzzle offsets
        [this.imageObjMuzzleFlash],
        14,//imageMuzzleSizeX
        22,//imageMuzzleSizeY
        [{bulletXOffset:88, bulletYOffset:64}],
        22,// bullet sizex
        14,
        600
      );
      this.turret.turretSlowRotate = false;
      this.turret.bTimerLimit = 45;
    }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    let positions = this.movePositions[this.phaseCounter];
    this.moveDirection = bulletManagerService.calculateBulletDirection(this.getCenterX(), this.getCenterY(), positions.x, positions.y, this.moveSpeed, true);
    this.posX += this.moveDirection.speed * this.moveDirection.directionX;
    this.posY += this.moveDirection.speed * this.moveDirection.directionY;
    if (this.isWithin(this.getCenterX(), positions.x, 10) && this.isWithin(this.getCenterY(), positions.y, 10)){
      this.phaseCounter++;
      if( this.phaseCounter == this.movePositions.length )
        this.phaseCounter = 0;
    }

    LogicService.drawRotateImage(this.imageObj, ctx, this.moveDirection.angle, this.posX, this.posY, this.imageSizeX, this.imageSizeY, 0, 0, this.imageSizeX, this.imageSizeY, this.posX+this.rotationCenterX, this.posY+this.rotationCenterY);
    this.updateDamageAnimation(ctx, this.moveDirection.angle);

    // Turret
    if ( this.health < this.turretHealthTrigger ) { // if the health is less than a certain value, then activate the turret
      this.turret.update(this.posX+this.turretXoffset,this.posY+this.turretYoffset,currentPlayer,levelInstance, ctx, ctx, botManagerService, bulletManagerService, playerService, true);
    } else { // else just draw it in place
      LogicService.drawRotateImage(this.imageObjTurret, ctx, this.moveDirection.angle, this.posX, this.posY, this.imageSizeX, this.imageSizeY, 0, 0, this.imageSizeX, this.imageSizeY, this.posX+this.rotationCenterX, this.posY+this.rotationCenterY);
    }

    if(levelInstance.drawHitBox()){
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }

    this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
    this.updateAnimation();
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
      this.health -= damage;
      this.triggerDamagedAnimation();
      if(this.health < 1){
        playerService.currentPlayer.addScore(this.score);
        botManagerService.removeBot(this,1);
        levelInstance.updatePhaseCounter();
      }
  }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		return true;
	}

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
    let bm = bulletManagerService.calculateBulletDirection(this.getCenterX(), this.getCenterY(), this.getCenterX(), this.getCenterY()+1, 0, true);
    bulletManagerService.generateBomberMine(levelInstance,bm,this.getCenterX(),this.getCenterY(),90);
  }

  isWithin(sourceX,tarX, distance):boolean{
      let val = sourceX - tarX;
      if(val < 0)
          val = val * -1;
      return (val < distance)
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox];
  }

  isDeathOnColision():boolean{
    return false;
  }

  /**
   * draw the damaged sprite over the parent sprite to indicate damage.
   * @param ctx
   * @param angle when provided the damaged image will be drawn at this angle
   */
   updateDamageAnimation(ctx,angle=null){
    if(this.damAnaimationTimer < this.damAnaimationTimerLimit) {
      this.damAnaimationTimer++;
      if(this.damAnaimationTimer %2 == 1) {
        var damImage = this.imageObjDamaged[0]
        if(this.animationIndex < this.imageObjDamaged.length){
          damImage = this.imageObjDamaged[this.animationIndex];
        }
        if(angle != null){
          LogicService.drawRotateImage(damImage,ctx,angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,0,0,this.imageSizeX,this.imageSizeY, this.posX+this.rotationCenterX, this.posY+this.rotationCenterY);
        } else {
          ctx.drawImage(damImage, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        }
      }
    }
  }

  /**
   * Return the current image
   */
  getDeathDetails():DeathDetails {
    return new DeathDetails(this.imageObj, this.posX, this.posY, this.imageSizeX, this.imageSizeY, this.getCurrentAngle());
  }

  getCurrentAngle() {
    return this.moveDirection.angle;
  }

}
