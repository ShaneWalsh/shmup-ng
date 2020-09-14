import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelInstance } from 'src/app/manager/level-manager.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { PlayerService } from 'src/app/services/player.service';
import { BulletInstance } from 'src/app/domain/bullet/BulletInstance';
import { HitBox } from 'src/app/domain/HitBox';
import { LogicService } from 'src/app/services/logic.service';
import { CanvasContainer } from '../domain/CanvasContainer';

@Injectable({
  providedIn: 'root'
})
export class BulletManagerService {
    private bulletDestroyed: Subject<BulletInstance> = new Subject();
    private bulletCreated: Subject<BulletInstance> = new Subject();
    private bulletRemoved: Subject<BulletInstance> = new Subject();

    private bulletsArr:BulletInstance[] = [];

    constructor(private resourcesService:ResourcesService) {

    }

    clean(){
        this.bulletsArr = [];
    }

    update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, playerService:PlayerService): any {
        //throw new Error("Method not implemented.");
        let bulletArrClone = [...this.bulletsArr]; // why clone it? So I can update the original array without effecting the for loop.
        for(let i = 0; i< bulletArrClone.length; i++){
            const bullet = bulletArrClone[i];
            bullet.update(levelInstance, canvasContainer, this, botManagerService, playerService);
        }
    }

    generatePlayerLazer(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY): any {
        // make a generaic lazer, isTargetBot? // damage to do
        let newBullet = new DumbLazer(2,startX, startY, bulletDirection, true, this.resourcesService.getRes().get("player-1-bullets"),null, 30,22);
        this.bulletsArr.push(newBullet);
        this.bulletCreated.next(newBullet);
    }

    generateBotBlazer(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY): any {
        let newBullet = new DumbLazer(1, startX, startY, bulletDirection, false, this.resourcesService.getRes().get("enemy-bullet-target"),null, 22, 14);
        this.bulletsArr.push(newBullet);
        this.bulletCreated.next(newBullet);
    }

    generateMuzzleBlazer(levelInstance: LevelInstance, bulletDirection: BulletDirection, startX, startY): any {
        let newBullet = new RotationLazer(1, startX, startY, bulletDirection, false, this.resourcesService.getRes().get("miniboss-2-bullet"),null, 36, 20);
        this.bulletsArr.push(newBullet);
        this.bulletCreated.next(newBullet);
    }

    generateBotTrackerBlob(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=30 ): any {
      let newBullet = new DumbLazer(1,startX, startY, bulletDirection, false, this.resourcesService.getRes().get("enemy-bullet-target"),null,22,14);
      newBullet.allowedMovement = allowedMovement; // 2 seconds ish
      this.bulletsArr.push(newBullet);
      this.bulletCreated.next(newBullet);
    }

		// the x+y passed into the tracker are middle point of the bullet, so I have to then workout where the top left x+y is and rotate that by the bullet angle, giving me the actual x+y cord
		generateGuardianTracker(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=30 ): any {
				//let cords :{x:number,y:number} = LogicService.pointAfterRotation(centerX, centerY, centerX-7, centerY-10, bulletDirection.angle)
				let newBullet = new RotationLazer(1,startX, startY, bulletDirection, false, this.resourcesService.getRes().get("enemy-bullet-target"),null,22,14);
				newBullet.allowedMovement = allowedMovement; // 2 seconds ish
				this.bulletsArr.push(newBullet);
				this.bulletCreated.next(newBullet);
		}

		generateHoming(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY, allowedMovement=60 ): any {
        let newBullet = new DumbLazer(1,startX, startY, bulletDirection, false, this.resourcesService.getRes().get("enemy-missile-1"),this.resourcesService.getRes().get("enemy-missile-2"),22,13);
        newBullet.allowedMovement = allowedMovement;
        this.bulletsArr.push(newBullet);
        this.bulletCreated.next(newBullet);
    }

    removeBullet(bullet:BulletInstance, botManagerService:BotManagerService, xOffset:number=0){
        //botManagerService.createMisslePlume(bullet.getPosX(),bullet.getPosY(), bullet.getCurrentRotation());
        botManagerService.createExplosionTiny(bullet.getPosX()+xOffset,bullet.getPosY(), bullet.getCurrentRotation())
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

    update(origX=0, origY=0){
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
}

class DumbLazer implements BulletInstance {

    public allowedMovement = -1; // if a bot has allowed movement it will be removed when that movement runs out
    public outOfMovesAnimation:any; // todo add in future.
		private pad = 25;
    protected imageObj:HTMLImageElement=null;
    protected flipImageCounter:number = -1;
    constructor(
        public damage:number=2,
        public posX:number=0,
        public posY:number=0,
        public bulletDirection:BulletDirection=null,
        public goodBullet:boolean=true,
        public imageObj1:HTMLImageElement=null,
        public imageObj2:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){
      this.imageObj = imageObj1;
      if(imageObj2 != null){
        this.flipImageCounter = 5;
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
        console.log("removed bullet");
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
          for(let i = 0; i < botArrClone.length;i++){
            let bot = botArrClone[i];
            if(bot.hasBotArmorBeenHit(this,this.hitBox)){
              // todo make noise or show anumation of failed hit
              bulletManagerService.removeBullet(this, botManagerService, LogicService.getRandomInt(this.imageSizeX-5));
              removed = true;
              break;
            }
            if(bot.hasBotBeenHit(this,this.hitBox)){
              bot.applyDamage(this.damage, botManagerService,playerService,levelInstance);
              bulletManagerService.removeBullet(this, botManagerService, LogicService.getRandomInt(this.imageSizeX-5));
              removed = true;
              break;
            }
          }
        } else { // colision with the player
          if(playerService.currentPlayer && playerService.currentPlayer.hasPlayerBeenHit(this,this.hitBox)){
            bulletManagerService.removeBullet(this, botManagerService);
            removed = true;
            playerService.killCurrentPlayer();
          }
        }

        if(!removed && this.allowedMovement > -1){
          this.allowedMovement--;
          if(this.allowedMovement < 1){
            // todo play an animcation perhaps?
            removed = true;
            bulletManagerService.removeBullet(this, botManagerService);
          }
        }
      }
      this.updateDisplayAnimation();
    }

		performRotation(ctx): any {
			// let rotatedCenterCords:{x:number,y:number} = LogicService.pointAfterRotation(this.posX, this.posY, this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.bulletDirection.angle)
      // LogicService.drawRotateImage(this.imageObj, ctx,this.bulletDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,
      //   this.posX,this.posY,this.imageSizeX,this.imageSizeY,
      //   rotatedCenterCords.x,rotatedCenterCords.y
      // );
      LogicService.drawRotateImage(this.imageObj, ctx,this.bulletDirection.angle,this.getPosX(),this.getPosY(),this.imageSizeX,this.imageSizeY);
    }

    updateDisplayAnimation(){
      console.log("BaBingBoom")
      if(this.flipImageCounter > 0) {
        this.flipImageCounter--;
      } else if(this.flipImageCounter == 0) {
        this.imageObj = (this.imageObj === this.imageObj1)?this.imageObj2:this.imageObj1;
        this.flipImageCounter = 5;
      }
    }
}

class RotationLazer extends DumbLazer {
	constructor(
		public damage:number=2,
		public posX:number=0,
		public posY:number=0,
		public bulletDirection:BulletDirection=null,
		public goodBullet:boolean=true,
		public imageObj:HTMLImageElement=null,
		public imageObj2:HTMLImageElement=null,
		public imageSizeX:number=90,
		public imageSizeY:number=60,
		public hitBox:HitBox=new HitBox(-(imageSizeX/2),-(imageSizeY/2),imageSizeX,imageSizeY)
	){
		super(damage,posX,posY,bulletDirection,goodBullet,imageObj,imageObj2, imageSizeX,imageSizeY,hitBox);
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
