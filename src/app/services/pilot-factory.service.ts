import { Injectable } from '@angular/core';
import { Pilot1, Pilot2, PilotEnum, PilotObject } from '../domain/player/PilotObject';
import { ResourcesService } from './resources.service';

@Injectable({
  providedIn: 'root'
})
export class PilotFactoryService {

  constructor(private resourcesService:ResourcesService) { }

  public createPilot(selectedPilot:PilotEnum) : PilotObject {
    switch(selectedPilot){
      case PilotEnum.NAOMI1:
        return new Pilot1({ab1:840, ab2:600}, 3, 4, 47); // extra life
      case PilotEnum.MYRA2:
        return new Pilot2({ab1:660, ab2:480}, 0, 4, 49); // faster cooldown
    }
  }
}

