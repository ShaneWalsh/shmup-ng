import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../../CanvasContainer";
import { Turret } from "../Turret";
import { LogicService, HardRotationAngle } from "src/app/services/logic.service";

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

  public rotationAngle:number = HardRotationAngle.RIGHT; // right

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
        this.hitBox=new HitBox(30,-20,imageSizeY,imageSizeX)
      } else if(this.moveToXCord < this.posX){
        this.rotationAngle = HardRotationAngle.LEFT;
        this.turretXoffset = 20
        this.turretYoffset = 5
      } // mtX > x RIGHT is default

		  this.bTimer = this.bTimerLimit/2;
      this.imageObj = imageObjMain;
      this.turret = new Turret(
        this.posX+this.turretXoffset,
        this.posY+this.turretYoffset,
        [this.aaTankTurret1,this.aaTankTurret2,this.aaTankTurret3,this.aaTankTurret4,this.aaTankTurret5,this.aaTankTurret6,this.aaTankTurret7,this.aaTankTurret8],
        aaTankTurretDamaged,
        98,//imageSizeX
        68,
        34,33, // rotation offsets
        "bullet",
        [{muzzlePosXOffset:100, muzzlePosYOffset:27},{muzzlePosXOffset:100, muzzlePosYOffset:35}], // Muzzle offsets
        this.imageObjMuzzleFlash,
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
    let ctx = canvasContainer.mainCtx;
    this.posY += this.posYSpeed;
    if((this.posX < (this.moveToXCord-this.posXSpeed+2))){
      this.posX += this.posXSpeed;
    } else if((this.posX) > (this.moveToXCord+this.posXSpeed+2)){
      this.posX -= this.posXSpeed;
    }
    if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)
        || (this.posX < -2000 || this.posX > 2000)){
        botManagerService.removeBot(this);
    } else {
      if(levelInstance.drawShadow() && this.imageObjShadow != null) {
        this.drawShadow(canvasContainer,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
      }
      let drawDamage = false;
      LogicService.drawRotateImage(this.imageObj,ctx,this.rotationAngle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
        if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
          this.damAnaimationTimer++;
          if(this.damAnaimationTimer %2 == 1){
            drawDamage = true;
            LogicService.drawRotateImage(this.imageObjDamaged,ctx,this.rotationAngle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
          }
        }
        this.turret.update(this.posX+this.turretXoffset,this.posY+this.turretYoffset,currentPlayer,levelInstance, ctx, botManagerService, bulletManagerService, playerService, drawDamage);
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
		}
		else{
			this.anaimationTimer++;
		}
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  applyDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
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
  drawShadow(canvasContainer:CanvasContainer, imageObjShadow:HTMLImageElement,posX:number,posY:number,imageSizeX:number, imageSizeY:number, shadowX:number=10, shadowY:number =6){
    LogicService.drawRotateImage(imageObjShadow,canvasContainer.shadowCtx,this.rotationAngle,posX+shadowX, posY+shadowY,imageSizeX, imageSizeY);
  }
}
