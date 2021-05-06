import { FlyingBotImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";

export class Level3SubBoss2 extends  FlyingBotImpl {
    public phaseCounter = 0;
    public moveSpeed = 4;

    public angle:number;
    public moveDirection: BulletDirection;
    public movePositions: {x:number,y:number}[] = [
        { x: 240, y: 45 },
        { x: 140, y: 52 },
        { x: 80, y: 101 },
        { x: 58, y: 186 },
        { x: 70, y: 244 },
        { x: 104, y: 292 },
        { x: 173, y: 329 },
        { x: 261, y: 348 },
        { x: 344, y: 387 },
        { x: 394, y: 454 },
        { x: 404, y: 541 },
        { x: 337, y: 598 },
        { x: 241, y: 612 },
        { x: 135, y: 593 },
        { x: 89, y: 532 },
        { x: 108, y: 460 },
        { x: 170, y: 401 },
        { x: 244, y: 384 },
        { x: 317, y: 362 },
        { x: 381, y: 296 },
        { x: 414, y: 209 },
        { x: 402, y: 129 },
        { x: 356, y: 74 },
        { x: 295, y: 49 }
    ];

    constructor(
		public config:any={},
        public posX:number=0,
        public posY:number=0,
        public images:HTMLImageElement[]=null,
        public imageObj4Damaged: HTMLImageElement = null,
        public imageSizeX:number=118,
        public imageSizeY:number=134,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ) {
      super(config, posX, posY, imageSizeX, imageSizeY, images, [imageObj4Damaged], null, true);
      this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score","moveSpeed","bulletSpeed"]);
    }

	update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
    let currentPlayer = playerService.currentPlayer;
    let ctx = canvasContainer.mainCtx;

    let positions = this.movePositions[this.phaseCounter];
    this.moveDirection = bulletManagerService.calculateBulletDirection(this.getCenterX(), this.getCenterY(), positions.x, positions.y, this.moveSpeed, true);
    this.posX += this.moveDirection.speed * this.moveDirection.directionX;
    this.posY += this.moveDirection.speed * this.moveDirection.directionY;
    if (this.isWithin(this.getCenterX(), positions.x, 10) && this.isWithin(this.getCenterY(), positions.y, 10)){
      this.phaseCounter++;
      if( this.phaseCounter == this.movePositions.length )
        this.phaseCounter = 0;
    }


    LogicService.drawRotateImage(this.imageObj, ctx, this.moveDirection.angle, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
    this.updateDamageAnimation(ctx, this.moveDirection.angle);

    // TODO the turret
    // if the health is less than a certain value, then activate the turret
    // else just draw it in place

    if(levelInstance.drawHitBox()){
      this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
    }

    this.updateBulletTimer(levelInstance,ctx,botManagerService, bulletManagerService,currentPlayer);
    this.updateAnimation();
  }

  hasBotBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

  applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, levelInstance:LevelInstance) {
      this.health -= damage;
      this.triggerDamagedAnimation();
      if(this.health < 1){
          playerService.currentPlayer.addScore(this.score);
          botManagerService.removeBot(this,1);
    levelInstance.updatePhaseCounter();
      }
  }

	canShoot(levelInstance:LevelInstance, currentPlayer:PlayerObj){
		return true;
	}

  fireSomething(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D,bulletManagerService:BulletManagerService, currentPlayer:PlayerObj) {
    console.log("Yes dropping bombs?");
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
