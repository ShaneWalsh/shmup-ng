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

export class AATank extends BotInstanceImpl{
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
  public turretXoffset:number=34;
  public turretYoffset:number=0;

  public trackXOffset:number=0;
  public trackYOffset:number=0;

  public rotationAngle:number = HardRotationAngle.RIGHT; // right

  public deathXOffset:number=0;
  public deathYOffset:number=-10;
  public deathShadowXOffset:number=5;
  public deathShadowYOffset:number=8;
  public skipTrack = false;
  public skipTrackCount = false;

  constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObjMain:HTMLImageElement=null,
        public imageObjDamaged:HTMLImageElement=null,
        public imageObjShadow:HTMLImageElement=null,
        public aaTankTrackHorizontal:HTMLImageElement=null,
        public aaTankTurretDamaged:HTMLImageElement=null,
        public aaTankTurret1:HTMLImageElement=null,
        public aaTankTurret2:HTMLImageElement=null,
        public aaTankTurret3:HTMLImageElement=null,
        public aaTankTurret4:HTMLImageElement=null,
        public aaTankTurret5:HTMLImageElement=null,
        public aaTankTurret6:HTMLImageElement=null,
        public aaTankTurret7:HTMLImageElement=null,
        public aaTankTurret8:HTMLImageElement=null,
        public imageObjMuzzleFlash:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){
      super(config);
      this.moveToXCord = this.posX;
      this.tryConfigValues(["bulletSpeed","posXSpeed","posYSpeed","bTimer","bTimerLimit","score","health", "moveToXCord"]);
      if(this.moveToXCord == this.posX){
        this.rotationAngle = HardRotationAngle.DOWN;
        this.turretXoffset = 30
        this.trackXOffset= 63;
        this.trackYOffset= -50;
        this.skipTrack = true;
        this.hitBox=new HitBox(30,-20,imageSizeY,imageSizeX)
        this.deathXOffset = 6;
        this.deathYOffset = -7;
        this.deathShadowXOffset = 14;
        this.deathShadowYOffset = 8;
      } else if(this.moveToXCord < this.posX){
        this.rotationAngle = HardRotationAngle.LEFT;
        this.turretXoffset = 20
        this.turretYoffset = 5
        this.trackXOffset= this.imageSizeX;
        this.trackYOffset= 10;
        this.deathYOffset = 0;
        this.deathShadowXOffset = 10;
        this.deathShadowYOffset = 16;
      } // mtX > x RIGHT is default

		  this.bTimer = this.bTimerLimit/2;
      this.imageObj = imageObjMain;
      this.turret = new Turret(
        this.posX+this.turretXoffset,
        this.posY+this.turretYoffset,
        [this.aaTankTurret1,this.aaTankTurret2,this.aaTankTurret3,this.aaTankTurret4,this.aaTankTurret5,this.aaTankTurret6,this.aaTankTurret7,this.aaTankTurret8],
        aaTankTurretDamaged,
        null,
        98,//imageSizeX
        68,
        34,33, // rotation offsets
        "bullet",
        [{muzzlePosXOffset:100, muzzlePosYOffset:27},{muzzlePosXOffset:100, muzzlePosYOffset:35}], // Muzzle offsets
        [this.imageObjMuzzleFlash],
        14,//imageMuzzleSizeX
        22,//imageMuzzleSizeY
        [{bulletXOffset:100, bulletYOffset:27},{bulletXOffset:100, bulletYOffset:35}],
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
    if((this.posX < (this.moveToXCord-this.posXSpeed+2))){
      this.posX += this.posXSpeed;
    } else if((this.posX) > (this.moveToXCord+this.posXSpeed+2)){
      this.posX -= this.posXSpeed;
    }
    if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)
        || (this.posX < -2000 || this.posX > 2000)){
        botManagerService.removeBotOOB(this);
    } else {
      if(levelInstance.drawShadow() && this.imageObjShadow != null) {
        this.drawShadow(ctxShadow,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
      }
      let drawDamage = false;
      LogicService.drawRotateImage(this.imageObj,ctx,this.rotationAngle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,0,0,this.imageSizeX,this.imageSizeY);
        if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
          this.damAnaimationTimer++;
          if(this.damAnaimationTimer %2 == 1){
            drawDamage = true;
            LogicService.drawRotateImage(this.imageObjDamaged,ctx,this.rotationAngle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,0,0,this.imageSizeX,this.imageSizeY);
          }
        }
        this.turret.update(this.posX+this.turretXoffset,this.posY+this.turretYoffset,currentPlayer,levelInstance, canvasContainer.groundCtx, canvasContainer.groundCtx, botManagerService, bulletManagerService, playerService, drawDamage);
    }
    if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }

    if(this.anaimationTimer >= this.anaimationTimerLimit){
			this.anaimationTimer = 0;
			if(this.imageObj == this.imageObjMain){
          this.imageObj = this.imageObjMain; // if we ever add a moving image we can just drop it in here,
      } else {
          this.imageObj = this.imageObjMain;
      }
      if(this.skipTrack){
        if(!this.skipTrackCount){
          botManagerService.generateTankTrack(this.posX+this.trackXOffset,this.posY+this.trackYOffset,this.rotationAngle);
        }
        this.skipTrackCount = !this.skipTrackCount;
      } else {
        botManagerService.generateTankTrack(this.posX+this.trackXOffset,this.posY+this.trackYOffset,this.rotationAngle);
      }
		}
		else{
			this.anaimationTimer++;
		}
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this);
      botManagerService.generateDeadAATank(this.posX,this.posY,this.rotationAngle,this.deathXOffset,this.deathYOffset, this.deathShadowXOffset, this.deathShadowYOffset);
    }
  }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		if(this.getCenterY() < levelInstance.getMapHeight() && (this.getCenterX() > 0 || this.getCenterX() < 480 )){
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
    LogicService.drawRotateImage(imageObjShadow,ctx,this.rotationAngle,posX+shadowX, posY+shadowY,imageSizeX, imageSizeY);
  }

  isGroundBot():boolean{
    return true;
  }
}
