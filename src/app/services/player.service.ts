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
import { ShipFactoryService } from './ship-factory.service';
import { PilotFactoryService } from './pilot-factory.service';
import { ShipEnum, ShipObject } from '../domain/player/ShipObject';
import { PilotEnum, PilotObject } from '../domain/player/PilotObject';
import { AudioServiceService } from './audio-service.service';
import { DeathManagerService } from '../manager/death-manager.service';
import { DeathDetails } from '../domain/DeathDetails';



@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public currentPlayer:PlayerObj = new PlayerObj();
  private playerLivesGoneSubject:Subject<PlayerObj> = new Subject();

  public selectedShip:ShipEnum = ShipEnum.BLADE1;
  public selectedPilot:PilotEnum = PilotEnum.NAOMI1;

  constructor(private keyboardEventService:KeyboardEventService, private levelManagerService:LevelManagerService,
    private resourcesService:ResourcesService, private botManagerService:BotManagerService,
    private bulletManagerService:BulletManagerService, private deathManagerService:DeathManagerService,
    private shipFactoryService:ShipFactoryService, private pilotFactoryService:PilotFactoryService ) {
    keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
        //if(this.levelManagerService.getNotPaused()){
            this.currentPlayer.processKeyDown(customKeyboardEvent);
        //}
    });
    keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
        //if(this.levelManagerService.getNotPaused()){
            this.currentPlayer.processKeyUp(customKeyboardEvent);
        //}
    });
  }

  killCurrentPlayer(): any {
      this.currentPlayer.lives--;
      this.currentPlayer.invincibilityTimer = 120;
      this.botManagerService.createPlayerDeath(this.currentPlayer.getCenterX(),this.currentPlayer.getCenterY());
      this.deathManagerService.addDynamicDeath(this.currentPlayer.getDeathDetails());
      if(this.currentPlayer.lives > 0){
          this.currentPlayer.reset(this.bulletManagerService);
      } else { // game over.
          this.getPlayerLivesGoneSubject().next(this.currentPlayer);
      }
  }

  getPlayerLivesGoneSubject(): Subject<PlayerObj> {
      return this.playerLivesGoneSubject;
  }

  // creates an entirely new player
  initPlayer(init:boolean=true, score=0,lives=30,startPositionX=210, startPositionY=640): any {
    this.currentPlayer.reset(this.bulletManagerService, startPositionX,startPositionY); // position
    this.currentPlayer.pressedKeys = {"left":false,"up":false,"right":false,"down":false};
    this.currentPlayer.bulletsFiring = false;
    this.currentPlayer.invincibilityTimer = 0;
    this.currentPlayer.score = score;
    this.currentPlayer.lives = lives;
    this.currentPlayer.abilityCooldown = 0;
    this.currentPlayer.activateAbilityNow = false;
    // are these need here? Or should these decide other objects that are inserted onto the ship? Pilot and ability seem like things that should be extracted
    this.currentPlayer.selectedShip = this.shipFactoryService.createShip(this.selectedShip);
    this.currentPlayer.selectedPilot = this.pilotFactoryService.createPilot(this.selectedPilot);
    if(init){
      this.currentPlayer.selectedPilot.playerInit(this.currentPlayer)
    }
  }

}

export class PlayerObj implements ShieldBot {
  // are these need here? Or should these decide other objects that are inserted onto the ship? Pilot and ability seem like things that should be extracted
  public selectedPilot: PilotObject;
  public selectedShip: ShipObject;

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

  public activateAbilityNow:boolean = false;
  public abilityCooldown:number =0;

  public hasMovedToMiddle=true;

  constructor(
      public lives:number=10,
      public posX:number=210,
      public posY:number=480
  ){

  }

