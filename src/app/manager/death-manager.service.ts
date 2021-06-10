import { Injectable } from '@angular/core';
import { BotInstance } from '../domain/bots/BotInstance';
import { CanvasContainer } from '../domain/CanvasContainer';
import { DeathDetails } from '../domain/DeathDetails';
import { HitBox } from '../domain/HitBox';
import { LogicService } from '../services/logic.service';
import { PlayerService } from '../services/player.service';
import { LevelInstance } from './level-manager.service';

@Injectable({
  providedIn: 'root'
})
export class DeathManagerService {
  clean() {
    this.shards = [];
  }

  shards:ShardAnimation[] = [];

  constructor() { }

  public update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, playerService: PlayerService): any {
    this.shards.forEach(element => {
      element.update(levelInstance, canvasContainer);
    });
  }

  public dynamicDeath(bot:BotInstance) {
    let dd = bot.getDeathDetails();
    if(dd != null)
      this.shards.push(new ShardAnimation(dd));
  }

}

class Direction {
  constructor(
    public directionY,
    public directionX,
    public angle = LogicService.degreeToRadian(360),
    public speed = 1) {

  }

  updateAngle(rotateClockwise: boolean) {
    if( this.angle != null) {
      if(rotateClockwise) {
        let angleDegree = LogicService.radianToDegreeFloor(this.angle);
        angleDegree = ((angleDegree+1) > 360)? 1: (angleDegree+1);
        this.angle = LogicService.degreeToRadian(angleDegree);
      } else {
        let angleDegree = LogicService.radianToDegreeFloor(this.angle);
        angleDegree = ((angleDegree-1) < 0)? 359: (angleDegree-1);
        this.angle = LogicService.degreeToRadian(angleDegree);
      }
    }
  }
}



/*
    Better solution.
    Break the bot image up into small squares. Maybe even along hitboxes? Just clip anything that overlaps.
    ~ This can be cached, it only needs to be calcualted once, on startup and the same data can be used every time.

    Now pick a random number of starting points, put one in each of the four sections + any extra randomly placed looping on the four sections.
    Then loop on the shards, each one will have a starting square.
      - pick a random square from available shard squares, and check if up,down,left,right(starting position random) is free, if it is add it to the shard.
      -- if none are free, this is landlocked, remove it from the loop of squares.
      Each shard gets to consume one more square each loop.
      - when all of a shards squares are landlocked, its finished.

    Now I should have multiple shards, which are a collection of squares.
      - MVP would draw all of the tiny squares.
      - Ideally, any squares that align and can form a clean rect should be joined into one larger square, less drawing and calcualtions.

    Now we are ready to shred and draw shards going in all directions.

    Gloss, instead of shrinking the bot shards into nothingness,
      - could we start to break it down, vanishing a random square at a time until its all gone?

    DONE
    rotate slowly
    project all from a point (Probably center, but make it configurable)
    TODO
    I want to configure a death config in the bots that can do it, so it can updated by game dev per bot instance
    this should be passed all the way down to here and used in the config, so size, growthfactor, rate of decay etc
      canvas to draw on!
    Shadow bots will need to duplicate the drawing with an offset?
  */

class ShardAnimation {
  shards:ShardSquare[][] = [];
  shardGroups:ShardGroup[]= [];
  constructor(public dd:DeathDetails) {
    let squareSize = dd.deathConfig.squareSize;
    for(let  i = 0; i < (this.dd.sizeX+squareSize-1)/squareSize; i++ ) {
      let iSize = (i*squareSize);
      this.shards[i] = [];
      for(let  j = 0; j < (this.dd.sizeY+squareSize-1)/squareSize; j++ ) {
        let jSize = (j*squareSize)
        this.shards[i][j] = new ShardSquare(i,j,iSize, jSize,squareSize,squareSize);
      }
    }

    // select the starting shardsquares
    this.selectStartingShards();
    this.growShards(dd.deathConfig.growPerLoop);
  }

  update(levelInstance: LevelInstance, canvasContainer:CanvasContainer) {
    let arr = [...this.shardGroups];
    for(let i = 0; i < arr.length; i++) {
      let shardGroup = arr[i];
      shardGroup.update(levelInstance, canvasContainer, this);
    }
  }

  removeShardGroup(shardGroup: ShardGroup) {
    this.shardGroups = this.shardGroups.filter(sg => sg != shardGroup);
  }

