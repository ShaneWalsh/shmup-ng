import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";

export class Level1SubBoss extends  BotInstanceImpl {

    public dirXRight:boolean = true;
    public dirYDown:boolean = true;

    public imageObj:HTMLImageElement;

	// todo make these config values
	public health:number=35;
	public bulletSpeed:number = 6;

	public posXSpeed:number = 3;
    public posYSpeed:number = 1.5;

	public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 30;

    public anaimationTimer:number = 0;
    public anaimationTimerLimit:number =4;

    public damAnaimationTimer:number = 4;
    public damAnaimationTimerLimit:number =4;

    public score:number = 10;

    constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObj1:HTMLImageElement=null,
        public imageObj2:HTMLImageElement=null,
        public imageObjDamaged:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){
        super(config);
        this.imageObj = imageObj1;
    }

	update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
		let currentPlayer = playerService.currentPlayer;

		if (this.dirYDown){
			this.posY += this.posYSpeed;
			if(this.posY > 0){
	            this.dirYDown = false;
	        }
		} else {
			this.posY -= this.posYSpeed;
			if (this.posY < -75) {
                this.dirYDown = true;
            }
		}
        if (this.dirXRight){
            this.posX += this.posXSpeed;
            if (this.posX > 400){
                this.dirXRight = false;
            }
        } else {
            this.posX -= this.posXSpeed;
            if (this.posX < 50) {
                this.dirXRight = true;
            }
        }

        ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
          this.damAnaimationTimer++;
          if(this.damAnaimationTimer %2 == 1){
            ctx.drawImage(this.imageObjDamaged, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
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
            //bullDirection = bulletManagerService.calculateBulletDirection(this.posX+170, this.posY+200,currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true);
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 170, this.posY + 200, this.posX + 170, this.posY + 1550, this.bulletSpeed, true);
            bulletManagerService.generateBotBlazer(levelInstance, bullDirection, this.posX+170, this.posY+200);
            //bullDirection = bulletManagerService.calculateBulletDirection(this.posX+5, this.posY+200,currentPlayer.getCenterX(), currentPlayer.getCenterY(), this.bulletSpeed, true);
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 5, this.posY + 200, this.posX + 5, this.posY + 1550, this.bulletSpeed, true);
            bulletManagerService.generateBotBlazer(levelInstance, bullDirection, this.posX+5, this.posY+200);
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
        return [this.hitBox];
    }

    isDeathOnColision():boolean{
      return false;
    }
}
