import { CanvasContainer } from "./CanvasContainer";

export class DeathDetails {
  constructor(
    public imageObj:HTMLImageElement,
    public posX:number,
    public posY:number,
    public sizeX:number,
    public sizeY:number,
    public rotation:number = 0,
    public centreX = posX+(sizeX/2),
    public centreY = posY+(sizeY/2),
    public deathConfig = new DeathConfig(),
    public ctxToDrawOn = null,
    public ShadowDetails = null
  ){

  }

  getCtxToDrawOn(canvasContainer: CanvasContainer): any {
    return (this.ctxToDrawOn != null)? this.ctxToDrawOn : canvasContainer.mainCtx;
  }

}

export class ShadowDetails {
  constructor(
    public imageObj:HTMLImageElement,
    public offsetX:number,
    public offsetY:number,
    public ctxToDrawOn:any,
  ){

  }

  getCtxToDrawOn(canvasContainer: CanvasContainer): any {
    return (this.ctxToDrawOn != null)? this.ctxToDrawOn : canvasContainer.mainCtx;
  }

}

export class DeathConfig {
  constructor(
    public squareSize:number = 4, //4 the size of each piece
    public totalShards:number = 8, //8 how many shards the bot should break into
    public growPerLoop:number = 5, //5 how many pieces to add to a shard per loop, higher = more chunky
    public decayPerLoop:number = 0, //0 how many loop iterations before a shard piece is lost
    public speed:number = 1, //1 speed the shards move out from center
    public updateTicksCountMax:number = 240 // max time it can remain before being removed from death animation loop
  ){

  }
}
