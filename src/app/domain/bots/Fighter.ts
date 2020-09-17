import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";

export class Fighter extends FlyingBotImpl{
  public score:number = 10;
  public health:number=3;

  constructor(
      config:any={},
      posX:number=0,
      posY:number=0,
      public imageObj1:HTMLImageElement=null,
      public imageObj2:HTMLImageElement=null,
      imageSizeX:number=90,
      imageSizeY:number=60,
      public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY),
      imageObjDamaged: HTMLImageElement = imageObj1,
      imageObjShadow: HTMLImageElement = null
    ){
      super(config, posX, posY, imageSizeX, imageSizeY, [imageObj1,imageObj2], imageObjDamaged, imageObjShadow);
      this.posXSpeed = 3;
      this.posYSpeed = 3;
		  this.tryConfigValues(["bulletSpeed","posXSpeed","posYSpeed","bTimer","bTimerLimit","score","health"]);
		  this.bTimer = this.bTimerLimit/2;
      this.imageObj = imageObj1;
  }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;
    this.posY += this.posYSpeed;
    if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)){
      botManagerService.removeBot(this);
    } else {
      if(levelInstance.drawShadow() && this.imageObjShadow != null) {
        this.drawShadow(canvasContainer,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
      }
      ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      this.updateDamageAnimation(ctx);
    }
    if(levelInstance.drawHitBox()){
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }

    this.updateBulletTimer(levelInstance,ctx,bulletManagerService,currentPlayer);
    this.updateAnimation();
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let bullDirection:BulletDirection;
    if(levelInstance.isVertical()){
      bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 15, this.posY + 55, this.posX + 15, this.posY + 90, this.bulletSpeed, true);
      bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, this.posX + 15, this.posY + 55, -1);
    } else {
      // todo
    }
	}

  applyDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this);
    }
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox];
  }
}
