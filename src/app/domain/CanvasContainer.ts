
export class CanvasContainer{
  constructor(
    public bgCanvasEl:any,
    public bgCtx:CanvasRenderingContext2D,
    public shadowCanvasEl:any,
    public shadowCtx:CanvasRenderingContext2D,
    public mainCanvasEl:any,
    public mainCtx:CanvasRenderingContext2D,
    public topCanvasEl:any,
    public topCtx:CanvasRenderingContext2D
  ){

  }
}
