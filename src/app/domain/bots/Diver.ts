import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";

export class Diver extends FlyingBotImpl{

  constructor(
      config:any={},
      posX:number=0,
      posY:number=0,
      imageObj:HTMLImageElement=null,
      imageObjDamaged:HTMLImageElement=null,
      imageSizeX:number=90,
      imageSizeY:number=60,
      public hitBox:HitBox=new HitBox(12,0,imageSizeX-24,imageSizeY),
      public hitBox2:HitBox=new HitBox(0,5,imageSizeX,25)
  ){
    super(config, posX, posY, imageSizeX, imageSizeY, [imageObj], imageObjDamaged);
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
      ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      this.updateDamageAnimation(ctx);
    }
    if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        this.hitBox2.drawBorder(this.posX+this.hitBox2.hitBoxX,this.posY+this.hitBox2.hitBoxY,this.hitBox2.hitBoxSizeX,this.hitBox2.hitBoxSizeY,ctx,"#FF0000");
    }
    this.updateBulletTimer(levelInstance,ctx,bulletManagerService,currentPlayer);
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox) || this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox2);
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let bullDirection:BulletDirection;
    if(levelInstance.isVertical()){
      bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);
      bulletManagerService.generateHoming(levelInstance, bullDirection,  (this.posX+16), (this.posY+40), 60);
    } else {
      // todo
    }
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox];
  }
}
