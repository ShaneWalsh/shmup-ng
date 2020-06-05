import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";

export class Level1Boss1 extends  BotInstanceImpl {
  public phaseCounter = -1;

  // todo make these config values
  public health:number=35;
  public bulletSpeed:number = 6; // 6
  public moveSpeed: number = 5; // 5

  public bTimer:number = 0; // bullet timer
  public bTimerLimit:number = 20; // 30

  public anaimationTimer:number = 0;
  public anaimationTimerLimit:number =4;

  public damAnaimationTimer:number = 8;
  public damAnaimationTimerLimit:number =8;

  public score:number = 10;

  public angle:number;

  constructor(
    public config:any={},
    public posX:number=0,
    public posY:number=0,
    public imageObjWeakpoint: HTMLImageElement = null,
    public imageObjArmor: HTMLImageElement = null,
    public imageSizeX:number=90,
    public imageSizeY:number=60,
    public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
  ){
    super(config);
  }

  update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService, ) {
    let currentPlayer = playerService.currentPlayer;

        ctx.drawImage(this.imageObjArmor, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        if(this.damAnaimationTimer < this.damAnaimationTimerLimit){
          this.damAnaimationTimer++;
          // if(this.damAnaimationTimer %2 == 1){
          // 	this.drawRotateImage(this.imageObj4Damaged, ctx, this.turnDirection.angle, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
          // }
        }
        //ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        if(levelInstance.drawHitBox()){
          this.hitBox.drawBorder(this.posX+this.hitBox.hitBoxX,this.posY+this.hitBox.hitBoxY,this.hitBox.hitBoxSizeX,this.hitBox.hitBoxSizeY,ctx,"#FF0000");
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
          //bullDirection = bulletManagerService.calculateBulletDirection(this.rotationCordsCenter.x - 18, this.rotationCordsCenter.y-10, 320, 240, this.bulletSpeed, true);
          //bulletManagerService.generateMuzzleBlazer(levelInstance, bullDirection, this.rotationCordsCenter.x - 18, this.rotationCordsCenter.y-10);
        } else {

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

      isWithin(sourceX,tarX, distance):boolean{
        let val = sourceX - tarX;
        if(val < 0)
        val = val * -1;
        return (val < distance)
      }

      getPlayerCollisionHitBox(): HitBox {
        return this.hitBox;
      }
    }
