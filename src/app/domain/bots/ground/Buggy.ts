import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../../CanvasContainer";
import { Turret } from "../Turret";
import { DeathDetails } from "../../DeathDetails";

export class Buggy extends BotInstanceImpl{
	public bulletSpeed:number = 6;
  public posXSpeed:number = 1.5;
  public posYSpeed:number = 1;
  public moveRight:boolean = false;

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
  public turretYoffset:number=28;

  constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObjMain:HTMLImageElement=null,
        public imageObjMainReversed:HTMLImageElement=null,
        public imageObjTurret:HTMLImageElement=null,
        public imageObjMuzzleFlash:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY),
				public imageObjDamaged: HTMLImageElement = imageObjMain,
				public imageObjShadow: HTMLImageElement = null
    ){
      super(config);
		  this.tryConfigValues(["bulletSpeed","posXSpeed","posYSpeed","bTimer","bTimerLimit","score","health", "moveToXCord", "moveRight"]);
		  this.bTimer = this.bTimerLimit/2;
      if(this.moveRight){
        this.turretXoffset=34;
        this.turretYoffset=28;
        this.imageObj = imageObjMain;
        this.turret = new Turret(
          this.posX+this.turretXoffset,
          this.posY+this.turretYoffset,
          [this.imageObjTurret],
          null,
          null,
          56,//imageSizeX
          20,
          18,6, // rotation offsets
          "bullet",
          [{muzzlePosXOffset:60, muzzlePosYOffset:5}], // Muzzle offsets
          [this.imageObjMuzzleFlash],
          14,//imageMuzzleSizeX
          22,//imageMuzzleSizeY
          [{bulletXOffset:50, bulletYOffset:10}],
          22,// bullet sizex
          14,
          600,
          this.bulletSpeed,
          this.bTimer,
          this.bTimerLimit,
          0,5,false
        );
      } else {
        this.imageObj = imageObjMainReversed;
        this.turretXoffset=48;
        this.turretYoffset=28;
        this.turret = new Turret(
          this.posX+this.turretXoffset,
          this.posY+this.turretYoffset,
          [this.imageObjTurret],
          null,
          null,
          56,//imageSizeX
          20,
          18,6, // rotation offsets
          "bullet",
          [{muzzlePosXOffset:60, muzzlePosYOffset:5}], // Muzzle offsets
          [this.imageObjMuzzleFlash],
          14,//imageMuzzleSizeX
          22,//imageMuzzleSizeY
          [{bulletXOffset:50, bulletYOffset:10}],
          22,// bullet sizex
          14,
          600,
          this.bulletSpeed,
          this.bTimer,
          this.bTimerLimit,
          0,5,false
        );
      }
  }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.groundCtx;
    let ctxShadow = canvasContainer.groundShadowCtx;
    this.posY += this.posYSpeed;
    if(this.moveRight) {
      this.posX += this.posXSpeed;
    } else {
      this.posX -= this.posXSpeed;
    }
    if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)
      || (this.posX < -400 || this.posX > 800)){
        botManagerService.removeBotOOB(this);
    } else {
        ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        if(levelInstance.drawShadow() && this.imageObjShadow != null) {
          this.drawShadow(ctxShadow,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
        }
        if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
          this.damAnaimationTimer++;
          if(this.damAnaimationTimer %2 == 1){
            ctx.drawImage(this.imageObjDamaged, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
          }
        }
        this.turret.update(this.posX+this.turretXoffset,this.posY+this.turretYoffset,currentPlayer,levelInstance, canvasContainer.groundCtx, canvasContainer.groundCtx, botManagerService, bulletManagerService, playerService);
    }
    if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,levelInstance.hitboxColor());
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
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this);
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
    if(this.imageObjDamaged != null){
      this.damAnaimationTimer = 1;// trigger damage animation
    }
  }

  drawShadow(ctx:CanvasRenderingContext2D, imageObjShadow:HTMLImageElement,posX:number,posY:number,imageSizeX:number, imageSizeY:number, shadowX:number=10, shadowY:number =6){
    ctx.drawImage(imageObjShadow, 0, 0, imageSizeX, imageSizeY, posX+shadowX, posY+shadowY, imageSizeX, imageSizeY);
  }

  isGroundBot():boolean{
    return true;
  }

  /**
     * Return the current image
     */
   getDeathDetails() : DeathDetails {
    return new DeathDetails ( this.imageObj, this.posX, this.posY, this.imageSizeX, this.imageSizeY,
                  this.getCurrentAngle(),this.getCenterX(), this.getCenterY(), this.getDeathConfig() );
  }
}
