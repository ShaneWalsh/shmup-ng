import { BotInstance } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";

export class Fighter implements BotInstance{

    public posXSpeed:number = 2;
    public posYSpeed:number = 2;

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 20;

    public anaimationTimer:number = 0;
    public anaimationTimerLimit:number =4;

    public imageObj:HTMLImageElement;

    public score:number = 10;

    constructor(
        public health:number=1,
        public posX:number=0,
        public posY:number=0,
        public imageObj1:HTMLImageElement=null,
        public imageObj2:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){
        this.imageObj = imageObj1;
    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
        this.posY += this.posYSpeed;
        if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)){
            botManagerService.removeBot(this);
        } else {
            ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        }
        if(levelInstance.drawHitBox()){
            this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        }

        // fire weapon
		if(this.bTimer >= this.bTimerLimit){
			this.bTimer = 0;
			this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
		}
		else{
			this.bTimer++;
		}
        if(this.anaimationTimer >= this.anaimationTimerLimit){
			this.anaimationTimer = 0;
			if(this.imageObj == this.imageObj1){
                this.imageObj = this.imageObj2;
            } else {
                this.imageObj = this.imageObj1;
            }
		}
		else{
			this.anaimationTimer++;
		}
    }

    hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
         return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
    }

    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireTracker(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
        let bullDirection:BulletDirection;
        if(levelInstance.isVertical()){
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX+17, this.posY+40,currentPlayer.getCenterX(), currentPlayer.getCenterY(), 6, true);
            bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, this.posX+17, this.posY+40, -1);
        } else {
            // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
            // bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
        }
	}

    applyDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService) {
        this.health -= damage;
        if(this.health < 1){
            playerService.currentPlayer.addScore(this.score);
            botManagerService.removeBot(this);
        }
    }

    getCenterX():number{
        return this.posX+(this.imageSizeX/2);
    }

    getCenterY():number{
        return this.posY+(this.imageSizeY/2);
    }
}
