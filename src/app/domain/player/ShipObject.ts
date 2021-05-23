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

  constructor(
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

  activateAbility(player, posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService) {
    // abstracted to subclass
  }

  clearAbility( player, bulletManagerService:BulletManagerService ){
    // abstracted to subclass
  }

  getHitBox():HitBox {
    return this.hitBox;
  }

}


export class ShipBlade extends ShipObject {

  lastShieldInstance = null;

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

}

export class ShipSpear extends ShipObject {
  timeout1: any = null;
  timeout2: any = null;

  drawMuzzleFlash(ctx: CanvasRenderingContext2D, posX: number, posY: number, levelInstance: LevelInstance, canvasContainer: CanvasContainer, bulletManagerService: BulletManagerService, botManagerService: BotManagerService) {
    ctx.drawImage(this.imageObjMuzzle[this.muzzleIndex], 0, 0, 90,40, posX-7, posY+5, 90,40);
  }

  fireLazer(posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService) {
    let bullDirection:BulletDirection;
    if (levelInstance.isVertical()) {
      bullDirection = bulletManagerService.calculateBulletDirection(posX, posY, posX, (posY-50), bulletSpeed);
      bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, posX+17, posY+22,this.imageBullets, 42,22);
    } else {

    }
  }

  /**
   * Fire 6 homing missiles.
   */
  activateAbility(player, posX: number, posY: number, bulletSpeed:number, levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService) {
    this.timeout1 = null;
    this.timeout2 = null;

    bulletManagerService.generatePlayerHomingMissiles(levelInstance,
      [
        {startX:posX-20, startY:posY+50},
        {startX:posX+40, startY:posY+50},
      ],
      bulletSpeed);
    this.timeout1 = setTimeout(()=> {
      bulletManagerService.generatePlayerHomingMissiles(levelInstance,
        [
          {startX:posX+40, startY:posY+50},
          {startX:posX-20, startY:posY+50},
        ],
        bulletSpeed);
    }, 50);
    this.timeout2 = setTimeout(()=> {
      bulletManagerService.generatePlayerHomingMissiles(levelInstance,
        [
          {startX:posX-20, startY:posY+50},
          {startX:posX+40, startY:posY+50},
        ],
        bulletSpeed);
    }, 100);
  }

  clearAbility( player, bulletManagerService:BulletManagerService){
    if ( this.timeout1 != null ) {
      clearTimeout(this.timeout1);
      clearTimeout(this.timeout2);
    }
  }

}
