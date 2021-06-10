import { HitBox } from "./HitBox";
import { CanvasContainer } from "./CanvasContainer";
import { LevelInstance } from "../manager/level-manager.service";
import { BotManagerService } from "../manager/bot-manager.service";
import { BulletManagerService } from "../manager/bullet-manager.service";
import { PlayerService } from "../services/player.service";
import { LogicService } from "../services/logic.service";

export class BackgroundElement {
    private timeCount = 0;

    constructor(
        public posX:number=0,
        public posY:number=0,
        public imageObj:HTMLImageElement=null,
        public imageSizeX:number=24,
        public imageSizeY:number=24,
        public rotationAngle:number=0,
        public timeLimit:number = 90,
        public posXSpeed:number = 0,
        public posYSpeed:number = 1,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY),
        public imageObjDamaged:HTMLImageElement=null,
    ){

    }

    update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService) {
        let ctx = canvasContainer.bgCtx;
        this.posY += this.posYSpeed;
        this.posX += this.posXSpeed;
        LogicService.drawRotateImage(this.imageObj,ctx,this.rotationAngle,this.posX,this.posY,this.imageSizeX,this.imageSizeY,0,0,this.imageSizeX,this.imageSizeY);
        this.timeCount++;
        if(this.timeCount >= this.timeLimit){
          botManagerService.removeBGElement(this);
        }
    }

    getCenterX():number{
        return this.posX+(this.imageSizeX/2);
    }

    getCenterY():number{
        return this.posY+(this.imageSizeY/2);
    }
}
