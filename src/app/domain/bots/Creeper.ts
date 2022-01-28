import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";
import { LazerAttack } from "./LazerAttack";

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
        public lazerAttack:LazerAttack=null,
        public posX:number=0,
        public posY:number=0,
        public imageObj:HTMLImageElement=null,
        public imageObjDamaged:HTMLImageElement=null,
        public imageObjShadow:HTMLImageElement=null,
        public imageSizeX:number=64,
        public imageSizeY:number=52,
        public hitBox:HitBox=new HitBox(4,0,imageSizeX-8,imageSizeY)
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
        if(levelInstance.drawShadow() && this.imageObjShadow != null) {
          this.drawShadow(canvasContainer.shadowCtx,this.imageObjShadow,this.posX,this.posY,this.imageSizeX, this.imageSizeY);
        }
  // todo add damage calcualtion
    }
    if(levelInstance.drawHitBox()){
        this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }
    this.lazerAttack.update(this.posX,this.posY,levelInstance,ctx,botManagerService,bulletManagerService,playerService);
    this.firingPhasesComplete = this.lazerAttack.firingPhasesComplete;
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
