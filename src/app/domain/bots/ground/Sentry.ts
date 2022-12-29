import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../../CanvasContainer";
import { Turret } from "../Turret";
import { LogicService, HardRotationAngle } from "src/app/services/logic.service";
import { BackgroundElement } from "../../BackgroundElement";
import { DeathDetails } from "../../DeathDetails";

export class Sentry extends BotInstanceImpl{
	public bulletSpeed:number = 6;
  public posXSpeed:number = 1.5;
  public posYSpeed:number = 1;
  public moveToXCord:number = 250;

  public bTimer:number = 0; // bullet timer
  public bTimerLimit:number = 30;

  public anaimationTimer:number = 0;
  public anaimationTimerLimit:number =4;

	public damAnaimationTimer:number = 8;
	public damAnaimationTimerLimit:number =8;

  public imageObj:HTMLImageElement;

  public score:number = 1000;

  public health:number=5;
  public turret:Turret;
  public turretXoffset:number=18;
  public turretYoffset:number=40;

  public deathXOffset:number=0;
  public deathYOffset:number=0;
  public deathShadowXOffset:number=10;
  public deathShadowYOffset:number=6;
  public skipTrack = false;
  public skipTrackCount = false;

  constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObjMain:HTMLImageElement=null,
        public imageObjDamaged:HTMLImageElement=null,
        public imageObjShadow:HTMLImageElement=null,
        public sentryTurret1:HTMLImageElement=null,
        public sentryTurretDamaged:HTMLImageElement=null,
        public sentryTurretShadow:HTMLImageElement=null,
        public imageObjMuzzleFlash:HTMLImageElement[]=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(20,60,60,60),
        public hitBox2:HitBox=new HitBox(70,20,60,60)
    ){
      super(config);
      this.tryConfigValues(["bulletSpeed","posXSpeed","posYSpeed","bTimer","bTimerLimit","score","health", "moveToXCord"]);

		  this.bTimer = this.bTimerLimit/2;
      this.imageObj = imageObjMain;
      this.turret = new Turret(
        this.posX+this.turretXoffset,
        this.posY+this.turretYoffset,
        [this.sentryTurret1],
        sentryTurretDamaged,
        sentryTurretShadow,
        130,//imageSizeX
        62,
        42,30, // rotation offsets
        "rocket",
        [{muzzlePosXOffset:125, muzzlePosYOffset:30}], // Muzzle offsets
        this.imageObjMuzzleFlash,
        20,//imageMuzzleSizeX
        20,//imageMuzzleSizeY
        [{bulletXOffset:135, bulletYOffset:32}],
        22,// bullet sizex
        14,
        600,
        this.bulletSpeed,
        this.bTimer,
        this.bTimerLimit
      );
  }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.groundCtx;
    let ctxShadow = canvasContainer.groundShadowCtx;
    this.posY += this.posYSpeed;
    if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)
        || (this.posX < -2000 || this.posX > 2000)){
        botManagerService.removeBotOOB(this);
    } else {
      if(levelInstance.drawShadow() && this.imageObjShadow != null) {
        this.drawShadow(ctxShadow,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
      }
      let drawDamage = false;
      LogicService.drawRotateImage(this.imageObj,ctx,0,this.posX,this.posY,this.imageSizeX,this.imageSizeY,0,0,this.imageSizeX,this.imageSizeY);
        if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
          this.damAnaimationTimer++;
          if(this.damAnaimationTimer %2 == 1){
            drawDamage = true;
            LogicService.drawRotateImage(this.imageObjDamaged,ctx,0,this.posX,this.posY,this.imageSizeX,this.imageSizeY,0,0,this.imageSizeX,this.imageSizeY);
          }
        }
        this.turret.update(this.posX+this.turretXoffset,this.posY+this.turretYoffset,currentPlayer,levelInstance, canvasContainer.groundCtx, canvasContainer.groundCtx, botManagerService, bulletManagerService, playerService, drawDamage);
    }
    if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,levelInstance.hitboxColor());
        this.hitBox2.drawBorder(this.posX+this.hitBox2.hitBoxX,this.posY+this.hitBox2.hitBoxY,this.hitBox2.hitBoxSizeX,this.hitBox2.hitBoxSizeY,ctx,levelInstance.hitboxColor());
    }

    if(this.anaimationTimer >= this.anaimationTimerLimit){
			this.anaimationTimer = 0;
			if(this.imageObj == this.imageObjMain){
          this.imageObj = this.imageObjMain; // if we ever add a moving image we can just drop it in here,
      } else {
          this.imageObj = this.imageObjMain;
      }
		}
		else{
			this.anaimationTimer++;
		}
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox) || this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox2)
  }

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this);
      botManagerService.generateDeadSentry(this.posX,this.posY,this.deathXOffset,this.deathYOffset, this.deathShadowXOffset, this.deathShadowYOffset);
    }
  }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		if(this.getCenterY() < levelInstance.getMapHeight() && (this.getCenterX() > -40 || this.getCenterY() < 640 )){
			return true;
		}
		return false;
	}

  getCenterX():number {
      return this.posX+(this.imageSizeX/2);
  }

  getCenterY():number {
      return this.posY+(this.imageSizeY/2);
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox];
  }

  triggerDamagedAnimation(): any {
    if(this.imageObjDamaged != null) {
      this.damAnaimationTimer = 1;// trigger damage animation
    }
  }
  drawShadow(ctx:CanvasRenderingContext2D, imageObjShadow:HTMLImageElement,posX:number,posY:number,imageSizeX:number, imageSizeY:number, shadowX:number=10, shadowY:number =6){
    LogicService.drawRotateImage(imageObjShadow,ctx,0,posX+shadowX, posY+shadowY,imageSizeX, imageSizeY);
  }

  isGroundBot():boolean{
    return true;
  }

    /**
   * Return the current image
   */
     getDeathDetails() : DeathDetails {
      return new DeathDetails ( this.sentryTurret1, this.posX+this.turretXoffset,this.posY+this.turretYoffset, 130, 62,
                    this.turret.angleDirection.angle,this.posX+this.turretXoffset+42,this.posY+this.turretYoffset+30, this.getDeathConfig() );
    }
}
