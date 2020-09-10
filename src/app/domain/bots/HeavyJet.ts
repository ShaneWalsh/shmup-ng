import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";

export class HeavyJet extends BotInstanceImpl{
    public bulletSpeed:number = 3;
    public posXSpeed:number = 1.5;
    public posYSpeed:number = 1.5;

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 80;
    public health:number=30;

    public damAnaimationTimer:number = 8;
    public damAnaimationTimerLimit:number =8;

    public targetCordsIndex = 0;
    public score:number = 80;
    public angleDirection:BulletDirection;
    constructor(
        public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObj:HTMLImageElement=null,
        public imageObjDamaged:HTMLImageElement=null,
        public imageObjShadow:HTMLImageElement=null,
        public imageSizeX:number=150,
        public imageSizeY:number=134,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX-10,imageSizeY-10),
        public targetCords:{targetX:number,targetY:number}[]=[]
    ){
      super(config);
		  this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","targetX","targetY","posXSpeed","posYSpeed","bulletSpeed","targetCords"]);
    }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    let targetCord : {targetX: number, targetY: number} = this.getCurrentTargetCords();
    let range = 10;
    this.angleDirection = bulletManagerService.calculateBulletDirection(this.getCenterX(), this.getCenterY(), targetCord.targetX, targetCord.targetY, this.bulletSpeed, true, currentPlayer);

		if (this.getCenterY() <= (targetCord.targetY-range) || this.getCenterY() >= (targetCord.targetY+range)) {
			this.posY += (this.getCenterY() <= (targetCord.targetY-range) )? this.posYSpeed:(this.posYSpeed * -1);
		}
		if (this.getCenterX() <= (targetCord.targetX-range) || this.getCenterX() >= (targetCord.targetX+range)) {
			this.posX += (this.getCenterX() <= (targetCord.targetX-range) )? this.posXSpeed:(this.posXSpeed * -1);
		}

    if(levelInstance.drawShadow() && this.imageObjShadow != null) {
      this.drawShadowRotate(canvasContainer,this.angleDirection.angle,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
    }
		LogicService.drawRotateImage(this.imageObj,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
		if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
			this.damAnaimationTimer++;
			if(this.damAnaimationTimer %2 == 1){
				LogicService.drawRotateImage(this.imageObjDamaged,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
			}
		}

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
        botManagerService.removeBot(this);
        return;
      } else {
        targetCord = this.getCurrentTargetCords();
      }
    }

        // fire weapon
		if(this.bTimer >= this.bTimerLimit && this.canShoot(levelInstance,currentPlayer)){
			this.bTimer = 0;
			this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
		}
		else{
			this.bTimer++;
		}
  }
  getCurrentTargetCords(): { targetX: number; targetY: number; } {
    return this.targetCords[this.targetCordsIndex];
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
        return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox)
  }

  fireTracker(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let bullDirection:BulletDirection;
    if(levelInstance.isVertical()){
      let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+150, this.posY+70, this.angleDirection.angle)

      bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, null);
      bulletManagerService.generateGuardianTracker(levelInstance, bullDirection, cords.x, cords.y, 500);
    } else {
        // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
        // bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
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

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		return true;
	}

  getCenterX():number{
    return this.posX+(this.imageSizeX/2);
  }

  getCenterY():number{
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
}
