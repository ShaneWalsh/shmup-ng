import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { Turret } from "./Turret";
import { CanvasContainer } from "../CanvasContainer";
import { LazerAttack } from "./LazerAttack";
import { DeathConfig, DeathDetails } from "../DeathDetails";
import { ProfileService, ProfileValuesEnum } from "src/app/services/profile.service";

/**
 * HellStream
 */
export class Level2SubBoss1V2 extends  BotInstanceImpl {
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
	public mSlots:{x:number,y:number}[] = [{x:30,y:190},{x:56,y:195},{x:182,y:195},{x:207,y:190}];

	public anaimationTimer:number = 0;
	public anaimationTimerLimit:number =4;

	public damAnaimationTimer:number = 4;
	public damAnaimationTimerLimit:number =4;

	public score:number = 10;

  public angleDirection:BulletDirection;
  public turret:Turret;

  public missileAttack:boolean = false;
  public halfHealth:number = 0;
  public moveXLeft = true;
  public lazerRight = true;


	constructor(
		public config:any={},
    public lazerAttack1:LazerAttack=null,
    public lazerAttack2:LazerAttack=null,
		public posX:number=0,
		public posY:number=0,
		public imageObjMuzzleFlash:HTMLImageElement=null,
		public imageObjcannon:HTMLImageElement=null,
		public imageObj2:HTMLImageElement=null,
		public imageObjDamaged:HTMLImageElement=null,
		public imageObjShadow:HTMLImageElement=null,
		public imageSizeX:number=90,
		public imageSizeY:number=60,
		public hitBox:HitBox=new HitBox(70,0,imageSizeX-140,imageSizeY-30),
		public hitBox2:HitBox=new HitBox(0,50,imageSizeX,150)
	){
		super(config);
		this.imageObj = imageObjMuzzleFlash;
    this.tryConfigValues(["bTimer", "bTimerLimit", "mTimer", "mTimerLimit", "missileSpeed", "health", "score","posYSpeed","posXSpeed","bulletSpeed", "anaimationTimerLimit","destinationY"]);
    this.halfHealth = this.health/1.5;
    this.turret = new Turret(
      this.posX+114,
      this.posY+265,
      [this.imageObjcannon],
      null,
      null,
      46,//imageSizeX
      18,
      8,8, // rotation offsets
      "bullet",
      [{muzzlePosXOffset:50, muzzlePosYOffset:10}], // Muzzle offsets
      [this.imageObjMuzzleFlash],
      14,//imageMuzzleSizeX
      22,//imageMuzzleSizeY
      [{bulletXOffset:50, bulletYOffset:10}],
      22,// bullet sizex
      14,
      600,
      this.bulletSpeed,
      this.bTimer,
      this.bTimerLimit,
      0,5,false
    );
	}

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2)+100, this.bulletSpeed, true, currentPlayer);

		if(this.posY < this.destinationY){
			this.posY += this.posYSpeed;
		} else if( !this.missileAttack){
      if(this.moveXLeft){
        if(this.posX > 3 ){
          this.posX -= this.posXSpeed;
        } else {
          this.posX -= this.posXSpeed;
          this.moveXLeft = false;
        }
      } else {
        if(this.posX < 250 ){
          this.posX += this.posXSpeed;
        } else {
          this.posX += this.posXSpeed;
          this.moveXLeft = true;
        }
      }
    }
    this.turret.update(this.posX+114,this.posY+265,currentPlayer,levelInstance, canvasContainer.mainCtx, canvasContainer.shadowCtx, botManagerService, bulletManagerService, playerService);
    if(this.health >= this.halfHealth) { // prevent the turret from firing until
      this.turret.bTimer = 0;
    }
    ctx.drawImage(this.imageObj2, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
    if(levelInstance.drawShadow() && this.imageObjShadow != null) {
      this.drawShadow(canvasContainer.shadowCtx,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
    }
		if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
			this.damAnaimationTimer++;
			if(this.damAnaimationTimer %2 == 1){
				ctx.drawImage(this.imageObjDamaged, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
			}
		}

		if(levelInstance.drawHitBox()){
			this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,levelInstance.hitboxColor());
			this.hitBox2.drawBorder(this.posX+this.hitBox2.hitBoxX,this.posY+this.hitBox2.hitBoxY,this.hitBox2.hitBoxSizeX,this.hitBox2.hitBoxSizeY,ctx,levelInstance.hitboxColor());
		}

    if(this.missileAttack){
      if(this.mTimer >= this.mTimerLimit){
        this.mTimer = 0;
        this.fireHoming(levelInstance,ctx,bulletManagerService,currentPlayer,this.mSlot);
        this.mSlot = this.mSlot+1 >= this.mSlots.length?0:this.mSlot+1;
      } else {
        this.mTimer++;
        if (this.mTimer == (this.mTimerLimit-5)){
          let slot = this.mSlots[this.mSlot];
          botManagerService.createMisslePlume(slot.x+this.posX,slot.y+this.posY);
        }
      }
    } else { // lazer
      let adjustX = -30;
      let adjustY = -45;
      let firingPhasesComplete = this.lazerAttack1.firingPhasesComplete;

	    let slot = this.mSlots[this.mSlot];
      this.lazerAttack1.update(this.posX+slot.x+adjustX,this.posY+slot.y+adjustY,levelInstance,ctx,botManagerService,bulletManagerService,playerService);

      if(firingPhasesComplete != this.lazerAttack1.firingPhasesComplete){
        //this.lazerRight = !this.lazerRight;
		    this.mSlot = this.mSlot+1 >= this.mSlots.length?0:this.mSlot+1;
      }
    }
	}

	hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
		return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox) || this.hitBox2.areCentersToClose(hitter,hitterBox,this,this.hitBox2)
	}

	fireHoming(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj, slot:number): any {
		let bullDirection:BulletDirection;
		if(levelInstance.isVertical()){
			let slot = this.mSlots[this.mSlot];
			bullDirection = bulletManagerService.calculateBulletDirection(slot.x+this.posX, slot.y+this.posY, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.missileSpeed, true, currentPlayer);
			bulletManagerService.generateHoming(levelInstance, bullDirection, slot.x+this.posX, slot.y+this.posY, 100, true);
		} else {}
	}

	applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
		this.health -= damage;
		this.triggerDamagedAnimation();
		if(this.health < 1){
			playerService.currentPlayer.addScore(this.score);
			botManagerService.removeBot(this,1);
      ProfileService.setProfileValue(ProfileValuesEnum.BOTKILLER_LEVEL2_MINI_BOSS1_HELLSTREAM,"true");
			levelInstance.updatePhaseCounter();
		} else if(this.missileAttack && this.health < this.halfHealth){
      this.missileAttack = false;
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
		return [this.hitBox,this.hitBox2];
	}

	isDeathOnColision():boolean{
		return false;
	}

  getDeathDetails():DeathDetails {
    return new DeathDetails(this.imageObj2, this.posX, this.posY, this.imageSizeX, this.imageSizeY, this.getCurrentAngle(), this.getCenterX(), this.getCenterY(), new DeathConfig(12,24));
  }
}
