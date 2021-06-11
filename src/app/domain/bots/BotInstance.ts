import { LevelInstance } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";
import { LogicService } from "src/app/services/logic.service";
import { ShieldBot } from "../skills/ShieldBotInterface";
import { DeathConfig, DeathDetails } from "../DeathDetails";

export interface BotInstance {
    update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService);
    // checks if the provided hitbox has intersected with this bot
    hasBotArmorBeenHit(hitter:any,hitterBox:HitBox);
    hasBotBeenHit(hitter:any,hitterBox:HitBox);

    applyArmorDamage(damage:number, botManagerService:BotManagerService, playerService:PlayerService, levelInstance:LevelInstance);
    applyDamage(damage:number, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance);

    getCenterX():number;

    getCenterY():number;

    getPlayerCollisionHitBoxes() : HitBox[];

    isGroundBot():boolean;

    isDeathOnColision():boolean;

    getDeathDetails():DeathDetails;
    getDeathConfig():DeathConfig;
    getCurrentAngle():number;
}


export class BotInstanceImpl implements BotInstance, ShieldBot {

  public botSize:number = 0;

  constructor(public config:any={}){

  }

  getCenterY(): number {
    throw new Error("Method not implemented.");
  }
  getCenterX(): number {
    throw new Error("Method not implemented.");
  }
  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService: PlayerService, levelInstance:LevelInstance) {
    throw new Error("Method not implemented.");
  }
  hasBotBeenHit(hitter: any, hitterBox: HitBox) {
    throw new Error("Method not implemented.");
  }
  update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
    throw new Error("Method not implemented.");
  }
  getPlayerCollisionHitBoxes(): HitBox[] {
    throw new Error("Method not implemented.");
  }

  getDeathDetails() {
    return null;
  }
  getCurrentAngle():number {
    return 0;
  }
  getDeathConfig(): DeathConfig {
    return new DeathConfig();
  }

  applyArmorDamage(damage:number, botManagerService:BotManagerService, playerService:PlayerService, levelInstance:LevelInstance){
    // do nothing
  }

  isDeathOnColision():boolean{
    return true;
  }

  tryConfigValues(params){
    for(let param of params){
      if(this.config[param]){
        this[param] = this.config[param];
      }
    }
  }

  hasBotArmorBeenHit(hitter: any, hitterBox: HitBox) {
    return false;
  }

  isGroundBot(): boolean {
    return false;
  }

  drawShadow(ctx:CanvasRenderingContext2D, imageObjShadow:HTMLImageElement,posX:number,posY:number,imageSizeX:number, imageSizeY:number, shadowX:number=30, shadowY:number =60){
    if(imageObjShadow != null)
    ctx.drawImage(imageObjShadow, 0, 0, imageSizeX, imageSizeY, posX+shadowX, posY+shadowY, imageSizeX, imageSizeY);
  }

  drawShadowRotate(ctx:CanvasRenderingContext2D,angle:number, imageObjShadow:HTMLImageElement,posX:number,posY:number,imageSizeX:number, imageSizeY:number, shadowX:number=30, shadowY:number =60){
    if(imageObjShadow != null)
      LogicService.drawRotateImage(imageObjShadow,ctx,angle,posX+shadowX, posY+shadowY, imageSizeX, imageSizeY);
  }

  getShieldX(): number {
    return this.getCenterX();
  }
  getShieldY(): number {
    return this.getCenterY();
  }


}

export class FlyingBotImpl extends BotInstanceImpl {
	public bulletSpeed:number = 3;
  public posXSpeed:number = 1.5;
  public posYSpeed:number = 1.5;

  public bTimer:number = 0;
  public bTimerLimit:number = 30;
  public muzzleDrawLimit:number = 5;

  public animationTimer:number = 0;
  public animationTimerLimit:number =4;
  public animationIndex:number= 0;

  public damAnaimationTimer:number = 8;
	public damAnaimationTimerLimit:number =8;

  public imageObj:HTMLImageElement;

  public score:number = 10;
  public health:number=3;

  constructor(public config:any={},
      public posX:number=0,
      public posY:number=0,
      public imageSizeX:number=90,
      public imageSizeY:number=60,
      public animationImages:HTMLImageElement[]=[],
      public imageObjDamaged: HTMLImageElement[] = [animationImages[0]],
      public imageObjShadow: HTMLImageElement[] = null,
      public isBoss:boolean = false
    ) {
    super(config);
    this.imageObj = animationImages[0];
  }

