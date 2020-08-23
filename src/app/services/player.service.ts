import { Injectable } from '@angular/core';
import { KeyboardEventService, CustomKeyboardEvent } from 'src/app/services/keyboard-event.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelManagerService, LevelInstance } from 'src/app/manager/level-manager.service';
import { HitBox } from 'src/app/domain/HitBox';
import { BulletManagerService, BulletDirection } from 'src/app/manager/bullet-manager.service';
import { Subject } from '../../../node_modules/rxjs';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { CanvasContainer } from '../domain/CanvasContainer';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
    public currentPlayer:PlayerObj = new PlayerObj();
    private playerLivesGoneSubject:Subject<PlayerObj> = new Subject();

    constructor(private keyboardEventService:KeyboardEventService, private levelManagerService:LevelManagerService, private resourcesService:ResourcesService, private botManagerService:BotManagerService) {
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
        this.currentPlayer.invincibilityTimer = 120;
		this.botManagerService.createPlayerDeath(this.currentPlayer.getCenterX(),this.currentPlayer.getCenterY());
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
    initPlayer(score=0,lives=3): any {
        this.currentPlayer.reset(); // position
        this.currentPlayer.pressedKeys = {"left":false,"up":false,"right":false,"down":false};
        this.currentPlayer.bulletsFiring = false;
        this.currentPlayer.invincibilityTimer = 0;
        this.currentPlayer.imageObj = this.resourcesService.getRes().get("player-1-ship");
        this.currentPlayer.imageObjMuzzle = this.resourcesService.getRes().get("player-1-muzzle-flash");
        this.currentPlayer.imageObjShadow = this.resourcesService.getRes().get("player-1-ship-shadow-separa");
        this.currentPlayer.score = score;
        this.currentPlayer.lives = lives;
    }

}

export class PlayerObj {
	public speed = 8;
	public bulletSpeed:number = 20;
	public pressedKeys = {"left":false,"up":false,"right":false,"down":false};

  public bTimer:number = 0; // bullet timer
  public bTimerLimit:number = 4;

  public bulletsFiring:boolean = false;
  public bulletsFired:boolean = true;

  public resetPositionX:number;
  public resetPositionY:number;

  public invincibilityTimer:number = 0;

  public firingSequence = 6;
  public score = 0;

    constructor(
        public lives:number=10,
        public posX:number=210,
        public posY:number=480,
        public imageObj:HTMLImageElement=null,
        public imageObjMuzzle:HTMLImageElement=null,
        public imageObjShadow:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox((Math.floor(imageSizeX/2))-5,(Math.floor(imageSizeY/2))-5,10,10)
    ){
        this.resetPositionX = this.posX;
        this.resetPositionY = this.posY;
    }

    update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService){
        this.acceleration(levelInstance);
        let ctx = canvasContainer.mainCtx;
        // fire weapon
        // need to put some kind of timer around this, may have to bring back the timer pubsub
		if(this.bulletsFiring || !this.bulletsFired){
			if(this.bTimer >= this.bTimerLimit){
				this.bTimer = 0;
        this.firingSequence = 1;
			}
			else{
				this.bTimer++;
			}
		}

    if(this.firingSequence < 5){
      ctx.drawImage(this.imageObjMuzzle, 0, 0, 30,17, this.posX+30, this.posY-10, 30,17);
      this.firingSequence++;
    } else if(this.firingSequence == 5){
      this.fireLazer(levelInstance,ctx,bulletManagerService);
      this.bulletsFired = true;
      this.firingSequence++;
    }


    if(levelInstance.drawShadow()){
      canvasContainer.shadowCtx.drawImage(this.imageObjShadow, 0, 0, this.imageSizeX, this.imageSizeY, this.posX+30, this.posY+60, this.imageSizeX, this.imageSizeY);
    }
        // draw
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer--;
            if (this.invincibilityTimer % 2 == 0) {// draw every second draw, to get an invincible effect
                ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
                if (levelInstance.drawHitBox()) {
                    this.hitBox.drawBorder(this.posX + this.hitBox.hitBoxX, this.posY + this.hitBox.hitBoxY, this.hitBox.hitBoxSizeX, this.hitBox.hitBoxSizeY, ctx, "#FF0000");
                }
            }
        } else {
            ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
            if (levelInstance.drawHitBox()) {
                this.hitBox.drawBorder(this.posX + this.hitBox.hitBoxX, this.posY + this.hitBox.hitBoxY, this.hitBox.hitBoxSizeX, this.hitBox.hitBoxSizeY, ctx, "#FF0000");
            }
        }
    }

    updateIntro(ctx: CanvasRenderingContext2D, animationTimer:number) {
        let sizeY = 4 + (4 * animationTimer);
        ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, sizeY, this.posX, this.posY, this.imageSizeX, sizeY);
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
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, this.posX, (this.posY-50), this.bulletSpeed);
            // todo gen two bullets, or just one?

            bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX+30, this.posY-10);
        } else {
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, this.bulletSpeed);
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

    isInvincible():boolean{
        return this.invincibilityTimer > 0;
    }

    hasPlayerBeenHit(hitter:any,hitterBox:HitBox):boolean {
        if (!this.isInvincible()){
            return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
        } else {
            return false;
        }
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
