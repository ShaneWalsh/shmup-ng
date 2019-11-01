import { BotInstance } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj } from "src/app/services/player.service";

export class Diver implements BotInstance{

    public posXSpeed:number = 2;
    public posYSpeed:number = 2;

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 30;


    constructor(
        public health:number=3,
        public posX:number=0,
        public posY:number=0,
        public imageObj:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(12,0,imageSizeX-24,imageSizeY),
        public hitBox2:HitBox=new HitBox(0,5,imageSizeX,25)
    ){

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
            this.hitBox2.drawBorder(this.posX+this.hitBox2.hitBoxX,this.posY+this.hitBox2.hitBoxY,this.hitBox2.hitBoxSizeX,this.hitBox2.hitBoxSizeY,ctx,"#FF0000");
        }

        // fire weapon
		if(this.bTimer >= this.bTimerLimit){
			this.bTimer = 0;
			this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
		}
		else{
			this.bTimer++;
		}
    }

    hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
         return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox) || this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox2);
    }

    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireTracker(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
        let bullDirection:BulletDirection;
        if(levelInstance.isVertical()){
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, currentPlayer.posX, currentPlayer.posY, 6, currentPlayer);
            // todo gen two bullets, or just one?
            bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, this.posX+30, this.posY);
        } else {
            // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
            // bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
        }
	}

    applyDamage(damage: number, botManagerService: BotManagerService) {
        this.health -= damage;
        if(this.health < 1){
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
