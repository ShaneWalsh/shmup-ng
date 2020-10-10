
export class CanvasContainer {

  public bgCtx:CanvasRenderingContext2D;
  public groundShadowCtx:CanvasRenderingContext2D;
  public groundCtx:CanvasRenderingContext2D;
  public shadowCtx:CanvasRenderingContext2D;
  public mainCtx:CanvasRenderingContext2D;
  public topCtx:CanvasRenderingContext2D;

  constructor(
    public canvasBGEl:any,
    public canvasGroundShadowEl:any,
    public canvasGroundEl:any,
    public canvasBGShadowEl:any,
    public canvasMainEl:any,
    public canvasTopEl:any,
  ){
    this.bgCtx = this.canvasBGEl.getContext('2d');
    this.groundShadowCtx = this.canvasGroundShadowEl.getContext('2d');
    this.groundCtx = this.canvasGroundEl.getContext('2d');
    this.shadowCtx = this.canvasBGShadowEl.getContext('2d');
    this.mainCtx = this.canvasMainEl.getContext('2d');
    this.topCtx = this.canvasTopEl.getContext('2d');
  }
}
