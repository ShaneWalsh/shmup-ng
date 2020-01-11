import { Injectable } from '@angular/core';
import { KeyboardEventService, CustomKeyboardEvent } from 'src/app/services/keyboard-event.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelManagerService, LevelInstance } from 'src/app/manager/level-manager.service';
import { HitBox } from 'src/app/domain/HitBox';
import { BulletManagerService, BulletDirection } from 'src/app/manager/bullet-manager.service';
import { Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
    public currentPlayer:PlayerObj = new PlayerObj();
    private playerLivesGoneSubject:Subject<PlayerObj> = new Subject();

    constructor(private keyboardEventService:KeyboardEventService, private levelManagerService:LevelManagerService, private resourcesService:ResourcesService) {
      keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
          if(this.levelManagerService.getNotPaused()){
              this.currentPlayer.processKeyDown(customKeyboardEvent);
          }
      });
      keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
          if(this.levelManagerService.getNotPaused()){
              this.currentPlayer.processKeyUp(customKeyboardEvent);
          }
      });
    }

    killCurrentPlayer(): any {
        this.currentPlayer.lives--;
        if(this.currentPlayer.lives > 0){
            this.currentPlayer.reset();
        } else { // game over.
            this.getPlayerLivesGoneSubject().next(this.currentPlayer);
        }
    }

    getPlayerLivesGoneSubject(): Subject<PlayerObj> {
        return this.playerLivesGoneSubject;
    }

    // creates an entirely new player
    initPlayer(): any {
        this.currentPlayer.reset(); // position
        this.currentPlayer.imageObj = this.resourcesService.getRes().get("player-1-ship");
        this.currentPlayer.score = 0;
        this.currentPlayer.lives = 3;
    }

}

export class PlayerObj {
	public speed = 8;
	public pressedKeys = {"left":false,"up":false,"right":false,"down":false};

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 10;

    public bulletsFiring:boolean = false;
    public bulletsFired:boolean = true;

    public resetPositionX:number;
    public resetPositionY:number;

    public score = 0;
    constructor(
        public lives:number=10,
        public posX:number=280,
        public posY:number=500,
        public imageObj:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox((Math.floor(imageSizeX/2))-5,(Math.floor(imageSizeY/2))-5,10,10)
    ){
        this.resetPositionX = this.posX;
        this.resetPositionY = this.posY;
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
		if(this.pressedKeys["left"])
			this.posX -= this.speed;
		if(this.pressedKeys["up"])
			this.posY += this.speed;
		if(this.pressedKeys["right"])
			this.posX += this.speed;
		if(this.pressedKeys["down"])
			this.posY -= this.speed;

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
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, this.posX, (this.posY-50), 8);
            // todo gen two bullets, or just one?
            bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX+30, this.posY);
        } else {
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 8);
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

    hasPlayerBeenHit(hitter:any,hitterBox:HitBox):boolean {
         return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
    }

    addScore(arg0: any): any {
        this.score+= arg0;
    }

    reset(): any {
        this.posX = this.resetPositionX;
        this.posY = this.resetPositionY;
    }

	processKeyDown(customKeyboardEvent:CustomKeyboardEvent){
        // move the ship about
        if(customKeyboardEvent.event.keyCode == 65 || customKeyboardEvent.event.keyCode == 37 ){ // a - left
			this.pressedKeys["left"] = true;

        } else if(customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ // s - up
			this.pressedKeys["up"] = true;

        } else if(customKeyboardEvent.event.keyCode == 68 || customKeyboardEvent.event.keyCode == 39){ // d - right
			this.pressedKeys["right"] = true;

        } else if(customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38){ // w -- down
			this.pressedKeys["down"] = true;

        }
        if(customKeyboardEvent.event.keyCode == 90 || customKeyboardEvent.event.keyCode == 78){ // z-n
            this.setFireBullet();
        }
    }

    processKeyUp(customKeyboardEvent:CustomKeyboardEvent){
        if(customKeyboardEvent.event.keyCode == 65 || customKeyboardEvent.event.keyCode == 37 ){ // a - left
			this.pressedKeys["left"] = false;
        } else if(customKeyboardEvent.event.keyCode == 83 || customKeyboardEvent.event.keyCode == 40){ // s - up
			this.pressedKeys["up"] = false;
        } else if(customKeyboardEvent.event.keyCode == 68 || customKeyboardEvent.event.keyCode == 39){ // d - right
			this.pressedKeys["right"] = false;
        } else if(customKeyboardEvent.event.keyCode == 87 || customKeyboardEvent.event.keyCode == 38){ // w -- down
			this.pressedKeys["down"] = false;
        }
        if(customKeyboardEvent.event.keyCode == 90 || customKeyboardEvent.event.keyCode == 78){ // z-n
            this.stopFireBullet();
        }

    }
}
