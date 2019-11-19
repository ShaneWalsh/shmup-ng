import { Injectable } from '@angular/core';
import { LevelEvent, SpawnBotEvent, BotType } from 'src/app/domain/events/level-events';

@Injectable({
  providedIn: 'root'
})
export class LevelEventsService {

  constructor() { }

  getLevel1Events():LevelEvent[] {
      let le = [];
      le.push(new SpawnBotEvent(0,500,true,500,BotType.DIVER, true));
      return le;
  }
}
