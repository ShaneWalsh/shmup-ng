import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelInstance } from 'src/app/manager/level-manager.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { PlayerObj, PlayerService } from 'src/app/services/player.service';
import { BulletInstance } from 'src/app/domain/bullet/BulletInstance';
import { HitBox } from 'src/app/domain/HitBox';
import { LogicService } from 'src/app/services/logic.service';
import { CanvasContainer } from '../domain/CanvasContainer';
import { Shield } from '../domain/skills/Shield';
import { bloomAdd } from '@angular/core/src/render3/di';

@Injectable({
  providedIn: 'root'
})
export class BulletManagerService {
  private bulletDestroyed: Subject<BulletInstance> = new Subject();
  private bulletCreated: Subject<BulletInstance> = new Subject();
  private bulletRemoved: Subject<BulletInstance> = new Subject();

  private bulletsArr:BulletInstance[] = [];
  private shieldsArr:Shield[] = [];


  constructor(private resourcesService:ResourcesService, private botManagerService:BotManagerService) {

  }

  clean(){
    this.bulletsArr = [];
    this.shieldsArr = [];
  }

  getBullets() {
    return this.bulletsArr;
  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, playerService:PlayerService): any {
    let bulletArrClone = [...this.bulletsArr]; // why clone it? So I can update the original array without effecting the for loop.
    for(let i = 0; i< bulletArrClone.length; i++){
        const bullet = bulletArrClone[i];
        bullet.update(levelInstance, canvasContainer, this, botManagerService, playerService);
    }

    let shieldsArrClone = [...this.shieldsArr];
    for (let i = 0; i < shieldsArrClone.length; i++) {
      const shield = shieldsArrClone[i];
      shield.update(levelInstance, canvasContainer, botManagerService, this, playerService);
    }
  }

