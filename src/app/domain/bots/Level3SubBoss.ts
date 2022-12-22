import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";
import { Turret } from "./Turret";
import { ProfileService, ProfileValuesEnum } from "src/app/services/profile.service";
import { DeathConfig, DeathDetails } from "../DeathDetails";

enum PhaseLaser {
  PHASE_LOADING,
  PHASE_CHARGING,
  PHASE_DAMAGE,
}

export class Level3SubBoss extends  BotInstanceImpl {

    public dirXRight:boolean = true;
    public dirYDown:boolean = true;

    public imageObj:HTMLImageElement;
    public bulletTurret:Turret;
    public bulletTurret2:Turret;

    public health:number=750;
    public totalHealth:number=750;
    public bulletSpeed:number = 5;

    public posXSpeed:number = 3;
    public posYSpeed:number = 1.5;

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 40;

    public anaimationTimer:number = 0;
    public anaimationTimerLimit:number =4;
    public animationIndex:number= 0;

    public damAnaimationTimer:number = 4;
    public damAnaimationTimerLimit:number =4;

    public score:number = 10;

    public phase:PhaseLaser = PhaseLaser.PHASE_LOADING;
    // for looping on the phases
    public phasesLoops:number[] = [5,1,6];
    public phaseLoop:number = 0;
    public phaseLoopLimit:number = 0;
    // for looping on the images
    public phaseCount:number = 0;
    public phaseCountLimit:number = 0;
    // for actually drawing
    public phaseDrawingCount:number = 0;
    public phaseDrawingCountLimit:number = 5;

    // static values for the laser locations
    public iLaserOrders:any[] = [
      [
        [0],[1],[2],[3],[4]
      ],
      [
        [2],[0],[4],[1],[3]
      ],
      [
        [0,1], [3,4], [1,2], [0,3], [2,3],
      ],
      [
        [0,4], [1,3], [1,2,3], [4,1], [0,3]
      ],
      [
        [0,2,4], [0,1,3], [1,2,3], [4,2,1], [0,2,4]
      ],
    ];
    public iLaserOrdersIndex = 0;
    public iLaserOrdersChangePer:number = 150;
    public iLaserOrdersChangeCounter:number = 0;

    public currentOrder:any[] = null;
    public currentOrderIndex:number = 0;
    public currentOrderIndexLimit:number = 5;
    public iLaserLocations:any[]= [{x:0,y:0}, {x:0,y:102}, {x:0,y:204}, {x:0,y:306}, {x:0,y:408}];

    constructor (
      public config:any={},
      public posX:number=0,
      public posY:number=0,
      imageObj:HTMLImageElement=null,
      public imageDamaged:HTMLImageElement=null,
      public imageSizeX:number=480,
      public imageSizeY:number=640,

      public iLaserLoading:HTMLImageElement[]=[],
      public iLaserCharging:HTMLImageElement[]=[],
      public iLaserDamage:HTMLImageElement[]=[],

      public imageTurretBullet:HTMLImageElement=null,
      public imageTurretBulletDam:HTMLImageElement=null,
      public imageTurretBulletMuzzle:HTMLImageElement=null,

      public hitBox:HitBox=new HitBox(0,0,imageSizeX,90),
      public hitBox2:HitBox=new HitBox(0,0,150,imageSizeY),
      public hitBox3:HitBox=new HitBox((imageSizeX-150),0,150,imageSizeY)
    ) {
      super(config);
      this.imageObj = imageObj;
      this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","posYSpeed","posXSpeed","bulletSpeed", "iLaserOrders", "iLaserOrdersChangePer"]);

      this.bulletTurret = new Turret(
        this.posX+(102),
        this.posY+(8),
        [this.imageTurretBullet],
        imageTurretBulletDam,
        null,
        101,//
        56,
        32,28, // rotation offsets
        "bullet",
        [{muzzlePosXOffset:101, muzzlePosYOffset:28}], // Muzzle offsets
        [imageTurretBulletMuzzle],
        14,//imageMuzzleSizeX
        22,//imageMuzzleSizeY
        [{bulletXOffset:101, bulletYOffset:28}],
        22,// bullet sizex
        14,
        600,
        this.bulletSpeed,
        this.bTimer,
        this.bTimerLimit,
        0,5,false
      );

      this.bulletTurret2 = new Turret(
        this.posX+(314),
        this.posY+(8),
        [this.imageTurretBullet],
        imageTurretBulletDam,
        null,
        101,//
        56,
        32,28, // rotation offsets
        "bullet",
        [{muzzlePosXOffset:101, muzzlePosYOffset:28}], // Muzzle offsets
        [imageTurretBulletMuzzle],
        14,//imageMuzzleSizeX
        22,//imageMuzzleSizeY
        [{bulletXOffset:101, bulletYOffset:28}],
        22,// bullet sizex
        14,
        600,
        this.bulletSpeed,
        this.bTimer,
        this.bTimerLimit,
        0,5,false
      );
      this.phase = PhaseLaser.PHASE_LOADING;
      this.phaseLoop = 0;
      this.phaseLoopLimit =  this.phasesLoops[this.phase];
      this.phaseCount = 0;
      this.phaseCountLimit = this.iLaserLoading.length;
      this.phaseDrawingCount = 0;

      this.currentOrder = this.iLaserOrders[this.iLaserOrdersIndex];
      this.totalHealth = this.health;
    }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

