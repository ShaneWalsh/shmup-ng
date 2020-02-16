import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";

export class Level1SubBoss2 extends  BotInstanceImpl {

    public phaseCounter = -1;

    public dirXRight:boolean = true;
    public dirYDown:boolean = true;

    public imageObj:HTMLImageElement;

	// todo make these config values
	public health:number=35;
    public bulletSpeed:number = 6;
    public moveSpeed: number = 6;

	public bTimer:number = 0; // bullet timer
    public bTimerLimit:number = 30;

    public anaimationTimer:number = 0;
    public anaimationTimerLimit:number =4;

    public score:number = 10;

    public angle:number;
    public turnDirection: BulletDirection;
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
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){
        super(config);
        this.imageObj = imageObj1;
    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
        this.turnDirection = bulletManagerService.calculateBulletDirection(
            this.posX + 112, this.posY + 118, 320, 240, this.bulletSpeed, true);

        if (this.phaseCounter == -1){
            this.posY += this.moveSpeed;
            if(this.posY > -10){
                this.phaseCounter++;
            }
        } else {
            let positions = this.movePositions[this.phaseCounter];
            this.moveDirection = bulletManagerService.calculateBulletDirection(
                this.posX + 112, this.posY + 118, positions.x, positions.y, this.moveSpeed, true);
            this.posX += this.moveDirection.speed * this.moveDirection.directionX;
            this.posY += this.moveDirection.speed * this.moveDirection.directionY;
            if (this.isWithin(this.posX + 112, positions.x, 10) && this.isWithin(this.posY + 118, positions.y, 10)){
                this.phaseCounter++;
                if(this.phaseCounter == 8)
                    this.phaseCounter = 0;
            }
        } 

        this.drawRotateImage(ctx, this.turnDirection.angle, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
        //ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        if(levelInstance.drawHitBox()){
            this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
        }

        // fire weapon
		if(this.bTimer >= this.bTimerLimit){
            this.bTimer = 0;
            // draw muzzle flash before firing, this.resourcesService.getRes().get("miniboss-2-bullet")
			this.fireTracker(levelInstance,ctx,bulletManagerService,currentPlayer);
		}
		else{
			this.bTimer++;
		}
        if(this.anaimationTimer >= this.anaimationTimerLimit){
			this.anaimationTimer = 0;
			if(this.imageObj == this.imageObj1){
                this.imageObj = this.imageObj2;
            } else if (this.imageObj == this.imageObj2) {
                this.imageObj = this.imageObj3;
            } else if (this.imageObj == this.imageObj3){
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
            bullDirection = bulletManagerService.calculateBulletDirection(this.posX + 224, this.posY + 95, 320, 240, this.bulletSpeed, true);
            bulletManagerService.generateBotBlazer(levelInstance, bullDirection, this.posX+224, this.posY+95);
        } else {
            
        }
	}

    applyDamage(damage: number, botManagerService: BotManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
        this.health -= damage;
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

    getCenterX():number{
        return this.posX+(this.imageSizeX/2);
    }

    getCenterY():number{
        return this.posY+(this.imageSizeY/2);
    }

    drawRotateImage(ctx, rotation, x, y, sx, sy, lx = x, ly = y, lxs = sx, lys = sy, translateX = x + (sx / 2), translateY = y + (sy / 2)) { // l are the actual canvas positions
        // bitwise transformations to remove floating point values, canvas drawimage is faster with integers
        lx = (0.5 + lx) << 0;
        ly = (0.5 + ly) << 0;

        translateX = (0.5 + translateX) << 0;
        translateY = (0.5 + translateY) << 0;

        ctx.save();
        ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
        ctx.rotate(rotation);
        ctx.translate(translateX * -1, translateY * -1); // this moves the point of drawing and rotation to the center.
        ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY, this.imageSizeX, this.imageSizeY);

        ctx.restore();
        //drawBorder(lx,ly,lxs,lys,window.ctxNPC,"#FF0000"); // uncomment for debugging sprites
    }

    isWithin(sourceX,tarX, distance):boolean{
        let val = sourceX - tarX;
        if(val < 0)
            val = val * -1;
        return (val < distance)
    }

}
