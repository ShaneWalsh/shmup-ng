import { LevelInstance } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";

export class Turret {
	public angleDirection:BulletDirection = null;
  public targetObject:any=null;
  public turretSlideIndexSpeed = 0;
  public currentTurretBulletOffsetIndex=0;
  public currentTurretMuzzleIndex=0;

  public firing = false;

	constructor(
		public posX:number=0, // top left of the turret
    public posY:number=0,
    public imageObjTurret:HTMLImageElement[]=null,
    public imageObjTurretDamaged = null,
    public imageObjTurretShadow = null,
    public imageSizeX:number=90,
    public imageSizeY:number=60,
    public rotationXOffset:number=0, // the turret may not turn on centerX+Y
    public rotationYOffset:number=0,
    public bulletType:string="bullet",
    public muzzlePosOffsets:{muzzlePosXOffset:number,muzzlePosYOffset:number}[],// the center of the muzzle flash
		public imageObjMuzzleFlash:HTMLImageElement[]=null,
		public imageMuzzleSizeX:number=90,
    public imageMuzzleSizeY:number=60,
    public bulletOffsets:{bulletXOffset:number,bulletYOffset:number}[], // the center of the bullet
    public bulletSizeX:number=22,
    public bulletSizeY:number=14,
    public allowedMovement:number=500,
    public bulletSpeed:number = 6,
    public bTimer:number = 0,
    public bTimerLimit:number = 30,
    public turretSlideIndex = 0,
    public turretSlideIndexSpeedLimit = 5,
    public turretSlowRotate:boolean = true
	){


	}

