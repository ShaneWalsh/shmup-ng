

// take a spite to split up, size x + y, chunks, speed, dissolve time.

import { LogicService } from "src/app/services/logic.service";
import { SplatterChunk } from "./SplatterChunk";

/**
 * The idea here is it should take an image, size, x and y cords, chunks, chunks sizes, speed, dissolve time.
 */
export default class Splatter {
  hSizeX
  hSizeY
  chunks

  constructor (
     public ctxToDraw,
     public x,
     public y,
     public imageX=0,
     public imageY=0,
     public sizeX=32,
     public sizeY=32,
     public elementImg,
     public angle=0,
     public chunkAmount=4,
     public chunkSizeX=16,
     public chunkSizeY=16,
     public chunkVariation=0,
     public rotationX=x+(sizeX/2),  // in theory, all chunks of the image should be rotating around this point. but some chunks will be componets on parent objects.
     public rotationY=y+(sizeY/2)
    ) {
    this.hSizeX = sizeX/2; // size of the image, 32, 32
    this.hSizeY = sizeY/2;

    this.chunks = []; // the actual caluclated chunks.
    this.init();
  }

/**
 * Work out the chunks, something that should only happen once per splatter, once set thats it.
 */
	init(){
    let p = this;

    this.fourSquareChunking();
    //this.fourSquareInward({});
    // not sure about this :/
    //this.randomSquareChunking({});

  }

  update(ctxToDraw=this.ctxToDraw){
    let p = this;
    for(let i = 0; i < p.chunks.length;i++){
      if(!p.chunks[i].update(ctxToDraw)){
        // then rmeove this biatch
        p.chunks.splice(i, 1);
        // now counter the i++ so we are still on this array element.
        i--;
      }
    }
    if(p.chunks.length == 0){
      return false;
    }
    return true;
  }


  /**
   * Utility.
   * moveDirX/Y is the x offset for the point you want to move towards.(calcualted after rotation, so its rotation safe.)
   * x+y are the starting positions after rotation,
   */
  getChunkXYAndDirectionXY(rotationX, rotationY,x,y,angle,speed, moveDirX,moveDirY){
    let pointUno = LogicService.pointAfterRotation(rotationX, rotationY,x,y,angle);
    let pointTarget = LogicService.pointAfterRotation(rotationX, rotationY,x+moveDirX,y+moveDirY,angle);
    let point1Movement = LogicService.moveBetweenPointsAtSpeed(speed,pointTarget.x,pointTarget.y,pointUno.x,pointUno.y);
    return {x:pointUno.x, y: pointUno.y, moveX:point1Movement.moveX, moveY:point1Movement.moveY};
  }

/**
 * Utility function, to create a new chunk.
 */
  createChunk(
    chunkXOffset, chunkYOffset, // offset for the top left corner of the chunk before rotation, offset form origin objects x+y
    moveDirX, moveDirY, // target to move towards
    centerXOffset, centerYOffset, // offset from the chunks top left corner to the chunks center.
    speed, effectRotation, keepRotationXYSame, dissolveTime,
    chunkSizeX=this.chunkSizeX, chunkSizeY=this.chunkSizeY
  ){
    let p = this;
    let imageX = p.imageX + chunkXOffset;
    let imageY = p.imageY + chunkYOffset;
    let point1 = this.getChunkXYAndDirectionXY(p.rotationX, p.rotationY,p.x+chunkXOffset+centerXOffset,p.y+chunkYOffset+centerYOffset,p.angle,speed,moveDirX,moveDirY);
    p.chunks.push(new SplatterChunk(
      point1.x-centerXOffset,
      point1.y-centerYOffset,
      imageX,imageY,
      chunkSizeX,chunkSizeY,
      p.elementImg,p.angle,
      point1.moveX, point1.moveY,
      p.rotationX,p.rotationY,effectRotation,keepRotationXYSame,dissolveTime));
  }