  update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, audioServiceService:AudioServiceService){
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
    let hitBox = this.selectedShip.getHitBox();

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
      this.selectedShip.drawMuzzleFlash(ctx, this.posX,this.posY, levelInstance, canvasContainer, bulletManagerService, botManagerService)
      this.firingSequence++;
    } else if(this.firingSequence == 5){
      this.selectedShip.fire(ctx, this.posX,this.posY, this.bulletSpeed, levelInstance, canvasContainer, bulletManagerService, botManagerService);
      audioServiceService.playAudioNewInstance("Space-Cannon");
      this.bulletsFired = true;
      this.firingSequence++;
    }


    if(levelInstance.drawShadow()){
      this.selectedShip.drawShadow(canvasContainer.shadowCtx, this.posX,this.posY, levelInstance, canvasContainer, bulletManagerService, botManagerService);
    }
    // draw
    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer--;
      if (this.invincibilityTimer % 2 == 0) {// draw every second draw, to get an invincible effect
        this.selectedShip.draw(ctx, this.posX,this.posY, levelInstance, canvasContainer, bulletManagerService, botManagerService);
        if (levelInstance.drawHitBox()) {
          hitBox.drawBorder(this.posX + hitBox.hitBoxX, this.posY + hitBox.hitBoxY, hitBox.hitBoxSizeX, hitBox.hitBoxSizeY, ctx, "#FF0000");
        }
      }
    } else {
      this.selectedShip.draw(ctx, this.posX,this.posY, levelInstance, canvasContainer, bulletManagerService, botManagerService);
      if (levelInstance.drawHitBox()) {
        hitBox.drawBorder(this.posX + hitBox.hitBoxX, this.posY + hitBox.hitBoxY, hitBox.hitBoxSizeX, hitBox.hitBoxSizeY, ctx, "#FF0000");
      }
    }
    if (this.activateAbilityNow && this.abilityCooldown < 1) { // can I activate my ability now? Cooldown?
      this.selectedShip.activateAbility(this, this.posX, this.posY,this.bulletSpeed, levelInstance, canvasContainer, bulletManagerService, botManagerService);
      this.abilityCooldown = this.selectedPilot.abilityCooldownLimit;
    } else {
      this.abilityCooldown--;
    }

  }

  updateIntro(ctx: CanvasRenderingContext2D, animationTimer:number) {
    let sizeY = 4 + (4 * animationTimer);
    ctx.drawImage(this.selectedShip.imageObj, 0, 0, this.selectedShip.imageSizeX, sizeY, this.posX, this.posY, this.selectedShip.imageSizeX, sizeY);
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

    if(this.posX + this.selectedShip.imageSizeX > levelInstance.getMapWidth()){
      this.posX = levelInstance.getMapWidth() -  this.selectedShip.imageSizeX;
    }
    else if(this.posX < 0){
      this.posX = 0;
    }

    if(this.posY + this.selectedShip.imageSizeY > levelInstance.getMapHeight()){
      this.posY = levelInstance.getMapHeight() -  this.selectedShip.imageSizeY;
    }
    else if(this.posY < 0){
      this.posY = 0;
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
    return this.posX+(this.selectedShip.imageSizeX/2);
  }

  getCenterY():number{
    return this.posY+(this.selectedShip.imageSizeY/2);
  }

  isInvincible():boolean {
    return this.invincibilityTimer > 0;
  }

  hasPlayerBeenHit(hitter:any,hitterBox:HitBox):boolean {
    if (!this.isInvincible()) {
      return this.selectedShip.getHitBox().areCentersToClose(hitter,hitterBox,this,this.selectedShip.getHitBox());
    } else {
      return false;
    }
  }

  addScore(arg0: any): any {
    this.score+= arg0;
  }

  reset( bulletManagerService:BulletManagerService, resetPositionX= this.resetPositionX, resetPositionY=this.resetPositionY): any {
    this.posX = resetPositionX;
    this.posY = resetPositionY;
    this.activateAbilityNow = false;
    this.abilityCooldown = 0;
    if (this.selectedPilot) this.selectedPilot.clearAbility();
    if (this.selectedShip) this.selectedShip.clearAbility(this, bulletManagerService);
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

  getDeathDetails(): DeathDetails {
    return new DeathDetails(this.selectedShip.imageObj, this.posX, this.posY, this.selectedShip.imageSizeX, this.selectedShip.imageSizeY);
  }
}
