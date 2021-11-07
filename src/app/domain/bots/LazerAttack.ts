import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { PlayerService } from "src/app/services/player.service";
import { HitBox } from "../HitBox";

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
	constructor(
    public config:any={},
    public loadingImages:HTMLImageElement[],
		public firingStartImage:HTMLImageElement,
		public firingImages:HTMLImageElement[],
		public imageFiringSizeX:number=64,
    public imageFiringSizeY:number=640,
		public beamHitBox:HitBox=new HitBox(0,0,imageFiringSizeX,imageFiringSizeY),
	){
    this.tryConfigValues(["bTimer", "bTimerLimit","bTimerLoading","bTimerLoadingLimit","firingPhasesToComplete", "mTimer", "mTimerLimit", "missileSpeed", "health", "score","posYSpeed","posXSpeed","bulletSpeed", "anaimationTimerLimit","destinationY"]);

	}

	update(posX,posY,levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    this.posX=posX;
    this.posY=posY;
    if(this.firingLoading){
			if(this.bTimerLoading < this.bTimerLoadingLimit) {
				this.bTimerLoading++;
				if(this.bTimerLoading % 3 == 0){
					this.loadingIndex++;
					if(this.loadingIndex == this.loadingImages.length )
						this.loadingIndex = 0;
				}
				ctx.drawImage(this.loadingImages[this.loadingIndex], 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, posX, posY,this.imageFiringSizeX, this.imageFiringSizeY);
			} else {
				this.firingLoading = false;
				this.firingPhase2 = true;
				this.loadingIndex = 0;
			}
		} else if(this.firingPhase2){
			if(this.bTimerFiring < this.bTimerFiringLimit) {
				this.bTimerFiring++;
				if(this.bTimerFiring < this.bTimerFiringPase2){
					ctx.drawImage(this.firingStartImage, 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, posX, posY,this.imageFiringSizeX, this.imageFiringSizeY);
				} else if(this.bTimerFiring < this.bTimerFiringPase3){
					if(this.bTimerFiring % 2 == 0){
						this.loadingIndex++;
						if(this.loadingIndex == this.firingImages.length )
							this.loadingIndex = 0;
					}
					ctx.drawImage(this.firingImages[this.loadingIndex], 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, posX, posY,this.imageFiringSizeX, this.imageFiringSizeY);
				} else if(this.bTimerFiring < this.bTimerFiringLimit){
					ctx.drawImage(this.firingStartImage, 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, posX, posY,this.imageFiringSizeX, this.imageFiringSizeY);
				}
				if(currentPlayer && currentPlayer.hasPlayerBeenHit(this,this.beamHitBox)){
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


  tryConfigValues(params){
    for(let param of params){
      if(this.config[param]){
        this[param] = this.config[param];
      }
    }
  }
}
