import { Injectable } from '@angular/core';
import { LevelEvent, SpawnBotEvent, BotType, LevelOverEvent } from 'src/app/domain/events/level-events';

@Injectable({
  providedIn: 'root'
})
export class LevelEventsService {

  constructor() { }

  getLevel1Events(difficulty:number):LevelEvent[] {
      let le = [];

	  /*
	  	GAME MECHANICS
		difficulty = is a number and its either 0 (easy) or 1 (normal)
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

	  // these are the default normal settings, I suggest you override the specific values you want to change in the difficulty if/else
	  let diverConfig = { // slow bot that fires the tracking bullets enemy-3-1
		  bulletSpeed: 3, // how fast this bots buttets travel every tick
		  posXSpeed: 1.5,
		  posYSpeed: 1.5, // the speed the bot moves in the X and y Directions every Tick, X = Left/Right Y=Up/Down
		  bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
		  score: 50, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		  health:3, // health, when 0 Diver is dead.
	  };
	  let guardian1Config = {
		  bulletSpeed: 3, // how fast this bots buttets travel every tick
		  posXSpeed: 1.5,
		  posYSpeed: 1.5, // the speed the bot moves in the X and y Directions every Tick
		  bTimerLimit: 80, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
		  score: 80, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		  health:30, // health, when 0 Diver is dead.
	  };
	  let droneConfig = { // original fast moving fast shooting figher enemy-2-2
		  bulletSpeed: 6,
		  posXSpeed: 1.5,
		  posYSpeed: 1.5,
		  bTimerLimit: 60,
		  score: 25,
		  health: 3,
	  };
	  let fighterConfig = { // basic fast moving fast shooting redesigned figher enemy-1-1
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 3,
		  bTimerLimit: 60,
		  anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
		  score: 10,
		  health:3,
	  };
	  let creeperConfig = { // top of the screen creeper enemy-07
		  posXSpeed: 1.5,
		  posYSpeed: 1.5,
		  bTimerLimit: 60,
		  score: 50,
		  health:5,
	  };
	  let rockConfig = { // big fat slow guy, enemy-2-1
		  posXSpeed: 2,
		  posYSpeed: 1.5,
		  score: 50,
		  health:20,
	  };
	  let level1MiniBoss1 = { // giant fighter with two bullets
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 1.5,
		  bTimerLimit: 30,
		  anaimationTimerLimit:4,
		  score: 200,
		  health:35,
	  };
	  let level1MiniBoss2 = { // spinning guy
		  bulletSpeed: 6,
		  moveSpeed: 2,
		  bTimerLimit: 30,
		  anaimationTimerLimit: 4,
		  score: 200,
		  health: 50,
	  };
	  let level1MainBoss1 = { // big boss with the bog laser
	  	posXSpeed: 3,
	  	posYSpeed: 1.5,
	  	score: 500,
	  	health:100,
	  };

	  if(difficulty == 0){ // easy so reducing the bots health
		  fighterConfig = {...fighterConfig,health:1}
	  } else if(difficulty == 1){
		  // use the defaults defined above
	  } else { //todo hard one day I assume

	  }

	  le.push(new SpawnBotEvent(0,120,false,0,BotType.DIVER,diverConfig, false, 200, -60));
	  le.push(new SpawnBotEvent(0, 120, false, 0, BotType.DRONE, droneConfig, false, 160, -60));

	  le.push(new SpawnBotEvent(0,105,false,0,BotType.CREEPER,creeperConfig, false, 250, -60));

	  le.push(new SpawnBotEvent(0,90,false,0,BotType.FIGHTER,fighterConfig, false, 300, -60));
	  le.push(new SpawnBotEvent(0,85,false,0,BotType.FIGHTER,fighterConfig, false, 360, -60));
	  le.push(new SpawnBotEvent(0,90,false,0,BotType.FIGHTER,fighterConfig, false, 420, -60));

	  le.push(new SpawnBotEvent(0,190,false,0,BotType.FIGHTER,fighterConfig, false, 460, -60));
	  le.push(new SpawnBotEvent(0,195,false,0,BotType.FIGHTER,fighterConfig, false, 520, -60));
	  le.push(new SpawnBotEvent(0,200,false,0,BotType.FIGHTER,fighterConfig, false, 580, -60));

      le.push(new SpawnBotEvent(0,190,false,0,BotType.ROCK,rockConfig, false, 120, -60));

 	  le.push(new SpawnBotEvent(0,250,false,0,BotType.DIVER,diverConfig, false, 500, -60));

	  le.push(new SpawnBotEvent(0,260,false,0,BotType.FIGHTER,fighterConfig, false, 220, -60));
	  le.push(new SpawnBotEvent(0,265,false,0,BotType.FIGHTER,fighterConfig, false, 160, -60));
	  le.push(new SpawnBotEvent(0,270,false,0,BotType.FIGHTER,fighterConfig, false, 100, -60));

	  // these are repeat events that will keep spawning while you fight the mini boss. They spawn at random positions.
	  le.push(new SpawnBotEvent(0,400,true,120,BotType.DIVER,diverConfig, true, 0, -60));
      le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));
	  le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));

	  // when a mini boss dies, the Phase moves forward by One.
	  le.push(new SpawnBotEvent(0, 350, false, 90, BotType.MINIBOSS1, level1MiniBoss2, false, 200, -300));

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

	  le.push(new SpawnBotEvent(1, 350, false, 90, BotType.MINIBOSS2,level1MiniBoss2, false, 300, -300));

	  // these are Phase 2 events, it will become phase 2 when MINIBOSS2 dies
	  le.push(new SpawnBotEvent(2,230,false,0,BotType.GUARDIAN1,guardian1Config, false, 380, -60));
	  le.push(new SpawnBotEvent(2,230,false,0,BotType.GUARDIAN1,guardian1Config, false, 5, -60));
	  le.push(new SpawnBotEvent(2,150, false, 90, BotType.MAINBOSS1, level1MainBoss1, false, 0, -300));

	  // after 100 ticks of Phase 2, level over is triggered.
	  le.push(new LevelOverEvent(3,100));


      return le;
  }
}
