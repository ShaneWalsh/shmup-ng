import { LogicService } from "src/app/services/logic.service";

/**
 * A chunk of the image being moved around.
 */
 export class SplatterChunk{
  hWidth:number;
  hHeight:number;
  dissolveCounter:number = 0;

  constructor(
      public x,
      public y,
      public imageX=0,
      public imageY=0,
      public chunkSizeX=16,
      public chunkSizeY=16,
      public elementImg,
      public angle=0,
      public speedX=2,
      public speedY=2,
      public rotationX,
      public rotationY,
      public effectRotation, // keep rotating the chunk as it moves, can be nothing.
      public keepRotationXYSame,  // if ture, then the rotaion point will never change. Lead to orbit motion. False, means spinning of chunk. like something flying from an explosion.
      public dissolveTime=120
    ) {
      this.dissolveTime = (dissolveTime/chunkSizeX);
      this.hWidth = chunkSizeX/2;
      this.hHeight = chunkSizeY/2;
      this.dissolveCounter = 0;
      this.init();
  }

	init(){
    //console.log("Chunk init");
    let p = this;
    // todo, refactor the constructor, we are taking in the rotation point of the original element from splatter, but we are no longer using it at all, maybe we should not be passing it in?
    // actually now I am enforcing a roation position, if I want the destroyed to orbit, they will have to orbit around a single point,
    if(!p.keepRotationXYSame){
      p.rotationX= p.x+p.hWidth;
      p.rotationY= p.y+p.hHeight;
    }
  }

  update(ctxToDraw:CanvasRenderingContext2D){
    let p = this;
    if(p.angle != 0){
      LogicService.drawRotateImage(p.elementImg, ctxToDraw,p.angle, p.x,p.y,p.chunkSizeX,p.chunkSizeY,p.imageX,p.imageY,p.chunkSizeX,p.chunkSizeY, p.rotationX,p.rotationY);
    }
    else {
      ctxToDraw.drawImage(p.elementImg, p.imageX,p.imageY,p.chunkSizeX,p.chunkSizeY, p.x,p.y,p.chunkSizeX,p.chunkSizeY);
    }

    // move the chunks location.
    p.x+= p.speedX;
    p.y+= p.speedY;

    // doing this will keep the rotation point updated with where it moves to, if we didnt do this the angle change would lead to a circular motion.
    if(!p.keepRotationXYSame){
      //p.rotationX+= p.speedX;
      //p.rotationY+= p.speedY;
      p.rotationX= p.x+p.hWidth;
      p.rotationY= p.y+p.hHeight;
    }
    // rotate the chunk even more
    p.angle += p.effectRotation;

    // Dissolution.
    if(p.dissolveCounter >= p.dissolveTime){
      p.dissolveCounter = 0;
      p.chunkSizeX--;
      p.chunkSizeY--;
      let death = 0;
      if(p.chunkSizeX < 1){
        death++;
        p.chunkSizeX = 1;
      }
      if(p.chunkSizeY < 1){
        death++;
        p.chunkSizeY = 1;
      }
      if(death >= 2){ // then both are fully dissolved, so remove entirely.
        return false;
      }
    }else{
      p.dissolveCounter++;
    }
    return true;
  }


}
