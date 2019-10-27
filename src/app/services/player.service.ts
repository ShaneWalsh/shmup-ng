import { Injectable } from '@angular/core';
import { KeyboardEventService, CustomKeyboardEvent } from 'src/app/services/keyboard-event.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { LevelManagerService, LevelInstance } from 'src/app/manager/level-manager.service';
import { HitBox } from 'src/app/domain/HitBox';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    public currentPlayer:PlayerObj = new PlayerObj();

    constructor(private keyboardEventService:KeyboardEventService, private levelManagerService:LevelManagerService, private resourcesService:ResourcesService) {
      keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
          if(this.levelManagerService.getNotPaused()){
              this.processKeyDown(customKeyboardEvent);
          }
      });
      keyboardEventService.getKeyUpEventSubject().subscribe(customKeyboardEvent => {
          if(this.levelManagerService.getNotPaused()){
              this.processKeyUp(customKeyboardEvent);
          }
      });
      this.currentPlayer.imageObj = this.resourcesService.getRes().get("player-1-ship");

    }

    processKeyDown(customKeyboardEvent:CustomKeyboardEvent){
        // move the ship about
        let speed = 6;
        if(customKeyboardEvent.event.keyCode == 65){ // a
            this.currentPlayer.posXSpeed = -speed;
        } else if(customKeyboardEvent.event.keyCode == 83){ // w
            this.currentPlayer.posYSpeed = +speed;
        } else if(customKeyboardEvent.event.keyCode == 68){ // d
            this.currentPlayer.posXSpeed = +speed;
        } else if(customKeyboardEvent.event.keyCode == 87){ // s
            this.currentPlayer.posYSpeed = -speed;
        }
    }

    processKeyUp(customKeyboardEvent:CustomKeyboardEvent){
        if(customKeyboardEvent.event.keyCode == 65){ // a
            this.currentPlayer.posXSpeed = 0;
        } else if(customKeyboardEvent.event.keyCode == 83){ // w
            this.currentPlayer.posYSpeed = 0;
        } else if(customKeyboardEvent.event.keyCode == 68){ // d
            this.currentPlayer.posXSpeed = 0;
        } else if(customKeyboardEvent.event.keyCode == 87){ // d
            this.currentPlayer.posYSpeed = 0;
        }
    }

}

export class PlayerObj {
    public posXSpeed:number = 0;
    public posYSpeed:number = 0;
    constructor(
        public lives:number=10,
        public posX:number=320,
        public posY:number=240,
        public imageObj:HTMLImageElement=null,
        public imageSizeX:number=90,
        public imageSizeY:number=60,
        public hitBox:HitBox=new HitBox(0,0,imageSizeX,imageSizeY)
    ){

    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D){
        this.acceleration(levelInstance);

        // draw
        ctx.drawImage(this.imageObj, 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY,this.imageSizeX, this.imageSizeY);
    }

    acceleration(levelInstance:LevelInstance){
        // this.posXSpeed += this.posXExcel;
        // this.posYSpeed += this.posYExcel;
        //
        // // acceleration extract into function?
        // if(this.posXSpeed > this.maxSpeed){this.posXSpeed =  this.maxSpeed;}
        // else if(this.posXSpeed < this.maxSpeedNeg){this.posXSpeed =  this.maxSpeedNeg;}
        //
        // if(this.posYSpeed > this.maxSpeed){this.posYSpeed =  this.maxSpeed;}
        // else if(this.posYSpeed < this.maxSpeedNeg){this.posYSpeed =  this.maxSpeedNeg;}
        //
        // apply movement
        this.posX += this.posXSpeed;
        this.posY += this.posYSpeed;

        if(this.posX + this.imageSizeX > levelInstance.getMapWidth()){
            this.posX = levelInstance.getMapWidth() -  this.imageSizeX;
        }
        else if(this.posX < 0){
            this.posX = 0;
        }

        if(this.posY + this.imageSizeY > levelInstance.getMapHeight()){
            this.posY = levelInstance.getMapHeight() -  this.imageSizeY;
        }
        else if(this.posY < 0){
            this.posY = 0;
        }
    }
}