		if (this.dirYDown){
			this.posY += this.posYSpeed;
      if(this.posY > 15){
        this.dirYDown = false;
      }
		}
    // Removed up down logic as its too difficult,
    // else {
		// 	this.posY -= this.posYSpeed;
		// 	if (this.posY < -30) {
    //     this.dirYDown = true;
    //   }
		// }
    // if (this.dirXRight){
    //   this.posX += this.posXSpeed;
    //   if (this.posX > 300){
    //     this.dirXRight = false;
    //   }
    // } else {
    //   this.posX -= this.posXSpeed;
    //   if (this.posX < 10) {
    //     this.dirXRight = true;
    //   }
    // }

    ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
    if ( this.damAnaimationTimer < this.damAnaimationTimerLimit) {
      this.damAnaimationTimer++;
      if ( this.damAnaimationTimer %2 == 1) {
        ctx.drawImage(this.imageDamaged, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      }
    }
    if(levelInstance.drawHitBox()){
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
      this.hitBox2.drawBorder(this.posX+this.hitBox2.hitBoxX,this.posY+this.hitBox2.hitBoxY,this.hitBox2.hitBoxSizeX,this.hitBox2.hitBoxSizeY,ctx,"#FF0000");
      this.hitBox3.drawBorder(this.posX+this.hitBox3.hitBoxX,this.posY+this.hitBox3.hitBoxY,this.hitBox3.hitBoxSizeX,this.hitBox3.hitBoxSizeY,ctx,"#FF0000");
    }

    this.bulletTurret.update(this.posX+(102),this.posY+(8),currentPlayer,levelInstance, canvasContainer.mainCtx, canvasContainer.shadowCtx, botManagerService, bulletManagerService, playerService,( this.damAnaimationTimer %2 == 1));
    this.bulletTurret2.update(this.posX+(314),this.posY+(8),currentPlayer,levelInstance, canvasContainer.mainCtx, canvasContainer.shadowCtx, botManagerService, bulletManagerService, playerService,( this.damAnaimationTimer %2 == 1));

    this.updatePhaseLaser(currentPlayer, canvasContainer, playerService, levelInstance);
    if(this.phase == PhaseLaser.PHASE_LOADING && this.phaseCount == 0 &&  this.phaseDrawingCount == 0 && this.phaseLoop == 0) {

      this.currentOrder = this.iLaserOrders[this.iLaserOrdersIndex];
      let diff = ((this.totalHealth - this.health) - this.iLaserOrdersChangeCounter);
      if(diff > this.iLaserOrdersChangePer) {
        this.iLaserOrdersChangeCounter += this.iLaserOrdersChangePer;
        this.iLaserOrdersIndex = ((this.iLaserOrdersIndex+1) >= this.iLaserOrders.length)? 0 : this.iLaserOrdersIndex+1;
        this.currentOrder = this.iLaserOrders[this.iLaserOrdersIndex];
        //console.log(`phase shift iLaserOrdersIndex:${this.iLaserOrdersIndex}`)
        // should I reset the order in the current index?
        this.currentOrderIndex = 0;
      }
    }
  }

