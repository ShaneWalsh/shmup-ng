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
    le.push(new LevelOverEvent(0, 10));
    return le;
  };
  getLevel2Events(difficulty:number):LevelEvent[] {
    let le = [];
    le.push(new LevelOverEvent(0, 10));
    return le;
  }
  getLevel3Events(difficulty:number):LevelEvent[] {
    let le = [];
    le.push(new LevelOverEvent(0, 10));
    return le;
  }


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

    le.push(new LevelOverEvent(3,100));
    return le;
  }

}
