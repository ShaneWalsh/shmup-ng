import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { LaserTurret, Turret } from "./Turret";
import { CanvasContainer } from "../CanvasContainer";

export class Level2Starship extends  FlyingBotImpl {

	public posXSpeed:number = 3;
	public posYSpeed:number = 1.5;

	public destinationY:number = 50;

  public angleDirection:BulletDirection;
  public lazerTurret:Turret;
  public bulletTurret:Turret;

  public armorDamAnaimationTimer:number = 8;
  public armorDamAnaimationTimerLimit:number = 8;
  public weakPointHealth:number=75;
  public hitBoxWeakpoint:HitBox=new HitBox(0,0,110,90);
	constructor(
		public config:any={},
		public posX:number=0,
    public posY:number=0,
    public imageObjArray:HTMLImageElement[]=null,
		public imageObjDamaged:HTMLImageElement[]=null,
    public imageObjShadow:HTMLImageElement[]=null,
		public imageSizeX:number=174,
    public imageSizeY:number=174,

    public imageTurretMain:HTMLImageElement=null,
    public imageTurretMainDam:HTMLImageElement=null,
    public imageTurretMainSha:HTMLImageElement=null,
    public imageTurretMuzzle:HTMLImageElement=null,

    public imageTurretBullet:HTMLImageElement=null,
    public imageTurretBulletDam:HTMLImageElement=null,
    public imageTurretBulletSha:HTMLImageElement=null,
    public imageTurretBulletMuzzle:HTMLImageElement=null,

    public starshipWeakpoint:HTMLImageElement=null,
    public starshipWeakpointDamage:HTMLImageElement=null,

    public loadingImages:HTMLImageElement[],
		public firingStartImage:HTMLImageElement,
		public firingImages:HTMLImageElement[],

    public hitBoxHull:HitBox=new HitBox(40,40,imageSizeX-80,imageSizeY-80),

	){
    super(config,posX,posY,imageSizeX,imageSizeY,imageObjArray,imageObjDamaged,imageObjShadow, true);
    this.botSize = 1;
    this.tryConfigValues(["bTimer", "bTimerLimit", "missileSpeed", "health", "score","posYSpeed","posXSpeed","bulletSpeed", "anaimationTimerLimit","destinationY"]);
    this.lazerTurret = new LaserTurret(
      this.posX+(-20),
      this.posY+(29),
      [this.imageTurretMain],
      imageTurretMainDam,
      imageTurretMainSha,
      224,//imageSizeX
      110,
      106,58, // rotation offsets
      "bullset",
      [{muzzlePosXOffset:225, muzzlePosYOffset:58}], // Muzzle offsets
      [imageTurretMuzzle],
      14,//imageMuzzleSizeX
      22,//imageMuzzleSizeY
      [{bulletXOffset:225, bulletYOffset:58}],
      22,// bullet sizex
      14,
      600,
      this.bulletSpeed,
      this.bTimer,
      50, // btimerlimit lazer between shots
      0,5,true, 30, 60,
      loadingImages,
      firingStartImage,
      firingImages
    );

    this.bulletTurret = new Turret(
      this.posX+(-20),
      this.posY+(29),
      [this.imageTurretBullet],
      imageTurretBulletDam,
      imageTurretBulletSha,
      224,//
      110,
      66,58, // rotation offsets
      "bullet",
      [{muzzlePosXOffset:106, muzzlePosYOffset:88}], // Muzzle offsets
      [imageTurretBulletMuzzle],
      14,//imageMuzzleSizeX
      22,//imageMuzzleSizeY
      [{bulletXOffset:106, bulletYOffset:88}],
      22,// bullet sizex
      14,
      600,
      this.bulletSpeed,
      this.bTimer,
      this.bTimerLimit,
      0,5,false
    );
	}

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    if(this.posY < this.destinationY){
			this.posY += this.posYSpeed;
    }

    if(levelInstance.drawShadow()) {
      this.drawShadowFlying(null,canvasContainer,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
    }
    ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
    let drawTurretDamage = (this.damAnaimationTimer < this.damAnaimationTimerLimit);
    this.updateDamageAnimation(ctx);

    // laser
    this.lazerTurret.update(this.posX+(-20),this.posY+(29),currentPlayer,levelInstance, canvasContainer.mainCtx, canvasContainer.shadowCtx, botManagerService, bulletManagerService, playerService,drawTurretDamage);
    // rotate the bullet turret and battery by the large turret so i know their cordinates.

    let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+87, this.posY+87,this.posX+(46), this.posY+(87),  this.lazerTurret.angleDirection.angle);
    // now get the point to rotate it by, which is the top left x+Y and rotate by those poitns.
    let topLeftCords={x:cords.x-66,y:cords.y-58}
    this.hitBoxWeakpoint.hitBoxX = topLeftCords.x - (this.posX-10);
    this.hitBoxWeakpoint.hitBoxY = topLeftCords.y - this.posY;
    // weakpoint
    LogicService.drawRotateImage(this.starshipWeakpoint,ctx,this.lazerTurret.angleDirection.angle,this.posX+(-20),this.posY+(29),224,110, 0,0,224,110, this.posX+86,this.posY+ 87);
    this.updateArmorDamageAnimation(ctx, this.lazerTurret.angleDirection.angle);
    // bullet
    this.bulletTurret.update(topLeftCords.x,topLeftCords.y,currentPlayer,levelInstance, canvasContainer.mainCtx, canvasContainer.shadowCtx, botManagerService, bulletManagerService, playerService,drawTurretDamage);



    if(levelInstance.drawHitBox()){
      this.hitBoxHull.drawBorder(this.posX+this.hitBoxHull.hitBoxX,this.posY+this.hitBoxHull.hitBoxY,this.hitBoxHull.hitBoxSizeX,this.hitBoxHull.hitBoxSizeY,ctx,"#FF0000");
      this.hitBoxWeakpoint.drawBorder(this.posX+this.hitBoxWeakpoint.hitBoxX,this.posY+this.hitBoxWeakpoint.hitBoxY,this.hitBoxWeakpoint.hitBoxSizeX,this.hitBoxWeakpoint.hitBoxSizeY,ctx,"#FFF000");
    }

    this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
    this.updateAnimation();
  }

  applyArmorDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.weakPointHealth -= damage;
    this.triggerArmorDamagedAnimation();
    if(this.weakPointHealth < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this,this.botSize);
      levelInstance.updatePhaseCounter();
    }
  }


  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBoxHull.areCentersToClose(hitter,hitterBox,this,this.hitBoxHull);
  }

  hasBotArmorBeenHit(hitter: any, hitterBox: HitBox) {
    return this.hitBoxWeakpoint.areCentersToClose(hitter,hitterBox,this,this.hitBoxWeakpoint);
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){

	}

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBoxHull];
  }

	isDeathOnColision():boolean{
		return false;
  }

  triggerArmorDamagedAnimation(): any {
    this.armorDamAnaimationTimer = 1;
  }

  updateArmorDamageAnimation(ctx,angle=null){
    if(this.armorDamAnaimationTimer < this.armorDamAnaimationTimerLimit) {
      this.armorDamAnaimationTimer++;
      if(this.armorDamAnaimationTimer %2 == 1) {
        if(angle != null){
          LogicService.drawRotateImage(this.starshipWeakpointDamage,ctx,this.lazerTurret.angleDirection.angle,this.posX+(-20),this.posY+(29),224,110, 0,0,224,110, this.posX+86,this.posY+ 87);
        }
      }
    }
  }
}
