import { Injectable } from '@angular/core';
import { KeyboardEventService, CustomKeyboardEvent } from 'src/app/services/keyboard-event.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelManagerService, LevelInstance } from 'src/app/manager/level-manager.service';
import { HitBox } from 'src/app/domain/HitBox';
import { BulletManagerService, BulletDirection } from 'src/app/manager/bullet-manager.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    public currentPlayer:PlayerObj = new PlayerObj();

    constructor(private keyboardEventService:KeyboardEventService, private levelManagerService:LevelManagerService, private resourcesService:ResourcesService) {
      keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
          if(this.levelManagerService.getNotPaused()){
              this.processKeyDown(customKeyboardEvent);
          }
      });
      keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
          if(this.levelManagerService.getNotPaused()){
              this.processKeyUp(customKeyboardEvent);
          }
      });
      this.currentPlayer.imageObj = this.resourcesService.getRes().get("player-1-ship");

    }

    processKeyDown(customKeyboardEvent:CustomKeyboardEvent){
        // move the ship about
        let speed = 6;
        if(customKeyboardEvent.event.keyCode == 65 || customKeyboardEvent.event.keyCode == 37 ){ // a - left
            this.currentPlayer.posXSpeed = -speed;
        } else if(customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ // s - up
            this.currentPlayer.posYSpeed = +speed;
        } else if(customKeyboardEvent.event.keyCode == 68 || customKeyboardEvent.event.keyCode == 39){ // d - right
            this.currentPlayer.posXSpeed = +speed;
        } else if(customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38){ // w -- down
            this.currentPlayer.posYSpeed = -speed;
        }
        if(customKeyboardEvent.event.keyCode == 90 || customKeyboardEvent.event.keyCode == 78){ // z-n
            this.currentPlayer.setFireBullet();
        }
    }

    processKeyUp(customKeyboardEvent:CustomKeyboardEvent){
        if(customKeyboardEvent.event.keyCode == 65 || customKeyboardEvent.event.keyCode == 37 ){ // a - left
            this.currentPlayer.posXSpeed = 0;
        } else if(customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ // s - up
            this.currentPlayer.posYSpeed = 0;
        } else if(customKeyboardEvent.event.keyCode == 68 || customKeyboardEvent.event.keyCode == 39){ // d - right
            this.currentPlayer.posXSpeed = 0;
        } else if(customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38){ // w -- down
            this.currentPlayer.posYSpeed = 0;
        }
        if(customKeyboardEvent.event.keyCode == 90 || customKeyboardEvent.event.keyCode == 78){ // z-n
            this.currentPlayer.stopFireBullet();
        }

    }

}

export class PlayerObj {
    public posXSpeed:number = 0;
    public posYSpeed:number = 0;

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 10;

    public bulletsFiring:boolean = false;
    public bulletsFired:boolean = true;

    constructor(
        public lives:number=10,
        public posX:number=320,
        public posY:number=240,
        public imageObj:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox((Math.floor(imageSizeX/2))-5,(Math.floor(imageSizeY/2))-5,10,10)
    ){

    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, bulletManagerService:BulletManagerService){
        this.acceleration(levelInstance);

        // fire weapon
        // need to put some kind of timer around this, may have to bring back the timer pubsub
		if(this.bulletsFiring || !this.bulletsFired){
			if(this.bTimer >= this.bTimerLimit){
				this.bTimer = 0;
				this.fireLazer(levelInstance,ctx,bulletManagerService);
                this.bulletsFired = true;
			}
			else{
				this.bTimer++;
			}
		}

        // draw
        ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        if(levelInstance.drawHitBox()){
            this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        }
    }

    acceleration(levelInstance:LevelInstance){
        // apply movement
        this.posX += this.posXSpeed;
        this.posY += this.posYSpeed;

        if(this.posX + this.imageSizeX > levelInstance.getMapWidth()){
            this.posX = levelInstance.getMapWidth() -  this.imageSizeX;
        }
        else if(this.posX < 0){
            this.posX = 0;
        }

        if(this.posY + this.imageSizeY > levelInstance.getMapHeight()){
            this.posY = levelInstance.getMapHeight() -  this.imageSizeY;
        }
        else if(this.posY < 0){
            this.posY = 0;
        }
    }

    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireLazer(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService){
        let bullDirection:BulletDirection;
        if(levelInstance.isVertical()){
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, this.posX, (this.posY-50), 6);
            // todo gen two bullets, or just one?
            bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX+30, this.posY);
        } else {
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
            bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
        }
	}

    setFireBullet(){
		this.bulletsFiring = true;
		this.bulletsFired = false;
	}

	stopFireBullet(){
		this.bulletsFiring = false;
	}

    getCenterX():number{
        return this.posX+(this.imageSizeX/2);
    }

    getCenterY():number{
        return this.posY+(this.imageSizeY/2);
    }
}
