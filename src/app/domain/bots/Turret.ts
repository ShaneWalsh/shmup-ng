import { LevelInstance } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";

export class Turret {
	public angleDirection:BulletDirection;
  public targetObject:any=null;

	constructor(
		public posX:number=0, // top left of the turret
    public posY:number=0,
    public imageObjTurret:HTMLImageElement=null,
    public imageSizeX:number=90,
    public imageSizeY:number=60,
    public rotationXOffset:number=0, // the turret may not turn on centerX+Y
    public rotationYOffset:number=0,
    public bulletType:string="bullet",
    public muzzlePosXOffset:number=0, // the center of the muzzle flash
    public muzzlePosYOffset:number=0,
		public imageObjMuzzleFlash:HTMLImageElement=null,
		public imageMuzzleSizeX:number=90,
    public imageMuzzleSizeY:number=60,
    public bulletXOffset:number=muzzlePosXOffset, // the center of the bullet
    public bulletYOffset:number=muzzlePosYOffset,
    public bulletSizeX:number=22,
    public bulletSizeY:number=14,
    public allowedMovement:number=500,
    public bulletSpeed:number = 6,
    public bTimer:number = 0,
    public bTimerLimit:number = 30
	){

	}

	update(posX,posY,targetObject,levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    this.targetObject = targetObject;
    this.posX = posX;
    this.posY = posY;
    if(this.targetObject != null) {
      this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.targetObject.getCenterX(), this.targetObject.getCenterY(), this.bulletSpeed, true, this.targetObject);
      LogicService.drawRotateImage(this.imageObjTurret,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,this.posX,this.posY,this.imageSizeX,this.imageSizeY,this.posX+8,this.posY+8);
    } else { // will always point straight ahead
      this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.posX+this.rotationXOffset, this.posY+this.rotationYOffset+100, this.bulletSpeed, true, null);
      LogicService.drawRotateImage(this.imageObjTurret,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
    }

		// fire weapon
		if(this.bTimer >= this.bTimerLimit){
      this.bTimer = 0;
      // where should the bullet spawn
      let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.posX+this.bulletXOffset, this.posY+this.bulletYOffset, this.angleDirection.angle);
      let topLeftCords={x:cords.x-(this.bulletSizeX/2),y:cords.y-(this.bulletSizeY/2)}
      if(this.bulletType == "bullet") {
        let bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y,
          (this.targetObject)?this.targetObject.getCenterX():cords.x, (this.targetObject)?this.targetObject.getCenterY():cords.y+6000, this.bulletSpeed, true, null);
        bulletManagerService.generateBotBlazer(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y);
      } else if(this.bulletType == "tracker") {
        let bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, this.targetObject.getCenterX(),this.targetObject.getCenterY(), this.bulletSpeed, true, this.targetObject);
        bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y, this.allowedMovement);
      } else if(this.bulletType == "homing") {
        let bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, this.targetObject.getCenterX(),this.targetObject.getCenterY(), this.bulletSpeed, true, this.targetObject);
        bulletManagerService.generateHoming(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y, this.allowedMovement);
      }
		} else {
			this.bTimer++;
			if (this.bTimer >= (this.bTimerLimit-5) && this.imageObjMuzzleFlash){
        if(this.targetObject != null) { // will have to rotate the drawing point accordingly
          let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+this.rotationXOffset, this.posY+this.rotationYOffset, this.posX+this.muzzlePosXOffset, this.posY+this.muzzlePosYOffset, this.angleDirection.angle);
          let topLeftCords={x:cords.x-(this.imageMuzzleSizeX/2),y:cords.y-(this.imageMuzzleSizeY/2)}
          LogicService.drawRotateImage(this.imageObjMuzzleFlash, ctx,this.angleDirection.angle,topLeftCords.x,topLeftCords.y,this.imageMuzzleSizeX,this.imageMuzzleSizeY);
        } else { // simply draw it directly where its specifed as there is no rotation.
          ctx.drawImage(this.imageObjTurret, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        }
			}
		}
	}

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		if(levelInstance.isVertical() && this.getCenterY() > 0){
			return true;
		} else if(!levelInstance.isVertical() && this.getCenterX() > currentPlayer.getCenterX()){
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
}
