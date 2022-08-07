import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection, TurretDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";
import { ProfileService, ProfileValuesEnum } from "src/app/services/profile.service";

export class Judge extends FlyingBotImpl {
  public speed:number = 5;

  public explodingBulletSpeed:number = 3.5;
  public eTimer:number = 0; // bullet timer
	public eTimerLimit:number = 60;
	public eSlot:number = 0;
	public eSlots:{x:number,y:number}[] = [{x:235,y:70},{x:235,y:200}];
	public bSlot:number = 0;
	public bSlots:{x:number,y:number}[] = [{x:262,y:118},{x:262,y:134}];
	public bMuzzleSlots:{x:number,y:number}[] = [{x:262,y:114},{x:262,y:130}];


  public targetCordsIndex = 0;
  public angleDirection:BulletDirection;
  public playerDirection:TurretDirection;
  constructor(
      config:any={},
      posX:number=0,
      posY:number=0,
      imageObj:HTMLImageElement=null,
      imageObjDamaged:HTMLImageElement=null,
      imageObjShadow:HTMLImageElement=null,
      public imageMuzzleFlash:HTMLImageElement=null,
      imageSizeX:number=264,
      imageSizeY:number=266,
      public hitBox:HitBox=new HitBox(50,50,imageSizeX-100,imageSizeY-100),
      public targetCords:{targetX:number,targetY:number}[]=[],
      public imageMuzzleFlashSizeX:number=14,
      public imageMuzzleFlashSizeY:number=22,
      public imageBulletSizeX:number=22,
      public imageBulletSizeY:number=14,
  ){
    super(config, posX, posY, imageSizeX, imageSizeY, [imageObj], [imageObjDamaged], [imageObjShadow], true);
    this.bTimerLimit = 80;
    this.health = 30;
    this.score = 80;
    this.tryConfigValues(["muzzleDrawLimit","bTimer", "bTimerLimit", "health", "score","targetX","targetY","speed","bulletSpeed","targetCords","explodingBulletSpeed","eTimer","eTimerLimit","eSlot","eSlots"]);
    this.botSize = 1;
  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    let targetCord : {targetX: number, targetY: number} = this.getCurrentTargetCords();
    let range = 10;
    if(this.playerDirection == null){
      this.playerDirection = bulletManagerService.calculateTurretDirection(this.getCenterX(), this.getCenterY(), currentPlayer.posX, currentPlayer.posY, this.speed, true, currentPlayer);
    } else {
      this.playerDirection.update(this.getCenterX(), this.getCenterY());
    }
    this.angleDirection = bulletManagerService.calculateBulletDirection(this.getCenterX(), this.getCenterY(), targetCord.targetX, targetCord.targetY, this.speed, true);

    this.posX += this.angleDirection.speed * this.angleDirection.directionX;
    this.posY += this.angleDirection.speed * this.angleDirection.directionY;

    if(levelInstance.drawShadow() && this.imageObjShadow != null) {
      this.drawShadowFlying(this.playerDirection.angle,canvasContainer,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
    }
		LogicService.drawRotateImage(this.imageObj,ctx,this.playerDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
		this.updateDamageAnimation(ctx, this.playerDirection.angle);

    if(levelInstance.drawHitBox()){
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
      this.hitBox.drawBorder(this.getCenterX(),this.getCenterY(),5,5,ctx,"#FF0000");
      this.targetCords.forEach( cord => {
        this.hitBox.drawBorder(cord.targetX,cord.targetY,5,5,ctx,"#FF0000");
      });
    }

    if ((this.getCenterX() > (targetCord.targetX - range) && this.getCenterX() < (targetCord.targetX + range))
        && (this.getCenterY() > (targetCord.targetY - range) && this.getCenterY() < (targetCord.targetY + range))) {
      this.targetCordsIndex++;
      if ( this.targetCordsIndex >= this.targetCords.length) {
        //botManagerService.removeBot(this);
        this.targetCordsIndex = 0;
        return;
      } else {
        targetCord = this.getCurrentTargetCords();
      }
    }
    if(this.health < 125){
      if(this.eTimer >= this.eTimerLimit){
        this.eTimer = 0;
        this.fireExploding(levelInstance,ctx,bulletManagerService,currentPlayer,this.eSlot);
        this.eSlot = this.eSlot+1 >= this.eSlots.length?0:this.eSlot+1;
      } else {
        this.eTimer++;
        if (this.eTimer == (this.eTimerLimit-5)){
          let slot = this.eSlots[this.eSlot];
          let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.getCenterX(), this.getCenterY(), this.posX+slot.x, this.posY+slot.y,  this.playerDirection.angle);
          let topLeftCords={x:cords.x-5,y:cords.y-5}
          botManagerService.createMisslePlume(topLeftCords.x,topLeftCords.y,null,2);
        }
      }
    } else {
      this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
    }
  }

  getCurrentTargetCords(): { targetX: number; targetY: number; } {
    return this.targetCords[this.targetCordsIndex];
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox)
  }

  fireExploding(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj, slot:number): any {
		let bullDirection:BulletDirection;
		if(levelInstance.isVertical()){
      let slot = this.eSlots[this.eSlot];
      let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.getCenterX(), this.getCenterY(), this.posX+slot.x, this.posY+slot.y,  this.playerDirection.angle);
      let topLeftCords={x:cords.x-5,y:cords.y-5}
			bullDirection = bulletManagerService.calculateBulletDirection(topLeftCords.x, topLeftCords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.explodingBulletSpeed, true, null);
			bulletManagerService.generateExplodingBullet(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y, 60, false);
		} else {}
	}

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    if(this.health >= 125){
      let bullDirection:BulletDirection;
      if(levelInstance.isVertical()){
        let slot = this.bSlots[this.bSlot];
        let topLeftCords=LogicService.topLeftAfterRotation(this.getCenterX(), this.getCenterY(), this.posX+slot.x, this.posY+slot.y, this.imageBulletSizeX, this.imageBulletSizeY,  this.playerDirection.angle)
        bullDirection = bulletManagerService.calculateBulletDirection(topLeftCords.x, topLeftCords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, null);
        bulletManagerService.generateBotBlazer(levelInstance, bullDirection, topLeftCords.x, topLeftCords.y);
        this.bSlot = this.bSlot+1 >= this.bSlots.length?0:this.bSlot+1;
      } else {
        // todo
      }
    }
  }

  drawMuzzleFlare(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, currentPlayer: PlayerObj) {
    let slot = this.bMuzzleSlots[this.bSlot];
    let topLeftCords=LogicService.topLeftAfterRotation(this.getCenterX(), this.getCenterY(), this.posX+slot.x, this.posY+slot.y, this.imageMuzzleFlashSizeX, this.imageMuzzleFlashSizeY,  this.playerDirection.angle)
    LogicService.drawRotateImage(this.imageMuzzleFlash, ctx, this.angleDirection.angle, topLeftCords.x, topLeftCords.y, this.imageMuzzleFlashSizeX, this.imageMuzzleFlashSizeY);
  }

	isDeathOnColision():boolean{
		return false;
  }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
    if(this.health >= 125) {
      return this.playerDirection.angDiff < 0.8 && this.playerDirection.angDiff > -0.8;
    }
		return true;
	}

  getPlayerCollisionHitBoxes(): HitBox[] {
    return [this.hitBox];
  }

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this,this.botSize);
      ProfileService.setProfileValue(ProfileValuesEnum.BOTKILLER_LEVEL2_MINI_BOSS2_JUDGE,"true");
      if(this.isBoss){
        levelInstance.updatePhaseCounter();
      }
    }
  }
}
