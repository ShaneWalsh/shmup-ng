import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";

export class Level2SubBoss1 extends  BotInstanceImpl {
	public imageObj:HTMLImageElement;

	// todo make these config values
	public health:number=200;
	public bulletSpeed:number = 6;
	public missileSpeed:number = 4.5;

	public posXSpeed:number = 3;
	public posYSpeed:number = 1.5;

	public destinationY:number = 50;

	public bTimer:number = 0; // bullet timer
	public bTimerLimit:number = 30;

	public mTimer:number = 0; // bullet timer
	public mTimerLimit:number = 60;
	public mSlot:number = 0;
	public mSlots:{x:number,y:number}[] = [{x:197,y:207},{x:201,y:182},{x:201,y:58},{x:197,y:33}];

	public anaimationTimer:number = 0;
	public anaimationTimerLimit:number =4;

	public damAnaimationTimer:number = 4;
	public damAnaimationTimerLimit:number =4;

	public score:number = 10;

	public angleDirection:BulletDirection;

	constructor(
		public config:any={},
		public posX:number=0,
		public posY:number=0,
		public imageObj1:HTMLImageElement=null,
		public imageObj2:HTMLImageElement=null,
		public imageObjDamaged:HTMLImageElement=null,
		public imageSizeX:number=90,
		public imageSizeY:number=60,
		public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY-20)
	){
		super(config);
		this.imageObj = imageObj1;
		this.tryConfigValues(["bTimer", "bTimerLimit", "mTimer", "mTimerLimit", "missileSpeed", "health", "score","posYSpeed","posXSpeed","bulletSpeed", "anaimationTimerLimit","destinationY"]);
	}

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

		this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);

		if(this.posY < this.destinationY){
			this.posY += this.posYSpeed;
		}

		// just to calcualte the angle :/
		LogicService.drawRotateImage(this.imageObj2,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
		if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
			this.damAnaimationTimer++;
			if(this.damAnaimationTimer %2 == 1){
				LogicService.drawRotateImage(this.imageObjDamaged,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
				//ctx.drawImage(this.imageObjDamaged, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
			}
		}

		if(levelInstance.drawHitBox()){
			this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
		}

		// fire weapon
		if(this.bTimer >= this.bTimerLimit){
			this.bTimer = 0;
			this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
		} else {
			this.bTimer++;
			// muzzle flash timer
			if (this.bTimer >= (this.bTimerLimit-5)){
				// this could probably be extracted as a reusable muzzle flash fcuntion?
				// the the centerx+y of the flash after rotation.
				let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+305, this.posY+121, this.angleDirection.angle);
				// now get the point to rotate it by, which is the top left x+Y and rotate by those poitns.
				let topLeftCords={x:cords.x-(14/2),y:cords.y-(22/2)}
				LogicService.drawRotateImage(this.imageObj1, ctx,this.angleDirection.angle,topLeftCords.x,topLeftCords.y,14,22);
			}
		}

		if(this.mTimer >= this.mTimerLimit){
			this.mTimer = 0;
			this.fireHoming(levelInstance,ctx,bulletManagerService,currentPlayer,this.mSlot);
			this.mSlot = this.mSlot+1 >= this.mSlots.length?0:this.mSlot+1;
		} else {
			this.mTimer++;
			// muzzle flash timer
			if (this.mTimer == (this.mTimerLimit-5)){
				// this could probably be extracted as a reusable muzzle flash fcuntion?
				// the the centerx+y of the flash after rotation.
				let slot = this.mSlots[this.mSlot];
				let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+slot.x, this.posY+slot.y, this.angleDirection.angle);
				// now get the point to rotate it by, which is the top left x+Y and rotate by those poitns.
				//let topLeftCords={x:cords.x-(14/2),y:cords.y-(22/2)}
				botManagerService.createMisslePlume(cords.x,cords.y);
			}
		}
	}

	hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
		return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox)
	}

	// lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
	fireTracker(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
		let bullDirection:BulletDirection;
		if(levelInstance.isVertical()){
			let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+298, this.posY+120, this.angleDirection.angle)

			bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, null);
			bulletManagerService.generateGuardianTracker(levelInstance, bullDirection, cords.x, cords.y, 500);
		} else {}
	}

	fireHoming(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj, slot:number): any {
		let bullDirection:BulletDirection;
		if(levelInstance.isVertical()){
			let slot = this.mSlots[this.mSlot];
			let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+slot.x, this.posY+slot.y, this.angleDirection.angle);

			bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.missileSpeed, true, currentPlayer);
			bulletManagerService.generateHoming(levelInstance, bullDirection, cords.x, cords.y, 100);
		} else {}
	}

	applyDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
		this.health -= damage;
		this.triggerDamagedAnimation();
		if(this.health < 1){
			playerService.currentPlayer.addScore(this.score);
			botManagerService.removeBot(this,1);
			levelInstance.updatePhaseCounter();
		}
	}

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		if(levelInstance.isVertical() && this.getCenterY() > 0){
			return true;
		} else if(!levelInstance.isVertical() && this.getCenterX() > currentPlayer.getCenterX()){
			return true;
		}
		return false;
	}

	triggerDamagedAnimation(): any {
		this.damAnaimationTimer = 1;// trigger damage animation
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

	isDeathOnColision():boolean{
		return false;
	}
}