  generatePlayerLazer(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, bulletImages, bulletImageSizeX=30, bulletImageSizeY= 22): any {
    let newBullet = new DumbLazer(2,startX, startY, bulletDirection, true, bulletImages, bulletImageSizeX,bulletImageSizeY);
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  generatePlayerHomingMissiles(levelInstance:LevelInstance, pods:{startX:number, startY:number}[], bulletSpeed:number): any {
    // choose a target on the screen and fire a bullet
    let bots = this.botManagerService.getBots();
    // todo order them by how close they are?
    for(let i = 0 ; i < pods.length; i++){
      let pod = pods[i];
      let bot = bots[(i < bots.length)?i:0];
      let bullDirection = this.calculateBulletDirection(pod.startX, pod.startY, pod.startX, pod.startY-90, bulletSpeed, true);
      if(bot != null){
        bullDirection = this.calculateBulletDirection(pod.startX, pod.startY, bot.getCenterX(), bot.getCenterY(), bulletSpeed, true, bot);
      }
      let newBullet = new DumbLazer(1, pod.startX, pod.startY, bullDirection, true,
        [this.resourcesService.getRes().get("enemy-missile-1"),this.resourcesService.getRes().get("enemy-missile-2"),this.resourcesService.getRes().get("enemy-missile-3")],
        38, 16, new HitBox(0,0,38,16), false);
      this.bulletsArr.push(newBullet);
      this.bulletCreated.next(newBullet);
    }

  }

  generateBotBlazer(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY): any {
    let newBullet = new DumbLazer(1, startX, startY, bulletDirection, false, [this.resourcesService.getRes().get("enemy-bullet-target")], 22, 14);
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  generateBotRocket(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY): any {
    let newBullet = new DumbLazer(1, startX, startY, bulletDirection, false, [this.resourcesService.getRes().get("enemy-rocket-1"),
      this.resourcesService.getRes().get("enemy-rocket-2")], 36, 26);
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  generateMuzzleBlazer(levelInstance: LevelInstance, bulletDirection: BulletDirection, startX, startY): any {
    let newBullet = new RotationLazer(1, startX, startY, bulletDirection, false, [this.resourcesService.getRes().get("miniboss-2-bullet")], 36, 20);
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  generateBotTrackerBlob(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=30 ): any {
    let newBullet = new DumbLazer(1,startX, startY, bulletDirection, false, [this.resourcesService.getRes().get("enemy-bullet-target")],22,14);
    newBullet.allowedMovement = allowedMovement; // 2 seconds ish
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  // the x+y passed into the tracker are middle point of the bullet, so I have to then workout where the top left x+y is and rotate that by the bullet angle, giving me the actual x+y cord
  generateGuardianTracker(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=30 ): any {
    let newBullet = new RotationLazer(1,startX, startY, bulletDirection, false, [this.resourcesService.getRes().get("enemy-bullet-target")],22,14);
    newBullet.allowedMovement = allowedMovement; // 2 seconds ish
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  generateHoming(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=60, destructable:boolean = false): any {
    let newBullet = new DumbLazer(1,startX, startY, bulletDirection, false,
      [this.resourcesService.getRes().get("enemy-missile-1"),this.resourcesService.getRes().get("enemy-missile-2"),this.resourcesService.getRes().get("enemy-missile-3")],
      38, 16, new HitBox(0,0,38,16), destructable);
    newBullet.allowedMovement = allowedMovement;
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  generateExplodingBullet(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=60, destructable:boolean = false): any {
    let newBullet = new ExplodingBullet(1,startX, startY, bulletDirection, false, [this.resourcesService.getRes().get("exploding-bullet")],16,16);
    newBullet.allowedMovement = allowedMovement;
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
  }

  generateBomberMine(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=60, destructable:boolean = false): any {
    let newBullet = new ExplodingBullet(1,startX, startY, bulletDirection, false,
        [this.resourcesService.getRes().get("boss-9-bomb-1"),this.resourcesService.getRes().get("boss-9-bomb-2")],18,18);
    newBullet.allowedMovement = allowedMovement;
    this.bulletsArr.push(newBullet);
    this.bulletCreated.next(newBullet);
}

  removeBullet(bullet:BulletInstance, botManagerService:BotManagerService, xOffset:number=0, createTiny:boolean=false, createSmall:boolean=false, createMedium:boolean=false) {
    if(createTiny) {
      botManagerService.createExplosionTiny(bullet.getCenterX()+xOffset,bullet.getCenterY(), bullet.getCurrentRotation())
    } else if(createSmall) {
      botManagerService.createMisslePlume(bullet.getCenterX()+xOffset,bullet.getCenterY(), bullet.getCurrentRotation())
    }
    this.bulletsArr.splice(this.bulletsArr.indexOf(bullet),1);
    this.bulletRemoved.next(bullet);
  }

  getBulletDestroyed():Subject<BulletInstance>{
    return this.bulletDestroyed;
  }

  getBulletCreated():Subject<BulletInstance>{
    return this.bulletCreated;
  }

  getBulletRemoved():Subject<BulletInstance>{
    return this.bulletRemoved;
  }

  addPlayerShield(playerObj:PlayerObj):Shield {
    let s = new Shield({},playerObj.getShieldX(),playerObj.getShieldY(),
    [ this.resourcesService.getRes().get("shield-1"),
      this.resourcesService.getRes().get("shield-2"),
      this.resourcesService.getRes().get("shield-3"),
      this.resourcesService.getRes().get("shield-4"),
      this.resourcesService.getRes().get("shield-5"),
      this.resourcesService.getRes().get("shield-6"),
      this.resourcesService.getRes().get("shield-7"),
      this.resourcesService.getRes().get("shield-8"),
    ],90,90,playerObj );
    this.shieldsArr.push(s);
    return s;
  }

  getShields() : Shield[] {
    return this.shieldsArr;
  }

  removeShield(shieldToRemove: Shield) {
    if(this.shieldsArr.indexOf(shieldToRemove) > -1){
      this.shieldsArr.splice(this.shieldsArr.indexOf(shieldToRemove),1);
    }
  }

  calculateBulletDirection(origX:number, origY:number, targetX:number, targetY:number, speed:number, performRotation=false, targetObject:any=null):BulletDirection {
    var directionY = targetY-origY;
    var directionX = targetX-origX;
    var angle = Math.atan2(directionY,directionX); // bullet angle
    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new BulletDirection(directionY,directionX,angle,len,speed, performRotation,targetObject);
  }

  calculateTurretDirection(origX:number, origY:number, targetX:number, targetY:number, speed:number, performRotation=false, targetObject:any=null):BulletDirection {
    var directionY = targetY-origY;
    var directionX = targetX-origX;
    var angle = Math.atan2(directionY,directionX); // bullet angle
    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new TurretDirection(directionY,directionX,angle,len,speed, performRotation,targetObject);
  }
}

class DumbLazer implements BulletInstance {
  public allowedMovement = -1; // if a bot has allowed movement it will be removed when that movement runs out
  public outOfMovesAnimation:any; // todo add in future.
  private pad = 25;
  protected imageObj:HTMLImageElement=null;
  public health:number=3;

  public animationTimer:number = -1;
  public animationTimerLimit:number =4;
  public animationIndex:number= 0;

  constructor(
      public damage:number=2,
      public posX:number=0,
      public posY:number=0,
      public bulletDirection:BulletDirection=null,
      public goodBullet:boolean=true,
      public animationImages:HTMLImageElement[]=null,
      public imageSizeX:number=90,
      public imageSizeY:number=60,
      public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY),
      public destructable:boolean=false
  ){
    this.imageObj = animationImages[0];
    if(animationImages.length > 1){
      this.animationTimer = 0;
    }
  }

  getPosX():number {
    return this.posX;
  }

  getPosY():number {
    return this.posY;
  }

  getCurrentRotation():number {
    return this.bulletDirection.angle;
  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, playerService:PlayerService ){
    this.bulletDirection.update(this.posX,this.posY);
    this.posX += this.bulletDirection.speed * this.bulletDirection.directionX;
    this.posY += this.bulletDirection.speed * this.bulletDirection.directionY;
    let ctx = canvasContainer.mainCtx;

    if(this.posY < (-this.pad) || this.posX < (0) || this.posY > (levelInstance.getMapHeight()+this.imageSizeY+this.pad) || this.posX > (levelInstance.getMapWidth()+this.imageSizeX+this.pad) ){
      bulletManagerService.removeBullet(this, botManagerService);
    } else {
      let removed:boolean =false;
      if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY + this.pad)){
        bulletManagerService.removeBullet(this, botManagerService);
        removed = true;
      } else {
        if(this.bulletDirection.performRotation){
          this.performRotation(ctx);
        } else {
            ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        }
      }
      if(levelInstance.drawHitBox()){
          this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
      }

      if(this.goodBullet){ // todo collision detection!!
        let botArrClone = [...botManagerService.getBots()];
        for(let i = 0; i < botArrClone.length;i++) {
          let bot = botArrClone[i];
          if(bot.hasBotArmorBeenHit(this,this.hitBox)) {
            bot.applyArmorDamage(this.damage, botManagerService,playerService,levelInstance);
            bulletManagerService.removeBullet(this, botManagerService, LogicService.getRandomInt(this.imageSizeX-5),false,true);
            removed = true;
            break;
          }
          if(bot.hasBotBeenHit(this,this.hitBox)) {
            bot.applyDamage(this.damage, botManagerService, bulletManagerService, playerService,levelInstance);
            bulletManagerService.removeBullet(this, botManagerService, LogicService.getRandomInt(this.imageSizeX-5),false,true);
            removed = true;
            break;
          }
        }
        let bullArrClone = [...bulletManagerService.getBullets()];
        for(let i = 0; i < bullArrClone.length;i++) {
          let bull = bullArrClone[i];
          if(bull.canBeDestroyed() && bull.hasBulBeenHit(this,this.hitBox)) {
            bull.applyDamage(this.damage, bulletManagerService, botManagerService, playerService,levelInstance);
            bulletManagerService.removeBullet(this, botManagerService, LogicService.getRandomInt(this.imageSizeX-5),false,true);
            removed = true;
            break;
          }
        }
      } else {
        // colision with a good shield
        let shieldsArrClone = [...bulletManagerService.getShields()];
        for (let i = 0; i < shieldsArrClone.length; i++) {
          const shield = shieldsArrClone[i];
          if(shield.goodShield && shield.hasShieldBeenHit(this,this.hitBox)){
            bulletManagerService.removeBullet(this, botManagerService, 0, true);
            removed = true;
            break;
          }
        }
        // colision with player
        if(!removed && playerService.currentPlayer && playerService.currentPlayer.hasPlayerBeenHit(this,this.hitBox)){
          bulletManagerService.removeBullet(this, botManagerService);
          removed = true;
          playerService.killCurrentPlayer();
        }
      }

      if(!removed && this.allowedMovement > -1){
        this.allowedMovement--;
        if(this.allowedMovement < 1) {
          this.allowedMovementOver(levelInstance, canvasContainer, bulletManagerService, botManagerService, playerService);
          removed = true;
        }
      }
    }
    this.updateDisplayAnimation();
  }

  canBeDestroyed(){
    return this.destructable;
  }

  hasBulBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  applyDamage(damage:number, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, playerService:PlayerService, levelInstance:LevelInstance){
    this.health -= damage;
    if(this.health < 1){
      bulletManagerService.removeBullet(this, botManagerService);
    }
  }

  performRotation(ctx): any {
    // let rotatedCenterCords:{x:number,y:number} = LogicService.pointAfterRotation(this.posX, this.posY, this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.bulletDirection.angle)
    // LogicService.drawRotateImage(this.imageObj, ctx,this.bulletDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,
    //   this.posX,this.posY,this.imageSizeX,this.imageSizeY,
    //   rotatedCenterCords.x,rotatedCenterCords.y
    // );
    LogicService.drawRotateImage(this.imageObj, ctx,this.bulletDirection.angle,this.getPosX(),this.getPosY(),this.imageSizeX,this.imageSizeY);
  }

  allowedMovementOver(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, playerService:PlayerService){
    bulletManagerService.removeBullet(this, botManagerService, 0, true);
  }

  updateDisplayAnimation(){
    if(this.animationTimer >= this.animationTimerLimit) {
      this.animationTimer = 0;
      this.animationIndex++;
      if(this.animationIndex >= this.animationImages.length) {
        this.animationIndex = 0;
      }
      this.imageObj = this.animationImages[this.animationIndex];
    } else if (this.animationTimer > -1){
      this.animationTimer++;
    }
  }

  getCenterX():number {
    return this.posX+(this.imageSizeX/2);
  }

  getCenterY():number {
      return this.posY+(this.imageSizeY/2);
  }

}

export class ExplodingBullet extends DumbLazer {
  positions:{x:number,y:number}[] = [{x:-10,y:-10},{x:-10,y:0},{x:-10,y:10},{x:0,y:-10},{x:0,y:10},{x:10,y:-10},{x:10,y:0},{x:10,y:10}];
  constructor(
    damage:number=2,
    posX:number=0,
    posY:number=0,
    bulletDirection:BulletDirection=null,
    goodBullet:boolean=true,
    animationImages:HTMLImageElement[]=null,
    imageSizeX:number=90,
    imageSizeY:number=60,
    hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY),
    destructable:boolean=false
  ){
    super(damage,posX,posY,bulletDirection,goodBullet,animationImages,imageSizeX,imageSizeY,hitBox,destructable);
  }

  allowedMovementOver(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, playerService:PlayerService) {
    let px = this.getCenterX();
    let py = this.getCenterY();
    botManagerService.createBotDeath(px,py);
    for(let pos of this.positions){
      bulletManagerService.generateBotBlazer(levelInstance,
        bulletManagerService.calculateBulletDirection(px, py, px+pos.x, py+pos.y, 6, true),
        px, py);
    }
    bulletManagerService.removeBullet(this, botManagerService, 0, false,false,true);
  }

}

class RotationLazer extends DumbLazer {
	constructor(
		public damage:number=2,
		public posX:number=0,
		public posY:number=0,
		public bulletDirection:BulletDirection=null,
		public goodBullet:boolean=true,
		public imageObjs:HTMLImageElement[]=null,
		public imageSizeX:number=90,
		public imageSizeY:number=60,
		public hitBox:HitBox=new HitBox(-(imageSizeX/2),-(imageSizeY/2),imageSizeX,imageSizeY)
	){
		super(damage,posX,posY,bulletDirection,goodBullet,imageObjs, imageSizeX,imageSizeY,hitBox);
  }

  getPosX():number {
    return this.posX-(this.imageSizeX/2);
  }

  getPosY():number {
    return this.posY-(this.imageSizeY/2);
  }

  getCurrentRotation():number {
    return this.bulletDirection.angle;
  }
	// in a rotation lazer, the x+y are actually in the center of the bullet, so we have to workout the top left cords.
	performRotation(ctx): any {
		let topLeftCords={x:this.posX-(this.imageSizeX/2),y:this.posY-(this.imageSizeY/2)}
		LogicService.drawRotateImage(this.imageObj, ctx,this.bulletDirection.angle,topLeftCords.x,topLeftCords.y,this.imageSizeX,this.imageSizeY);
	}
}


export class BulletDirection {
  constructor(
    public directionY,
    public directionX,
    public angle,
    public len,
    public speed,
    public performRotation,
    public targetObject
  ){    }

  update(origX=0, origY=0, newTarget = null){
    if(newTarget != null){
      this.targetObject = newTarget;
    }
    if(this.targetObject != null && this.targetObject != undefined && this.targetObject.posY != undefined && this.targetObject.posX != undefined){
      var directionY = this.targetObject.getCenterY()-origY;
      var directionX = this.targetObject.getCenterX()-origX;
      var angle = Math.atan2(directionY,directionX); // bullet angle

      // Normalize the direction
      var len = Math.sqrt(directionX * directionX + directionY * directionY);
      directionX /= len;
      directionY /= len;

      this.len = len;
      this.angle = angle;
      this.directionY = directionY;
      this.directionX = directionX;
    } else {
      //console.error("Cannot target this object.",this.targetObject);
    }
  }

  canShoot():boolean{
    return true;
  }
}


export class TurretDirection extends BulletDirection {
  protected angDiff: number = 0;

  constructor(
     directionY,
     directionX,
     angle,
     len,
     speed,
     performRotation,
     targetObject
  ){
    super(directionY,directionX,angle,len,speed,performRotation,targetObject)
   }

  update(origX=0, origY=0){
    if(this.targetObject != null && this.targetObject != undefined && this.targetObject.posY != undefined && this.targetObject.posX != undefined){
      var directionY = this.targetObject.getCenterY()-origY;
      var directionX = this.targetObject.getCenterX()-origX;
      var angle = Math.atan2(directionY,directionX); // bullet angle

      // Normalize the direction
      var len = Math.sqrt(directionX * directionX + directionY * directionY);
      directionX /= len;
      directionY /= len;

      let currentAngleDeg = LogicService.radianToDegree(this.angle);
      let newAngleDeg = LogicService.radianToDegree(angle);
      this.angDiff = currentAngleDeg-newAngleDeg;
      if(this.angDiff > 360){
        console.log("this should not be happening:"+this.angDiff);
      }
      if(this.angDiff != 0 && (this.angDiff > 0.9 || this.angDiff < -0.9)){
        if(this.angDiff < 0){
          if(this.angDiff < -180) {
            angle = LogicService.degreeToRadian(this.decreaseAngle(currentAngleDeg))
          } else { // its > than 180 so i may as well go the opposite direction
            angle = LogicService.degreeToRadian(this.increaseAngle(currentAngleDeg))
          }
        } else {
          if(this.angDiff > 180) {
            angle = LogicService.degreeToRadian(this.increaseAngle(currentAngleDeg))
          } else { // its < than 180 so i may as well go the opposite direction
            angle = LogicService.degreeToRadian(this.decreaseAngle(currentAngleDeg))
          }
        }
      }

      this.len = len;
      this.angle = angle;
      this.directionY = directionY;
      this.directionX = directionX;
    } else {
      //console.error("Cannot target this object.",this.targetObject);
    }
  }

  increaseAngle(currentAngleDeg):number{
    currentAngleDeg = currentAngleDeg+1;
    return (currentAngleDeg > 360)?1:currentAngleDeg;
  }
  decreaseAngle(currentAngleDeg):number{
    currentAngleDeg = currentAngleDeg-1;
    return (currentAngleDeg < 0)?359:currentAngleDeg;
  }

  canShoot():boolean{
    let cs = this.angDiff < 0.9 && this.angDiff > -0.9;
    //console.log("canShoot:"+cs)
    return cs;
  }
}
