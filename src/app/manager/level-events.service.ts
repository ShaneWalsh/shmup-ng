import { Injectable } from '@angular/core';
import { LevelEvent, SpawnBotEvent, BotType } from 'src/app/domain/events/level-events';

@Injectable({
  providedIn: 'root'
})
export class LevelEventsService {

  constructor() { }

  getLevel1Events():LevelEvent[] {
      let le = [];
	  // testing bots
      // le.push(new SpawnBotEvent(0,120,true,120,BotType.DIVER, true));
      // le.push(new SpawnBotEvent(0,90,true,90,BotType.FIGHTER, true));
      // le.push(new SpawnBotEvent(0,90,true,90,BotType.FIGHTER, true));

	  le.push(new SpawnBotEvent(0,120,false,120,BotType.DIVER, false, 200));
	  le.push(new SpawnBotEvent(0,90,false,90,BotType.FIGHTER, false, 300));
	  le.push(new SpawnBotEvent(0,85,false,90,BotType.FIGHTER, false, 360));
	  le.push(new SpawnBotEvent(0,90,false,90,BotType.FIGHTER, false, 420));

	  le.push(new SpawnBotEvent(0,190,false,90,BotType.FIGHTER, false, 460));
	  le.push(new SpawnBotEvent(0,195,false,90,BotType.FIGHTER, false, 520));
	  le.push(new SpawnBotEvent(0,200,false,90,BotType.FIGHTER, false, 580));

 	  le.push(new SpawnBotEvent(0,250,false,120,BotType.DIVER, false, 500));

	  le.push(new SpawnBotEvent(0,260,false,90,BotType.FIGHTER, false, 220));
	  le.push(new SpawnBotEvent(0,265,false,90,BotType.FIGHTER, false, 160));
	  le.push(new SpawnBotEvent(0,270,false,90,BotType.FIGHTER, false, 100));

	  le.push(new SpawnBotEvent(0,400,true,120,BotType.DIVER, true));
      le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER, true));
      le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER, true));

      return le;
  }
}
