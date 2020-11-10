import { Injectable } from '@angular/core';
import { ResourcesService } from './resources.service';

export enum PilotEnum {
  NAOMI1,
  MYRA2
}


export class PilotObject {

}

@Injectable({
  providedIn: 'root'
})
export class PilotFactoryService {

  constructor(private resourcesService:ResourcesService) { }

  public createPilot(selectedPilot:PilotEnum) : PilotObject {
    switch(selectedPilot){
      case PilotEnum.NAOMI1:
        return new Pilot1();
      case PilotEnum.MYRA2:
        return new Pilot2();
    }
  }
}


class Pilot1 extends PilotObject {

}

class Pilot2 extends PilotObject {

}
