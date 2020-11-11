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
        return new Pilot1(900, 1); // extra life
      case PilotEnum.MYRA2:
        return new Pilot2(800, 0); // faster cooldown
    }
  }
}

