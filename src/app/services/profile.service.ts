import { Injectable } from '@angular/core';
import { LogicService } from './logic.service';
import { NgApiService } from './ng-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private lockedMedals:MedalUnlock[]=[];
  private unlockedMedals:MedalUnlock[]=[];

  constructor(private ngApiService:NgApiService) {
    this.lockedMedals.push(new MedalUnlock("Defeated Phantom",ProfileValuesEnum.BOTKILLER_LEVEL1_MINI_BOSS1_PHANTOM,CalculationEnum.STRINGEQ,"true"));

    this.checkMedals(false);// the medal would have already been unlocked in the last playthrough, so don't unlock it again, save calls to ng.
  }

  // when string value = another string value, unlock certain medal
  public checkMedals(callNg:boolean=true) {
    LogicService.moveBetweenArrays(this.lockedMedals,this.unlockedMedals, (medalUnlock:MedalUnlock) => {
      if(medalUnlock.checkMedal()){
        if(callNg){
          this.ngApiService.unlockMedal(medalUnlock.medalUnlockCode);
        }
        return true;
      } else {
        return false;
      }
    });
  }

  // String + boolean + number
  public static setProfileValue( profileValuesEnum:ProfileValuesEnum, value:any) {
    localStorage.setItem(profileValuesEnum.toString(), ""+value);
  }

  // number increment
  public static increaseProfileValue( profileValuesEnum:ProfileValuesEnum, value:any) {
    let val = localStorage.getItem(profileValuesEnum.toString());
    if(val != undefined || val != null) {
      val = Number(val)+value;
      localStorage.setItem(profileValuesEnum.toString(), ""+val);
    } else {
      this.setProfileValue(profileValuesEnum,value);
    }
  }

}

export enum ProfileValuesEnum {
  BOTKILLER_KILLS="BOTKILLER_KILLS",
  BOTKILLER_LEVEL1_MINI_BOSS1_PHANTOM="BOTKILLER_LEVEL1_MINI_BOSS1_PHANTOM",
}

enum CalculationEnum {
    LTE="LTE",
    GTE="GTE",
    EQ="EQ",
    STRINGEQ="STRINGEQ",
}

class MedalUnlock {

  public unlocked:boolean =false;

  constructor(
      public medalUnlockCode:string,
      public profileValue:ProfileValuesEnum,
      public calculationEnum:CalculationEnum,
      public value:any
    ) {
    this.checkMedalAlreadyUnlocked();
  }

  private checkMedalAlreadyUnlocked( ) {
    if( this.checkMedalCalc() ) {
      this.unlocked = true;
    }
  }

  /**
   * Checks if the medal meets the profile requirements to unlock
   * @returns if the medal was just unlocked
   */
  public checkMedal(){
    if( this.checkMedalCalc() ) {
      this.unlocked = true;
    }
    return this.unlocked;
  }

  private checkMedalCalc():boolean {
    const profValue = localStorage.getItem(this.profileValue);
    if ( this.calculationEnum == CalculationEnum.STRINGEQ) {
      return this.value === profValue;
    } else { // number check
      let num = Number(profValue);
      if ( this.calculationEnum == CalculationEnum.LTE) {
        return this.value <= num;
      } else if ( this.calculationEnum == CalculationEnum.GTE) {
        return this.value >= num;
      } else if ( this.calculationEnum == CalculationEnum.EQ) {
        return this.value == num;
      }
    }
    return false;
  }

}