  selectStartingShards(totalShards:number = 8) {
    let section:SectionEnum = SectionEnum.ONE;
    for ( let i = 0; i < totalShards; i++) {
      let shard = null;
      let sxl = Math.floor(this.shards.length/2);
      let syl = Math.floor(this.shards[0].length/2);

      while(shard == null || shard.occupied){
        if ( section == SectionEnum.ONE) {
          shard = this.shards[LogicService.getRandomInt(sxl)][LogicService.getRandomInt(syl)];
          section = SectionEnum.TWO;
        } else if ( section == SectionEnum.TWO) {
          shard = this.shards[LogicService.getRandomInt(sxl)+sxl][LogicService.getRandomInt(syl)];
          section = SectionEnum.THREE;
        } else if ( section == SectionEnum.THREE) {
          shard = this.shards[LogicService.getRandomInt(sxl)][LogicService.getRandomInt(syl)+syl];
          section = SectionEnum.Four;
        } else if ( section == SectionEnum.Four) {
          shard = this.shards[LogicService.getRandomInt(sxl) + sxl][LogicService.getRandomInt(syl) + syl];
          section = SectionEnum.ONE;
        }
      }

      let shardGroup = new ShardGroup(shard, this.dd);
      this.shardGroups.push(shardGroup);
    }
  }

  growShards(growPerLoop) {
    let shatteredFully = false; // keep growing until all is consumed.
    while(!shatteredFully) {
      shatteredFully = true;
      let growableShardGroups = this.shardGroups.filter(group => !group.isShatteredFully());
      for ( let i = 0; i < growableShardGroups.length; i++) {
        let sg = growableShardGroups[i];

        let grown = 0;
        // get the growable shards, and randomly loop on them and find a new shard;
        // set paramter for how many shards can be added at once?
        let growableShards = sg.shards.filter(val => val.canGrow);
        if(growableShards.length < 1){
          sg.shattered();
          growableShardGroups.splice(i,1);
        } else {
          while(grown < growPerLoop && growableShards.length > 0) {
            shatteredFully = false;
            let index = LogicService.getRandomInt(growableShards.length);
            let growableShard = growableShards[index];

            let crackedShard = this.crackShard(growableShard);
            if( crackedShard != null ){
              grown++;
              sg.shards.push(crackedShard);
              growableShards.push(crackedShard);
              crackedShard.occupied = true;
            } else {
              growableShard.canGrow = false;
              growableShards.splice(index,1);
            }
            index = LogicService.incrementLoop(index,growableShards.length);
          }
        }
      }
    }
    this.shardGroups.forEach(sg => {if(!sg.isShatteredFully())sg.shattered()})
  }

  /**
   * Find a neigbouring shard thats not occupied, so it can be used to extend the shard group
   * @param shard
   */
  crackShard(shard:ShardSquare):ShardSquare {
    let positions:{i,j}[] = [{i:-1,j:0},{i:0,j:-1},{i:1,j:0},{i:0,j:1}]
    let index = LogicService.getRandomInt(4);
    let loop = 0;
    while(loop < 4) { // check all of the shards around this one in a random order
      loop++;
      let crackedShard = this.getShardIfValid(shard.i + positions[index].i, shard.j + positions[index].j);
      index = LogicService.incrementLoop(index,positions.length);
      if(crackedShard != null && !crackedShard.occupied){
        return crackedShard;
      }
    }
    return null;
  }

  /**
   * Get the shard is its no index OOB
   */
  getShardIfValid(tarI,tarJ) {
    if(tarI > -1 && tarI < this.shards.length) {
      if(tarJ > -1 && tarJ < this.shards[tarI].length) {
        return this.shards[tarI][tarJ];
      }
    }
    return null;
  }

}

class ShardGroup {
  private shatteredFully:boolean=false;
  shards:ShardSquare[] = [];
  direction:Direction = null;
  distanceMoved:{x:number,y:number} = null;

  updateTicksCount = 0;
  rotateClockwise:boolean = (LogicService.getRandomInt(10)>4); // completely random rotations

  // the center of the shard, so where everyshard should rotate around
  shardGroupCentre:{x:number,y:number};
  rateOfDecayCount:number = 0;

  constructor(shard:ShardSquare, public dd:DeathDetails) {
    shard.occupied = true;
    this.shards.push(shard);
  }

