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
  ){

  }
}
