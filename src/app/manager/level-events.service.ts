import { Injectable } from '@angular/core';
import { LevelEvent, SpawnBotEvent, BotType, LevelOverEvent } from 'src/app/domain/events/level-events';

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

	  /*
	  	GAME MECHANICS
		There is 60 ticks in a second, so most of the numbers in the configs are based off of these ticks.
		SpawnBotEvent
			first value is the phase this event will occur in. 0 is the default phase. When a Phase changes, the phaseTicks reset to 0
			second value is after how many phaseTicks this event will occur.
			third value is whether this event should be repeated repeatUntilPhaseEnd
			forth value applies to the above, when thirt value is true, this event will fire again after this amount of phaseTicks.
			fifth value is the bot type spawned by this event
			sixth value is the bot congig values which you can change below.
			seventh value is whether or not the bots X/Y cords should be automatically generated.
			eight value is the bots spawning X cordinate
			ninth value is the bots spawning Y cordinate
	  */

	  const diverConfig = {
		  bulletSpeed: 3, // how fast this bots buttets travel every tick
		  posXSpeed: 1.5,
		  posYSpeed: 1.5, // the speed the bot moves in the X and y Directions every Tick
		  bTimerLimit: 40, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
		  score: 50, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		  health:3, // health, when 0 Diver is dead.
	  };
	  const droneConfig = {
		  bulletSpeed: 3,
		  posXSpeed: 1.5,
		  posYSpeed: 1.5,
		  bTimerLimit: 40,
		  score: 25,
		  health: 3,
	  };
	  const fighterConfig = {
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 3,
		  bTimerLimit: 85,
		  anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
		  score: 10,
		  health:2,
	  };
	  const level1MiniBoss1 = {
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 1.5,
		  bTimerLimit: 30,
		  anaimationTimerLimit:4,
		  score: 200,
		  health:35,
	  };
	  const level1MiniBoss2 = {
		  bulletSpeed: 6,
		  moveSpeed: 2,
		  bTimerLimit: 30,
		  anaimationTimerLimit: 4,
		  score: 200,
		  health: 35,
	  };



	  le.push(new SpawnBotEvent(0,120,false,0,BotType.DIVER,diverConfig, false, 200, -60));
	  le.push(new SpawnBotEvent(0, 120, false, 0, BotType.DRONE, droneConfig, false, 160, -60));

	  le.push(new SpawnBotEvent(0,105,false,0,BotType.CREEPER,fighterConfig, false, 250, -60));

	  le.push(new SpawnBotEvent(0,90,false,0,BotType.FIGHTER,fighterConfig, false, 300, -60));
	  le.push(new SpawnBotEvent(0,85,false,0,BotType.FIGHTER,fighterConfig, false, 360, -60));
	  le.push(new SpawnBotEvent(0,90,false,0,BotType.FIGHTER,fighterConfig, false, 420, -60));

    le.push(new SpawnBotEvent(0,190,false,0,BotType.ROCK,fighterConfig, false, 120, -60));
	  // le.push(new SpawnBotEvent(0,190,false,0,BotType.FIGHTER,fighterConfig, false, 460, -60));
	  // le.push(new SpawnBotEvent(0,195,false,0,BotType.FIGHTER,fighterConfig, false, 520, -60));
	  // le.push(new SpawnBotEvent(0,200,false,0,BotType.FIGHTER,fighterConfig, false, 580, -60));

 	  le.push(new SpawnBotEvent(0,250,false,0,BotType.DIVER,diverConfig, false, 500, -60));

	  le.push(new SpawnBotEvent(0,260,false,0,BotType.FIGHTER,fighterConfig, false, 220, -60));
	  le.push(new SpawnBotEvent(0,265,false,0,BotType.FIGHTER,fighterConfig, false, 160, -60));
	  le.push(new SpawnBotEvent(0,270,false,0,BotType.FIGHTER,fighterConfig, false, 100, -60));

	  // these are repeat events that will keep spawning while you fight the mini boss. They spawn at random positions.
	  le.push(new SpawnBotEvent(0,400,true,120,BotType.DIVER,diverConfig, true, 0, -60));
      le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));
	  le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));

	  // when a mini boss dies, the Phase moves forward by One.
	  //le.push(new SpawnBotEvent(0, 350, false, 90, BotType.MINIBOSS2, level1MiniBoss1, false, 200, -300));
	  le.push(new SpawnBotEvent(0, 350, false, 90, BotType.MAINBOSS1, level1MiniBoss1, false, 0, -300));

	  // these are Phase 1 events, it will become phase 1 when MINIBOSS1 dies
	  le.push(new SpawnBotEvent(1,120,false,0,BotType.DIVER,diverConfig, false, 200, -60));
	  le.push(new SpawnBotEvent(1,90,false,0,BotType.FIGHTER,fighterConfig, false, 300, -60));
	  le.push(new SpawnBotEvent(1,85,false,0,BotType.FIGHTER,fighterConfig, false, 360, -60));
	  le.push(new SpawnBotEvent(1,90,false,0,BotType.FIGHTER,fighterConfig, false, 420, -60));

	  le.push(new SpawnBotEvent(1,190,false,0,BotType.FIGHTER,fighterConfig, false, 460, -60));
	  le.push(new SpawnBotEvent(1,195,false,0,BotType.FIGHTER,fighterConfig, false, 520, -60));
	  le.push(new SpawnBotEvent(1,200,false,0,BotType.FIGHTER,fighterConfig, false, 580, -60));

	  le.push(new SpawnBotEvent(1,250,false,0,BotType.DIVER,diverConfig, false, 500, -60));

	  le.push(new SpawnBotEvent(1,260,false,0,BotType.FIGHTER,fighterConfig, false, 220, -60));
	  le.push(new SpawnBotEvent(1,265,false,0,BotType.FIGHTER,fighterConfig, false, 160, -60));
	  le.push(new SpawnBotEvent(1,270,false,0,BotType.FIGHTER,fighterConfig, false, 100, -60));

	  le.push(new SpawnBotEvent(1,400,true,120,BotType.DIVER,diverConfig, true, 0, -60));
	  le.push(new SpawnBotEvent(1,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));
	  le.push(new SpawnBotEvent(1,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));

	  le.push(new SpawnBotEvent(1, 350, false, 90, BotType.MINIBOSS1,level1MiniBoss1, false, 300, -300));

	  // after 100 ticks of Phase 2, level over is triggered.
	  le.push(new LevelOverEvent(2,100));


      return le;
  }
}
