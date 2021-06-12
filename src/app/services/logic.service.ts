import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicService {
  public static RADIANCAL= 180/Math.PI;
  public static DEGREECAL= Math.PI/180;

  constructor() { }

  /**
   * The point of this method is to simplify the process of rotating an image around another image.
   * In order to draw something correctly after rotation you have to take its center point, and rotate that using the angle of the parent.
   * Then subtract half the image size to get the top left again, this is where the image needs to be drawn and rotated.
   * This is required to accurately draw a muzzle flash or bullet coming out of a turret correctly.
   * Rotate around the parents rotation point, with your rotation point,
   * then return both your final rotation cords and the topleft cords after rotating for drawing top left x+y.
   * @param parCenterX
   * @param parCenterY
   * @param point2X
   * @param point2Y
   * @param imgSizeX
   * @param imgSizeY
   * @param angle
   */
  public static topLeftAfterRotation(parCenterX, parCenterY, point2X, point2Y, imgSizeX, imgSizeY, angle) :{x:number,y:number, xR:number, yR:number} {
    let halfImageSizeX = imgSizeX/2;
    let halfImageSizeY = imgSizeY/2;
    let cords = this.pointAfterRotation(parCenterX, parCenterY, point2X + halfImageSizeX, point2Y + halfImageSizeY, angle);
    return { x: (cords.x-halfImageSizeX), y: (cords.y-halfImageSizeY), xR: cords.x, yR: cords.y };
  }

  /**
   * Performs a rotation of point2X/Y around centerX/Y by angle(Radian) degrees.
   * @param centerX rotation origin x coordinate
   * @param centerY rotation origin y coordinate
   * @param point2X point to rotate x coordinate
   * @param point2Y point to rotate y coordinate
   * @param angle Radian value
   * @returns the new positions of point2X+Y after rotation
   */
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
   * xy are the actual canvas positions
	 * lxly are the image draw positions
	 * the translateX + Y when drawing something that is its own source of truth, e.g a turret, the defaults are fine.
	 * When calcualting the rotation of an object based off the rotation of another, eg. a bullet from a turret
	 * the translateX + Y need to be calcualted by rotating the center of the bullet, and use this rotated center as the translateX + Y
	 * and workout the x,y from the translateX + Y - sx+sy.
	 *
	 */
  public static drawRotateImage(imageObj, ctx, rotation, x, y, sx, sy, lx = 0, ly = 0, lxs = sx, lys = sy, translateX = x + (sx / 2), translateY = y + (sy / 2)) {
    // bitwise transformations to remove floating point values, canvas drawimage is faster with integers
    lx = (0.5 + lx) << 0;
    ly = (0.5 + ly) << 0;

    translateX = (0.5 + translateX) << 0;
    translateY = (0.5 + translateY) << 0;

    ctx.save();
    ctx.translate(translateX, translateY); // this moves the point of drawing and rotation to the center.
    ctx.rotate(rotation);
    ctx.translate(translateX * -1, translateY * -1); // this moves the point of drawing and rotation to the center.
    ctx.drawImage(imageObj, lx, ly, lxs, lys, x, y, sx, sy);

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

  /**
   * Returns an integer in the range of 0 : (max -1)
   */
  public static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /**
   * Converts a Radian value to a Dregree with floating point
   */
  public static radianToDegree(radians){
    var deg = radians * this.RADIANCAL;
    if(deg < 0){
        return deg+360;
    }
    else{
          return deg;
      }
  }

  /**
   * Converts a Radian value to a Dregree integer
   */
  public static radianToDegreeFloor(radians){
    return Math.floor(this.radianToDegree(radians))
  }

  /**
   * Converts a Dregree value to a Radian value
   * The Radian value can be passed directly to canvas methods as the angle parameter
   */
  public static degreeToRadian(degrees){
    return degrees * this.DEGREECAL;
  }

  public static getRandomInSquare(startX, startY, sizeX, sizeY):{x:number,y:number} {
    return {
      x: startX + this.getRandomInt(sizeX),
      y: startY + this.getRandomInt(sizeY)
    }
  }

  /**
   * Loop around on a value
   * @param index the current index position
   * @param length the maximum value before the loop resets to 0
   * @param increment the amount to increment on each loop
   * @returns
   */
  static incrementLoop(index: number, length: number, increment:number=1): number {
    index = index+increment;
    return (index >= length)?0:index;
  }

  static randomColor(): string {
    return "#" + ((1<<24)*Math.random() | 0).toString(16)
  }

  // maybe one day I can try and draw odd shapes using points
  // https://stackoverflow.com/questions/27213413/canvas-cropping-images-in-different-shapes
}



export enum HardRotationAngle {
  UP=-1.5707963267948966,
  DOWN=1.5707963267948966,
  LEFT=3.141592653589793,
  RIGHT=0,
}
