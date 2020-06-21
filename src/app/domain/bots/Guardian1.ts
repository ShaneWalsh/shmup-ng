import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";

export class Guardian1 extends BotInstanceImpl{
	public bulletSpeed:number = 3;
    public posXSpeed:number = 1.5;
    public posYSpeed:number = 1.5;

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 80;
	public health:number=30;

	public damAnaimationTimer:number = 8;
	public damAnaimationTimerLimit:number =8;

    public score:number = 80;
	public angleDirection:BulletDirection;
    constructor(
        public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObj:HTMLImageElement=null,
        public imageObjDamaged:HTMLImageElement=null,
        public imageSizeX:number=92,
        public imageSizeY:number=78,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX-10,imageSizeY-10),
		public targetX:number=posX,
		public targetY:number=posY+300
    ){
        super(config);
		this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","targetX","targetY","posXSpeed","posYSpeed","bulletSpeed"]);
    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
		let currentPlayer = playerService.currentPlayer;
		this.angleDirection = bulletManagerService.calculateBulletDirection(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, currentPlayer);

		if(this.posY < (this.targetY-3) || this.posY > (this.targetY+3)){
			this.posY += (this.posY < (this.targetY-3) )? this.posYSpeed:(this.posYSpeed * -1);
		}
		if(this.posX < (this.targetX-3) || this.posX > (this.targetX+3)){
			this.posX += (this.posX < (this.targetX-3) )? this.posXSpeed:(this.posXSpeed * -1);
		}

		// just to calcualte the angle :/
		LogicService.drawRotateImage(this.imageObj,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
		if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
			this.damAnaimationTimer++;
			if(this.damAnaimationTimer %2 == 1){
				LogicService.drawRotateImage(this.imageObjDamaged,ctx,this.angleDirection.angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
				//ctx.drawImage(this.imageObjDamaged, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
			}
		}

        if(levelInstance.drawHitBox()){
            this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        }

        // fire weapon
		if(this.bTimer >= this.bTimerLimit && this.canShoot(levelInstance,currentPlayer)){
			this.bTimer = 0;
			this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
		}
		else{
			this.bTimer++;
		}
    }

    hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
         return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox)
    }

    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireTracker(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj){
        let bullDirection:BulletDirection;
        if(levelInstance.isVertical()){
			let cords :{x:number,y:number} = LogicService.pointAfterRotation(this.posX+(this.imageSizeX/2), this.posY+(this.imageSizeY/2), this.posX+92, this.posY+45, this.angleDirection.angle)
            // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, this.posX, (this.posY+50), 6);
            // bulletManagerService.generateBotBlazer(levelInstance, bullDirection, (this.posX+16), (this.posY+40));

            bullDirection = bulletManagerService.calculateBulletDirection(cords.x, cords.y, currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true, null);
            bulletManagerService.generateBotTrackerBlob(levelInstance, bullDirection, cords.x, cords.y, 500);
        } else {
            // bullDirection = bulletManagerService.calculateBulletDirection(this.posX, this.posY, (this.posX+50), this.posY, 6);
            // bulletManagerService.generatePlayerLazer(levelInstance, bullDirection, this.posX, this.posY);
        }
	}

    applyDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
        this.health -= damage;
				this.triggerDamagedAnimation();
        if(this.health < 1){
            playerService.currentPlayer.addScore(this.score);
            botManagerService.removeBot(this);
        }
    }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		return true;
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

		triggerDamagedAnimation(): any {
			if(this.imageObjDamaged != null){
				this.damAnaimationTimer = 1;// trigger damage animation
			}
		}
}
