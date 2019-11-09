import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelInstance } from 'src/app/manager/level-manager.service';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { PlayerService } from 'src/app/services/player.service';
import { BulletInstance } from 'src/app/domain/bullet/BulletInstance';
import { HitBox } from 'src/app/domain/HitBox';

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

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, playerService:PlayerService): any {
        //throw new Error("Method not implemented.");
        let bulletArrClone = [...this.bulletsArr]; // why clone it? So I can update the original array without effecting the for loop.
        for(let i = 0; i< bulletArrClone.length; i++){
            const bullet = bulletArrClone[i];
            bullet.update(levelInstance, ctx, this, botManagerService, playerService);
        }
    }

    generatePlayerLazer(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY): any {
        // make a generaic lazer, isTargetBot? // damage to do
        let newBullet = new DumbLazer(2,startX, startY, bulletDirection, true, this.resourcesService.getRes().get("player-1-bullets"), 30,22);
        this.bulletsArr.push(newBullet);
        this.bulletCreated.next(newBullet);
    }

    generateBotTrackerBlob(levelInstance:LevelInstance, bulletDirection:BulletDirection, startX, startY): any {
        // make a generaic lazer, isTargetBot? // damage to do
        let newBullet = new DumbLazer(1,startX, startY, bulletDirection, false, this.resourcesService.getRes().get("enemy-bullet"), 14,22);
        this.bulletsArr.push(newBullet);
        this.bulletCreated.next(newBullet);
    }

    removeBullet(bullet:BulletInstance){
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

    calculateBulletDirection(origX:number, origY:number, targetX:number, targetY:number, speed:number, targetObject:any=null):BulletDirection {
        var directionY = targetY-origY;
        var directionX = targetX-origX;
        var angle = Math.atan2(directionY,directionX); // bullet angle

        // Normalize the direction
        var len = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= len;
        directionY /= len;

        return new BulletDirection(directionY,directionX,angle,len,speed,targetObject);
        // let xw = origX+this.hWidth;
        // let yh = origY+this.hHeight;
        // let leftGun = pointAfterRotation( xw, yh, origX + 16,origY+5,  this.angle );
        // let rightGun = pointAfterRotation( xw, yh, origX + 16,origY+27,  this.angle );
        //
        // this.missiles[id]=new Missile({x:leftGun.x,y:leftGun.y,angle,id, speed:6, dirX:directionX, dirY:directionY, targetObject});
    }

}

export class BulletDirection {
    constructor(
        public directionY,
        public directionX,
        public angle,
        public len,
        public speed,
        public targetObject
    ){    }

    update(origX=0, origY=0){
        if(this.targetObject != null && this.targetObject != undefined && this.targetObject.posY && this.targetObject.posX){
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
        }
    }
}

class DumbLazer implements BulletInstance {
    constructor(
        public damage:number=2,
        public posX:number=0,
        public posY:number=0,
        public bulletDirection:BulletDirection=null,
        public goodBullet:boolean=true,
        public imageObj:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){

    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, playerService:PlayerService ){
        this.bulletDirection.update(this.posX,this.posY);
		this.posX += this.bulletDirection.speed * this.bulletDirection.directionX;
		this.posY += this.bulletDirection.speed * this.bulletDirection.directionY;

        if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)){
            bulletManagerService.removeBullet(this);
        } else {
            ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        }
        if(levelInstance.drawHitBox()){
            this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        }

        if(this.goodBullet){ // todo collision detection!!
            let botArrClone = [...botManagerService.getBots()];
            for(let i = 0; i < botArrClone.length;i++){
                let bot = botArrClone[i];
                if(bot.hasBotBeenHit(this,this.hitBox)){
                    bot.applyDamage(this.damage, botManagerService);
                    bulletManagerService.removeBullet(this);
                    break;
                }
            }
        } else { // colision with the player
            if(playerService.currentPlayer && playerService.currentPlayer.hasPlayerBeenHit(this,this.hitBox)){
                bulletManagerService.removeBullet(this);
                playerService.killCurrentPlayer();
            }
        }
    }
}
