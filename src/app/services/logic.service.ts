import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

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
	 * the translateX + Y sometimes need to be calcualted by rotating the center by the top left by the angle, e.g when you fire from a rotating turret.
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

}
