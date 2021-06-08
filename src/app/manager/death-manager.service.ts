import { Injectable } from '@angular/core';
import { BotInstance } from '../domain/bots/BotInstance';
import { CanvasContainer } from '../domain/CanvasContainer';
import { DeathDetails } from '../domain/DeathDetails';
import { LogicService } from '../services/logic.service';
import { PlayerService } from '../services/player.service';
import { LevelInstance } from './level-manager.service';

@Injectable({
  providedIn: 'root'
})
export class DeathManagerService {

  deaths:DeathAnimation[] = [];

  constructor() { }

  public update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, playerService: PlayerService): any {
    this.deaths.forEach(element => {
      element.update(levelInstance, canvasContainer);
    });
  }

  public dynamicDeath(bot:BotInstance){
    this.deaths.push(new DeathAnimation(bot));
  }

}

class DeathAnimation {

  fragments:Fragment[] = [];
  deathDetails: DeathDetails;

  constructor(bot:BotInstance) {
    this.deathDetails = bot.getDeathDetails();
    let dd = this.deathDetails;
    this.fragments.push(new Fragment(dd.posX,           dd.posY,           0,           0,            dd.sizeX/2,dd.sizeY/2,dd.rotation,  {x:dd.posX-20,y:dd.posY-20} ));
    this.fragments.push(new Fragment(dd.posX,           dd.posY+dd.sizeY/2,0,  dd.sizeY/2,   dd.sizeX/2,dd.sizeY/2,dd.rotation,           {x:dd.posX-20,y:dd.posY+dd.sizeY/2+20} ));

    this.fragments.push(new Fragment(dd.posX+dd.sizeX/2,dd.posY,           dd.sizeX/2,  0,            dd.sizeX/2,dd.sizeY/2,dd.rotation, {x:dd.posX+dd.sizeX/2+20,y:dd.posY-20}));
    this.fragments.push(new Fragment(dd.posX+dd.sizeX/2,dd.posY+dd.sizeY/2,dd.sizeX/2,  dd.sizeY/2,   dd.sizeX/2,dd.sizeY/2,dd.rotation, {x:dd.posX+dd.sizeX/2+20,y:dd.posY+dd.sizeY/2+20}));
  }

  update(levelInstance: LevelInstance, canvasContainer:CanvasContainer) {
    this.fragments.forEach(fragment => {
      fragment.posX += fragment.dir.speed * fragment.dir.directionX;
      fragment.posY += fragment.dir.speed * fragment.dir.directionY;
      if(fragment.rotation != null){
        //LogicService.drawRotateImage(damImage,ctx,angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
      } else {
        canvasContainer.mainCtx.drawImage(this.deathDetails.imageObj, fragment.startX, fragment.startY, fragment.imageSizeX, fragment.imageSizeY, fragment.posX, fragment.posY,fragment.imageSizeX, fragment.imageSizeY);
      }
    });
  }
}

class Fragment {
  public dir:Direction;

  constructor(
    public posX,
    public posY,
    public startX,
    public startY,
    public imageSizeX,
    public imageSizeY,
    public rotation,
    public moveAwayFrom:{x:number,y:number} = null) {
      if ( moveAwayFrom != null ) {
        this.dir = this.genRandomDirection(moveAwayFrom.x,moveAwayFrom.y);
      }
      if(this.dir == null) {
        this.dir = this.genRandomDirection();
      }
  }

  genRandomDirection(targetX:number = this.posY + Math.floor((Math.random()*10)-5) ,targetY:number = this.posX + Math.floor((Math.random()*10)-5)): Direction {
    // make sure its not 0
    var directionY = targetY-this.posY;
    var directionX = targetX-this.posX;
    var angle = Math.atan2(directionY,directionX); // bullet angle
    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new Direction(directionY,directionX,angle);
  }

}

class Direction {
  constructor(
    public directionY,
    public directionX,
    public angle,
    public speed = 5) {

  }
}
