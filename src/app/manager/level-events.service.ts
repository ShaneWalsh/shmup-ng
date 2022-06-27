import { Injectable } from '@angular/core';
import { LevelEvent, SpawnBotEvent, BotType, LevelOverEvent, NextPhaseEvent, SpawnTimer } from 'src/app/domain/events/level-events';
import { Level3SubBoss2 } from '../domain/bots/Level3SubBoss2';

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
        bulletSpeed: 3,
        posXSpeed: 1.5,
        posYSpeed: 2,
        bTimerLimit: 60,
        score: 4000,
        health: 7,
      };
      // main boss guardian
      let guardian1Config = {
          bulletSpeed: 3,
          posXSpeed: 1.5,
          posYSpeed: 1.5,
          bTimerLimit: 60,
          score: 8000,
          health: 100,
      };
      let guardianCreeperConfig = {
          bulletSpeed: 6,
          posXSpeed: 1.5,
          posYSpeed: 2,
          bTimerLimit: 50,
          score: 8000,
          health: 30,
          retreatAfterShotsFiredLimit: 5
      };
      // original fast moving fast shooting fighter enemy-2-2
      let droneConfig = {
          bulletSpeed: 6,
          posXSpeed: 2,
          posYSpeed: 2,
          bTimerLimit: 75,
          score: 2000,
          health: 7,
      };
      // basic fast moving fast shooting redesigned fighter enemy-1-1
      let fighterConfig = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 3,
          bTimerLimit: 90,
          anaimationTimerLimit: 4,
          score: 1000,
          health: 5,
      };
      // top of the screen creeper enemy-07
      let creeperConfig = {
          posXSpeed: 1.5,
          posYSpeed: 1.5,
          bTimerLimit: 60,
          score: 4000,
          health: 12,
      };
      // big fat slow guy, enemy-2-1
      let rockConfig = {
          posXSpeed: 3,
          posYSpeed: 2,
          score: 8000,
          health: 36,
          driftXDistance: 50
      };
      // giant fighter with two bullets
      let level1MiniBoss1 = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 1.5,
          bTimerLimit: 45,
          anaimationTimerLimit: 4,
          score: 200000,
          health: 400,
      };
      // spinning boss guy
      let level1MiniBoss2 = {
          bulletSpeed: 6,
          moveSpeed: 5,
          bTimerLimit: 20,
          score: 250000,
          health: 300,
      };
      // big boss with the big laser
      let level1MainBoss1 = {
          score: 500000,
          health: 250,
      };
      let level2MiniBoss1 = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 1.5,
          bTimerLimit: 30,
          mTimerLimit: 60,
          missileSpeed: 4.5,
          destinationY: 1,
          anaimationTimerLimit: 4,
          score: 20000,
          health: 250,
      };
      // big fat slow guy, enemy-2-1
      let sliderConfigLeft = {
        posXSpeed: 2,
        posYSpeed: 3,
        score: 8000,
        health: 20,
        side: "LEFT"
      };
      let sliderConfigRight = {side:"RIGHT",posXSpeed:-2, ...sliderConfigLeft}
      if (difficulty == 0) { // easy difficulty, so reducing the bots health
          // here I am overiding the fighters health and reducing it to one, and keeping all of the other values defined above.
          fighterConfig = {... fighterConfig, health: 3 }
          // reducing drones health
          droneConfig = {... droneConfig, health: 3}
          // reducing rocks health
          rockConfig = {... rockConfig,  health: 26 }
          // reducing diver fire rate
          diverConfig = {... diverConfig,  bTimerLimit: 80 }
          // reducing guardians health
          guardian1Config = {... guardian1Config,  health: 75 }
          // reducing guardianCreepers health and shot limit
          guardianCreeperConfig = {... guardianCreeperConfig,  health: 22, retreatAfterShotsFiredLimit: 3 }
          // reducing miniboss 1 health and fire rate
          level1MiniBoss1 = {... level1MiniBoss1,  health: 325, bTimerLimit: 65 }
          // reducing miniboss 2 health and fire rate
          level1MiniBoss2 = {... level1MiniBoss2,  health: 200, bTimerLimit: 35 }
          // reducing main boss 1 health
          level1MainBoss1 = {... level1MainBoss1,  health: 200 }
      }
      else if (difficulty == 1) { // normal, can just use the default settings above.
          // use the defaults defined above
      }
      else { //todo hard one day I assume
          // todo
      }
      //#########################################################################################
      //######################          Phase Zero        #######################################
      //#########################################################################################
      
      le.push(new SpawnBotEvent(0, 50, false, 0, BotType.SLIDER, sliderConfigLeft, false, -40, 150));
      le.push(new SpawnBotEvent(0, 50, false, 0, BotType.SLIDER, sliderConfigRight, false, 440, 250));
     
      // wings middle
      le.push(new SpawnBotEvent(0, 50, false, 0, BotType.LAZERGUARDIAN, fighterConfig, false, 200, 20));
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
      le.push(new SpawnBotEvent(0, 400, false, 0, BotType.DIVER, diverConfig, false, 346, -60));
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
      le.push(new SpawnBotEvent(0, 1510, false, 0, BotType.DIVER, diverConfig, false, 330, -60));
      le.push(new SpawnBotEvent(0, 1600, false, 0, BotType.ROCK, rockConfig, false, 120, -80));
      le.push(new SpawnBotEvent(0, 1600, false, 0, BotType.ROCK, rockConfig, false, 320, -80));
      le.push(new SpawnBotEvent(0, 1800, false, 0, BotType.DIVER, diverConfig, false, 110, -60));
      le.push(new SpawnBotEvent(0, 1800, false, 0, BotType.DIVER, diverConfig, false, 246, -60));
      le.push(new SpawnBotEvent(0, 1960, false, 0, BotType.DRONE, droneConfig, false, 10, -60));
      le.push(new SpawnBotEvent(0, 1930, false, 0, BotType.DRONE, droneConfig, false, 70, -60));
      le.push(new SpawnBotEvent(0, 1930, false, 0, BotType.DRONE, droneConfig, false, 360, -60));
      le.push(new SpawnBotEvent(0, 1960, false, 0, BotType.DRONE, droneConfig, false, 420, -60));
      le.push(new SpawnBotEvent(0, 2200, false, 0, BotType.FIGHTER, fighterConfig, false, 60, -60));
      le.push(new SpawnBotEvent(0, 2215, false, 0, BotType.FIGHTER, fighterConfig, false, 120, -60));
      le.push(new SpawnBotEvent(0, 2230, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
      le.push(new SpawnBotEvent(0, 2245, false, 0, BotType.FIGHTER, fighterConfig, false, 240, -60));
      le.push(new SpawnBotEvent(0, 2230, false, 0, BotType.DIVER, diverConfig, false, 346, -60));
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
      le.push(new SpawnBotEvent(0, 3500, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
      le.push(new SpawnBotEvent(0, 3600, false, 0, BotType.MINIBOSS1, level1MiniBoss1, false, 240, -300));
      // I've put in the new boss here so you can see him in action!
      //le.push(new SpawnBotEvent(0, 3700, false, 0, BotType.MINIBOSS1L2, level2MiniBoss1, false, 100, -300));
      // le.push(new SpawnBotEvent(0, 2200, true, 120, BotType.FIGHTER, fighterConfig, false, 360, -60));
      // le.push(new SpawnBotEvent(0, 2200, true, 120, BotType.FIGHTER, fighterConfig, false, 70, -60));
      //le.push(new NextPhaseEvent(0,1600));
      //#########################################################################################
      //######################          Phase One        #######################################
      //#########################################################################################
      // these are Phase 1 events, it will become phase 1 when MINIBOSS1 dies
      le.push(new SpawnBotEvent(1, 180, false, 0, BotType.DIVER, diverConfig, false, 5, -60));
      le.push(new SpawnBotEvent(1, 180, false, 0, BotType.DIVER, diverConfig, false, 200, -60));
      le.push(new SpawnBotEvent(1, 180, false, 0, BotType.DIVER, diverConfig, false, 355, -60));
      le.push(new SpawnBotEvent(1, 120, false, 0, BotType.FIGHTER, fighterConfig, false, 145, -60));
      le.push(new SpawnBotEvent(1, 120, false, 0, BotType.FIGHTER, fighterConfig, false, 320, -60));
      le.push(new SpawnBotEvent(1, 300, false, 0, BotType.DIVER, diverConfig, false, 100, -60));
      le.push(new SpawnBotEvent(1, 300, false, 0, BotType.DIVER, diverConfig, false, 280, -60));
      le.push(new SpawnBotEvent(1, 360, false, 0, BotType.FIGHTER, fighterConfig, false, 50, -60));
      le.push(new SpawnBotEvent(1, 340, false, 0, BotType.FIGHTER, fighterConfig, false, 230, -60));
      le.push(new SpawnBotEvent(1, 360, false, 0, BotType.FIGHTER, fighterConfig, false, 410, -60));
      le.push(new SpawnBotEvent(1, 460, false, 0, BotType.ROCK, rockConfig, false, 200, -80));
      le.push(new SpawnBotEvent(1, 570, false, 0, BotType.FIGHTER, fighterConfig, false, 30, -60));
      le.push(new SpawnBotEvent(1, 550, false, 0, BotType.FIGHTER, fighterConfig, false, 90, -60));
      le.push(new SpawnBotEvent(1, 550, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
      le.push(new SpawnBotEvent(1, 570, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
      le.push(new SpawnBotEvent(1, 690, false, 0, BotType.DRONE, droneConfig, false, 170, -60));
      le.push(new SpawnBotEvent(1, 670, false, 0, BotType.DRONE, droneConfig, false, 230, -60));
      le.push(new SpawnBotEvent(1, 690, false, 0, BotType.DRONE, droneConfig, false, 290, -60));
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
      le.push(new SpawnBotEvent(1, 1740, false, 0, BotType.FIGHTER, fighterConfig, false, 425, -60));
      le.push(new SpawnBotEvent(1, 1920, false, 0, BotType.FIGHTER, fighterConfig, false, 5, -60));
      le.push(new SpawnBotEvent(1, 1900, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
      le.push(new SpawnBotEvent(1, 1880, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
      le.push(new SpawnBotEvent(1, 1860, false, 0, BotType.FIGHTER, fighterConfig, false, 190, -60));
      le.push(new SpawnBotEvent(1, 1840, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
      le.push(new SpawnBotEvent(1, 1820, false, 0, BotType.FIGHTER, fighterConfig, false, 310, -60));
      le.push(new SpawnBotEvent(1, 1800, false, 0, BotType.FIGHTER, fighterConfig, false, 370, -60));
      le.push(new SpawnBotEvent(1, 1780, false, 0, BotType.FIGHTER, fighterConfig, false, 425, -60));
      le.push(new SpawnBotEvent(1, 1960, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
      le.push(new SpawnBotEvent(1, 1980, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
      le.push(new SpawnBotEvent(1, 2000, false, 0, BotType.FIGHTER, fighterConfig, false, 190, -60));
      le.push(new SpawnBotEvent(1, 2020, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
      le.push(new SpawnBotEvent(1, 2040, false, 0, BotType.FIGHTER, fighterConfig, false, 310, -60));
      le.push(new SpawnBotEvent(1, 2060, false, 0, BotType.FIGHTER, fighterConfig, false, 370, -60));
      le.push(new SpawnBotEvent(1, 2080, false, 0, BotType.FIGHTER, fighterConfig, false, 425, -60));
      le.push(new SpawnBotEvent(1, 2240, false, 0, BotType.FIGHTER, fighterConfig, false, 5, -60));
      le.push(new SpawnBotEvent(1, 2220, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
      le.push(new SpawnBotEvent(1, 2200, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
      le.push(new SpawnBotEvent(1, 2180, false, 0, BotType.FIGHTER, fighterConfig, false, 190, -60));
      le.push(new SpawnBotEvent(1, 2160, false, 0, BotType.FIGHTER, fighterConfig, false, 250, -60));
      le.push(new SpawnBotEvent(1, 2140, false, 0, BotType.FIGHTER, fighterConfig, false, 310, -60));
      le.push(new SpawnBotEvent(1, 2120, false, 0, BotType.FIGHTER, fighterConfig, false, 370, -60));
      le.push(new SpawnBotEvent(1, 2280, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 220, -60));
      le.push(new SpawnBotEvent(1, 2460, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 360, -60));
      le.push(new SpawnBotEvent(1, 2600, false, 0, BotType.FIGHTER, fighterConfig, false, 320, -60));
      le.push(new SpawnBotEvent(1, 2600, false, 0, BotType.FIGHTER, fighterConfig, false, 120, -60));
      le.push(new SpawnBotEvent(1, 2640, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 200, -60));
      le.push(new SpawnBotEvent(1, 2800, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 10, -90));
      le.push(new SpawnBotEvent(1, 2800, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 368, -80));
      le.push(new SpawnBotEvent(1, 3020, false, 0, BotType.DIVER, diverConfig, false, 125, -60));
      le.push(new SpawnBotEvent(1, 3020, false, 0, BotType.DIVER, diverConfig, false, 255, -60));
      le.push(new SpawnBotEvent(1, 3100, false, 0, BotType.DRONE, droneConfig, false, 230, -60));
      le.push(new SpawnBotEvent(1, 3300, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(1, 3400, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 200, -30));
      le.push(new SpawnBotEvent(1, 3350, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 375, -60));
      // le.push(new SpawnBotEvent(1, 400, true, 120, BotType.DIVER, diverConfig, true, 0, -60));
      // le.push(new SpawnBotEvent(1, 350, true, 90, BotType.FIGHTER, fighterConfig, true, 0, -60));
      // le.push(new SpawnBotEvent(1, 350, true, 90, BotType.FIGHTER, fighterConfig, true, 0, -60));
      le.push(new SpawnBotEvent(1, 3700, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
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
      le.push(new SpawnBotEvent(2, 1400, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
      le.push(new SpawnBotEvent(2, 1500, false, 0, BotType.MAINBOSS1, level1MainBoss1, false, 0, -300));
      // after 100 ticks of Phase 2, level over is triggered.
      le.push(new LevelOverEvent(3, 100));
      return le;
  };
  getLevel2Events(difficulty:number):LevelEvent[] {
      let le = [];
      // buggy will move to the right or left after it spawns depending on moveRight boolean, using the posXSpeed. posYSpeed should match the screen scroll speed of 1.
      let buggyConfigMR = {
          bulletSpeed: 7,
          posXSpeed: 2.4,
          posYSpeed: 1,
          bTimerLimit: 75,
          moveRight: true,
          score: 2000,
          health: 15,
      };
      let buggyConfigML = {... buggyConfigMR,  moveRight: false }
      let AATankConfig = {
          bulletSpeed: 6,
          posXSpeed: 1.5,
          posYSpeed: 1,
          bTimerLimit: 45,
          moveToXCord: 400,
          score: 8000,
          health: 32,
      };
      let sentryConfig = {
          bulletSpeed: 8,
          posXSpeed: 0,
          posYSpeed: 1,
          bTimerLimit: 90,
          score: 10000,
          health: 44,
      };
      // main boss guardian
      let heavyJetConfig = {
          bulletSpeed: 6,
          speed: 3,
          bTimerLimit: 75,
          score: 10000,
          health: 60,
          targetCords: [{ targetX: 70, targetY: 440 }, { targetX: 110, targetY: 535 }, { targetX: 200, targetY: 580 }, { targetX: 280, targetY: 580 }, { targetX: 360, targetY: 540 }, { targetX: 410, targetY: 440 }, { targetX: 410, targetY: -150 }]
      };
      let diverConfig = {
          bulletSpeed: 3,
          posXSpeed: 1.5,
          posYSpeed: 2,
          bTimerLimit: 60,
          score: 4000,
          health: 7,
      };
      let kamikazeConfig = {
          bulletSpeed: 5,
          posXSpeed: 4,
          posYSpeed: 4,
          bTimerLimit: 60,
          score: 1500,
          health: 9,
      };
      // main boss guardian
      let guardian1Config = {
          bulletSpeed: 3,
          posXSpeed: 1.5,
          posYSpeed: 1.5,
          bTimerLimit: 60,
          score: 8000,
          health: 100,
      };
      let guardianCreeperConfig = {
          bulletSpeed: 6,
          posXSpeed: 1.5,
          posYSpeed: 2,
          bTimerLimit: 50,
          score: 8000,
          health: 30,
          retreatAfterShotsFiredLimit: 5
      };
      // original fast moving fast shooting fighter enemy-2-2
      let droneConfig = {
          bulletSpeed: 6,
          posXSpeed: 2,
          posYSpeed: 2,
          bTimerLimit: 60,
          score: 2000,
          health: 7,
      };
      // basic fast moving fast shooting redesigned fighter enemy-1-1
      let fighterConfig = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 3,
          bTimerLimit: 90,
          anaimationTimerLimit: 4,
          score: 1000,
          health: 5,
      };
      // top of the screen creeper enemy-07
      let creeperConfig = {
          posXSpeed: 1.5,
          posYSpeed: 1.5,
          bTimerLimit: 60,
          score: 4000,
          health: 12,
      };
      // big fat slow guy, enemy-2-1
      let rockConfig = {
          posXSpeed: 3,
          posYSpeed: 2,
          score: 8000,
          health: 36,
          driftXDistance: 50
      };
      // giant fighter with two bullets
      let level1MiniBoss1 = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 1.5,
          bTimerLimit: 45,
          anaimationTimerLimit: 4,
          score: 200000,
          health: 400,
      };
      // spinning boss guy
      let level1MiniBoss2 = {
          bulletSpeed: 6,
          moveSpeed: 5,
          bTimerLimit: 20,
          score: 250000,
          health: 300,
      };
      // big boss with the big laser
      let level1MainBoss1 = {
          score: 500000,
          health: 250,
      };
      let level2MiniBoss1 = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 1.5,
          bTimerLimit: 30,
          mTimerLimit: 60,
          missileSpeed: 4.5,
          destinationY: 1,
          anaimationTimerLimit: 4,
          score: 250000,
          health: 250,
      };
      let level2Starship = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 1.5,
          bTimerLimit: 30,
          mTimerLimit: 60,
          missileSpeed: 4.5,
          destinationY: 220,
          anaimationTimerLimit: 4,
          score: 500000,
          health: 350,
          weakPointHealth: 100,
      };
      let judgeL2Config = {
          bulletSpeed: 6,
          speed: 3,
          bTimerLimit: 30,
          score: 350000,
          health: 300,
          targetCords: [
              { targetX: 90, targetY: 535 }, { targetX: 90, targetY: 90 },
              { targetX: 380, targetY: 90 }, { targetX: 380, targetY: 535 },
              { targetX: 380, targetY: 90 }, { targetX: 90, targetY: 90 }
          ]
      };
      if (difficulty == 0) { // easy difficulty, so reducing the bots health
          // here I am overiding the fighters health and reducing it to one, and keeping all of the other values defined above.
          fighterConfig = {... fighterConfig, health: 3 }
          // reducing drones health
          droneConfig = {... droneConfig,  health: 3 }
          // reducing rocks health
          rockConfig = {... rockConfig,  health: 26 }
          // reducing diver fire rate
          diverConfig = {... diverConfig,  bTimerLimit: 80 }
          // reducing guardians health
          guardian1Config = {... guardian1Config,  health: 75 }
          // reducing guardianCreepers health and shot limit
          guardianCreeperConfig = {... guardianCreeperConfig,  health: 22, retreatAfterShotsFiredLimit: 3 }
          // reducing miniboss 1 health and fire rate
          level1MiniBoss1 = {... level1MiniBoss1,  health: 325, bTimerLimit: 65 }
          // reducing miniboss 2 health and fire rate
          level1MiniBoss2 = {... level1MiniBoss2,  health: 200, bTimerLimit: 35 }
          // reducing main boss 1 health
          level1MainBoss1 = {... level1MainBoss1,  health: 200 }
      }
      else if (difficulty == 1) { // normal, can just use the default settings above.
          // use the defaults defined above
      }
      else { //todo hard one day I assume
          // todo
      }
      //#########################################################################################
      //######################          Phase Zero        #######################################
      //#########################################################################################
      // trick of the eye here, by increasing the AATanks yspeed by .5 it will look like its driving down, or leave it at 1 and it will look parked.
      le.push(new SpawnBotEvent(0, 100, false, 0, BotType.SENTRY, sentryConfig, false, 140, -140));
      le.push(new SpawnBotEvent(0, 40, false, 0, BotType.BUGGY, {... buggyConfigMR,  moveRight: true }, false, -100, 0));
      le.push(new SpawnBotEvent(0, 330, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: 230, posYSpeed: 1.5 }, false, 230, -150));
      le.push(new SpawnBotEvent(0, 650, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: -100 }, false, 400, 80));
      le.push(new SpawnBotEvent(0, 750, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: -150 }, false, 450, 80));
      le.push(new SpawnBotEvent(0, 815, false, 0, BotType.SENTRY, sentryConfig, false, 225, -140));
      le.push(new SpawnBotEvent(0, 850, false, 0, BotType.DIVER, diverConfig, false, 5, -80));
      le.push(new SpawnBotEvent(0, 850, false, 0, BotType.DIVER, diverConfig, false, 355, -80));
      le.push(new SpawnBotEvent(0, 1100, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: 130, posYSpeed: 1.5 }, false, 130, -150));
      le.push(new SpawnBotEvent(0, 1365, false, 0, BotType.BUGGY, {... buggyConfigMR,  moveRight: true }, false, -10, 0));
      le.push(new SpawnBotEvent(0, 1450, false, 0, BotType.BUGGY, {... buggyConfigMR,  moveRight: false }, false, 500, 0));
      le.push(new SpawnBotEvent(0, 1520, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: 20, posYSpeed: 1.5 }, false, 20, -150));
      le.push(new SpawnBotEvent(0, 1520, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: 350, posYSpeed: 1.5 }, false, 350, -150));
      le.push(new SpawnBotEvent(0, 1700, false, 0, BotType.SENTRY, sentryConfig, false, 30, -140));
      le.push(new SpawnBotEvent(0, 1920, false, 0, BotType.BUGGY, {... buggyConfigMR,  moveRight: true }, false, -100, 0));
      le.push(new SpawnBotEvent(0, 2000, false, 0, BotType.BUGGY, {... buggyConfigMR, moveRight: true }, false, -100, 0));
      le.push(new SpawnBotEvent(0, 2120, false, 0, BotType.SENTRY, sentryConfig, false, 330, -140));
      le.push(new SpawnBotEvent(0, 2270, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
      le.push(new SpawnBotEvent(0, 2270, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
      le.push(new SpawnBotEvent(0, 2330, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
      le.push(new SpawnBotEvent(0, 2330, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
      le.push(new SpawnBotEvent(0, 2550, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: -200 }, false, 400, 80));
      le.push(new SpawnBotEvent(0, 2630, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: 600 }, false, -100, 80));
      le.push(new SpawnBotEvent(0, 2680, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: 130, posYSpeed: 1.5 }, false, 130, -150));
      le.push(new SpawnBotEvent(0, 2800, false, 0, BotType.AATANK, {... AATankConfig,  moveToXCord: 215, posYSpeed: 1.5 }, false, 215, -150));
      le.push(new SpawnBotEvent(0, 3200, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
      le.push(new SpawnBotEvent(0, 3300, false, 0, BotType.MINIBOSS1L2, level2MiniBoss1, false, 100, -300));
      //#########################################################################################
      //######################          Phase One        #######################################
      //#########################################################################################
      le.push(new SpawnBotEvent(1, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 160, -60));
      le.push(new SpawnBotEvent(1, 80, false, 0, BotType.FIGHTER, fighterConfig, false, 215, -60));
      le.push(new SpawnBotEvent(1, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 280, -60));
      le.push(new SpawnBotEvent(1, 190, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
      le.push(new SpawnBotEvent(1, 200, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
      le.push(new SpawnBotEvent(1, 210, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
      le.push(new SpawnBotEvent(1, 260, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
      le.push(new SpawnBotEvent(1, 270, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
      le.push(new SpawnBotEvent(1, 280, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
      le.push(new SpawnBotEvent(1, 390, false, 0, BotType.DIVER, diverConfig, false, 5, -60));
      le.push(new SpawnBotEvent(1, 340, false, 0, BotType.DIVER, diverConfig, false, 180, -60));
      le.push(new SpawnBotEvent(1, 390, false, 0, BotType.DIVER, diverConfig, false, 355, -60));
      le.push(new SpawnBotEvent(1, 580, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(1, 480, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 190, -40));
      le.push(new SpawnBotEvent(1, 580, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 375, -60));
      le.push(new SpawnBotEvent(1, 950, false, 0, BotType.HEAVYJET, heavyJetConfig, false, 0, -150));
      le.push(new SpawnBotEvent(1, 1050, false, 0, BotType.DIVER, diverConfig, false, 180, -60));
      le.push(new SpawnBotEvent(1, 1300, false, 0, BotType.CREEPER, creeperConfig, false, 340, -60));
      le.push(new SpawnBotEvent(1, 1360, false, 0, BotType.ROCK, rockConfig, false, 200, -80));
      le.push(new SpawnBotEvent(1, 1300, false, 0, BotType.CREEPER, creeperConfig, false, 100, -60));
      le.push(new SpawnBotEvent(1, 1500, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 190, -40))
      le.push(new SpawnBotEvent(1, 1700, false, 0, BotType.DIVER, diverConfig, false, 5, -60));
      le.push(new SpawnBotEvent(1, 1800, false, 0, BotType.ROCK, rockConfig, false, 220, -80));
      le.push(new SpawnBotEvent(1, 1700, false, 0, BotType.DIVER, diverConfig, false, 355, -60));
      le.push(new SpawnBotEvent(1, 1900, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 90, -40))
      le.push(new SpawnBotEvent(1, 1900, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 290, -40))
      le.push(new SpawnBotEvent(1, 2000, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 190, -40));
      le.push(new SpawnBotEvent(1, 2050, false, 0, BotType.DIVER, diverConfig, false, 5, -60));
      le.push(new SpawnBotEvent(1, 2050, false, 0, BotType.DIVER, diverConfig, false, 355, -60));
      le.push(new SpawnBotEvent(1, 2200, false, 0, BotType.FIGHTER, fighterConfig, false, 160, -60));
      le.push(new SpawnBotEvent(1, 2100, false, 0, BotType.FIGHTER, fighterConfig, false, 215, -60));
      le.push(new SpawnBotEvent(1, 2200, false, 0, BotType.FIGHTER, fighterConfig, false, 280, -60));
      le.push(new SpawnBotEvent(1, 2250, false, 0, BotType.DIVER, diverConfig, false, 5, -60));
      le.push(new SpawnBotEvent(1, 2400, false, 0, BotType.DIVER, diverConfig, false, 180, -60));
      le.push(new SpawnBotEvent(1, 2250, false, 0, BotType.DIVER, diverConfig, false, 355, -60));
      le.push(new SpawnBotEvent(1, 2600, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 90, -40))
      le.push(new SpawnBotEvent(1, 2700, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 190, -40))
      le.push(new SpawnBotEvent(1, 2800, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 290, -40))
      le.push(new SpawnBotEvent(1, 3100, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
      le.push(new SpawnBotEvent(1, 3200, false, 0, BotType.JUDGEL2, judgeL2Config, false, 90, -300));
      //#########################################################################################
      //######################          Phase Two        #######################################
      //#########################################################################################
      le.push(new SpawnBotEvent(2, 100, false, 0, BotType.DIVER, diverConfig, false, 5, -60));
      le.push(new SpawnBotEvent(2, 60, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 190, -40));
      le.push(new SpawnBotEvent(2, 100, false, 0, BotType.DIVER, diverConfig, false, 355, -60));
      le.push(new SpawnBotEvent(2, 320, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 90, -40))
      le.push(new SpawnBotEvent(2, 360, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 290, -40))
      le.push(new SpawnBotEvent(2, 500, false, 0, BotType.HEAVYJET, heavyJetConfig, false, 0, -150));
      le.push(new SpawnBotEvent(2, 700, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(2, 710, false, 0, BotType.CREEPER, creeperConfig, false, 70, -60));
      le.push(new SpawnBotEvent(2, 720, false, 0, BotType.CREEPER, creeperConfig, false, 130, -60));
      le.push(new SpawnBotEvent(2, 730, false, 0, BotType.CREEPER, creeperConfig, false, 190, -60));
      le.push(new SpawnBotEvent(2, 740, false, 0, BotType.CREEPER, creeperConfig, false, 250, -60));
      le.push(new SpawnBotEvent(2, 900, false, 0, BotType.ROCK, rockConfig, false, 40, -60));
      le.push(new SpawnBotEvent(2, 1000, false, 0, BotType.ROCK, rockConfig, false, 190, -60));
      le.push(new SpawnBotEvent(2, 900, false, 0, BotType.ROCK, rockConfig, false, 340, -60));
      le.push(new SpawnBotEvent(2, 1000, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(2, 1000, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 375, -60));
      le.push(new SpawnBotEvent(2, 1100, false, 0, BotType.DIVER, diverConfig, false, 180, -60));
      le.push(new SpawnBotEvent(2, 1400, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
      le.push(new SpawnBotEvent(2, 1420, false, 0, BotType.FIGHTER, fighterConfig, false, 360, -60));
      le.push(new SpawnBotEvent(2, 1440, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
      le.push(new SpawnBotEvent(2, 1400, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
      le.push(new SpawnBotEvent(2, 1420, false, 0, BotType.FIGHTER, fighterConfig, false, 70, -60));
      le.push(new SpawnBotEvent(2, 1440, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
      le.push(new SpawnBotEvent(2, 1400, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 190, -40));
      le.push(new SpawnBotEvent(2, 1550, false, 0, BotType.DRONE, droneConfig, false, 170, -60));
      le.push(new SpawnBotEvent(2, 1600, false, 0, BotType.DRONE, droneConfig, false, 230, -60));
      le.push(new SpawnBotEvent(2, 1550, false, 0, BotType.DRONE, droneConfig, false, 290, -60));
      le.push(new SpawnBotEvent(2, 1750, false, 0, BotType.DIVER, diverConfig, false, 105, -60));
      le.push(new SpawnBotEvent(2, 1750, false, 0, BotType.DIVER, diverConfig, false, 275, -60));
      le.push(new SpawnBotEvent(2, 1780, false, 0, BotType.DRONE, droneConfig, false, 230, -60));
      le.push(new SpawnBotEvent(2, 1850, false, 0, BotType.DIVER, diverConfig, false, 85, -60));
      le.push(new SpawnBotEvent(2, 1850, false, 0, BotType.DIVER, diverConfig, false, 295, -60));
      le.push(new SpawnBotEvent(2, 2000, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(2, 2050, false, 0, BotType.CREEPER, creeperConfig, false, 70, -60));
      le.push(new SpawnBotEvent(2, 2100, false, 0, BotType.CREEPER, creeperConfig, false, 130, -60));
      le.push(new SpawnBotEvent(2, 2150, false, 0, BotType.CREEPER, creeperConfig, false, 190, -60));
      le.push(new SpawnBotEvent(2, 2150, false, 0, BotType.CREEPER, creeperConfig, false, 250, -60));
      le.push(new SpawnBotEvent(2, 2100, false, 0, BotType.CREEPER, creeperConfig, false, 310, -60));
      le.push(new SpawnBotEvent(2, 2050, false, 0, BotType.CREEPER, creeperConfig, false, 370, -60));
      le.push(new SpawnBotEvent(2, 2000, false, 0, BotType.CREEPER, creeperConfig, false, 430, -60));
      le.push(new SpawnBotEvent(2, 2400, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
      le.push(new SpawnBotEvent(2, 2500, false, 0, BotType.STARSHIPL2, level2Starship, false, 150, -300));
      le.push(new LevelOverEvent(3, 100));
      return le;
  };
  getLevel3Events(difficulty:number):LevelEvent[] {
      let le = [];
      // buggy will move to the right or left after it spawns depending on moveRight boolean, using the posXSpeed. posYSpeed should match the screen scroll speed of 1.
      let buggyConfigMR = {
          bulletSpeed: 7,
          posXSpeed: 2.4,
          posYSpeed: 1,
          bTimerLimit: 75,
          moveRight: true,
          score: 2000,
          health: 15,
      };
      let buggyConfigML = {... buggyConfigMR,  moveRight: false }
      let AATankConfig = {
          bulletSpeed: 6,
          posXSpeed: 1.5,
          posYSpeed: 1,
          bTimerLimit: 45,
          moveToXCord: 400,
          score: 8000,
          health: 32,
      };
      let sentryConfig = {
          bulletSpeed: 8,
          posXSpeed: 0,
          posYSpeed: 1,
          bTimerLimit: 90,
          score: 10000,
          health: 44,
      };
      // main boss guardian
      let heavyJetConfig = {
          bulletSpeed: 6,
          speed: 3,
          bTimerLimit: 75,
          score: 10000,
          health: 60,
          targetCords: [{ targetX: 70, targetY: 440 }, { targetX: 110, targetY: 535 }, { targetX: 200, targetY: 580 }, { targetX: 280, targetY: 580 }, { targetX: 360, targetY: 540 }, { targetX: 410, targetY: 440 }, { targetX: 410, targetY: -150 }]
      };
      let diverConfig = {
          bulletSpeed: 3,
          posXSpeed: 1.5,
          posYSpeed: 2,
          bTimerLimit: 60,
          score: 4000,
          health: 7,
      };
      let kamikazeConfig = {
          bulletSpeed: 5,
          posXSpeed: 4,
          posYSpeed: 4,
          bTimerLimit: 60,
          score: 1500,
          health: 9,
      };
      // main boss guardian
      let guardian1Config = {
          bulletSpeed: 3,
          posXSpeed: 1.5,
          posYSpeed: 1.5,
          bTimerLimit: 60,
          score: 8000,
          health: 100,
      };
      let guardianCreeperConfig = {
          bulletSpeed: 6,
          posXSpeed: 1.5,
          posYSpeed: 2,
          bTimerLimit: 50,
          score: 8000,
          health: 30,
          retreatAfterShotsFiredLimit: 5
      };
      // original fast moving fast shooting fighter enemy-2-2
      let droneConfig = {
          bulletSpeed: 6,
          posXSpeed: 2,
          posYSpeed: 2,
          bTimerLimit: 60,
          score: 2000,
          health: 7,
      };
      // basic fast moving fast shooting redesigned fighter enemy-1-1
      let fighterConfig = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 3,
          bTimerLimit: 90,
          anaimationTimerLimit: 4,
          score: 1000,
          health: 5,
      };
      // top of the screen creeper enemy-07
      let creeperConfig = {
          posXSpeed: 1.5,
          posYSpeed: 1.5,
          bTimerLimit: 60,
          score: 4000,
          health: 12,
      };
      // big fat slow guy, enemy-2-1
      let rockConfig = {
          posXSpeed: 3,
          posYSpeed: 2,
          score: 8000,
          health: 36,
          driftXDistance: 50
      };
      // giant fighter with two bullets
      let level1MiniBoss1 = {
          bulletSpeed: 6,
          posXSpeed: 3,
          posYSpeed: 1.5,
          bTimerLimit: 45,
          anaimationTimerLimit: 4,
          score: 200000,
          health: 400,
      };
      let swordfishConfig = {
          bulletSpeed: 6,
          posXSpeed: 2.5,
          posYSpeed: 2.5,
          bTimerLimit: 70,
          anaimationTimerLimit: 4,
          score: 4000,
          health: 10,
      };
      // spinning boss guy
      let level1MiniBoss2 = {
          bulletSpeed: 6,
          moveSpeed: 5,
          bTimerLimit: 20,
          score: 250000,
          health: 300,
      };
      // big boss with the big laser
      let level1MainBoss1 = {
          score: 500000,
          health: 250,
      };
      let level3MiniBoss1 = {
          bulletSpeed: 4,
          posXSpeed: 3,
          posYSpeed: 1.5,
          bTimerLimit: 80,
          mTimerLimit: 60,
          missileSpeed: 4.5,
          destinationY: 1,
          anaimationTimerLimit: 4,
          score: 20000,
          health: 750,
      };
      let level3MiniBoss2 = {
          moveSpeed: 3.5,
          score: 15000,
          health: 300,
          bTimerLimit: 60,
      };
      // The phase 0, is irrelevant 
      let finalBossSpawns = [
        new SpawnTimer(305,[
            new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60),
            new SpawnBotEvent(0, 80, false, 0, BotType.SWORDFISH, swordfishConfig, false, 205, -185),
            new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60),
            
            new SpawnBotEvent(0, 180, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60),
            new SpawnBotEvent(0, 170, false, 0, BotType.SWORDFISH, swordfishConfig, false, 205, -185),
            new SpawnBotEvent(0, 180, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60)
        ]),
        new SpawnTimer(250,[
            new SpawnBotEvent(0, 100, false, 0, BotType.SWORDFISH, swordfishConfig, false, 60, -185),
            new SpawnBotEvent(0, 110, false, 0, BotType.SWORDFISH, swordfishConfig, false, 300, -185),

            new SpawnBotEvent(0, 200, false, 0, BotType.SWORDFISH, swordfishConfig, false, 60, -185),
            new SpawnBotEvent(0, 210, false, 0, BotType.SWORDFISH, swordfishConfig, false, 300, -185)
        ])
      ]
      let finalBossAttr = {
          moveSpeed: 4,
          score: 15000,
          health: 300,
          bTimerLimit: 60,
          spawnTimer : finalBossSpawns
      };
      if (difficulty == 0) { // easy difficulty, so reducing the bots health
          // here I am overiding the fighters health and reducing it to one, and keeping all of the other values defined above.
          fighterConfig = {... fighterConfig,  health: 3 }
          // reducing drones health
          droneConfig = {... droneConfig,  health: 3 }
          // reducing rocks health
          rockConfig = {... rockConfig,  health: 26 }
          // reducing diver fire rate
          diverConfig = {... diverConfig,  bTimerLimit: 80 }
          // reducing guardians health
          guardian1Config = {... guardian1Config,  health: 75 }
          // reducing guardianCreepers health and shot limit
          guardianCreeperConfig = {... guardianCreeperConfig,  health: 22, retreatAfterShotsFiredLimit: 3 }
          // reducing miniboss 1 health and fire rate
          level1MiniBoss1 = {... level1MiniBoss1, health: 325, bTimerLimit: 65 }
          // reducing miniboss 2 health and fire rate
          level1MiniBoss2 = {... level1MiniBoss2, health: 200, bTimerLimit: 35 }
          // reducing main boss 1 health
          level1MainBoss1 = {... level1MainBoss1, health: 200 }
      }
      else if (difficulty == 1) { // normal, can just use the default settings above.
          // use the defaults defined above
      }
      else { //todo hard one day I assume
          // todo
      }
      //#########################################################################################
      //######################          Phase Zero        #######################################
      //#########################################################################################
      le.push(new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
      le.push(new SpawnBotEvent(0, 80, false, 0, BotType.SWORDFISH, swordfishConfig, false, 205, -185));
      le.push(new SpawnBotEvent(0, 90, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
      // blade right
      le.push(new SpawnBotEvent(0, 190, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
      le.push(new SpawnBotEvent(0, 200, false, 0, BotType.SWORDFISH, swordfishConfig, false, 325, -185));
      le.push(new SpawnBotEvent(0, 210, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
      // blade left
      le.push(new SpawnBotEvent(0, 260, false, 0, BotType.FIGHTER, fighterConfig, false, 130, -60));
      le.push(new SpawnBotEvent(0, 270, false, 0, BotType.SWORDFISH, swordfishConfig, false, 35, -185));
      le.push(new SpawnBotEvent(0, 280, false, 0, BotType.FIGHTER, fighterConfig, false, 10, -60));
      le.push(new SpawnBotEvent(0, 400, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(0, 500, false, 0, BotType.SWORDFISH, swordfishConfig, false, 200, -185));
      le.push(new SpawnBotEvent(0, 400, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 375, -60));
      le.push(new SpawnBotEvent(0, 650, false, 0, BotType.HEAVYJET, heavyJetConfig, false, 0, -150));
      le.push(new SpawnBotEvent(0, 720, false, 0, BotType.KAMIKAZE, kamikazeConfig, false, 190, -40));
      le.push(new SpawnBotEvent(0, 1200, false, 0, BotType.SWORDFISH, swordfishConfig, false, 25, -185));
      le.push(new SpawnBotEvent(0, 1250, false, 0, BotType.ROCK, rockConfig, false, 190, -80));
      le.push(new SpawnBotEvent(0, 1200, false, 0, BotType.SWORDFISH, swordfishConfig, false, 335, -185));
      le.push(new SpawnBotEvent(0, 1300, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(0, 1350, false, 0, BotType.CREEPER, creeperConfig, false, 70, -60));
      le.push(new SpawnBotEvent(0, 1350, false, 0, BotType.CREEPER, creeperConfig, false, 370, -60));
      le.push(new SpawnBotEvent(0, 1300, false, 0, BotType.CREEPER, creeperConfig, false, 430, -60));
      le.push(new SpawnBotEvent(0, 1400, false, 0, BotType.CREEPER, creeperConfig, false, 130, -60));
      le.push(new SpawnBotEvent(0, 1400, false, 0, BotType.CREEPER, creeperConfig, false, 310, -60));
      le.push(new SpawnBotEvent(0, 1500, false, 0, BotType.CREEPER, creeperConfig, false, 190, -60));
      le.push(new SpawnBotEvent(0, 1500, false, 0, BotType.CREEPER, creeperConfig, false, 250, -60));
      le.push(new SpawnBotEvent(0, 1550, false, 0, BotType.SWORDFISH, swordfishConfig, false, 35, -185));
      le.push(new SpawnBotEvent(0, 1550, false, 0, BotType.SWORDFISH, swordfishConfig, false, 335, -185));
      le.push(new SpawnBotEvent(0, 1700, false, 0, BotType.CREEPER, creeperConfig, false, 130, -60));
      le.push(new SpawnBotEvent(0, 1700, false, 0, BotType.CREEPER, creeperConfig, false, 310, -60));
      le.push(new SpawnBotEvent(0, 2000, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
      le.push(new SpawnBotEvent(0, 2100, false, 0, BotType.MINIBOSS1L3, level3MiniBoss1, false, 0, -645));
      //#########################################################################################
      //######################          Phase One        #######################################
      //#########################################################################################;
      le.push(new SpawnBotEvent(1, 90, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(1, 90, false, 0, BotType.CREEPER, creeperConfig, false, 430, -60));
      le.push(new SpawnBotEvent(1, 120, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 190, -40));
      le.push(new SpawnBotEvent(1, 220, false, 0, BotType.SWORDFISH, swordfishConfig, false, 60, -185));
      le.push(new SpawnBotEvent(1, 220, false, 0, BotType.SWORDFISH, swordfishConfig, false, 300, -185));
      le.push(new SpawnBotEvent(1, 510, false, 0, BotType.FIGHTER, fighterConfig, false, 170, -60));
      le.push(new SpawnBotEvent(1, 490, false, 0, BotType.FIGHTER, fighterConfig, false, 230, -60));
      le.push(new SpawnBotEvent(1, 510, false, 0, BotType.FIGHTER, fighterConfig, false, 290, -60));
      le.push(new SpawnBotEvent(1, 700, false, 0, BotType.HEAVYJET, heavyJetConfig, false, 0, -150));
      le.push(new SpawnBotEvent(1, 700, false, 0, BotType.CREEPER, creeperConfig, false, 190, -60));
      le.push(new SpawnBotEvent(1, 720, false, 0, BotType.CREEPER, creeperConfig, false, 250, -60));
      le.push(new SpawnBotEvent(1, 740, false, 0, BotType.CREEPER, creeperConfig, false, 310, -60));
      le.push(new SpawnBotEvent(1, 760, false, 0, BotType.CREEPER, creeperConfig, false, 370, -60));
      le.push(new SpawnBotEvent(1, 780, false, 0, BotType.CREEPER, creeperConfig, false, 430, -60));
      le.push(new SpawnBotEvent(1, 800, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(1, 820, false, 0, BotType.CREEPER, creeperConfig, false, 70, -60));
      le.push(new SpawnBotEvent(1, 840, false, 0, BotType.CREEPER, creeperConfig, false, 130, -60));
      le.push(new SpawnBotEvent(1, 860, false, 0, BotType.CREEPER, creeperConfig, false, 190, -60));
      le.push(new SpawnBotEvent(1, 880, false, 0, BotType.CREEPER, creeperConfig, false, 250, -60));
      le.push(new SpawnBotEvent(1, 1200, false, 0, BotType.SWORDFISH, swordfishConfig, false, 35, -185));
      le.push(new SpawnBotEvent(1, 1200, false, 0, BotType.SWORDFISH, swordfishConfig, false, 335, -185));
      le.push(new SpawnBotEvent(1, 1300, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 200, -60));
      le.push(new SpawnBotEvent(1, 1400, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 10, -90));
      le.push(new SpawnBotEvent(1, 1400, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 368, -80));
      le.push(new SpawnBotEvent(1, 1550, false, 0, BotType.SWORDFISH, swordfishConfig, false, 60, -185));
      le.push(new SpawnBotEvent(1, 1550, false, 0, BotType.SWORDFISH, swordfishConfig, false, 300, -185));
      le.push(new SpawnBotEvent(1, 1900, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(1, 2000, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 200, -30));
      le.push(new SpawnBotEvent(1, 1900, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 375, -60));
      le.push(new SpawnBotEvent(1, 2300, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
      le.push(new SpawnBotEvent(1, 2400, false, 0, BotType.MINIBOSS2L3, level3MiniBoss2, false, 0, -645));
      //#########################################################################################
      //######################          Phase Two       #######################################
      //#########################################################################################
      le.push(new SpawnBotEvent(2, 60, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(2, 60, false, 0, BotType.CREEPER, creeperConfig, false, 430, -60));
      le.push(new SpawnBotEvent(2, 120, false, 0, BotType.SWORDFISH, swordfishConfig, false, 60, -185));
      le.push(new SpawnBotEvent(2, 120, false, 0, BotType.SWORDFISH, swordfishConfig, false, 300, -185));
      le.push(new SpawnBotEvent(2, 200, false, 0, BotType.GUARDIANCREEPER, guardianCreeperConfig, false, 200, -30));
      le.push(new SpawnBotEvent(2, 300, false, 0, BotType.FIGHTER, fighterConfig, false, 180, -60));
      le.push(new SpawnBotEvent(2, 280, false, 0, BotType.SWORDFISH, swordfishConfig, false, 205, -185));
      le.push(new SpawnBotEvent(2, 300, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
      le.push(new SpawnBotEvent(2, 300, false, 0, BotType.FIGHTER, fighterConfig, false, 300, -60));
      le.push(new SpawnBotEvent(2, 280, false, 0, BotType.SWORDFISH, swordfishConfig, false, 325, -185));
      le.push(new SpawnBotEvent(2, 300, false, 0, BotType.FIGHTER, fighterConfig, false, 420, -60));
      le.push(new SpawnBotEvent(2, 800, false, 0, BotType.CREEPER, creeperConfig, false, 10, -60));
      le.push(new SpawnBotEvent(2, 850, false, 0, BotType.CREEPER, creeperConfig, false, 70, -60));
      le.push(new SpawnBotEvent(2, 900, false, 0, BotType.CREEPER, creeperConfig, false, 130, -60));
      le.push(new SpawnBotEvent(2, 950, false, 0, BotType.CREEPER, creeperConfig, false, 190, -60));
      le.push(new SpawnBotEvent(2, 1000, false, 0, BotType.CREEPER, creeperConfig, false, 250, -60));
      le.push(new SpawnBotEvent(2, 1050, false, 0, BotType.CREEPER, creeperConfig, false, 310, -60));
      le.push(new SpawnBotEvent(2, 1100, false, 0, BotType.CREEPER, creeperConfig, false, 370, -60));
      le.push(new SpawnBotEvent(2, 1150, false, 0, BotType.CREEPER, creeperConfig, false, 430, -60));
      le.push(new SpawnBotEvent(2, 1400, false, 0, BotType.FINALBOSS, finalBossAttr, false, 100, -645));
      le.push(new LevelOverEvent(3, 100));
      return le;
  };


  getLevel4Events(difficulty:number):LevelEvent[] {
    let le = [];

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


    if(difficulty == 0){ // easy difficulty, so reducing the bots health
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
    le.push(new SpawnBotEvent(0, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(0, 80, false, 0, BotType.MINIBOSS1, level1MiniBoss1, false, 240, -300));
    //#########################################################################################
    //######################          Phase One        #######################################
    //#########################################################################################
    // these are Phase 1 events, it will become phase 1 when MINIBOSS1 dies
    le.push(new SpawnBotEvent(1, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(1, 80, false, 0, BotType.MINIBOSS2, level1MiniBoss2, false, 300, -300));
    //#########################################################################################
    //######################          Phase Two       #######################################
    //#########################################################################################

    le.push(new SpawnBotEvent(2, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(2, 80, false, 0, BotType.MAINBOSS1, level1MainBoss1, false, 0, -300));
    // after 100 ticks of Phase 2, level over is triggered.
    le.push(new LevelOverEvent(3,100));
    return le;
  }

  getLevel5Events(difficulty:number):LevelEvent[] {
    let le = [];

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
      destinationY: 220,
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
      // todo
    } else if(difficulty == 1){ // normal, can just use the default settings above.
      // use the defaults defined above
    } else { //todo hard one day I assume
      // todo
    }

    le.push(new SpawnBotEvent(0, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(0, 80, false, 0, BotType.MINIBOSS1L2, level2MiniBoss1, false, 100, -300));

    le.push(new SpawnBotEvent(1, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(1, 80, false, 0, BotType.JUDGEL2, judgeL2Config, false, 90, -300));

    le.push(new SpawnBotEvent(2, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(2, 80, false, 0, BotType.STARSHIPL2, level2Starship, false, 150, -300));

    le.push(new LevelOverEvent(3,100));
    return le;
  }

  getLevel6Events(difficulty:number):LevelEvent[] {
    let le = [];

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

    let finalBossAttr = {
      moveSpeed: 4,
      score: 15000,
      health: 300, // the turret will trigger at health/2 so 300/2 = 150
      bTimerLimit: 60,
    };

    if(difficulty == 0){ // easy difficulty, so reducing the bots health
      // todo
    } else if(difficulty == 1){ // normal, can just use the default settings above.
      // use the defaults defined above
    } else { //todo hard one day I assume
      // todo
    }

    le.push(new SpawnBotEvent(0, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(0, 80, false, 0, BotType.MINIBOSS1L3, level3MiniBoss1, false, 0, -645));

    le.push(new SpawnBotEvent(1, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(1, 80, false, 0, BotType.MINIBOSS2L3, level3MiniBoss2, false, 0, -645));

    le.push(new SpawnBotEvent(2, 30, false, 0, BotType.CAUTIONANIMATION, null, false, 108, 278));
    le.push(new SpawnBotEvent(2, 80, false, 0, BotType.FINALBOSS, finalBossAttr, false, 100, -645));

    le.push(new LevelOverEvent(2,100));
    return le;
  }

}
