import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";

export class Guardian1 extends FlyingBotImpl{
  public angleDirection:BulletDirection;
  constructor(
      config:any={},
      posX:number=0,
      posY:number=0,
      imageObj:HTMLImageElement=null,
      imageObjDamaged:HTMLImageElement=null,
      imageSizeX:number=92,
      imageSizeY:number=78,
      public hitBox:HitBox=new HitBox(0,0,imageSizeX-10,imageSizeY-10),
      public targetX:number=posX,
      public targetY:number=posY+300
  ){
    super(config, posX, posY, imageSizeX, imageSizeY, [imageObj], [imageObjDamaged], null);
    this.bTimerLimit = 80;
    this.health = 30;
    this.score = 80;
    this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","targetX","targetY","posXSpeed","posYSpeed","bulletSpeed"]);
  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;
		this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);

		if(this.posY < (this.targetY-3) || this.posY > (this.targetY+3)){
			this.posY += (this.posY < (this.targetY-3) )? this.posYSpeed:(this.posYSpeed * -1);
		}
		if(this.posX < (this.targetX-3) || this.posX > (this.targetX+3)){
			this.posX += (this.posX < (this.targetX-3) )? this.posXSpeed:(this.posXSpeed * -1);
		}

		LogicService.drawRotateImage(this.imageObj,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
		this.updateDamageAnimation(ctx,this.angleDirection.angle);

    if(levelInstance.drawHitBox()){
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }
    this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox)
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let bullDirection:BulletDirection;
    if(levelInstance.isVertical()){
      let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+98, this.posY+38, this.angleDirection.angle)
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
