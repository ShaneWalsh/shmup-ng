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

	  const diverStats = {};
	  const fighterStats = {};

	  le.push(new SpawnBotEvent(0,120,false,0,BotType.DIVER,diverStats, false, 200, -60));
	  le.push(new SpawnBotEvent(0,90,false,0,BotType.FIGHTER,fighterStats, false, 300, -60));
	  le.push(new SpawnBotEvent(0,85,false,0,BotType.FIGHTER,fighterStats, false, 360, -60));
	  le.push(new SpawnBotEvent(0,90,false,0,BotType.FIGHTER,fighterStats, false, 420, -60));

	  le.push(new SpawnBotEvent(0,190,false,0,BotType.FIGHTER,fighterStats, false, 460, -60));
	  le.push(new SpawnBotEvent(0,195,false,0,BotType.FIGHTER,fighterStats, false, 520, -60));
	  le.push(new SpawnBotEvent(0,200,false,0,BotType.FIGHTER,fighterStats, false, 580, -60));

 	  le.push(new SpawnBotEvent(0,250,false,0,BotType.DIVER,diverStats, false, 500, -60));

	  le.push(new SpawnBotEvent(0,260,false,0,BotType.FIGHTER,fighterStats, false, 220, -60));
	  le.push(new SpawnBotEvent(0,265,false,0,BotType.FIGHTER,fighterStats, false, 160, -60));
	  le.push(new SpawnBotEvent(0,270,false,0,BotType.FIGHTER,fighterStats, false, 100, -60));

	  le.push(new SpawnBotEvent(0,400,true,120,BotType.DIVER,diverStats, true, 0, -60));
      le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterStats, true, 0, -60));
	  le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterStats, true, 0, -60));

	  le.push(new SpawnBotEvent(0, 350, false, 90, BotType.MINIBOSS1,{}, false, 300, -300));


      return le;
  }
}
