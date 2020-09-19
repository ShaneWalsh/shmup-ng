import { BotInstance, BotInstanceImpl, FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { Guardian1 } from "src/app/domain/bots/Guardian1";
import { CanvasContainer } from "../CanvasContainer";

export class GuardianCreeper extends FlyingBotImpl {
	public canShootNow = false;
	public retreatAfterShotsFired = 0;
  public retreatAfterShotsFiredLimit = 3;
  public angleDirection:BulletDirection;

	constructor(
		config:any={},
		posX:number=0,
		posY:number=0,
		imageObj1:HTMLImageElement=null,
		imageObj2:HTMLImageElement=null,
		imageObjDamaged:HTMLImageElement=null,
		imageSizeX:number=100,
		imageSizeY:number=102,
		public hitBox:HitBox=new HitBox(0,0,imageSizeX-10,imageSizeY-10),
		public targetX:number=posX,
		public targetY:number=posY+200
	){
		super(config, posX, posY, imageSizeX, imageSizeY, [imageObj1,imageObj2], [imageObjDamaged], null);
		this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","targetX","targetY","posXSpeed","posYSpeed","bulletSpeed","retreatAfterShotsFiredLimit","canShootNow"]);
		this.imageObj = imageObj1;
	}

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;
		this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);

		if(this.canShootNow == false && (this.retreatAfterShotsFired < this.retreatAfterShotsFiredLimit)) {
			if(this.posY < (this.targetY-3) || this.posY > (this.targetY+3)){
				this.posY += (this.posY < (this.targetY-3) )? this.posYSpeed:(this.posYSpeed * -1);
			} else { // in position, shoot!
				this.canShootNow = true;
				this.bTimer = this.bTimerLimit;
			}
		} else if(this.retreatAfterShotsFired >= this.retreatAfterShotsFiredLimit){
			this.posY -= this.posYSpeed;
			this.canShootNow = false;
			if(this.posY < -400){
				botManagerService.removeBot(this);
			}
		}
		if(this.posX < (this.targetX-3) || this.posX > (this.targetX+3)){
			this.posX += (this.posX < (this.targetX-3) )? this.posXSpeed:(this.posXSpeed * -1);
		}

		LogicService.drawRotateImage(this.imageObj,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
		this.updateDamageAnimation(ctx,this.angleDirection.angle);

		if(levelInstance.drawHitBox()){
			this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
		}

		if(this.canShootNow){
      this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
		}
    this.updateAnimation();
	}

	hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
		return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox)
	}

	// lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
	fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let bullDirection:BulletDirection;
    this.retreatAfterShotsFired++;
		if(levelInstance.isVertical()){
			let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+107, this.posY+50, this.angleDirection.angle)
			bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, null);
			bulletManagerService.generateGuardianTracker(levelInstance, bullDirection, cords.x, cords.y, 500);
		} else {
		}
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
    return [this.hitBox];
  }

}
