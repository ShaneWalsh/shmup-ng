import { Injectable } from '@angular/core';
import { KeyboardEventService, CustomKeyboardEvent } from 'src/app/services/keyboard-event.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelManagerService, LevelInstance } from 'src/app/manager/level-manager.service';
import { HitBox } from 'src/app/domain/HitBox';
import { BulletManagerService, BulletDirection } from 'src/app/manager/bullet-manager.service';
import { Subject } from '../../../node_modules/rxjs';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { CanvasContainer } from '../domain/CanvasContainer';
import { Shield } from '../domain/skills/Shield';
import { ShieldBot } from '../domain/skills/ShieldBotInterface';

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
    initPlayer(score=0,lives=25,startPositionX=210, startPositionY=640): any {
        this.currentPlayer.reset(startPositionX,startPositionY); // position
        this.currentPlayer.pressedKeys = {"left":false,"up":false,"right":false,"down":false};
        this.currentPlayer.bulletsFiring = false;
        this.currentPlayer.invincibilityTimer = 0;
        this.currentPlayer.imageObj = this.resourcesService.getRes().get("player-1-ship");
        this.currentPlayer.imageObjMuzzle = [this.resourcesService.getRes().get("player-muzzle-flash-1"),this.resourcesService.getRes().get("player-muzzle-flash-2"),this.resourcesService.getRes().get("player-muzzle-flash-3")];
        this.currentPlayer.imageObjShadow = this.resourcesService.getRes().get("player-1-ship-shadow-separa");
        this.currentPlayer.score = score;
        this.currentPlayer.lives = lives;
        this.currentPlayer.abilityCooldown = 0;
        this.currentPlayer.activateAbilityNow = false;
    }

}

export class PlayerObj implements ShieldBot{
	public speed = 8;
	public bulletSpeed:number = 20;
  public pressedKeys = {"left":false,"up":false,"right":false,"down":false};

  public bTimer:number = 0; // bullet timer
  public bTimerLimit:number = 4;

  public bulletsFiring:boolean = false;
  public bulletsFired:boolean = true;

  public resetPositionX:number= 210;
  public resetPositionY:number= 480;

  public invincibilityTimer:number = 0;

  public firingSequence = 6;
  public score = 0;

  public muzzleIndex = 0;
  public activateAbilityNow:boolean = false;
  public abilityCooldown:number =0;
  public abilityCooldownLimit:number = 900; //15 seconds

  public hasMovedToMiddle=true;

    constructor(
        public lives:number=10,
        public posX:number=210,
        public posY:number=480,
        public imageObj:HTMLImageElement=null,
        public imageObjMuzzle:HTMLImageElement[]=[],
        public imageObjShadow:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=70,
        public hitBox:HitBox=new HitBox((Math.floor(imageSizeX/2))-5,(Math.floor(imageSizeY/2))-5,10,10)
    ){

    }

    update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService){
      if(!this.hasMovedToMiddle){
        if(this.posY > 320){
          this.posY-= this.speed;
        } else {
          this.hasMovedToMiddle = true;
        }
      } else {
        this.acceleration(levelInstance);
      }
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
        ctx.drawImage(this.imageObjMuzzle[this.muzzleIndex], 0, 0, 90,40, this.posX, this.posY-30, 90,40);
        this.firingSequence++;
      } else if(this.firingSequence == 5){
        this.fireLazer(levelInstance,ctx,bulletManagerService);
        this.muzzleIndex = ((this.muzzleIndex+1)>=this.imageObjMuzzle.length)?0:(this.muzzleIndex+1);
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
      if(this.activateAbilityNow && this.abilityCooldown < 1) { // can I activate my ability now? Cooldown?
        this.activateAbility(levelInstance, canvasContainer, bulletManagerService, botManagerService);
      } else {
        this.abilityCooldown--;
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
        bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX+30, this.posY-10);
      } else {
        bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, this.bulletSpeed);
        bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
      }
  }

  // depending on which ship it is, it may have a different ability, perhaps I could pass a function as the arg for the player ability.
  activateAbility(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService) {
    bulletManagerService.addPlayerShield(this);
    this.abilityCooldown = this.abilityCooldownLimit;
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

  isInvincible():boolean {
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

  reset(resetPositionX= this.resetPositionX, resetPositionY=this.resetPositionY): any {
    this.posX = resetPositionX;
    this.posY = resetPositionY;
  }

	processKeyDown(customKeyboardEvent:CustomKeyboardEvent){
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
    if(customKeyboardEvent.event.keyCode == 32){ // space
      this.activateAbilityNow=true;
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
    if(customKeyboardEvent.event.keyCode == 32){ // space
      this.activateAbilityNow=false;
    }
  }

  getShieldX(): number {
    return this.getCenterX();
  }
  getShieldY(): number {
    return this.getCenterY();
  }

  moveToMiddle(){
    this.hasMovedToMiddle=false;
  }
}
