import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";

export class Level1SubBoss2 extends  BotInstanceImpl {
    public phaseCounter = -1;

    public dirXRight:boolean = true;
    public dirYDown:boolean = true;

    public imageObj:HTMLImageElement;

	// todo make these config values
	public health:number=150;
    public bulletSpeed:number = 6; // 6
    public moveSpeed: number = 5; // 5

	public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 20; // 30

    public anaimationTimer:number = 0;
    public anaimationTimerLimit:number =4;

	public damAnaimationTimer:number = 8;
	public damAnaimationTimerLimit:number =8;

    public score:number = 200;

    public angle:number;
    public turnDirection: BulletDirection;
    public rotationCordsCenter: { x: number, y: number };
    public moveDirection: BulletDirection;
    public movePositions: {x:number,y:number}[] = [
        { x: 540, y: 120 },
        { x: 600, y: 240 },
        { x: 540, y: 400 },
        { x: 320, y: 440 },
        { x: 120, y: 400 },
        { x: 40, y: 240 },
        { x: 120, y: 120 },
        { x: 320, y: 40 }
    ];

    constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public imageObj1: HTMLImageElement = null,
        public imageObj2: HTMLImageElement = null,
        public imageObj3: HTMLImageElement = null,
        public imageObj4Damaged: HTMLImageElement = null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,50,50)
    ){
        super(config);
        this.imageObj = imageObj2;
		this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","moveSpeed","bulletSpeed"]);
    }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;
		if (this.phaseCounter == -1){
			this.posY += this.moveSpeed;
			if(this.posY > -10){
				this.phaseCounter++;
			}
		} else {
			let positions = this.movePositions[this.phaseCounter];
			this.moveDirection = bulletManagerService.calculateBulletDirection(this.posX + 112, this.posY + 118, positions.x, positions.y, this.moveSpeed, true);
			this.posX += this.moveDirection.speed * this.moveDirection.directionX;
			this.posY += this.moveDirection.speed * this.moveDirection.directionY;
			if (this.isWithin(this.posX + 112, positions.x, 10) && this.isWithin(this.posY + 118, positions.y, 10)){
				this.phaseCounter++;
				if(this.phaseCounter == 8)
				this.phaseCounter = 0;
			}
		}
			this.turnDirection = bulletManagerService.calculateBulletDirection(
			this.posX + 112, this.posY + 118, 320, 240, this.bulletSpeed, true);

			//    28 44
			this.rotationCordsCenter = LogicService.pointAfterRotation(this.posX + 112, this.posY + 118,this.posX + 236, this.posY + 95, this.turnDirection.angle)

			this.drawRotateImage(this.imageObj, ctx, this.turnDirection.angle, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
			if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
				this.damAnaimationTimer++;
				if(this.damAnaimationTimer %2 == 1){
					this.drawRotateImage(this.imageObj4Damaged, ctx, this.turnDirection.angle, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
				}
			}
			if(levelInstance.drawHitBox()){
				this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
			}

        // fire weapon
			if(this.bTimer >= this.bTimerLimit){
				this.bTimer = 0;
				this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
			} else {
				this.bTimer++;
				if (this.bTimer >= (this.bTimerLimit-5)){
					// todo get this position calc right, might need its own center rotation
					this.drawRotateImage(this.imageObj1, ctx, this.turnDirection.angle, this.rotationCordsCenter.x - 14, this.rotationCordsCenter.y - 22, 28, 44);
				}
			}
			if(this.anaimationTimer >= this.anaimationTimerLimit){
				this.anaimationTimer = 0;
				if (this.imageObj == this.imageObj2) {
					this.imageObj = this.imageObj3;
				} else if (this.imageObj == this.imageObj3){
					this.imageObj = this.imageObj2;
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
            // this.hitBox.drawBorder(cords.x, cords.y, 5, 5, ctx, "#FFFF00");
            bullDirection = bulletManagerService.calculateBulletDirection(this.rotationCordsCenter.x, this.rotationCordsCenter.y, 320, 240, this.bulletSpeed, true);
            bulletManagerService.generateMuzzleBlazer(levelInstance, bullDirection, this.rotationCordsCenter.x, this.rotationCordsCenter.y);
        } else {

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

	triggerDamagedAnimation(): any {
        this.damAnaimationTimer = 1;// trigger damage animation
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

    drawRotateImage(imageObj, ctx, rotation, x, y, sx, sy, lx = x, ly = y, lxs = sx, lys = sy, translateX = x + (sx / 2), translateY = y + (sy / 2)) { // l are the actual canvas positions
        // bitwise transformations to remove floating point values, canvas drawimage is faster with integers
        lx = (0.5 + lx) << 0;
        ly = (0.5 + ly) << 0;

        translateX = (0.5 + translateX) << 0;
        translateY = (0.5 + translateY) << 0;

        ctx.save();
        ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
        ctx.rotate(rotation);
        ctx.translate(translateX * -1, translateY * -1); // this moves the point of drawing and rotation to the center.
        ctx.drawImage(imageObj, 0, 0, sx, sy, x, y, sx, sy);

        ctx.restore();
    }

    isWithin(sourceX,tarX, distance):boolean{
        let val = sourceX - tarX;
        if(val < 0)
            val = val * -1;
        return (val < distance)
    }

    getPlayerCollisionHitBoxes(): HitBox[] {
        return [this.hitBox];
    }

    isDeathOnColision():boolean{
      return false;
    }
}
