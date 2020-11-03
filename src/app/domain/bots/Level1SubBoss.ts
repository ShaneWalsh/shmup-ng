import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";

export class Level1SubBoss extends  BotInstanceImpl {

    public dirXRight:boolean = true;
    public dirYDown:boolean = true;

    public imageObj:HTMLImageElement;
    public imageObjFlame:HTMLImageElement;

    // todo make these config values
    public health:number=200;
    public bulletSpeed:number = 6;

    public posXSpeed:number = 3;
    public posYSpeed:number = 1.5;

    public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 30;

    public anaimationTimer:number = 0;
    public anaimationTimerLimit:number =4;
    public animationIndex:number= 0;

    public animationFlamesTimer:number = 0;
    public animationFlamesTimerLimit:number =2;
    public animationFlamesIndex:number= 0;

    public damAnaimationTimer:number = 4;
    public damAnaimationTimerLimit:number =4;

    public score:number = 10;

    constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public images:HTMLImageElement[]=null,
        public imagesDamaged:HTMLImageElement[]=null,
        public imagesFlames:HTMLImageElement[]=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(72,0,50,imageSizeY),
        public hitBox2:HitBox=new HitBox(0,160,imageSizeX,30)
    ){
        super(config);
        this.imageObj = images[this.animationIndex];
        this.imageObjFlame = imagesFlames[this.animationFlamesIndex];
		this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","posYSpeed","posXSpeed","bulletSpeed", "anaimationTimerLimit","animationFlamesTimerLimit"]);
    }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

		if (this.dirYDown){
			this.posY += this.posYSpeed;
      if(this.posY > 30){
        this.dirYDown = false;
      }
		} else {
			this.posY -= this.posYSpeed;
			if (this.posY < -30) {
        this.dirYDown = true;
      }
		}
    if (this.dirXRight){
      this.posX += this.posXSpeed;
      if (this.posX > 300){
        this.dirXRight = false;
      }
    } else {
      this.posX -= this.posXSpeed;
      if (this.posX < 10) {
        this.dirXRight = true;
      }
    }

    ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
    ctx.drawImage(this.imageObjFlame, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
    if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
      this.damAnaimationTimer++;
      if(this.damAnaimationTimer %2 == 1){
        ctx.drawImage(this.imagesDamaged[this.animationIndex], 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      }
    }
    if(levelInstance.drawHitBox()){
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
      this.hitBox2.drawBorder(this.posX+this.hitBox2.hitBoxX,this.posY+this.hitBox2.hitBoxY,this.hitBox2.hitBoxSizeX,this.hitBox2.hitBoxSizeY,ctx,"#FF0000");
    }

        // fire weapon
		if(this.bTimer >= this.bTimerLimit && this.canShoot(levelInstance,currentPlayer)){
			this.bTimer = 0;
			this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
		} else{
			this.bTimer++;
		}
    if(this.anaimationTimer >= this.anaimationTimerLimit){
      this.anaimationTimer = 0;
      this.animationIndex = (this.animationIndex +1 >= this.images.length)?0:this.animationIndex +1;
			this.imageObj = this.images[this.animationIndex];
		} else{
			this.anaimationTimer++;
    }

    if(this.animationFlamesTimer >= this.animationFlamesTimerLimit){
      this.animationFlamesTimer = 0;
      this.animationFlamesIndex = (this.animationFlamesIndex +1 >= this.imagesFlames.length)?0:this.animationFlamesIndex +1;
			this.imageObjFlame = this.imagesFlames[this.animationFlamesIndex];
		} else{
			this.animationFlamesTimer++;
		}
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
      return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox) || this.hitBox2.areCentersToClose(hitter,hitterBox,this,this.hitBox2);
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

    applyDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
        this.health -= damage;
        this.triggerDamagedAnimation();
        if(this.health < 1){
            playerService.currentPlayer.addScore(this.score);
            botManagerService.removeBot(this,1);
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
      return [this.hitBox, this.hitBox2];
  }

  isDeathOnColision():boolean{
    return false;
  }
}
