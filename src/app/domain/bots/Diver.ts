import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";
import { DeathConfig } from "../DeathDetails";

export class Diver extends FlyingBotImpl{

  firingPorts:{x:number,y:number}[] = [{x:33,y:69},{x:78,y:69}];
  firingPortIndex = 0;

  constructor(
      config:any={},
      posX:number=0,
      posY:number=0,
      imageObj:HTMLImageElement[]=null,
      imageObjDamaged:HTMLImageElement[]=null,
      imageObjShadow:HTMLImageElement[]=null,
      imageSizeX:number=90,
      imageSizeY:number=60,
      public hitBox:HitBox=new HitBox(47,5,imageSizeX-92,imageSizeY-35),
      public hitBox2:HitBox=new HitBox(30,50,imageSizeX-60,25)
  ){
    super(config, posX, posY, imageSizeX, imageSizeY, imageObj, imageObjDamaged, imageObjShadow);
    this.score = 50;
    this.bTimerLimit = 60;
    this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","posYSpeed","posXSpeed","bulletSpeed"]);
  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;
    this.posY += this.posYSpeed;
    if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)){
        botManagerService.removeBot(this);
    } else {
      if(levelInstance.drawShadow() && this.imageObjShadow != null) {
        this.drawShadowFlying(null,canvasContainer,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
      }
      ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      this.updateDamageAnimation(ctx);
    }
    if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        this.hitBox2.drawBorder(this.posX+this.hitBox2.hitBoxX,this.posY+this.hitBox2.hitBoxY,this.hitBox2.hitBoxSizeX,this.hitBox2.hitBoxSizeY,ctx,"#FF0000");
    }
    this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
    this.updateAnimation();
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox) || this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox2);
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
    let bullDirection:BulletDirection;
    let portCords = this.firingPorts[this.firingPortIndex];
    if(levelInstance.isVertical()){
      bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);
      bulletManagerService.generateHoming(levelInstance, bullDirection,  (this.posX+portCords.x), (this.posY+portCords.y), 120, true);
    } else {
      // todo
    }
    this.firingPortIndex  = (this.firingPortIndex+1) < this.firingPorts.length?this.firingPortIndex+1:0;
  }

  drawMuzzleFlare(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let portCords = this.firingPorts[this.firingPortIndex];
    botManagerService.createMisslePlume(this.posX+portCords.x,this.posY+portCords.y);
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox];
  }

  getDeathConfig(): DeathConfig {
    return new DeathConfig(6);
  }

}
