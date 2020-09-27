import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";
import { HitBox } from "../HitBox";
import { ShieldBot } from "./ShieldBotInterface";

export class Shield {
  public lifeSpanUsed:number= 0;

  public animationTimer:number = 0;
  public animationTimerLimit:number =4;
  public animationIndex:number= 0;

  public imageObj:HTMLImageElement=null;

  constructor(
    public config:any={},
    public posX:number=0,
    public posY:number=0,
    public animationImages:HTMLImageElement[] = [],
    public imageSizeX:number=90,
    public imageSizeY:number=60,
    public shieldBot:ShieldBot=null,
    public lifeSpanLimit:number = 150, // 2+1/2 seconds.
    public goodShield:boolean=true,
    public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY),
  ) {
    this.imageObj = animationImages[0];
  }

  update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
    if(this.lifeSpanUsed > this.lifeSpanLimit){
      bulletManagerService.removeShield(this);
    } else if(this.shieldBot) {
      this.posX = this.shieldBot.getShieldX()-(this.imageSizeX/2)
      this.posY = this.shieldBot.getShieldY()-(this.imageSizeY/2)
      canvasContainer.mainCtx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
      this.updateAnimation();
    }
    this.lifeSpanUsed++;
  }

  updateAnimation(){
    if(this.animationTimer >= this.animationTimerLimit) {
      this.animationTimer = 0;
      this.animationIndex++;
      if(this.animationIndex >= this.animationImages.length) {
        this.animationIndex = 0;
      }
      this.imageObj = this.animationImages[this.animationIndex];
    } else {
      this.animationTimer++;
    }
  }

  hasShieldBeenHit(hitter:any,hitterBox:HitBox):boolean {
    return this.hitBox.areCentersToClose(hitter,hitterBox,this,this.hitBox);
  }

}
