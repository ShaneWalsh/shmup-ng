import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";
import { LogicService } from "src/app/services/logic.service";

export class Kamikaze extends FlyingBotImpl {

  public angleDirection:BulletDirection = null;

  constructor(
      config:any={},
      posX:number=0,
      posY:number=0,
      public imageObj1:HTMLImageElement[]=null,
      imageObjDamaged: HTMLImageElement[] = imageObj1,
      imageObjShadow: HTMLImageElement[] = null,
      imageSizeX:number=90,
      imageSizeY:number=60,
      public hitBox:HitBox=new HitBox(10,10,imageSizeX-10,imageSizeY-10),
      public kamaHitBox:HitBox=new HitBox(-10,-10,imageSizeX+20,imageSizeY+20)
    ) {
      super(config, posX, posY, imageSizeX, imageSizeY, imageObj1, imageObjDamaged, imageObjShadow);
      this.posXSpeed = 5;
      this.posYSpeed = 5;
		  this.tryConfigValues(["bulletSpeed","posXSpeed","posYSpeed","bTimer","bTimerLimit","score","health"]);
      this.imageObj = imageObj1[0];
  }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;
    this.angleDirection = bulletManagerService.calculateBulletDirection(this.getCenterX(),this.getCenterY(), currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);
    this.posX += this.angleDirection.speed * this.angleDirection.directionX;
    this.posY += this.angleDirection.speed * this.angleDirection.directionY;

    if ( playerService.currentPlayer.hasPlayerBeenHit(this,this.kamaHitBox) ) {
      botManagerService.removeBot(this);
      playerService.killCurrentPlayer();
    } else {
      if(levelInstance.drawShadow() && this.getShadowImage() != null) {
        this.drawShadowFlying(this.angleDirection.angle,canvasContainer,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
      }
      LogicService.drawRotateImage(this.imageObj,ctx,this.angleDirection.angle, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      this.updateDamageAnimation(ctx,this.angleDirection.angle);

      if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
      }

      this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
      this.updateAnimation();
    }
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
    // fires nothing!
	}

  getPlayerCollisionHitBoxes(): HitBox[] {
    return [this.hitBox];
  }

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1) {
      bulletManagerService.generateExplodingBullet(levelInstance, this.angleDirection, this.getCenterX(),this.getCenterY(),1,false);
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this,this.botSize);
      // add exploding bullet
      if(this.isBoss){
        levelInstance.updatePhaseCounter();
      }
    }
  }

  getCurrentAngle():number {
    return this.angleDirection.angle;
  }
}
