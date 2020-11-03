import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor() { }

  /**
   * skip the game introduction vid
   */
  isSkipIntro() :boolean {
    return false;
  }

  /**
   * draw the hit boxes
   */
  isDrawHitBox(): boolean {
    return false;
  }

  /**
   * display the games ticks
   */
  isDisplayTicksAndPhases(): boolean {
    return true;
  }

}
