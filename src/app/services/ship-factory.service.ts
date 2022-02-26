import { Injectable } from '@angular/core';
import { ShipBlade, ShipEnum, ShipObject, ShipSpear } from '../domain/player/ShipObject';
import { OptionsService } from './options.service';
import { ResourcesService } from './resources.service';


@Injectable({
  providedIn: 'root'
})
export class ShipFactoryService {

  constructor( private resourcesService:ResourcesService, private optionsService:OptionsService ) { }

  public createShip(selectedShip:ShipEnum) : ShipObject {
    let ship:ShipObject = null;
    switch(selectedShip){
      case ShipEnum.BLADE1:
        ship = new ShipBlade (
          this.optionsService.getBladeConfig(),
          this.resourcesService.getRes().get("player-1-ship"),
          [this.resourcesService.getRes().get("player-muzzle-flash-1"),
            this.resourcesService.getRes().get("player-muzzle-flash-2"),
            this.resourcesService.getRes().get("player-muzzle-flash-3")],
          [this.resourcesService.getRes().get("player-1-bullets")],
          this.resourcesService.getRes().get("player-1-ship-shadow-separa")
        );
        break;
      case ShipEnum.SPEAR2:
        ship = new ShipSpear (
          this.optionsService.getSpearConfig(),
          this.resourcesService.getRes().get("player-2-ship"),
          [this.resourcesService.getRes().get("player-2-muzzle-flash-1"),
            this.resourcesService.getRes().get("player-2-muzzle-flash-2"),
            this.resourcesService.getRes().get("player-2-muzzle-flash-3")],
          [this.resourcesService.getRes().get("player-2-bullets")],
          this.resourcesService.getRes().get("player-1-ship-shadow-separa")
        );
        break;
    }
    ship.setProperties();
    return ship;
  }
}




