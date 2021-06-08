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
  shards:ShardAnimation[] = [];

  constructor() { }

  public update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, playerService: PlayerService): any {
    this.deaths.forEach(element => {
      element.update(levelInstance, canvasContainer);
    });
    this.shards.forEach(element => {
      element.update(levelInstance, canvasContainer);
    });
  }

  public dynamicDeath(bot:BotInstance){
    //this.deaths.push(new DeathAnimation(bot));
    this.shards.push(new ShardAnimation(bot));
  }

}

// pretty simple implementation
// TODO add rotation and shrinking of fragments to complete
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

  */

class ShardAnimation {
  shards:ShardSquare[][] = [];
  shardGroups:ShardGroup[]= [];
  dd:DeathDetails = null;
  constructor(public bot:BotInstance, public squareSize:number=4) {
    this.dd = bot.getDeathDetails();
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
    this.growShards();
  }

  update(levelInstance: LevelInstance, canvasContainer:CanvasContainer) {
    this.shardGroups.forEach(shardGroup => {
      shardGroup.update(levelInstance, canvasContainer, this.dd)
    });
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

      let shardGroup = new ShardGroup(shard);
      this.shardGroups.push(shardGroup);
    }
  }

  growShards(growPerLoop:number = 10) {
    let shatteredFully = false; // keep growing until all is consumed.
    while(!shatteredFully) {
      shatteredFully = true;
      let growableShardGroups = this.shardGroups.filter(group => !group.shatteredFully);
      for ( let i = 0; i < growableShardGroups.length; i++) {
        let sg = growableShardGroups[i];

        let grown = 0;
        // get the growable shards, and randomly loop on them and find a new shard;
        // set paramter for how many shards can be added at once?
        let growableShards = sg.shards.filter(val => val.canGrow);
        if(growableShards.length < 1){
          sg.shatteredFully = true;
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
  }

  /**
   * Find a neigbouring shard thats not occupied, so it can be used to extend the shard group
   * @param shard
   */
  crackShard(shard:ShardSquare):ShardSquare {
    let positions:{i,j}[] = [{i:-1,j:1},{i:-1,j:-1},{i:1,j:1},{i:1,j:-1}]
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
  shatteredFully:boolean=false;
  shards:ShardSquare[] = [];
  direction:Direction = null;
  distanceMoved:{x:number,y:number} = null;

  constructor(shard:ShardSquare){
    shard.occupied = true;
    this.shards.push(shard);
    this.direction = this.genRandomDirection();
  }

  update(levelInstance: LevelInstance, canvasContainer: CanvasContainer, dd:DeathDetails) {
    if(this.distanceMoved != null) {
      this.distanceMoved.x += this.direction.speed * this.direction.directionX;
      this.distanceMoved.y += this.direction.speed * this.direction.directionY;
    } else {
      this.distanceMoved = {x:this.direction.speed * this.direction.directionX, y:this.direction.speed * this.direction.directionX}
    }
    this.shards.forEach(shard => {
      let posX = dd.posX + shard.offsetX + this.distanceMoved.x;
      let posY = dd.posY + shard.offsetY + this.distanceMoved.y;
      if(dd.rotation != null) {
        //LogicService.drawRotateImage(damImage,ctx,angle,this.posX,this.posY,this.imageSizeX,this.imageSizeY);
      } else {
        canvasContainer.mainCtx.drawImage(dd.imageObj, shard.offsetX, shard.offsetY, shard.imageSizeX, shard.imageSizeY, posX, posY, shard.imageSizeX, shard.imageSizeY);
      }
    });
  }

  genRandomDirection(): Direction {
    let targetX:number =  Math.floor((Math.random()*10)-5)
    let targetY:number = Math.floor((Math.random()*10)-5)
    // make sure its not 0
    var directionY = targetY-Math.floor((Math.random()*10)-5);
    var directionX = targetX-Math.floor((Math.random()*10)-5);
    var angle = Math.atan2(directionY,directionX); // bullet angle
    // Normalize the direction
    var len = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= len;
    directionY /= len;
    return new Direction(directionY,directionX,angle);
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
