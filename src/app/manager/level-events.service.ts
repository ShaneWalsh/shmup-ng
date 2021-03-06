import { Injectable } from '@angular/core';
import { LevelEvent, SpawnBotEvent, BotType, LevelOverEvent, NextPhaseEvent } from 'src/app/domain/events/level-events';

@Injectable({
  providedIn: 'root'
})
export class LevelEventsService {

  constructor() { }

  getLevel1Events(difficulty:number):LevelEvent[] {
      let le = [];

	  /*
	  	GAME MECHANICS
		difficulty = is a number and its either 0 (easy) or 1 (normal), see if/else just below the configs
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
	  // slow bot that fires the tracking bullets enemy-3-1
	  let diverConfig = {
		  bulletSpeed: 3, // how fast this bots buttets travel every tick
		  posXSpeed: 1.5,
		  posYSpeed: 2, // the speed the bot moves in the X and y Directions every Tick, X = Left/Right Y=Up/Down
		  bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
		  score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		  health:7, // health, when 0 Diver is dead.
	  };
	  // main boss guardian
	  let guardian1Config = {
		  bulletSpeed: 3, // how fast this bots buttets travel every tick
		  posXSpeed: 1.5,
		  posYSpeed: 1.5, // the speed the bot moves in the X and y Directions every Tick
		  bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
		  score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		  health:100, // health, when 0 Diver is dead.
	  };
	  let guardianCreeperConfig = {
		  bulletSpeed: 6, // how fast this bots buttets travel every tick
		  posXSpeed: 1.5,
		  posYSpeed: 2, // the speed the bot moves in the X and y Directions every Tick
		  bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
		  score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		health:30, // health, when 0 Diver is dead.
			retreatAfterShotsFiredLimit:5
	  };
	   // original fast moving fast shooting fighter enemy-2-2
	  let droneConfig = {
		  bulletSpeed: 6,
		  posXSpeed: 2,
		  posYSpeed: 2,
		  bTimerLimit: 60,
		  score: 1500,
		  health: 5,
	  };
	  // basic fast moving fast shooting redesigned fighter enemy-1-1
	  let fighterConfig = {
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 3,
		  bTimerLimit: 90,
		  anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
		  score: 1000,
		  health:5,
	  };
	  // top of the screen creeper enemy-07
	  let creeperConfig = {
		  posXSpeed: 1.5,
		  posYSpeed: 1.5,
		  bTimerLimit: 60,
		  score: 2500,
		  health:12,
	  };
	  // big fat slow guy, enemy-2-1
	  let rockConfig = {
		  posXSpeed: 3,
		  posYSpeed: 2,
		  score: 5000,
		  health:36,
		  driftXDistance:50
	  };
	  // giant fighter with two bullets
	  let level1MiniBoss1 = {
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 1.5,
		  bTimerLimit: 30,
		  anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
		  score: 20000,
		  health:400,
	  };
	   // spinning boss guy
	  let level1MiniBoss2 = {
		  bulletSpeed: 6,
		  moveSpeed: 5,
		  bTimerLimit: 20,
		  score: 25000,
		  health: 300,
	  };
	  // big boss with the big laser
	  let level1MainBoss1 = {
	  	score: 50000,
	  	health:250,
	  };

		let level2MiniBoss1 = {
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 1.5,
		  bTimerLimit: 30,
		  mTimerLimit: 60,
		  missileSpeed: 4.5,
		  destinationY: 1,
		  anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
		  score: 20000,
		  health:200,
	  };

	  if(difficulty == 0){ // easy difficulty, so reducing the bots health
		   // here I am overiding the fighters health and reducing it to one, and keeping all of the other values defined above.
		  fighterConfig = {...fighterConfig, health:3}
			// reducing drones health
			droneConfig = {...droneConfig, health: 3 }
			// reducing rocks health
			rockConfig = {...rockConfig, health: 26 }
			// reducing diver fire rate
			diverConfig = {...diverConfig, bTimerLimit: 90 }
			// reducing guardians health
			guardian1Config = {...guardian1Config, health: 70 }
			// reducing guardianCreepers health and shot limit
			guardianCreeperConfig = {...guardianCreeperConfig, health: 22, retreatAfterShotsFiredLimit: 3 }
			// reducing miniboss 1 health and fire rate
			level1MiniBoss1 = {...level1MiniBoss1, health: 300, bTimerLimit: 90 }
			// reducing miniboss 2 health and fire rate
			level1MiniBoss2 = {...level1MiniBoss2, health: 200, bTimerLimit: 35 }
			// reducing main boss 1 health
			level1MainBoss1 = {...level1MainBoss1, health: 175 }
	  } else if(difficulty == 1){ // normal, can just use the default settings above.
		  // use the defaults defined above
	  } else { //todo hard one day I assume
		  // todo
    }
	  //#########################################################################################
	  //######################          Phase Zero        #######################################
	  //#########################################################################################
		// wings middle
		le.push(new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
		le.push(new SpawnBotEvent(0, 80, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
		le.push(new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		// blade right
		le.push(new SpawnBotEvent(0, 190, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(0, 200, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
    le.push(new SpawnBotEvent(0, 210, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		// blade left
		le.push(new SpawnBotEvent(0, 260, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(0, 270, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(0, 280, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(0, 400, false, 0, BotType.DIVER, diverConfig, false, 10, -60));
		le.push(new SpawnBotEvent(0, 450, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
		le.push(new SpawnBotEvent(0, 430, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
		le.push(new SpawnBotEvent(0, 450, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(0, 400, false, 0, BotType.DIVER, diverConfig, false, 420, -60));
		le.push(new SpawnBotEvent(0, 700, false, 0, BotType.DRONE, droneConfig, false, 100, -60));
		le.push(new SpawnBotEvent(0, 720, false, 0, BotType.DRONE, droneConfig, false, 160, -60));
		le.push(new SpawnBotEvent(0, 740, false, 0, BotType.DRONE, droneConfig, false, 220, -60));
		le.push(new SpawnBotEvent(0, 720, false, 0, BotType.DRONE, droneConfig, false, 280, -60));
		le.push(new SpawnBotEvent(0, 700, false, 0, BotType.DRONE, droneConfig, false, 340, -60));
		le.push(new SpawnBotEvent(0, 900, false, 0, BotType.ROCK, rockConfig, false, 220, -80));
		le.push(new SpawnBotEvent(0, 1200, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(0, 1210, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(0, 1220, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(0, 1210, false, 0, BotType.DIVER, diverConfig, false, 70, -60));
		le.push(new SpawnBotEvent(0, 1500, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(0, 1510, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(0, 1520, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(0, 1510, false, 0, BotType.DIVER, diverConfig, false, 360, -60));
		le.push(new SpawnBotEvent(0, 1600, false, 0, BotType.ROCK, rockConfig, false, 120, -80));
		le.push(new SpawnBotEvent(0, 1600, false, 0, BotType.ROCK, rockConfig, false, 320, -80));
		le.push(new SpawnBotEvent(0, 1800, false, 0, BotType.DIVER, diverConfig, false, 200, -60));
		le.push(new SpawnBotEvent(0, 1800, false, 0, BotType.DIVER, diverConfig, false, 280, -60));
		le.push(new SpawnBotEvent(0, 1960, false, 0, BotType.DRONE, droneConfig, false, 10, -60));
		le.push(new SpawnBotEvent(0, 1930, false, 0, BotType.DRONE, droneConfig, false, 70, -60));
		le.push(new SpawnBotEvent(0, 1930, false, 0, BotType.DRONE, droneConfig, false, 360, -60));
		le.push(new SpawnBotEvent(0, 1960, false, 0, BotType.DRONE, droneConfig, false, 420, -60));
		le.push(new SpawnBotEvent(0, 2200, false, 0, BotType.FIGHTER, fighterConfig, false, 60, -60));
		le.push(new SpawnBotEvent(0, 2215, false, 0, BotType.FIGHTER, fighterConfig, false, 120, -60));
		le.push(new SpawnBotEvent(0, 2230, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
		le.push(new SpawnBotEvent(0, 2245, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
		le.push(new SpawnBotEvent(0, 2230, false, 0, BotType.DIVER, diverConfig, false, 420, -60));
		le.push(new SpawnBotEvent(0, 2500, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(0, 2515, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(0, 2530, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(0, 2545, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
		le.push(new SpawnBotEvent(0, 2530, false, 0, BotType.DIVER, diverConfig, false, 60, -60));
		le.push(new SpawnBotEvent(0, 2700, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(0, 2730, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(0, 2760, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(0, 2700, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(0, 2730, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(0, 2760, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(0, 2960, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(0, 2930, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(0, 2900, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(0, 2960, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(0, 2930, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(0, 2900, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(0, 3000, false, 0, BotType.ROCK, rockConfig, false, 240, -80));
		le.push(new SpawnBotEvent(0, 3100, false, 0, BotType.DRONE, droneConfig, false, 100, -60));
		le.push(new SpawnBotEvent(0, 3120, false, 0, BotType.DRONE, droneConfig, false, 160, -60));
		le.push(new SpawnBotEvent(0, 3140, false, 0, BotType.DRONE, droneConfig, false, 220, -60));
		le.push(new SpawnBotEvent(0, 3120, false, 0, BotType.DRONE, droneConfig, false, 280, -60));
		le.push(new SpawnBotEvent(0, 3100, false, 0, BotType.DRONE, droneConfig, false, 340, -60));


		le.push(new SpawnBotEvent(0, 3240, false, 0, BotType.ROCK, rockConfig, false, 240, -80));
		le.push(new SpawnBotEvent(0, 3300, false, 0, BotType.FIGHTER, fighterConfig, false, 120, -60));
		le.push(new SpawnBotEvent(0, 3300, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		// these are repeat events that will keep spawning while you fight the mini boss. They spawn at random positions.
		// le.push(new SpawnBotEvent(0,400,true,120,BotType.DIVER,diverConfig, true, 0, -60));
		// le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));
		// le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));
		// when a mini boss dies, the Phase moves forward by One.
		le.push(new SpawnBotEvent(0, 3700, false, 0, BotType.MINIBOSS1, level1MiniBoss1, false, 240, -300));

		// I've put in the new boss here so you can see him in action!
		//le.push(new SpawnBotEvent(0, 3700, false, 0, BotType.MINIBOSS1L2, level2MiniBoss1, false, 100, -300));

		// le.push(new SpawnBotEvent(0, 2200, true, 120, BotType.FIGHTER, fighterConfig, false, 360, -60));
		// le.push(new SpawnBotEvent(0, 2200, true, 120, BotType.FIGHTER, fighterConfig, false, 70, -60));
		//le.push(new NextPhaseEvent(0,1600));
		//#########################################################################################
		//######################          Phase One        #######################################
		//#########################################################################################
		// these are Phase 1 events, it will become phase 1 when MINIBOSS1 dies
		le.push(new SpawnBotEvent(1, 120, false, 0, BotType.DIVER, diverConfig, false, 120, -60));
		le.push(new SpawnBotEvent(1, 120, false, 0, BotType.DIVER, diverConfig, false, 240, -60));
		le.push(new SpawnBotEvent(1, 120, false, 0, BotType.DIVER, diverConfig, false, 360, -60));
		le.push(new SpawnBotEvent(1, 180, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
		le.push(new SpawnBotEvent(1, 180, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(1, 300, false, 0, BotType.DIVER, diverConfig, false, 180, -60));
		le.push(new SpawnBotEvent(1, 300, false, 0, BotType.DIVER, diverConfig, false, 300, -60));
		le.push(new SpawnBotEvent(1, 360, false, 0, BotType.FIGHTER, fighterConfig, false, 120, -60));
		le.push(new SpawnBotEvent(1, 340, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
		le.push(new SpawnBotEvent(1, 360, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(1, 460, false, 0, BotType.ROCK, rockConfig, false, 240, -80));
		le.push(new SpawnBotEvent(1, 570, false, 0, BotType.FIGHTER, fighterConfig, false, 30, -60));
		le.push(new SpawnBotEvent(1, 550, false, 0, BotType.FIGHTER, fighterConfig, false, 90, -60));
		le.push(new SpawnBotEvent(1, 550, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(1, 570, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(1, 690, false, 0, BotType.DRONE, droneConfig, false, 180, -60));
		le.push(new SpawnBotEvent(1, 670, false, 0, BotType.DRONE, droneConfig, false, 240, -60));
		le.push(new SpawnBotEvent(1, 690, false, 0, BotType.DRONE, droneConfig, false, 300, -60));
		le.push(new SpawnBotEvent(1, 760, false, 0, BotType.DRONE, droneConfig, false, 300, -60));
		le.push(new SpawnBotEvent(1, 775, false, 0, BotType.DRONE, droneConfig, false, 360, -60));
		le.push(new SpawnBotEvent(1, 785, false, 0, BotType.DRONE, droneConfig, false, 420, -60));
		le.push(new SpawnBotEvent(1, 830, false, 0, BotType.DRONE, droneConfig, false, 130, -60));
		le.push(new SpawnBotEvent(1, 845, false, 0, BotType.DRONE, droneConfig, false, 70, -60));
		le.push(new SpawnBotEvent(1, 855, false, 0, BotType.DRONE, droneConfig, false, 10, -60));
		le.push(new SpawnBotEvent(1, 950, false, 0, BotType.ROCK, rockConfig, false, 40, -60));
		le.push(new SpawnBotEvent(1, 1040, false, 0, BotType.ROCK, rockConfig, false, 140, -60));
		le.push(new SpawnBotEvent(1, 1130, false, 0, BotType.ROCK, rockConfig, false, 240, -60));
		le.push(new SpawnBotEvent(1, 1240, false, 0, BotType.ROCK, rockConfig, false, 340, -60));
		le.push(new SpawnBotEvent(1, 1330, false, 0, BotType.ROCK, rockConfig, false, 240, -60));
		le.push(new SpawnBotEvent(1, 1420, false, 0, BotType.ROCK, rockConfig, false, 140, -60));
		le.push(new SpawnBotEvent(1, 1510, false, 0, BotType.ROCK, rockConfig, false, 40, -60));
		le.push(new SpawnBotEvent(1, 1600, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(1, 1620, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(1, 1640, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(1, 1660, false, 0, BotType.FIGHTER, fighterConfig, false, 190, -60));
		le.push(new SpawnBotEvent(1, 1680, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
		le.push(new SpawnBotEvent(1, 1700, false, 0, BotType.FIGHTER, fighterConfig, false, 310, -60));
		le.push(new SpawnBotEvent(1, 1720, false, 0, BotType.FIGHTER, fighterConfig, false, 370, -60));
		le.push(new SpawnBotEvent(1, 1740, false, 0, BotType.FIGHTER, fighterConfig, false, 430, -60));
		le.push(new SpawnBotEvent(1, 1920, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(1, 1900, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(1, 1880, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(1, 1860, false, 0, BotType.FIGHTER, fighterConfig, false, 190, -60));
		le.push(new SpawnBotEvent(1, 1840, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
		le.push(new SpawnBotEvent(1, 1820, false, 0, BotType.FIGHTER, fighterConfig, false, 310, -60));
		le.push(new SpawnBotEvent(1, 1800, false, 0, BotType.FIGHTER, fighterConfig, false, 370, -60));
		le.push(new SpawnBotEvent(1, 1780, false, 0, BotType.FIGHTER, fighterConfig, false, 430, -60));
		le.push(new SpawnBotEvent(1, 1960, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(1, 1980, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(1, 2000, false, 0, BotType.FIGHTER, fighterConfig, false, 190, -60));
		le.push(new SpawnBotEvent(1, 2020, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
		le.push(new SpawnBotEvent(1, 2040, false, 0, BotType.FIGHTER, fighterConfig, false, 310, -60));
		le.push(new SpawnBotEvent(1, 2060, false, 0, BotType.FIGHTER, fighterConfig, false, 370, -60));
		le.push(new SpawnBotEvent(1, 2080, false, 0, BotType.FIGHTER, fighterConfig, false, 430, -60));
		le.push(new SpawnBotEvent(1, 2240, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(1, 2220, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(1, 2200, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(1, 2180, false, 0, BotType.FIGHTER, fighterConfig, false, 190, -60));
		le.push(new SpawnBotEvent(1, 2160, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
		le.push(new SpawnBotEvent(1, 2140, false, 0, BotType.FIGHTER, fighterConfig, false, 310, -60));
		le.push(new SpawnBotEvent(1, 2120, false, 0, BotType.FIGHTER, fighterConfig, false, 370, -60));
		le.push(new SpawnBotEvent(1, 2310, false, 0, BotType.FIGHTER, fighterConfig, false, 140, -60));
		le.push(new SpawnBotEvent(1, 2280, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 250, -60));
		le.push(new SpawnBotEvent(1, 2310, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(1, 2420, false, 0, BotType.FIGHTER, fighterConfig, false, 200, -60));
		le.push(new SpawnBotEvent(1, 2440, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(1, 2460, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 400, -60));
		le.push(new SpawnBotEvent(1, 2600, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
		le.push(new SpawnBotEvent(1, 2620, false, 0, BotType.FIGHTER, fighterConfig, false, 150, -60));
		le.push(new SpawnBotEvent(1, 2640, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 50, -60));
		le.push(new SpawnBotEvent(1, 2800, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 100, -80));
		le.push(new SpawnBotEvent(1, 2800, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 300, -80));
		le.push(new SpawnBotEvent(1, 3020, false, 0, BotType.DIVER, diverConfig, false, 60, -60));
		le.push(new SpawnBotEvent(1, 3020, false, 0, BotType.DIVER, diverConfig, false, 420, -60));
		le.push(new SpawnBotEvent(1, 3100, false, 0, BotType.DRONE, droneConfig, false, 180, -60));
		le.push(new SpawnBotEvent(1, 3050, false, 0, BotType.DRONE, droneConfig, false, 240, -60));
		le.push(new SpawnBotEvent(1, 3100, false, 0, BotType.DRONE, droneConfig, false, 300, -60));
		le.push(new SpawnBotEvent(1, 3300, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 100, -60));
		le.push(new SpawnBotEvent(1, 3400, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 240, -50));
		le.push(new SpawnBotEvent(1, 3350, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 400, -60));
		// le.push(new SpawnBotEvent(1, 400, true, 120, BotType.DIVER, diverConfig, true, 0, -60));
		// le.push(new SpawnBotEvent(1, 350, true, 90, BotType.FIGHTER, fighterConfig, true, 0, -60));
		// le.push(new SpawnBotEvent(1, 350, true, 90, BotType.FIGHTER, fighterConfig, true, 0, -60));
		le.push(new SpawnBotEvent(1, 3800, false, 0, BotType.MINIBOSS2, level1MiniBoss2, false, 300, -300));
		//#########################################################################################
		//######################          Phase Two       #######################################
		//#########################################################################################
		// these are Phase 2 events, it will become phase 2 when MINIBOSS2 dies
		le.push(new SpawnBotEvent(2, 120, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(2, 140, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(2, 160, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(2, 120, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(2, 140, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(2, 160, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(2, 260, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(2, 240, false, 0, BotType.FIGHTER, fighterConfig, false, 220, -60));
		le.push(new SpawnBotEvent(2, 260, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(2, 360, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(2, 380, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
		le.push(new SpawnBotEvent(2, 400, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(2, 360, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(2, 380, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		le.push(new SpawnBotEvent(2, 400, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(2, 500, false, 0, BotType.CREEPER, creeperConfig, false, 220, -60));
		le.push(new SpawnBotEvent(2, 660, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		le.push(new SpawnBotEvent(2, 680, false, 0, BotType.CREEPER, creeperConfig, false, 360, -60));
		le.push(new SpawnBotEvent(2, 700, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		le.push(new SpawnBotEvent(2, 720, false, 0, BotType.CREEPER, creeperConfig, false, 220, -60));
		le.push(new SpawnBotEvent(2, 660, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		le.push(new SpawnBotEvent(2, 680, false, 0, BotType.CREEPER, creeperConfig, false, 70, -60));
		le.push(new SpawnBotEvent(2, 700, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		le.push(new SpawnBotEvent(2, 800, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
		le.push(new SpawnBotEvent(2, 850, false, 0, BotType.CREEPER, creeperConfig, false, 70, -60));
		le.push(new SpawnBotEvent(2, 900, false, 0, BotType.CREEPER, creeperConfig, false, 130, -60));
		le.push(new SpawnBotEvent(2, 950, false, 0, BotType.CREEPER, creeperConfig, false, 190, -60));
		le.push(new SpawnBotEvent(2, 1000, false, 0, BotType.CREEPER, creeperConfig, false, 250, -60));
		le.push(new SpawnBotEvent(2, 1050, false, 0, BotType.CREEPER, creeperConfig, false, 310, -60));
		le.push(new SpawnBotEvent(2, 1100, false, 0, BotType.CREEPER, creeperConfig, false, 370, -60));
		le.push(new SpawnBotEvent(2, 1150, false, 0, BotType.CREEPER, creeperConfig, false, 430, -60));

		le.push(new SpawnBotEvent(2, 1800, false, 0, BotType.GUARDIAN1, guardian1Config, false, 380, -60));
		le.push(new SpawnBotEvent(2, 1800, false, 0, BotType.GUARDIAN1, guardian1Config, false, 5, -60));
		le.push(new SpawnBotEvent(2, 1500, false, 0, BotType.MAINBOSS1, level1MainBoss1, false, 0, -300));
	  // after 100 ticks of Phase 2, level over is triggered.
	  le.push(new LevelOverEvent(3,100));


      return le;
  }

	getLevel2Events(difficulty:number):LevelEvent[] {
		let le = [];

    // buggy will move to the right or left after it spawns depending on moveRight boolean, using the posXSpeed. posYSpeed should match the screen scroll speed of 1.
    let buggyConfigMR = {
			bulletSpeed: 6,
			posXSpeed: 1.5,
			posYSpeed: 1,
      bTimerLimit: 90,
      moveRight: true,
			score: 1000,
			health:5,
    };
    let buggyConfigML = {...buggyConfigMR,moveRight: false,};

    let AATankConfig = {
			bulletSpeed: 6,
			posXSpeed: 1.5,
			posYSpeed: 1,
      bTimerLimit: 90,
      moveToXCord: 400,
			score: 1000,
			health:25,
    };

    let sentryConfig = {
			bulletSpeed: 6,
			posXSpeed: 0,
			posYSpeed: 1,
      bTimerLimit: 90,
			score: 10000,
			health:35,
    };

    // main boss guardian
    let heavyJetConfig = {
      bulletSpeed: 6, // how fast this bots buttets travel every tick
      speed: 3,
      bTimerLimit: 90,
      score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
      health:20, // health, when 0 Diver is dead.
      targetCords:[{targetX:70,targetY:440},{targetX:110,targetY:535},{targetX:200,targetY:580},{targetX:280,targetY:580},{targetX:360,targetY:540},{targetX:410,targetY:440}, {targetX:410,targetY:-150}]
    };

		let diverConfig = {
			bulletSpeed: 3, // how fast this bots buttets travel every tick
			posXSpeed: 1.5,
			posYSpeed: 2, // the speed the bot moves in the X and y Directions every Tick, X = Left/Right Y=Up/Down
			bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
			score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
			health:7, // health, when 0 Diver is dead.
    };

		let kamikazeConfig = {
			bulletSpeed: 5,
			posXSpeed: 5,
			posYSpeed: 5,
			bTimerLimit: 60,
			score: 1500,
			health:7,
		};
		// main boss guardian
		let guardian1Config = {
			bulletSpeed: 3, // how fast this bots buttets travel every tick
			posXSpeed: 1.5,
			posYSpeed: 1.5, // the speed the bot moves in the X and y Directions every Tick
			bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
			score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
			health:100, // health, when 0 Diver is dead.
		};
		let guardianCreeperConfig = {
			bulletSpeed: 6, // how fast this bots buttets travel every tick
			posXSpeed: 1.5,
			posYSpeed: 2, // the speed the bot moves in the X and y Directions every Tick
			bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
			score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
			health:30, // health, when 0 Diver is dead.
			retreatAfterShotsFiredLimit:5
		};
		// original fast moving fast shooting fighter enemy-2-2
		let droneConfig = {
			bulletSpeed: 6,
			posXSpeed: 2,
			posYSpeed: 2,
			bTimerLimit: 60,
			score: 1500,
			health: 5,
		};
		// basic fast moving fast shooting redesigned fighter enemy-1-1
		let fighterConfig = {
			bulletSpeed: 6,
			posXSpeed: 3,
			posYSpeed: 3,
			bTimerLimit: 90,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 1000,
			health:5,
		};
		// top of the screen creeper enemy-07
		let creeperConfig = {
			posXSpeed: 1.5,
			posYSpeed: 1.5,
			bTimerLimit: 60,
			score: 2500,
			health:12,
		};
		// big fat slow guy, enemy-2-1
		let rockConfig = {
			posXSpeed: 3,
			posYSpeed: 2,
			score: 5000,
			health:36,
			driftXDistance:50
		};
		// giant fighter with two bullets
		let level1MiniBoss1 = {
			bulletSpeed: 6,
			posXSpeed: 3,
			posYSpeed: 1.5,
			bTimerLimit: 30,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 20000,
			health:400,
		};
		// spinning boss guy
		let level1MiniBoss2 = {
			bulletSpeed: 6,
			moveSpeed: 5,
			bTimerLimit: 20,
			score: 25000,
			health: 300,
		};
		// big boss with the big laser
		let level1MainBoss1 = {
			score: 50000,
			health:250,
		};

		let level2MiniBoss1 = {
			bulletSpeed: 6,
			posXSpeed: 3,
			posYSpeed: 1.5,
			bTimerLimit: 30,
			mTimerLimit: 60,
			missileSpeed: 4.5,
			destinationY: 1,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 20000,
			health:200,
    };

    let level2Starship = {
			bulletSpeed: 6,
			posXSpeed: 3,
			posYSpeed: 1.5,
			bTimerLimit: 30,
			mTimerLimit: 60,
			missileSpeed: 4.5,
			destinationY: 50,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 50000,
			health:350,
			weakPointHealth:75,
    };

    let judgeL2Config = {
      bulletSpeed: 6, // how fast this bots buttets travel every tick
      speed: 3,
      bTimerLimit: 30,
      score: 20000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
      health:300, // health, when 0 Diver is dead.
      targetCords:[
        {targetX:90,targetY:535},{targetX:90,targetY:90},
        {targetX:380,targetY:90},{targetX:380,targetY:535},
        {targetX:380,targetY:90},{targetX:90,targetY:90}
      ]
    };

		if(difficulty == 0){ // easy difficulty, so reducing the bots health
			// here I am overiding the fighters health and reducing it to one, and keeping all of the other values defined above.
			fighterConfig = {...fighterConfig, health:3}
			// reducing drones health
			droneConfig = {...droneConfig, health: 3 }
			// reducing rocks health
			rockConfig = {...rockConfig, health: 26 }
			// reducing diver fire rate
			diverConfig = {...diverConfig, bTimerLimit: 90 }
			// reducing guardians health
			guardian1Config = {...guardian1Config, health: 70 }
			// reducing guardianCreepers health and shot limit
			guardianCreeperConfig = {...guardianCreeperConfig, health: 22, retreatAfterShotsFiredLimit: 3 }
			// reducing miniboss 1 health and fire rate
			level1MiniBoss1 = {...level1MiniBoss1, health: 300, bTimerLimit: 90 }
			// reducing miniboss 2 health and fire rate
			level1MiniBoss2 = {...level1MiniBoss2, health: 200, bTimerLimit: 35 }
			// reducing main boss 1 health
			level1MainBoss1 = {...level1MainBoss1, health: 175 }
		} else if(difficulty == 1){ // normal, can just use the default settings above.
			// use the defaults defined above
		} else { //todo hard one day I assume
			// todo
		}

		//#########################################################################################
		//######################          Phase Zero        #######################################
    //#########################################################################################
    le.push(new SpawnBotEvent(0, 50, false, 0, BotType.SENTRY, sentryConfig, false, 140, -140));
    le.push(new SpawnBotEvent(0, 20, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 150, -80));
    le.push(new SpawnBotEvent(0, 40, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 400, -80));
    //le.push(new SpawnBotEvent(0, 500, false, 0, BotType.BUGGY, buggyConfigMR, false, -30, 80));

    //le.push(new SpawnBotEvent(0, 120, false, 0, BotType.AATANK, AATankConfig, false, -30, 20));
    le.push(new SpawnBotEvent(0, 120, false, 0, BotType.AATANK, {...AATankConfig, moveToXCord: 50 }, false, 400, 80));
    //le.push(new SpawnBotEvent(0, 300, false, 0, BotType.SENTRY, sentryConfig, false, 100, -140));
    // trick of the eye here, by increasing the AATanks yspeed by .5 it will look like its driving down, or leave it at 1 and it will look parked.
    le.push(new SpawnBotEvent(0, 300, false, 0, BotType.AATANK, {...AATankConfig, moveToXCord: 220, posYSpeed: 1.5 }, false, 220, -150));
    //le.push(new SpawnBotEvent(0, 220, false, 0, BotType.AATANK, {...AATankConfig, moveToXCord:50, posYSpeed:1.5}, false, 50, -150));
    le.push(new SpawnBotEvent(0, 220, false, 0, BotType.HEAVYJET, heavyJetConfig, false, 0, -150));
    le.push(new SpawnBotEvent(0, 650, false, 0, BotType.AATANK, {...AATankConfig, moveToXCord: 100 }, false, 400, 80));
    le.push(new SpawnBotEvent(0, 750, false, 0, BotType.AATANK, {...AATankConfig, moveToXCord: 150 }, false, 450, 80));
    le.push(new SpawnBotEvent(0, 800, false, 0, BotType.SENTRY, sentryConfig, false, 160, -140));
    le.push(new SpawnBotEvent(0, 800, false, 0, BotType.DIVER, diverConfig, false, 60, -80));

    le.push(new SpawnBotEvent(0, 1200, false, 0, BotType.MINIBOSS1L2, level2MiniBoss1, false, 100, -300));

    le.push(new SpawnBotEvent(1, 180, false, 0, BotType.JUDGEL2, judgeL2Config, false, 90, -300));

    le.push(new SpawnBotEvent(2, 2000, false, 0, BotType.STARSHIPL2, level2Starship, false, 150, -300));

    le.push(new LevelOverEvent(3,100));
    return le;

  }

  getLevel3Events(difficulty:number):LevelEvent[] {
		let le = [];

    // buggy will move to the right or left after it spawns depending on moveRight boolean, using the posXSpeed. posYSpeed should match the screen scroll speed of 1.
    let buggyConfigMR = {
			bulletSpeed: 6,
			posXSpeed: 1.5,
			posYSpeed: 1,
      bTimerLimit: 90,
      moveRight: true,
			score: 1000,
			health:5,
    };
    let buggyConfigML = {...buggyConfigMR,moveRight: false,};

    let AATankConfig = {
			bulletSpeed: 6,
			posXSpeed: 1.5,
			posYSpeed: 1,
      bTimerLimit: 90,
      moveToXCord: 400,
			score: 1000,
			health:25,
    };

    let sentryConfig = {
			bulletSpeed: 6,
			posXSpeed: 0,
			posYSpeed: 1,
      bTimerLimit: 90,
			score: 10000,
			health:35,
    };

    // main boss guardian
    let heavyJetConfig = {
      bulletSpeed: 6, // how fast this bots buttets travel every tick
      speed: 3,
      bTimerLimit: 90,
      score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
      health:20, // health, when 0 Diver is dead.
      targetCords:[{targetX:70,targetY:440},{targetX:110,targetY:535},{targetX:200,targetY:580},{targetX:280,targetY:580},{targetX:360,targetY:540},{targetX:410,targetY:440}, {targetX:410,targetY:-150}]
    };

		let diverConfig = {
			bulletSpeed: 3, // how fast this bots buttets travel every tick
			posXSpeed: 1.5,
			posYSpeed: 2, // the speed the bot moves in the X and y Directions every Tick, X = Left/Right Y=Up/Down
			bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
			score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
			health:7, // health, when 0 Diver is dead.
    };

		let kamikazeConfig = {
			bulletSpeed: 5,
			posXSpeed: 5,
			posYSpeed: 5,
			bTimerLimit: 60,
			score: 1500,
			health:7,
		};
		// main boss guardian
		let guardian1Config = {
			bulletSpeed: 3, // how fast this bots buttets travel every tick
			posXSpeed: 1.5,
			posYSpeed: 1.5, // the speed the bot moves in the X and y Directions every Tick
			bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
			score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
			health:100, // health, when 0 Diver is dead.
		};
		let guardianCreeperConfig = {
			bulletSpeed: 6, // how fast this bots buttets travel every tick
			posXSpeed: 1.5,
			posYSpeed: 2, // the speed the bot moves in the X and y Directions every Tick
			bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
			score: 2000, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
			health:30, // health, when 0 Diver is dead.
			retreatAfterShotsFiredLimit:5
		};
		// original fast moving fast shooting fighter enemy-2-2
		let droneConfig = {
			bulletSpeed: 6,
			posXSpeed: 2,
			posYSpeed: 2,
			bTimerLimit: 60,
			score: 1500,
			health: 5,
		};
		// basic fast moving fast shooting redesigned fighter enemy-1-1
		let fighterConfig = {
			bulletSpeed: 6,
			posXSpeed: 3,
			posYSpeed: 3,
			bTimerLimit: 90,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 1000,
			health:5,
		};
		// top of the screen creeper enemy-07
		let creeperConfig = {
			posXSpeed: 1.5,
			posYSpeed: 1.5,
			bTimerLimit: 60,
			score: 2500,
			health:12,
		};
		// big fat slow guy, enemy-2-1
		let rockConfig = {
			posXSpeed: 3,
			posYSpeed: 2,
			score: 5000,
			health:36,
			driftXDistance:50
		};
		// giant fighter with two bullets
		let level1MiniBoss1 = {
			bulletSpeed: 6,
			posXSpeed: 3,
			posYSpeed: 1.5,
			bTimerLimit: 30,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 20000,
			health:400,
		};

    let swordfishConfig = {
			bulletSpeed: 6,
			posXSpeed: 2.5,
			posYSpeed: 2.5,
			bTimerLimit: 90,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 1000,
			health:10,
		};

		// spinning boss guy
		let level1MiniBoss2 = {
			bulletSpeed: 6,
			moveSpeed: 5,
			bTimerLimit: 20,
			score: 25000,
			health: 300,
		};
		// big boss with the big laser
		let level1MainBoss1 = {
			score: 50000,
			health:250,
		};

		let level3MiniBoss1 = {
			bulletSpeed: 4,
			posXSpeed: 3,
			posYSpeed: 1.5,
			bTimerLimit: 80,// 80
			mTimerLimit: 60,
			missileSpeed: 4.5,
			destinationY: 1,
			anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
			score: 20000,
			health:750,
    };

    let level3MiniBoss2 = {
			moveSpeed: 4,
			score: 15000,
			health: 300, // the turret will trigger at health/2 so 300/2 = 150
      bTimerLimit: 60,
    };

		if(difficulty == 0){ // easy difficulty, so reducing the bots health
			// here I am overiding the fighters health and reducing it to one, and keeping all of the other values defined above.
			fighterConfig = {...fighterConfig, health:3}
			// reducing drones health
			droneConfig = {...droneConfig, health: 3 }
			// reducing rocks health
			rockConfig = {...rockConfig, health: 26 }
			// reducing diver fire rate
			diverConfig = {...diverConfig, bTimerLimit: 90 }
			// reducing guardians health
			guardian1Config = {...guardian1Config, health: 70 }
			// reducing guardianCreepers health and shot limit
			guardianCreeperConfig = {...guardianCreeperConfig, health: 22, retreatAfterShotsFiredLimit: 3 }
			// reducing miniboss 1 health and fire rate
			level1MiniBoss1 = {...level1MiniBoss1, health: 300, bTimerLimit: 90 }
			// reducing miniboss 2 health and fire rate
			level1MiniBoss2 = {...level1MiniBoss2, health: 200, bTimerLimit: 35 }
			// reducing main boss 1 health
			level1MainBoss1 = {...level1MainBoss1, health: 175 }
		} else if(difficulty == 1){ // normal, can just use the default settings above.
			// use the defaults defined above
		} else { //todo hard one day I assume
			// todo
		}

		//#########################################################################################
		//######################          Phase Zero        #######################################
    //#########################################################################################
    // le.push(new SpawnBotEvent(0, 40, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 200, -80));
		// le.push(new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
		// le.push(new SpawnBotEvent(0, 80, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
		// le.push(new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		// // blade right
		// le.push(new SpawnBotEvent(0, 190, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
		// le.push(new SpawnBotEvent(0, 200, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
    // le.push(new SpawnBotEvent(0, 210, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
		// // blade left
		// le.push(new SpawnBotEvent(0, 260, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
		// le.push(new SpawnBotEvent(0, 270, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
		// le.push(new SpawnBotEvent(0, 280, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
		// le.push(new SpawnBotEvent(0, 400, false, 0, BotType.DIVER, diverConfig, false, 10, -60));
		// le.push(new SpawnBotEvent(0, 450, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
		// le.push(new SpawnBotEvent(0, 430, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
		// le.push(new SpawnBotEvent(0, 450, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));

    le.push(new SpawnBotEvent(0, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(0, 30, false, 0, BotType.SWORDFISH, swordfishConfig, false, 180, -185));
    le.push(new SpawnBotEvent(0, 30, false, 0, BotType.SWORDFISH, swordfishConfig, false, 50, -185));
    le.push(new SpawnBotEvent(0, 30, false, 0, BotType.SWORDFISH, swordfishConfig, false, 300, -185));
    le.push(new SpawnBotEvent(0, 80, false, 0, BotType.MINIBOSS2L3, level3MiniBoss2, false, 0, -645));

    le.push(new SpawnBotEvent(1, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(1, 80, false, 0, BotType.MINIBOSS1L3, level3MiniBoss1, false, 0, -645));

    le.push(new LevelOverEvent(2,100));
    return le;
	}
}
