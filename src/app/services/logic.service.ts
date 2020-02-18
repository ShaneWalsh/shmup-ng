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

}