  updatePhaseLaser( playerObj:PlayerObj, canvasContainer:CanvasContainer,  playerService:PlayerService, levelInstance:LevelInstance) {

    let currentLaserPositions:number[] = this.currentOrder[this.currentOrderIndex];
    let currentLaserLength = currentLaserPositions.length;

    if(this.phaseDrawingCount == this.phaseDrawingCountLimit){
      this.phaseCount++; // move to the next image
      this.phaseDrawingCount = 0; // reset for the next image
    } else {
      this.phaseDrawingCount++;
      let image = null;
      if ( this.phase == PhaseLaser.PHASE_LOADING ) {
        image = this.iLaserLoading[this.phaseCount];
      } else if ( this.phase == PhaseLaser.PHASE_CHARGING ) {
        image = this.iLaserCharging[this.phaseCount];
      } else if ( this.phase == PhaseLaser.PHASE_DAMAGE ) {
        image = this.iLaserDamage[this.phaseCount];
      }
      for(let i = 0; i < currentLaserLength; i++) {
        let iX = this.iLaserLocations[currentLaserPositions[i]].x;
        let iY = this.iLaserLocations[currentLaserPositions[i]].y;
        let drawX = this.posX+iX;
        let drawY = this.posY+iY;
        canvasContainer.mainCtx.drawImage(image, 0, 0, this.imageSizeX, this.imageSizeY, drawX, drawY,this.imageSizeX, this.imageSizeY);
      }
    }

    if ( this.phaseCount == this.phaseCountLimit ) {
      this.phaseCount = 0;
      this.phaseDrawingCount = 0;
      this.phaseLoop++;
      if ( this.phaseLoop == this.phaseLoopLimit ) {
        if ( this.phase == PhaseLaser.PHASE_LOADING ) {
          this.phase = PhaseLaser.PHASE_CHARGING;
          this.phaseCountLimit = this.iLaserCharging.length;
        } else if ( this.phase == PhaseLaser.PHASE_CHARGING ) {
          this.phase = PhaseLaser.PHASE_DAMAGE;
          this.phaseCountLimit = this.iLaserDamage.length;
        } else if ( this.phase == PhaseLaser.PHASE_DAMAGE ) {
          this.phase = PhaseLaser.PHASE_LOADING;
          this.phaseCountLimit = this.iLaserLoading.length;
          // move to a new drawing location
          this.currentOrderIndex = ((this.currentOrderIndex+1) >= this.currentOrderIndexLimit)? 0 : this.currentOrderIndex+1;
        }
        this.phaseLoopLimit =  this.phasesLoops[this.phase];
        this.phaseLoop = 0;
      }
    }
    if ( this.phase == PhaseLaser.PHASE_DAMAGE ) {
      let hitty = new HitBox(162, 112, 150, 96);
      for(let i = 0; i < currentLaserLength; i++) {
        let iX = this.iLaserLocations[currentLaserPositions[i]].x;
        let iY = this.iLaserLocations[currentLaserPositions[i]].y;
        let drawX = this.posX+iX;
        let drawY = this.posY+iY;
        if ( playerObj.hasPlayerBeenHit ( {posX:drawX, posY:drawY}, hitty) ) {
          playerService.killCurrentPlayer();
        }
        if ( levelInstance.drawHitBox() ) {
          hitty.drawBorder(drawX+hitty.hitBoxX,drawY+hitty.hitBoxY,hitty.hitBoxSizeX,hitty.hitBoxSizeY,canvasContainer.mainCtx,"#FF0000");
        }
      }
    }
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
      return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox) || this.hitBox2.areCentersToClose(hitter,hitterBox,this,this.hitBox2) || this.hitBox3.areCentersToClose(hitter,hitterBox,this,this.hitBox3);
  }

  // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
  fireTracker(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
    let bullDirection:BulletDirection;
    if(levelInstance.isVertical()){

        bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 170, this.posY + 180, this.posX + 170, this.posY + 1550, this.bulletSpeed, true);
        bulletManagerService.generateBotBlazer(levelInstance, bullDirection, this.posX+170, this.posY+180);

        bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 5, this.posY + 180, this.posX + 5, this.posY + 1550, this.bulletSpeed, true);
        bulletManagerService.generateBotBlazer(levelInstance, bullDirection, this.posX+5, this.posY+180);
    } else {
        // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
        // bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
    }
	}

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
    this.health -= damage;
    this.triggerDamagedAnimation();
    if(this.health < 1){
      playerService.currentPlayer.addScore(this.score);
      botManagerService.removeBot(this,1);
      ProfileService.setProfileValue(ProfileValuesEnum.BOTKILLER_LEVEL3_MINI_BOSS1_PINCER,"true");
      levelInstance.updatePhaseCounter();
    }
  }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		if(levelInstance.isVertical() && this.getCenterY() < currentPlayer.getCenterY()){
			return true;
		} else if(!levelInstance.isVertical() && this.getCenterX() > currentPlayer.getCenterX()){
			return true;
		}
		return false;
	}

  triggerDamagedAnimation(): any {
      this.damAnaimationTimer = 1;// trigger damage animation
  }

  getCenterX():number{
      return this.posX+(this.imageSizeX/2);
  }

  getCenterY():number{
      return this.posY+(this.imageSizeY/2);
  }

  getPlayerCollisionHitBoxes(): HitBox[] {
      return [this.hitBox, this.hitBox2, this.hitBox3];
  }

  isDeathOnColision():boolean{
    return false;
  }

    /**
   * Return the current image
   */
    getDeathDetails():DeathDetails {
      return new DeathDetails(this.imageObj, this.posX, this.posY, this.imageSizeX, this.imageSizeY, this.getCurrentAngle(),this.getCenterX(), this.getCenterY(),new DeathConfig(12,24));
    }

}
