import { BotInstance } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";

export class Diver implements BotInstance{
    public posXSpeed:number = 2;
    public posYSpeed:number = 2;

    constructor(
        public health:number=2,
        public posX:number=0,
        public posY:number=0,
        public imageObj:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){

    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService){
        // dive!!
        this.posY += this.posYSpeed;

        if(this.posY + this.imageSizeY > (levelInstance.getMapHeight()+this.imageSizeY)){
            botManagerService.removeBot(this);
        } else {
            ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
        }
    }
}
