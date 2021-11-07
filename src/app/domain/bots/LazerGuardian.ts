import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";
import { LazerAttack } from "./LazerAttack";

export class LazerGuardian extends BotInstanceImpl{
  public posXSpeed:number = 1.5;
  public posYSpeed:number = 1.5;
	public movedIn:boolean = false;

  public bTimer:number = 0; // bullet timer
  public bTimerLimit:number = 60;
	public firingLoading = false;
	public firingPhase2 = false;

	public bTimerLoading:number = 0;
	public bTimerLoadingLimit:number = 60;
	public loadingIndex:number = 0;

	public bTimerFiring:number = 0;
	public bTimerFiringPase2:number = 4;
	public bTimerFiringPase3:number = 20;
	public bTimerFiringLimit:number = 24;

	public firingPhasesComplete = 0;
	public firingPhasesToComplete = 1;

	public health:number=5;

  public score:number = 50;
  public drawingPhase1 = true;
  public drawingPhase2 = false;
  public drawingPhase3 = false;
  public imageObj = null;

  public imageIndex = 0;
  public drawLoop = 0;
  public drawLoopLimit = 16;

  constructor(
      public config:any={},
      public lazerAttack:LazerAttack=null,
      public posX:number=0,
      public posY:number=0,
      public imageObjArr:HTMLImageElement[]=null,
      public imageObjDamaged:HTMLImageElement[]=null,
      public imageSizeX:number=84,
      public imageSizeY:number=80,
      public hitBox:HitBox=new HitBox(4,0,imageSizeX-8,imageSizeY)
  ){
      super(config);
  this.tryConfigValues(["drawLoopLimit","bTimer","bTimerLimit","bTimerLoading","bTimerLoadingLimit","bTimerFiring","bTimerFiringPase2",
    "bTimerFiringPase3", "bTimerFiringLimit", "health", "score", "firingPhasesToComplete","posYSpeed","posXSpeed"]);
    this.imageObj = this.imageObjArr[this.imageIndex];
  }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    if(this.drawingPhase1){
      // phase in
      if(this.drawLoop < this.drawLoopLimit){
        this.drawLoop++;
      } else {
        this.drawLoop = 0;
        this.imageIndex++;
        if(this.imageIndex >= this.imageObjArr.length){
          this.drawingPhase1 = false;
          this.drawingPhase2 = true;
        } else {
          this.imageObj = this.imageObjArr[this.imageIndex];
        }
      }

    } else if(this.drawingPhase2){
      this.lazerAttack.update(this.posX+10,this.posY,levelInstance,ctx,botManagerService,bulletManagerService,playerService);
      this.firingPhasesComplete = this.lazerAttack.firingPhasesComplete;
      if(this.firingPhasesComplete >= this.firingPhasesToComplete){
        this.drawingPhase2 = false;
        this.drawingPhase3 = true;
      }
    } else if(this.drawingPhase3){
      if(this.drawLoop < this.drawLoopLimit){
        this.drawLoop++;
      } else {
        this.drawLoop = 0;
        this.imageIndex--;
        if(this.imageIndex < 0){
          this.drawingPhase3 = false;
        } else {
          this.imageObj = this.imageObjArr[this.imageIndex];
        }
      }
    } else {
      botManagerService.removeBotOOB(this);
    }
    ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);

    if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }

	}

    hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
         return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
    }

    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireTracker(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){

	}

    applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
        this.health -= damage;
        if(this.health < 1){
            playerService.currentPlayer.addScore(this.score);
            botManagerService.removeBot(this);
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

    getCenterX():number{
        return this.posX+(this.imageSizeX/2);
    }

    getCenterY():number{
        return this.posY+(this.imageSizeY/2);
    }

    getPlayerCollisionHitBoxes(): HitBox[] {
        return [this.hitBox];
    }
}
