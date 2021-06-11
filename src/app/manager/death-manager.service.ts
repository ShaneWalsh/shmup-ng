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
    let arr = [...this.shards];
    for(let i = 0; i < arr.length; i++) {
      let shardAnimation = arr[i];
      shardAnimation.update(levelInstance, canvasContainer);
    }
  }

  public dynamicDeath(bot:BotInstance) {
    let dd = bot.getDeathDetails();
    if(dd != null)
      this.shards.push(new ShardAnimation(dd));
  }

  public addDynamicDeath(dd:DeathDetails) {
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
        let angleDegree = LogicService.radianToDegree(this.angle);
        angleDegree = ((angleDegree+1) > 360)? 1: (angleDegree+1);
        this.angle = LogicService.degreeToRadian(angleDegree);
      } else {
        let angleDegree = LogicService.radianToDegree(this.angle);
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
        this.shards[i][j] = new ShardSquare( i, j, dd.posX+iSize, dd.posY+jSize, iSize, jSize, squareSize, squareSize);
      }
    }

    // select the starting shardsquares
    this.selectStartingShards();
    this.growShards(dd.deathConfig.growPerLoop);
  }

  update(levelInstance: LevelInstance, canvasContainer:CanvasContainer) {
    let arr = [...this.shardGroups];
    if(arr.length > 0) {
      for(let i = 0; i < arr.length; i++) {
        let shardGroup = arr[i];
        shardGroup.update(levelInstance, canvasContainer, this);
      }
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

      let shardGroup = (this.dd.rotation != null && this.dd.rotation != 0)? new ShardGroupWithRotation(shard, this.dd) : new ShardGroup(shard, this.dd);
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
  highestAndLowestPositions:{hX:number, lX:number, hY:number,lY:number};
  rateOfDecayCount:number = 0;

  constructor(shard:ShardSquare, public dd:DeathDetails) {
    if(shard != null ){
      shard.occupied = true;
      this.shards.push(shard);
    }
  }

  update ( levelInstance: LevelInstance, canvasContainer: CanvasContainer, sA:ShardAnimation, updateTicksCountMax:number = 150) {
    if(this.distanceMoved != null) {
      this.distanceMoved.x += this.direction.speed * this.direction.directionX;
      this.distanceMoved.y += this.direction.speed * this.direction.directionY;
    } else {
      this.distanceMoved = {x:this.direction.speed * this.direction.directionX, y:this.direction.speed * this.direction.directionY}
    }
    // the shardgroup center will be the same for all of the shards
    let shardGroupCentrePlusBot = {x: this.shardGroupCentre.x + this.distanceMoved.x, y: this.shardGroupCentre.y + this.distanceMoved.y}

    // var randomColor = "#" + ((1<<24)*Math.random() | 0).toString(16)
    // LogicService.drawBorder(this.highestAndLowestPositions.lX, this.highestAndLowestPositions.lY,
    //   (this.highestAndLowestPositions.hX - this.highestAndLowestPositions.lX),
    //   (this.highestAndLowestPositions.hY - this.highestAndLowestPositions.lY),
    //   canvasContainer.topCtx, randomColor);
    // LogicService.drawBorder(shardGroupCentrePlusBot.x-4, shardGroupCentrePlusBot.y-4,8,8,
    //     canvasContainer.topCtx, randomColor);

    let arr = [...this.shards];
    for(let i = 0; i < arr.length; i++) {
      let shard = arr[i];
      let posX = shard.posX + this.distanceMoved.x;
      let posY = shard.posY + this.distanceMoved.y;
      if( this.direction.angle != null && this.direction.angle != 0 ) {
        LogicService.drawRotateImage(this.dd.imageObj, canvasContainer.mainCtx,
          this.direction.angle,
          posX, posY, shard.imageSizeX, shard.imageSizeY,
          shard.offsetX, shard.offsetY, shard.imageSizeX, shard.imageSizeY,
          shardGroupCentrePlusBot.x, shardGroupCentrePlusBot.y);
      } else {
        canvasContainer.mainCtx.drawImage(this.dd.imageObj, shard.offsetX, shard.offsetY, shard.imageSizeX, shard.imageSizeY, posX, posY, shard.imageSizeX, shard.imageSizeY);
      }
    }

    //Decay
    this.rateOfDecayCount = LogicService.incrementLoop(this.rateOfDecayCount, this.dd.deathConfig.decayPerLoop);
    if(this.rateOfDecayCount == 0) this.removeRandomShard();

    this.direction.updateAngle(this.rotateClockwise);
    this.updateTicksCount += 1;
    if( (this.updateTicksCount > this.dd.deathConfig.updateTicksCountMax) || this.shards.length < 1){
      sA.removeShardGroup(this);
    }
  }

  removeRandomShard() {
    this.shards.splice(LogicService.getRandomInt(this.shards.length),1);
  }

  genDirection( shardX, shardY, botX, botY, currentAngle, speed): Direction {
    // make sure its not 0
    var directionY = shardY-botY;
    var directionX = shardX-botX;

    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new Direction(directionY,directionX,currentAngle, speed);
  }

  /**
   * Mark the shard as Shattered and find the center, roughly
   */
  shattered(){
    this.shatteredFully = true;

    let rotation = this.dd.rotation;
    this.highestAndLowestPositions = {
      hX:this.shards[0].posX,
      lX:this.shards[0].posX,
      hY:this.shards[0].posY,
      lY:this.shards[0].posY,
    }

    this.shards.forEach(shard => {
      this.highestAndLowestPositions.hX = (shard.posX > this.highestAndLowestPositions.hX)? shard.posX:this.highestAndLowestPositions.hX;
      this.highestAndLowestPositions.lX = (shard.posX < this.highestAndLowestPositions.lX)? shard.posX:this.highestAndLowestPositions.lX;
      this.highestAndLowestPositions.hY = (shard.posY > this.highestAndLowestPositions.hY)? shard.posY:this.highestAndLowestPositions.hY;
      this.highestAndLowestPositions.lY = (shard.posY < this.highestAndLowestPositions.lY)? shard.posY:this.highestAndLowestPositions.lY;
    });

    this.shardGroupCentre = {
      x: this.highestAndLowestPositions.lX + Math.floor((this.highestAndLowestPositions.hX - this.highestAndLowestPositions.lX)/2),
      y: this.highestAndLowestPositions.lY + Math.floor((this.highestAndLowestPositions.hY - this.highestAndLowestPositions.lY)/2)
    }
    this.direction = this.genDirection(this.shardGroupCentre.x, this.shardGroupCentre.y, this.dd.centreX, this.dd.centreY, rotation, this.dd.deathConfig.speed);
  }

  isShatteredFully(){
    return this.shatteredFully;
  }

}

class ShardGroupWithRotation extends ShardGroup {

  // this is required for rotated images, in order to maintin the correct orentiation
  originalBotCentre:{x:number,y:number} = null;

  constructor(shard:ShardSquare, dd:DeathDetails) {
    super(shard,dd);
    this.originalBotCentre = {x:dd.centreX, y:dd.centreY};
  }

  // because the angle is > 0 then this is not going to be an easy rotation.
    // It can work, but this whole group will have to remember the original centerX+Y
      // Draw Loop
        //1. Move the Shard + original bot CenterX+Y by distance
        //2.  Draw the shards, rotate them around the bot CenterX+Y ((original bot CenterX+Y moved by distance))
  update ( levelInstance: LevelInstance, canvasContainer: CanvasContainer, sA:ShardAnimation, updateTicksCountMax:number = 150) {
    if(this.distanceMoved == null) {
      this.distanceMoved = {x:this.direction.speed * this.direction.directionX, y:this.direction.speed * this.direction.directionY}
    }
    // the shardgroup center will be used to rotate the original bot center around the shard group. The group will then draw rotate around the original bot center
    this.shardGroupCentre = {x: this.shardGroupCentre.x + this.distanceMoved.x, y: this.shardGroupCentre.y + this.distanceMoved.y}
    //1. update the rotation point (OriginalBotCentre) by the movement distance also
    this.originalBotCentre = {x: this.originalBotCentre.x + this.distanceMoved.x, y: this.originalBotCentre.y + this.distanceMoved.y}

    let arr = [...this.shards];
    for(let i = 0; i < arr.length; i++) {
      let shard = arr[i];
      shard.posX = shard.posX + this.distanceMoved.x;
      shard.posY = shard.posY + this.distanceMoved.y;
      //2.
      LogicService.drawRotateImage(this.dd.imageObj, canvasContainer.mainCtx,
        this.direction.angle,
        shard.posX, shard.posY, shard.imageSizeX, shard.imageSizeY,
        shard.offsetX, shard.offsetY, shard.imageSizeX, shard.imageSizeY,
        this.originalBotCentre.x, this.originalBotCentre.y);
    }

    //Decay
    this.rateOfDecayCount = LogicService.incrementLoop(this.rateOfDecayCount, this.dd.deathConfig.decayPerLoop);
    if(this.rateOfDecayCount == 0) this.removeRandomShard();

    this.direction.updateAngle(this.rotateClockwise);
    // deprecated, not required
    // this.updateRotateOriginalBotCenterXY(this.rotateClockwise);

    this.updateTicksCount += 1;
    if(this.updateTicksCount > this.dd.deathConfig.updateTicksCountMax){
      sA.removeShardGroup(this);
    }
  }

  updateRotateOriginalBotCenterXY(rotateClockwise: boolean) {
    this.originalBotCentre = LogicService.pointAfterRotation(this.shardGroupCentre.x,this.shardGroupCentre.y,this.originalBotCentre.x, this.originalBotCentre.y,(rotateClockwise)?1:359);
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
    public posX, // these are the offsets from original boxs posX/Y
    public posY,
    public offsetX, // these are the offsets from original boxs posX/Y
    public offsetY,
    public imageSizeX,
    public imageSizeY) {
  }
}
