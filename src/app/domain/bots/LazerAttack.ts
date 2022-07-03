import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HardRotationAngle, LogicService } from "src/app/services/logic.service";
import { PlayerService } from "src/app/services/player.service";
import { HitBox } from "../HitBox";

export enum LazerSide {
	TOP="TOP",
	LEFT="LEFT",
	RIGHT="RIGHT"
}

export class LazerAttack {
  public posX:number=0;
  public posY:number=0;

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
  public side:string = LazerSide.TOP;

	constructor(
    public config:any={},
    public loadingImages:HTMLImageElement[],
		public firingStartImage:HTMLImageElement,
		public firingImages:HTMLImageElement[],
		public imageFiringSizeX:number=64,
    public imageFiringSizeY:number=640
	){
    this.tryConfigValues(["bTimer", "bTimerLimit","bTimerLoading","bTimerLoadingLimit","firingPhasesToComplete", "mTimer", "mTimerLimit", "missileSpeed", "health", "score","posYSpeed","posXSpeed","bulletSpeed", "anaimationTimerLimit","destinationY"]);

	}

	update(posX,posY,levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    this.posX=posX;
    this.posY=posY;
    if(this.firingLoading) {
			if(this.bTimerLoading < this.bTimerLoadingLimit) {
				this.bTimerLoading++;
				if(this.bTimerLoading % 3 == 0){
					this.loadingIndex++;
					if(this.loadingIndex == this.loadingImages.length )
						this.loadingIndex = 0;
				}
				this.drawImageRotate(this.loadingImages[this.loadingIndex],posX,posY,ctx);
			} else {
				this.firingLoading = false;
				this.firingPhase2 = true;
				this.loadingIndex = 0;
			}
		} else if(this.firingPhase2){
			if(this.bTimerFiring < this.bTimerFiringLimit) {
				this.bTimerFiring++;
				if(this.bTimerFiring < this.bTimerFiringPase2){
					this.drawImageRotate(this.firingStartImage,posX,posY,ctx);
				} else if(this.bTimerFiring < this.bTimerFiringPase3){
					if(this.bTimerFiring % 2 == 0){
						this.loadingIndex++;
						if(this.loadingIndex == this.firingImages.length )
							this.loadingIndex = 0;
					}
					this.drawImageRotate(this.firingImages[this.loadingIndex],posX,posY,ctx);
				} else if(this.bTimerFiring < this.bTimerFiringLimit){
					this.drawImageRotate(this.firingStartImage,posX,posY,ctx);
				}
				if(currentPlayer && currentPlayer.hasPlayerBeenHit(this,this.getBeamHitBox(this.posX,this.posY))) {
          playerService.killCurrentPlayer();
        }
			} else {
				this.loadingIndex = 0;
				this.firingPhase2 = false;
				this.firingPhasesComplete++;
			}
		} else { // fire weapon
			if(this.bTimer >= this.bTimerLimit && (this.firingPhasesComplete < this.firingPhasesToComplete)){
				this.bTimerLoading = 0;
				this.bTimerFiring = 0;
				this.loadingIndex = 0;
				this.firingLoading = true;
			}
			else {
				this.bTimer++;
			}
		}

  }

  drawImageRotate(image:any, posX,posY,ctx) {
    if(this.side === LazerSide.TOP){
      ctx.drawImage(image, 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, posX, posY,this.imageFiringSizeX, this.imageFiringSizeY);
    } else { // left or right
      LogicService.drawRotateImage(image,ctx,this.getRotationAngle(),this.posX,this.posY,this.imageFiringSizeX,this.imageFiringSizeY,0,0,this.imageFiringSizeX,this.imageFiringSizeY,this.posX+(this.imageFiringSizeX/2),this.posY+(this.imageFiringSizeX/2));
      // ctx.drawImage(image, 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, posX, posY,this.imageFiringSizeX, this.imageFiringSizeY);
    }
  }

  getRotationAngle(){
    if(this.side === LazerSide.LEFT){
      return HardRotationAngle.UP
    } else if(this.side === LazerSide.RIGHT){ // left or right
      return HardRotationAngle.DOWN
    }
  }

  getBeamHitBox(posX, posY):HitBox {
    if(this.side === LazerSide.TOP) {
      return new HitBox( 0, 0, this.imageFiringSizeX, this.imageFiringSizeY );
    } else if(this.side === LazerSide.RIGHT) { // left or right
      return new HitBox( 0-posX, 0, this.imageFiringSizeY, this.imageFiringSizeX );
    } else if(this.side === LazerSide.LEFT) {
      return new HitBox( 0, 0, this.imageFiringSizeY, this.imageFiringSizeX );
    }
  }

  tryConfigValues(params){
    for(let param of params){
      if(this.config[param]){
        this[param] = this.config[param];
      }
    }
  }
}