  update ( levelInstance: LevelInstance, canvasContainer: CanvasContainer, sA:ShardAnimation, updateTicksCountMax:number = 150) {
    if(this.distanceMoved != null) {
      this.distanceMoved.x += this.direction.speed * this.direction.directionX;
      this.distanceMoved.y += this.direction.speed * this.direction.directionY;
    } else {
      this.distanceMoved = {x:this.direction.speed * this.direction.directionX, y:this.direction.speed * this.direction.directionX}
    }
    // the shardgroup center will be the same for all of the shards
    let shardGroupCentrePlusBot = {x: this.dd.posX + this.shardGroupCentre.x + this.distanceMoved.x, y: this.dd.posY + this.shardGroupCentre.y + this.distanceMoved.y}
    this.shards.forEach(shard => {
      let posX = this.dd.posX + shard.offsetX + this.distanceMoved.x;
      let posY = this.dd.posY + shard.offsetY + this.distanceMoved.y;
      if(this.direction.angle != null) {
        LogicService.drawRotateImage(this.dd.imageObj, canvasContainer.mainCtx,
          this.direction.angle,
          posX, posY, shard.imageSizeX, shard.imageSizeY,
          shard.offsetX, shard.offsetY, shard.imageSizeX, shard.imageSizeY,
          shardGroupCentrePlusBot.x, shardGroupCentrePlusBot.y);
      } else {
        canvasContainer.mainCtx.drawImage(this.dd.imageObj, shard.offsetX, shard.offsetY, shard.imageSizeX, shard.imageSizeY, posX, posY, shard.imageSizeX, shard.imageSizeY);
      }
    });

    //Decay
    this.rateOfDecayCount = LogicService.incrementLoop(this.rateOfDecayCount, this.dd.deathConfig.decayPerLoop);
    if(this.rateOfDecayCount == 0) this.removeRandomShard();

    this.direction.updateAngle(this.rotateClockwise);
    this.updateTicksCount += 1;
    if(this.updateTicksCount > this.dd.deathConfig.updateTicksCountMax){
      sA.removeShardGroup(this);
    }
  }

  removeRandomShard() {
    this.shards.splice(LogicService.getRandomInt(this.shards.length),1);
  }

  genDirection( shardX, shardY, botX, botY, currentAngle): Direction {
    // make sure its not 0
    var directionY = shardY-botY;
    var directionX = shardX-botX;

    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new Direction(directionY,directionX,currentAngle);
  }

  /**
   * Mark the shard as Shattered and find the center, roughly
   */
  shattered(){
    this.shatteredFully = true;
    let highestAndLowestPositions:{hX:number, lX:number, hY:number,lY:number} = {
      hX:this.shards[0].offsetX,
      lX:this.shards[0].offsetX,
      hY:this.shards[0].offsetY,
      lY:this.shards[0].offsetY,
    }

    this.shards.forEach(shard => {
      highestAndLowestPositions.hX = (shard.offsetX > highestAndLowestPositions.hX)? shard.offsetX:highestAndLowestPositions.hX;
      highestAndLowestPositions.lX = (shard.offsetX < highestAndLowestPositions.lX)? shard.offsetX:highestAndLowestPositions.lX;
      highestAndLowestPositions.hY = (shard.offsetY > highestAndLowestPositions.hY)? shard.offsetY:highestAndLowestPositions.hY;
      highestAndLowestPositions.lY = (shard.offsetY < highestAndLowestPositions.lY)? shard.offsetY:highestAndLowestPositions.lY;
    });

    this.shardGroupCentre = {
      x: highestAndLowestPositions.lX + Math.floor((highestAndLowestPositions.hX - highestAndLowestPositions.lX)/2),
      y: highestAndLowestPositions.lY + Math.floor((highestAndLowestPositions.hY - highestAndLowestPositions.lY)/2)
    }
    this.direction = this.genDirection(this.dd.posX+this.shardGroupCentre.x, this.dd.posY+this.shardGroupCentre.y, this.dd.centreX, this.dd.centreY, this.dd.rotation);
  }

  isShatteredFully(){
    return this.shatteredFully;
  }

}

enum SectionEnum {
  ONE,TWO,THREE, Four
}

class ShardSquare {
  public occupied:boolean =false; // when true, its been used by a shard.
  public canGrow:boolean =true; // when true, its can still grow
  constructor(
    public i, // position in grid
    public j,
    public offsetX, // these are the offsets from original boxs posX/Y
    public offsetY,
    public imageSizeX,
    public imageSizeY) {
  }
}
