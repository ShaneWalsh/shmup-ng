export class HitBox{
    constructor(
        public hitBoxX:number=0,
        public hitBoxY:number=0,
        public hitBoxSizeX:number=90,
        public hitBoxSizeY:number=60,
    ){

    }

    drawBorder(x,y,sizeX,sizeY,ctx,color){
        ctx.lineWidth = 1;
    	ctx.strokeStyle = color;
    	ctx.strokeRect(x,y,sizeX,sizeY);
    }

    areCentersToClose(first:any, a:HitBox,second:any, b:HitBox) {
        let ax = first.posX+a.hitBoxX;
        let ay = first.posY+a.hitBoxY;
        let bx = second.posX+b.hitBoxX;
        let by = second.posY+b.hitBoxY;
        return  (this.absVal( (ax+(a.hitBoxSizeX >> 1))  - (bx + (b.hitBoxSizeX >> 1)) ) < ((a.hitBoxSizeX >>1) + (b.hitBoxSizeX >> 1))) &&
                (this.absVal( (ay+(a.hitBoxSizeY >> 1))  - (by + (b.hitBoxSizeY >> 1)) ) < ((a.hitBoxSizeY >> 1) + (b.hitBoxSizeY >> 1)));
    }

    absVal(val) {
      return (val < 0) ? -val : val;
    }
}