	update(posX,posY,targetObject,levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, drawDamage:boolean=false) {
    this.targetObject = targetObject;
    this.posX = posX;
    this.posY = posY;
    let ctx = canvasContainer.mainCtx;
    if(this.targetObject != null) {
      if(this.angleDirection == null) {
        if(this.turretSlowRotate){
          this.angleDirection = bulletManagerService.calculateTurretDirection(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.targetObject.getCenterX(), this.targetObject.getCenterY(), this.bulletSpeed, true, this.targetObject);
        } else {
          this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.targetObject.getCenterX(), this.targetObject.getCenterY(), this.bulletSpeed, true, this.targetObject);
        }
      } else {
        this.angleDirection.update(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset,this.targetObject);
      }
      if(levelInstance.drawShadow() && this.imageObjTurretShadow != null) {
        this.drawShadow(ctx,this.imageObjTurretShadow,5,3);
      }
      LogicService.drawRotateImage(this.getNextTurretImage(drawDamage),ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,this.posX,this.posY,this.imageSizeX,this.imageSizeY,this.posX+this.rotationXOffset,this.posY+this.rotationYOffset);
    } else { // will always point straight ahead
      this.angleDirection = bulletManagerService.calculateTurretDirection(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.posX+this.rotationXOffset, this.posY+this.rotationYOffset+100, this.bulletSpeed, true, null);
      LogicService.drawRotateImage(this.getNextTurretImage(drawDamage),ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
    }

    if(!this.firing){
      this.bTimer = (this.bTimer >= (this.bTimerLimit-5))? this.bTimerLimit-5:this.bTimer+1
      if(this.bTimer >= (this.bTimerLimit-5) && this.angleDirection.canShoot()){
        this.firing = true;
      }
    } else {
      // fire weapon
      if(this.bTimer >= this.bTimerLimit){
        this.bTimer = 0;
        this.firing = false;
        let bulletOffsets:{bulletXOffset:number,bulletYOffset:number} = this.getCurrentBulletOffsets();
        // where should the bullet spawn
        let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.posX+bulletOffsets.bulletXOffset, this.posY+bulletOffsets.bulletYOffset, this.angleDirection.angle);
        let topLeftCords={x:cords.x-(this.bulletSizeX/2),y:cords.y-(this.bulletSizeY/2)}
        if(this.bulletType == "bullet") {
          let bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y,
            (this.targetObject)?this.targetObject.getCenterX():cords.x, (this.targetObject)?this.targetObject.getCenterY():cords.y+6000, this.bulletSpeed, true, null);
          bulletManagerService.generateBotBlazer(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y);
        } else if (this.bulletType == "rocket" ) {
          let bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y,
            (this.targetObject)?this.targetObject.getCenterX():cords.x, (this.targetObject)?this.targetObject.getCenterY():cords.y+6000, this.bulletSpeed, true, null);
          bulletManagerService.generateBotRocket(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y);
        } else if(this.bulletType == "tracker") {
          let bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, this.targetObject.getCenterX(),this.targetObject.getCenterY(), this.bulletSpeed, true, this.targetObject);
          bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y, this.allowedMovement);
        } else if(this.bulletType == "homing") {
          let bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, this.targetObject.getCenterX(),this.targetObject.getCenterY(), this.bulletSpeed, true, this.targetObject);
          bulletManagerService.generateHoming(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y, this.allowedMovement);
        }
        // update the bullet offset
        this.incrementTurretBulletIndex();
      } else {
        this.bTimer++;
        let muzzlePosOffsets:{muzzlePosXOffset:number,muzzlePosYOffset:number} = this.getCurrentMuzzleOffsets();
        if (this.bTimer >= (this.bTimerLimit-20) && this.imageObjMuzzleFlash) {
          this.currentTurretMuzzleIndex = (this.currentTurretMuzzleIndex === this.imageObjMuzzleFlash.length-1)?0:this.currentTurretMuzzleIndex+1;
          const imageObj = this.imageObjMuzzleFlash[this.currentTurretMuzzleIndex];
          if(this.targetObject != null) { // will have to rotate the drawing point accordingly
            let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.posX+muzzlePosOffsets.muzzlePosXOffset, this.posY+muzzlePosOffsets.muzzlePosYOffset, this.angleDirection.angle);
            let topLeftCords={x:cords.x-(this.imageMuzzleSizeX/2),y:cords.y-(this.imageMuzzleSizeY/2)}
            LogicService.drawRotateImage(imageObj, ctx,this.angleDirection.angle,topLeftCords.x,topLeftCords.y,this.imageMuzzleSizeX,this.imageMuzzleSizeY);
          } else { // simply draw it directly where its specifed as there is no rotation.
            ctx.drawImage(imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
          }
        }
      }
    }
  }

  incrementTurretBulletIndex(){
    this.currentTurretBulletOffsetIndex++;
    if(this.currentTurretBulletOffsetIndex >= this.bulletOffsets.length){
      this.currentTurretBulletOffsetIndex = 0;
    }
  }
  getCurrentBulletOffsets(): { bulletXOffset: number; bulletYOffset: number; } {
    return this.bulletOffsets[this.currentTurretBulletOffsetIndex];
  }
  getCurrentMuzzleOffsets(): {muzzlePosXOffset:number,muzzlePosYOffset:number} {
    return this.muzzlePosOffsets[this.currentTurretBulletOffsetIndex];
  }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		if(this.getCenterY() < levelInstance.getMapHeight()){
			return true;
		}
		return false;
	}

	getCenterX():number{
		return this.posX+this.rotationXOffset;
	}

	getCenterY():number{
		return this.posY+this.rotationYOffset;
  }

  getNextTurretImage(drawDamage=false):HTMLImageElement {
    if(drawDamage && this.imageObjTurretDamaged != null){
      return this.imageObjTurretDamaged;
    }
    if(this.imageObjTurret.length > 1){
      this.turretSlideIndexSpeed++;
      if(this.turretSlideIndexSpeed >= this.turretSlideIndexSpeedLimit){
        this.turretSlideIndexSpeed =0;
        this.turretSlideIndex++;
        if(this.turretSlideIndex >= this.imageObjTurret.length){
          this.turretSlideIndex = 0;
        }
      }
      return this.imageObjTurret[this.turretSlideIndex];
    } else {
      return this.imageObjTurret[0];
    }
  }

  drawShadow(ctx:CanvasRenderingContext2D, imageObjShadow:HTMLImageElement, shadowX:number=10, shadowY:number =6){
    //LogicService.drawRotateImage(imageObjShadow,ctx,this.angleDirection.angle,posX+shadowX, posY+shadowY,imageSizeX, imageSizeY);
    let posX = this.posX+shadowX;
    let posY = this.posY+shadowY;
    LogicService.drawRotateImage(imageObjShadow,ctx,this.angleDirection.angle,posX,posY,this.imageSizeX,this.imageSizeY,posX,posY,this.imageSizeX,this.imageSizeY,posX+this.rotationXOffset,posY+this.rotationYOffset);
  }
}
