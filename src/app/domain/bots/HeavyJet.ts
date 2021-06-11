import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";
import { BotAnimation } from "../BotAnimation";

export class HeavyJet extends FlyingBotImpl {
  public speed:number = 3;

  public targetCordsIndex = 0;
  public angleDirection:BulletDirection;
  constructor(
      config:any={},
      posX:number=0,
      posY:number=0,
      imageObj:HTMLImageElement=null,
      imageObjDamaged:HTMLImageElement=null,
      imageObjShadow:HTMLImageElement=null,
      public engine:BotAnimation= null,
      imageSizeX:number=164,
      imageSizeY:number=134,
      public hitBox:HitBox=new HitBox(0,0,imageSizeX-10,imageSizeY-10),
      public targetCords:{targetX:number,targetY:number}[]=[]
  ){
    super(config, posX, posY, imageSizeX, imageSizeY, [imageObj], [imageObjDamaged], [imageObjShadow]);
    this.bTimerLimit = 80;
    this.health = 30;
    this.score = 80;
    this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","targetX","targetY","speed","bulletSpeed","targetCords"]);
  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    let targetCord : {targetX: number, targetY: number} = this.getCurrentTargetCords();
    let range = 10;
    this.angleDirection = bulletManagerService.calculateBulletDirection(this.getCenterX(), this.getCenterY(), targetCord.targetX, targetCord.targetY, this.speed, true);

    this.posX += this.angleDirection.speed * this.angleDirection.directionX;
    this.posY += this.angleDirection.speed * this.angleDirection.directionY;

    if(levelInstance.drawShadow() && this.imageObjShadow != null) {
      this.drawShadowFlying(this.angleDirection.angle,canvasContainer,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
    }
    LogicService.drawRotateImage(this.imageObj,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
    if(this.engine != null) {
      this.engine.update(this.posX, this.posY, this.angleDirection.angle, ctx, levelInstance, canvasContainer, botManagerService, bulletManagerService, playerService)
    }
		this.updateDamageAnimation(ctx, this.angleDirection.angle);

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
      if ( this.targetCordsIndex >= this.targetCords.length){
        botManagerService.removeBotOOB(this);
        return;
      } else {
        targetCord = this.getCurrentTargetCords();
      }
    }
    this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
  }

  getCurrentTargetCords(): { targetX: number; targetY: number; } {
    return this.targetCords[this.targetCordsIndex];
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox)
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let bullDirection:BulletDirection;
    if(levelInstance.isVertical()){
      let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+150, this.posY+70, this.angleDirection.angle)
      bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, null);
      bulletManagerService.generateGuardianTracker(levelInstance, bullDirection, cords.x, cords.y, 500);
    } else {
      // todo
    }
	}

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		return true;
	}

  getPlayerCollisionHitBoxes(): HitBox[] {
    return [this.hitBox];
  }

  getCurrentAngle():number {
    return this.angleDirection.angle;
  }
}
