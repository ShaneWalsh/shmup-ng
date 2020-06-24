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
		  score: 200, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		  health:3, // health, when 0 Diver is dead.
	  };
	  // main boss guardian
	  let guardian1Config = {
		  bulletSpeed: 3, // how fast this bots buttets travel every tick
		  posXSpeed: 1.5,
		  posYSpeed: 1.5, // the speed the bot moves in the X and y Directions every Tick
		  bTimerLimit: 60, // this means that a diver fires a button once every 40 ticks, e.g 3 times in 2 seconds.
		  score: 200, // this is only added to the players score if they kill the bot, if it leaves the screen the bot is simply removed.
  		  health:50, // health, when 0 Diver is dead.
	  };
	   // original fast moving fast shooting figher enemy-2-2
	  let droneConfig = {
		  bulletSpeed: 6,
		  posXSpeed: 2,
		  posYSpeed: 2,
		  bTimerLimit: 60,
		  score: 50,
		  health: 3,
	  };
	  // basic fast moving fast shooting redesigned figher enemy-1-1
	  let fighterConfig = {
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 3,
		  bTimerLimit: 90,
		  anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
		  score: 100,
		  health:3,
	  };
	  // top of the screen creeper enemy-07
	  let creeperConfig = {
		  posXSpeed: 1.5,
		  posYSpeed: 1.5,
		  bTimerLimit: 60,
		  score: 250,
		  health:5,
	  };
	  // big fat slow guy, enemy-2-1
	  let rockConfig = {
		  posXSpeed: 3,
		  posYSpeed: 2,
		  score: 500,
		  health:24,
		  driftXDistance:50
	  };
	  // giant fighter with two bullets
	  let level1MiniBoss1 = {
		  bulletSpeed: 6,
		  posXSpeed: 3,
		  posYSpeed: 1.5,
		  bTimerLimit: 30,
		  anaimationTimerLimit:4, // the bot has an animation for its engine, this animation swaps every 4 ticks.
		  score: 2000,
		  health:200,
	  };
	   // spinning boss guy
	  let level1MiniBoss2 = {
		  bulletSpeed: 6,
		  moveSpeed: 5,
		  bTimerLimit: 20,
		  score: 2500,
		  health: 150,
	  };
	  // big boss with the bog laser
	  let level1MainBoss1 = {
	  	score: 5000,
	  	health:250,
	  };

	  if(difficulty == 0){ // easy difficulty, so reducing the bots health
		   // here I am overiding the fighters health and reducing it to one, and keeping all of the other values defined above.
		  fighterConfig = {...fighterConfig, health:1}
		  // reducing rocks health, and uping his score value
		  rockConfig = {...rockConfig, health:12}
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
        le.push(new SpawnBotEvent(0, 3120, false, 0, BotType.DIVER, diverConfig, false, 60, -60));
        le.push(new SpawnBotEvent(0, 3120, false, 0, BotType.DIVER, diverConfig, false, 420, -60));
        le.push(new SpawnBotEvent(0, 3240, false, 0, BotType.ROCK, rockConfig, false, 240, -80));
        le.push(new SpawnBotEvent(0, 3300, false, 0, BotType.FIGHTER, fighterConfig, false, 120, -60));
        le.push(new SpawnBotEvent(0, 3300, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
	// these are repeat events that will keep spawning while you fight the mini boss. They spawn at random positions.
        // le.push(new SpawnBotEvent(0,400,true,120,BotType.DIVER,diverConfig, true, 0, -60));
        // le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));
        // le.push(new SpawnBotEvent(0,350,true,90,BotType.FIGHTER,fighterConfig, true, 0, -60));
        // when a mini boss dies, the Phase moves forward by One.
        le.push(new SpawnBotEvent(0, 3700, false, 0, BotType.MINIBOSS1, level1MiniBoss2, false, 240, -300));
        // le.push(new SpawnBotEvent(0, 2200, true, 120, BotType.FIGHTER, fighterConfig, false, 360, -60));
        // le.push(new SpawnBotEvent(0, 2200, true, 120, BotType.FIGHTER, fighterConfig, false, 70, -60));
        //le.push(new NextPhaseEvent(0,1600));
        //#########################################################################################
        //######################          Phase One        #######################################
        //#########################################################################################
        // these are Phase 1 events, it will become phase 1 when MINIBOSS1 dies
        le.push(new SpawnBotEvent(1, 120, false, 0, BotType.DIVER, diverConfig, false, 200, -60));
        le.push(new SpawnBotEvent(1, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
        le.push(new SpawnBotEvent(1, 85, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
        le.push(new SpawnBotEvent(1, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
        le.push(new SpawnBotEvent(1, 190, false, 0, BotType.FIGHTER, fighterConfig, false, 460, -60));
        le.push(new SpawnBotEvent(1, 195, false, 0, BotType.FIGHTER, fighterConfig, false, 520, -60));
        le.push(new SpawnBotEvent(1, 200, false, 0, BotType.FIGHTER, fighterConfig, false, 580, -60));
        le.push(new SpawnBotEvent(1, 250, false, 0, BotType.DIVER, diverConfig, false, 500, -60));
        le.push(new SpawnBotEvent(1, 260, false, 0, BotType.FIGHTER, fighterConfig, false, 220, -60));
        le.push(new SpawnBotEvent(1, 265, false, 0, BotType.FIGHTER, fighterConfig, false, 160, -60));
        le.push(new SpawnBotEvent(1, 270, false, 0, BotType.FIGHTER, fighterConfig, false, 100, -60));
        // le.push(new SpawnBotEvent(1, 400, true, 120, BotType.DIVER, diverConfig, true, 0, -60));
        // le.push(new SpawnBotEvent(1, 350, true, 90, BotType.FIGHTER, fighterConfig, true, 0, -60));
        // le.push(new SpawnBotEvent(1, 350, true, 90, BotType.FIGHTER, fighterConfig, true, 0, -60));
        le.push(new SpawnBotEvent(1, 350, false, 0, BotType.MINIBOSS2, level1MiniBoss2, false, 300, -300));
	  //#########################################################################################
	  //######################          Phase Two       #######################################
	  //#########################################################################################

	  // these are Phase 2 events, it will become phase 2 when MINIBOSS2 dies
	  le.push(new SpawnBotEvent(2,230,false,0,BotType.GUARDIAN1,guardian1Config, false, 380, -60));
	  le.push(new SpawnBotEvent(2,230,false,0,BotType.GUARDIAN1,guardian1Config, false, 5, -60));
	  le.push(new SpawnBotEvent(2,150, false, 0, BotType.MAINBOSS1, level1MainBoss1, false, 0, -300));

	  // after 100 ticks of Phase 2, level over is triggered.
	  le.push(new LevelOverEvent(3,100));


      return le;
  }
}