  /**
   * Can this bot fire right now?
   */
  canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj) {
		if(levelInstance.isVertical() && this.getCenterY() < currentPlayer.getCenterY()) {
			return true;
		} else if(!levelInstance.isVertical() && this.getCenterX() > currentPlayer.getCenterX()) {
			return true;
		}
		return false;
	}

  /**
   * Common method for looping a firing timer for single firing bots.
   * @param levelInstance
   * @param ctx
   * @param bulletManagerService
   * @param currentPlayer
   */
  updateBulletTimer(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,botManagerService:BotManagerService, bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
    if(this.bTimer >= this.bTimerLimit && this.canShoot(levelInstance,currentPlayer)) {
			this.bTimer = 0;
			this.fireSomething(levelInstance,ctx,bulletManagerService,currentPlayer);
		} else if(this.bTimer == (this.bTimerLimit-this.muzzleDrawLimit) && this.canShoot(levelInstance,currentPlayer)) {
      this.drawMuzzleFlare(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
      this.bTimer++;
		} else {
			this.bTimer++;
		}
  }

  /**
   * Optional method for bots to draw in a muzzle flare before firing.
   */
  drawMuzzleFlare(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, currentPlayer: PlayerObj) {

  }

  /**
   * cycle through the bots sprites to create an animation
   */
  updateAnimation(){
    if(this.animationTimer >= this.animationTimerLimit) {
      this.animationTimer = 0;
      this.animationIndex++;
      if(this.animationIndex >= this.animationImages.length) {
        this.animationIndex = 0;
      }
      this.imageObj = this.animationImages[this.animationIndex];
    } else {
      this.animationTimer++;
    }
  }

  /**
   * draw the damaged sprite over the parent sprite to indicate damage.
   * @param ctx
   * @param angle when provided the damaged image will be drawn at this angle
   */
  updateDamageAnimation(ctx,angle=null){
    if(this.damAnaimationTimer < this.damAnaimationTimerLimit) {
      this.damAnaimationTimer++;
      if(this.damAnaimationTimer %2 == 1) {
        var damImage = this.imageObjDamaged[0]
        if(this.animationIndex < this.imageObjDamaged.length){
          damImage = this.imageObjDamaged[this.animationIndex];
        }
        if(angle != null){
          LogicService.drawRotateImage(damImage,ctx,angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
        } else {
          ctx.drawImage(damImage, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        }
      }
    }
  }

  /**
   * Single place to calcualte the current shadow image.
   */
  getShadowImage(){
    if(this.imageObjShadow != null) {
      var shadowImage = this.imageObjShadow[0];
      if(this.animationIndex < this.imageObjShadow.length){
        shadowImage = this.imageObjShadow[this.animationIndex];
      }
      return shadowImage;
    }
    return null;
  }

  /**
   * Start the damage animation.
   */
  triggerDamagedAnimation(): any {
    if(this.imageObjDamaged != null) {
      this.damAnaimationTimer = 1;
    }
  }

  /**
   * Apply damage to the bot and trigger damage animation, and death if health below zero
   * Also add score value to the players score.
   * @param damage
   * @param botManagerService
   * @param playerService
   * @param levelInstance
   */
  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this,this.botSize);
      if(this.isBoss){
        levelInstance.updatePhaseCounter();
      }
    }
  }

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
    console.log("Should i be firing something?");
  }

  getCenterX():number {
    return this.posX+(this.imageSizeX/2);
  }

  getCenterY():number {
      return this.posY+(this.imageSizeY/2);
  }

  drawShadowFlying(angle:number, canvasContainer:CanvasContainer, posX:number,posY:number,imageSizeX:number, imageSizeY:number, shadowX:number=30, shadowY:number =60){
    if(angle != null){
      this.drawShadowRotate(canvasContainer.shadowCtx,angle,this.getShadowImage(),posX,posY,imageSizeX,imageSizeY,shadowX,shadowY)
    } else {
      this.drawShadow(canvasContainer.shadowCtx,this.getShadowImage(),posX,posY,imageSizeX,imageSizeY,shadowX,shadowY)
    }
  }

  /**
   * Return the current image
   */
  getDeathDetails():DeathDetails {
    return new DeathDetails(this.imageObj, this.posX, this.posY, this.imageSizeX, this.imageSizeY, this.getCurrentAngle(),this.getCenterX(), this.getCenterY(),this.getDeathConfig());
  }

}
