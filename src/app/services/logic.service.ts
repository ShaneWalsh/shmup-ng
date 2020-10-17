import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  public static RADIANCAL= 180/Math.PI;
  public static DEGREECAL= Math.PI/180;

  constructor() { }

  public static pointAfterRotation(centerX, centerY, point2X, point2Y, angle) :{x:number,y:number} {
    var x1 = point2X - centerX;
    var y1 = point2Y - centerY;

    var x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
    var y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);

    var newX = x2 + centerX;
    var newY = y2 + centerY;

    return { x: newX, y: newY }; // so i can drop it straight into assignments
  }
	/**
	 * l are the actual canvas positions
	 * the translateX + Y when drawing something that is its own source of truth, e.g a turret, the defaults are fine.
	 * When calcualting the rotation of an object based off the rotation of another, eg. a bullet from a turret
	 * the translateX + Y need to be calcualted by rotating the center of the bullet, and use this rotated center as the translateX + Y
	 * and workout the x,y from the translateX + Y - sx+sy.
	 *
	 */
  public static drawRotateImage(imageObj, ctx, rotation, x, y, sx, sy, lx = x, ly = y, lxs = sx, lys = sy, translateX = x + (sx / 2), translateY = y + (sy / 2)) {
    // bitwise transformations to remove floating point values, canvas drawimage is faster with integers
    lx = (0.5 + lx) << 0;
    ly = (0.5 + ly) << 0;

    translateX = (0.5 + translateX) << 0;
    translateY = (0.5 + translateY) << 0;

    ctx.save();
    ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
    ctx.rotate(rotation);
    ctx.translate(translateX * -1, translateY * -1); // this moves the point of drawing and rotation to the center.
    ctx.drawImage(imageObj, 0, 0, sx, sy, x, y, sx, sy);

    ctx.restore();
  }

	public static drawBorder(x,y,sizeX,sizeY,ctx,color){
    ctx.lineWidth = 1;
  	ctx.strokeStyle = color;
  	ctx.strokeRect(x,y,sizeX,sizeY);
  }

  public static writeOnCanvas(x,y,text,size,color1,ctx){
    ctx.font = size + "px 'Century Gothic'"; // Supertext 01
    ctx.fillStyle = color1;
    ctx.fillText(text, x, y);
    //ctx.fill();
  }

  public static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  public static radianToDegree(radians){
    var deg = radians * this.RADIANCAL;
    if(deg < 0){
        return deg+360;
    }
    else{
          return deg;
      }
  }

  public static radianToDegreeFloor(radians){
    return Math.floor(this.radianToDegree(radians))
  }

  public static degreeToRadian(degrees){
    return degrees * this.DEGREECAL;
  }
}



export enum HardRotationAngle {
  UP=-1.5707963267948966,
  DOWN=1.5707963267948966,
  LEFT=3.141592653589793,
  RIGHT=0,
}
