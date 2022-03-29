import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletDirection, BulletManagerService } from "src/app/manager/bullet-manager.service";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { CanvasContainer } from "../CanvasContainer";
import { HitBox } from "../HitBox";


export enum ShipEnum {
  BLADE1,
  SPEAR2
}

export class ShipObject {
  public muzzleIndex = 0;
  public speed = 4;

  constructor(
    public config:any,
    public imageObj:HTMLImageElement=null,
    public imageObjMuzzle:HTMLImageElement[]=[],
    public imageBullets:HTMLImageElement[]=[],
    public imageObjShadow:HTMLImageElement=null,
    public imageSizeX:number=90,
    public imageSizeY:number=70,
    public hitBox:HitBox=new HitBox((Math.floor(imageSizeX/2))-5,(Math.floor(imageSizeY/2))-5,10,10)
  ){

  }

  draw(ctx, posX: number, posY: number, levelInstance: LevelInstance, canvasContainer: CanvasContainer, bulletManagerService: BulletManagerService, botManagerService: BotManagerService) {
    ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, posX, posY, this.imageSizeX, this.imageSizeY);
  }

  drawShadow(shadowCtx: CanvasRenderingContext2D, posX: number, posY: number, levelInstance: LevelInstance, canvasContainer: CanvasContainer, bulletManagerService: BulletManagerService, botManagerService: BotManagerService) {
    shadowCtx.drawImage(this.imageObjShadow, 0, 0, this.imageSizeX, this.imageSizeY, posX+30, posY+60, this.imageSizeX, this.imageSizeY);
  }

  drawMuzzleFlash(ctx: CanvasRenderingContext2D, posX: number, posY: number, levelInstance: LevelInstance, canvasContainer: CanvasContainer, bulletManagerService: BulletManagerService, botManagerService: BotManagerService) {
    // abstracted to subclass
  }

  fire(ctx: CanvasRenderingContext2D, posX: number, posY: number, bulletSpeed: number, levelInstance: LevelInstance, canvasContainer: CanvasContainer, bulletManagerService: BulletManagerService, botManagerService: BotManagerService) {
    this.fireLazer(posX, posY, bulletSpeed, levelInstance,ctx,bulletManagerService);
    this.muzzleIndex = ((this.muzzleIndex+1)>=this.imageObjMuzzle.length)?0:(this.muzzleIndex+1);
  }

  fireLazer(posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService) {
    // abstracted to subclass
  }

  setProperties(config:any={}){

  }

  activateAbility(player, posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService) {
    // abstracted to subclass
  }

  clearAbility( player, bulletManagerService:BulletManagerService ){
    // abstracted to subclass
  }

  getIntroNumber():number{
    return 0;
  }

  getHitBox():HitBox {
    return this.hitBox;
  }

  getSpeed() : number {
    return this.speed;
  }

  tryConfigValues(config, params){
    for(let param of params){
      if(config[param]){
        this[param] = config[param];
      }
    }
  }

  getABCode():string{
    return "ab1";
  }

}


export class ShipBlade extends ShipObject {

  protected lastShieldInstance = null;
  public lifeSpanLimit= 150;

  setProperties() {
    this.tryConfigValues(this.config,["lifeSpanLimit","speed"])
  }

  drawMuzzleFlash(ctx: CanvasRenderingContext2D, posX: number, posY: number, levelInstance: LevelInstance, canvasContainer: CanvasContainer, bulletManagerService: BulletManagerService, botManagerService: BotManagerService) {
    ctx.drawImage(this.imageObjMuzzle[this.muzzleIndex], 0, 0, 90,40, posX, posY-30, 90,40);
  }

  fireLazer(posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService) {
    let bullDirection:BulletDirection;
    if (levelInstance.isVertical()) {
      bullDirection = bulletManagerService.calculateBulletDirection(posX, posY, posX, (posY-50), bulletSpeed);
      bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, posX+30, posY-10,this.imageBullets, 30, 22);
    } else {

    }
  }

  activateAbility(player, posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService) {
    this.lastShieldInstance = bulletManagerService.addPlayerShield(player);
  }

  clearAbility( player, bulletManagerService:BulletManagerService){
    if(this.lastShieldInstance != null) {
      bulletManagerService.removeShield( this.lastShieldInstance );
    }
  }

  getIntroNumber():number{
    return 1;
  }

  getABCode():string{
    return "ab1";
  }

}

export class ShipSpear extends ShipObject {
  protected timeouts:any[] = [];
  public missilesToCreate = 3;
  public missileSpeed = 6;

  setProperties() {
    this.tryConfigValues(this.config,["missilesToCreate","missileSpeed","speed"])
  }

  drawMuzzleFlash(ctx: CanvasRenderingContext2D, posX: number, posY: number, levelInstance: LevelInstance, canvasContainer: CanvasContainer, bulletManagerService: BulletManagerService, botManagerService: BotManagerService) {
    ctx.drawImage(this.imageObjMuzzle[this.muzzleIndex], 0, 0, 90,40, posX, posY-20, 90,40);
  }

  fireLazer(posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService) {
    let bullDirection:BulletDirection;
    if (levelInstance.isVertical()) {
      bullDirection = bulletManagerService.calculateBulletDirection(posX, posY, posX, (posY-50), bulletSpeed);
      bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, posX+22, posY+14,this.imageBullets, 42,22);
    } else {

    }
  }

  /**
   * Fire 6 homing missiles.
   */
  activateAbility(player, posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService) {
    this.clearAbility(player,bulletManagerService);

    botManagerService.createPlayerMissilePlum(posX+30,posY+6);
    botManagerService.createPlayerMissilePlum(posX+59,posY+6);
    bulletManagerService.generatePlayerHomingMissiles(levelInstance,
      [
        {startX:posX+10, startY:posY+5},
        {startX:posX+50, startY:posY+5},
      ],
      this.missileSpeed);
    for(let i =1; i < this.missilesToCreate ;i++){
      this.timeouts.push(setTimeout(()=> {
        botManagerService.createPlayerMissilePlum(posX+30,posY+6);
        botManagerService.createPlayerMissilePlum(posX+59,posY+6);
        bulletManagerService.generatePlayerHomingMissiles(levelInstance,
          [
            {startX:posX+10, startY:posY+5},
            {startX:posX+50, startY:posY+5},
          ],
          this.missileSpeed);
      }, 70*i));
    }

  }

  clearAbility( player, bulletManagerService:BulletManagerService){
    this.timeouts.forEach( s => {
      clearTimeout(s)
    });
    this.timeouts = [];
  }

  getIntroNumber():number{
    return 2;
  }

  getABCode():string{
    return "ab2";
  }

}
