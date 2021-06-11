import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";

export class Creeper extends BotInstanceImpl{
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

    constructor(
        public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObj:HTMLImageElement=null,
        public imageObjDamaged:HTMLImageElement=null,
		public loadingImages:HTMLImageElement[],
		public firingStartImage:HTMLImageElement,
		public firingImages:HTMLImageElement[],
		public imageSizeX:number=64,
		public imageSizeY:number=52,
		public imageFiringSizeX:number=64,
        public imageFiringSizeY:number=640,
		public hitBox:HitBox=new HitBox(4,0,imageSizeX-8,imageSizeY),
		public beamHitBox:HitBox=new HitBox(0,0,imageFiringSizeX,imageFiringSizeY),
    ){
        super(config);
		this.tryConfigValues(["bTimer","bTimerLimit","bTimerLoading","bTimerLoadingLimit","bTimerFiring","bTimerFiringPase2",
			"bTimerFiringPase3", "bTimerFiringLimit", "health", "score", "firingPhasesToComplete","posYSpeed","posXSpeed"]);
    }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;
		if(!this.movedIn){
			this.posY += this.posYSpeed;
			if(this.posY > 5){
				this.movedIn = true;
			}
		} else if(this.firingPhasesComplete >= this.firingPhasesToComplete){
			this.posY -= this.posYSpeed;
		}
        if(this.posY < -200){
            botManagerService.removeBotOOB(this);
        } else {
            ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
			// todo add damage calcualtion
        }
        if(levelInstance.drawHitBox()){
            this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        }

		if(this.firingLoading){
			if(this.bTimerLoading < this.bTimerLoadingLimit) {
				this.bTimerLoading++;
				if(this.bTimerLoading % 3 == 0){
					this.loadingIndex++;
					if(this.loadingIndex == this.loadingImages.length )
						this.loadingIndex = 0;
				}
				ctx.drawImage(this.loadingImages[this.loadingIndex], 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, this.posX, this.posY,this.imageFiringSizeX, this.imageFiringSizeY);
			} else {
				this.firingLoading = false;
				this.firingPhase2 = true;
				this.loadingIndex = 0;
			}
		} else if(this.firingPhase2){
			if(this.bTimerFiring < this.bTimerFiringLimit) {
				this.bTimerFiring++;
				if(this.bTimerFiring < this.bTimerFiringPase2){
					ctx.drawImage(this.firingStartImage, 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, this.posX, this.posY,this.imageFiringSizeX, this.imageFiringSizeY);
				} else if(this.bTimerFiring < this.bTimerFiringPase3){
					if(this.bTimerFiring % 2 == 0){
						this.loadingIndex++;
						if(this.loadingIndex == this.firingImages.length )
							this.loadingIndex = 0;
					}
					ctx.drawImage(this.firingImages[this.loadingIndex], 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, this.posX, this.posY,this.imageFiringSizeX, this.imageFiringSizeY);
				} else if(this.bTimerFiring < this.bTimerFiringLimit){
					ctx.drawImage(this.firingStartImage, 0, 0, this.imageFiringSizeX, this.imageFiringSizeY, this.posX, this.posY,this.imageFiringSizeX, this.imageFiringSizeY);
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
			if(this.bTimer >= this.bTimerLimit && this.canShoot(levelInstance,currentPlayer) && (this.firingPhasesComplete < this.firingPhasesToComplete)){
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