  /**
   * Simple four part chunking, even slipt, with slow drift. Real space like.
   */
   fourSquareChunking(speed=1, effectRotation=.1, keepRotationXYSame=false, dirDis=100, dissolveTime=120){
   // fourSquareChunking({speed=.01, effectRotation=.1, keepRotationXYSame=false, dirDis=100, dissolveTime=12000}){
    let p = this;

    // to get this to move correctly, i need to alter the speed for x and y in each chunk so it takes the angle into account.
    // e.g instead of going -1,-1 for top left, when rotated 180D it should be doing +1,+1. How to figure this out and tell the function?
    // Solution, need to work out their new x and y, after rotation, this is their new start position.
    // then I need to give them a tragrectory for the direction I want, after rotation, e.g i want him to move left(-1) but the angle is 180D, so I want him to go +1
    //{x:newX,y:newY}
    let centerXOffset = (p.chunkSizeX/2);
    let centerYOffset = (p.chunkSizeY/2);

    this.createChunk(0, 0, -dirDis, -dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
    this.createChunk(p.chunkSizeX, 0, dirDis,-dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
    this.createChunk(0, p.chunkSizeY, -dirDis, dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
    this.createChunk(p.chunkSizeX, p.chunkSizeY, dirDis, dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
  }

/**
 * Chunks dissolve into the center instead of out, with an orbit. keepRotationXYSame= true means the rotations will all be around the original death origin, this means it will orbit.
 */
  fourSquareInward({speed=.5, effectRotation=.5, keepRotationXYSame=true, dirDis=100, dissolveTime=30}){
    let p = this;

    let centerXOffset = (p.chunkSizeX/2);
    let centerYOffset = (p.chunkSizeY/2);

    this.createChunk(0, 0, dirDis, dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
    this.createChunk(p.chunkSizeX, 0, -dirDis,dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
    this.createChunk(0, p.chunkSizeY, dirDis, -dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
    this.createChunk(p.chunkSizeX, p.chunkSizeY, -dirDis, -dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
  }


  // point based squares, pick a point from each corner, then one between them, connect them all up, making multiple square chunks.
  // flip those about for a bit.
    /**
     * Splits into 4 chunks, then splits those into four more chunks
     */
    randomSquareChunking({speed=1, effectRotation=.1, keepRotationXYSame=false, dirDis=100, dissolveTime=120}){
     // fourSquareChunking({speed=.01, effectRotation=.1, keepRotationXYSame=false, dirDis=100, dissolveTime=12000}){
      let p = this;

      // to get this to move correctly, i need to alter the speed for x and y in each chunk so it takes the angle into account.
      // e.g instead of going -1,-1 for top left, when rotated 180D it should be doing +1,+1. How to figure this out and tell the function?
      // Solution, need to work out their new x and y, after rotation, this is their new start position.
      // then I need to give them a tragrectory for the direction I want, after rotation, e.g i want him to move left(-1) but the angle is 180D, so I want him to go +1
      //{x:newX,y:newY}
      let centerXOffset = (p.chunkSizeX/4);
      let centerYOffset = (p.chunkSizeY/4);

      this.createChunk(0, 0, (-dirDis)+this.getRandomInt(2,200), -dirDis+this.getRandomInt(2,200), centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
      this.createChunk(centerXOffset, 0, -dirDis+this.getRandomInt(2,200), -dirDis+this.getRandomInt(2,200), centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
      this.createChunk(0, centerYOffset, -dirDis+this.getRandomInt(2,200), -dirDis+this.getRandomInt(2,200), centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
      this.createChunk(centerXOffset, centerXOffset, -dirDis+this.getRandomInt(2,200), -dirDis+this.getRandomInt(2,200), centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)

      this.createChunk(p.chunkSizeX, 0, dirDis,-dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
      this.createChunk(0, p.chunkSizeY, -dirDis, dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
      this.createChunk(p.chunkSizeX, p.chunkSizeY, dirDis, dirDis, centerXOffset, centerYOffset, speed, effectRotation, keepRotationXYSame, dissolveTime)
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  // Advanced stuff, bucket list.
  // Next up, custom chunks, pick loads of points, draw random shapes by connecting them, draw image inside the custom shapes,
  // so its doesnt shatter like a square.
  // https://stackoverflow.com/questions/27213413/canvas-cropping-images-in-different-shapes

}
