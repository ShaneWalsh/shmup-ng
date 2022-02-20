import { Injectable } from '@angular/core';
import { CanvasContainer } from '../domain/CanvasContainer';
import { HitBox } from '../domain/HitBox';
import { ShipBlade, ShipEnum, ShipObject, ShipSpear } from '../domain/player/ShipObject';
import { BotManagerService } from '../manager/bot-manager.service';
import { BulletDirection, BulletManagerService } from '../manager/bullet-manager.service';
import { LevelInstance } from '../manager/level-manager.service';
import { ResourcesService } from './resources.service';


@Injectable({
  providedIn: 'root'
})
export class ShipFactoryService {

  constructor(private resourcesService:ResourcesService) { }

  public createShip(selectedShip:ShipEnum) : ShipObject {
    switch(selectedShip){
      case ShipEnum.BLADE1:
        return new ShipBlade (
          this.resourcesService.getRes().get("player-1-ship"),
          [this.resourcesService.getRes().get("player-muzzle-flash-1"),
            this.resourcesService.getRes().get("player-muzzle-flash-2"),
            this.resourcesService.getRes().get("player-muzzle-flash-3")],
          [this.resourcesService.getRes().get("player-1-bullets")],
          this.resourcesService.getRes().get("player-1-ship-shadow-separa")
        );
      case ShipEnum.SPEAR2:
        return new ShipSpear (
          this.resourcesService.getRes().get("player-2-ship"),
          [this.resourcesService.getRes().get("player-2-muzzle-flash-1"),
            this.resourcesService.getRes().get("player-2-muzzle-flash-2"),
            this.resourcesService.getRes().get("player-2-muzzle-flash-3")],
          [this.resourcesService.getRes().get("player-2-bullets")],
          this.resourcesService.getRes().get("player-1-ship-shadow-separa")
        );
    }
  }
}




