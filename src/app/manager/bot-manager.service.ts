import { HeavyJet } from './../domain/bots/HeavyJet';
import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { BotInstance } from 'src/app/domain/bots/BotInstance';
import { LevelInstance } from 'src/app/manager/level-manager.service';
import { Diver } from 'src/app/domain/bots/Diver';
import { ResourcesService } from 'src/app/services/resources.service';
import { BulletManagerService } from 'src/app/manager/bullet-manager.service';
import { PlayerObj, PlayerService } from 'src/app/services/player.service';
import { Fighter } from '../domain/bots/Fighter';
import { Rock } from '../domain/bots/Rock';
import { Level1SubBoss } from '../domain/bots/Level1SubBoss';
import { Drone } from '../domain/bots/Drone';
import { SpriteSheet } from '../domain/SpriteSheet';
import { Level1SubBoss2 } from '../domain/bots/Level1SubBoss2';
import { HitBox } from '../domain/HitBox';
import { Creeper } from 'src/app/domain/bots/Creeper';
import { Level1Boss1 } from 'src/app/domain/bots/Level1Boss1';
import { Guardian1 } from 'src/app/domain/bots/Guardian1';
import { GuardianCreeper } from 'src/app/domain/bots/GuardianCreeper';
import { Level2SubBoss1 } from 'src/app/domain/bots/Level2SubBoss1';
import { Level2SubBoss1V2 } from '../domain/bots/Level2SubBoss1V2';
import { CanvasContainer } from '../domain/CanvasContainer';
import { Buggy } from '../domain/bots/ground/Buggy';
import { AATank } from '../domain/bots/ground/AATank';
import { BackgroundElement } from '../domain/BackgroundElement';

/**
 * Going to manage the created bots, spawned by the level manager. Its going to emit when they are destroyed or when they leave the screen.
 */
@Injectable({
    providedIn: 'root'
})
export class BotManagerService {
    private botDestroyed: Subject<BotInstance> = new Subject();
    private botCreated: Subject<BotInstance> = new Subject();
    private botRemoved: Subject<BotInstance> = new Subject();
	  private deathAnimtionTimer:number=4;

    private botsArr: BotInstance[] = [];
    private backgroundElementsArr: BackgroundElement[] = [];
    private spriteSheetArr: SpriteSheet[] = [];

    constructor(private resourcesService: ResourcesService) {

    }

    clean() {
        this.botsArr = [];
        this.spriteSheetArr = [];
    }

    update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, bulletManagerService: BulletManagerService, playerService: PlayerService): any {
        //throw new Error("Method not implemented.");
        let botArrClone = [...this.botsArr]; // why clone it? So I can update the original array without effecting the for loop.
        for (let i = 0; i < botArrClone.length; i++) {
            const bot = botArrClone[i];
            bot.update(levelInstance, canvasContainer, this, bulletManagerService, playerService);
            if (playerService.currentPlayer && !bot.isGroundBot() && bot.getPlayerCollisionHitBoxes() != null && bot.getPlayerCollisionHitBoxes().length > 0){
              const collsionBoxes = bot.getPlayerCollisionHitBoxes();
              for(let i = 0; i < collsionBoxes.length;i++){
                if(playerService.currentPlayer.hasPlayerBeenHit(bot,collsionBoxes[i] )) {
                  if(bot.isDeathOnColision()){
                    this.removeBot(bot); // trigger death todo
                  }
                  playerService.killCurrentPlayer();
                  break;
                }
              }
            }
        }

        let spriteSheetArrClone = [...this.spriteSheetArr]; // why clone it? So I can update the original array without effecting the for loop.
        for (let i = 0; i < spriteSheetArrClone.length; i++) {
            const sprite = spriteSheetArrClone[i];
            sprite.update(levelInstance, canvasContainer, this, bulletManagerService, playerService);
        }
        let backgroundElementsArrClone = [...this.backgroundElementsArr];
        for (let i = 0; i < backgroundElementsArrClone.length; i++) {
            const element = backgroundElementsArrClone[i];
            element.update(levelInstance, canvasContainer, this, bulletManagerService, playerService);
        }
    }

    generateDiver(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Diver(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("enemy-3-1"), this.resourcesService.getRes().get("enemy-3-1-damaged"), 46, 52);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

	generateGuardian1(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Guardian1(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("main-boss-1-guardian"), this.resourcesService.getRes().get("main-boss-1-guardian-damage"));
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateHeavyJet(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
      let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
      let newBot = new HeavyJet(config, posObj.posX, posObj.posY,
        this.resourcesService.getRes().get("heavy-jet"),
        this.resourcesService.getRes().get("heavy-jet-damaged"),
        this.resourcesService.getRes().get("heavy-jet-shadow")
        );
      this.botsArr.push(newBot);
      this.botCreated.next(newBot);
  }

		generateGuardianCreeper(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
      let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);

      let newBot = new GuardianCreeper(config, posObj.posX, posObj.posY,
      this.resourcesService.getRes().get("enemy-08-1"),
      this.resourcesService.getRes().get("enemy-08-2"),
      this.resourcesService.getRes().get("enemy-08-damaged"));
      this.botsArr.push(newBot);
      this.botCreated.next(newBot);
    }

    generateBuggy(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Buggy(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("ground-enemy-1-1"),
        this.resourcesService.getRes().get("ground-enemy-1-1-cannon"),
        this.resourcesService.getRes().get("miniboss-3-muzzle-flash"),
        120, 70);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }
    generateAATank(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new AATank(config, posObj.posX, posObj.posY,
        this.resourcesService.getRes().get("aa-tank-hull-horizontal"),
        this.resourcesService.getRes().get("aa-tank-hull-horizontal-dam"),
        this.resourcesService.getRes().get("aa-tank-hull-horizontal-shadow"),
        this.resourcesService.getRes().get("aa-tank-track-horizontal"),
        this.resourcesService.getRes().get("aa-tank-turret-damaged"),
        this.resourcesService.getRes().get("aa-tank-turret-1"),
        this.resourcesService.getRes().get("aa-tank-turret-2"),
        this.resourcesService.getRes().get("aa-tank-turret-3"),
        this.resourcesService.getRes().get("aa-tank-turret-4"),
        this.resourcesService.getRes().get("aa-tank-turret-5"),
        this.resourcesService.getRes().get("aa-tank-turret-6"),
        this.resourcesService.getRes().get("aa-tank-turret-7"),
        this.resourcesService.getRes().get("aa-tank-turret-8"),
        this.resourcesService.getRes().get("miniboss-3-muzzle-flash"),
        120, 70);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateFighter(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Fighter(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("enemy-1-1"), this.resourcesService.getRes().get("enemy-1-2"), 52, 56);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateFighterV2(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Fighter(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("enemy-1-1-v2"), this.resourcesService.getRes().get("enemy-1-2-v2"), 48, 78, new HitBox(0, 0, 48, 78), this.resourcesService.getRes().get("enemy-1-damaged-v2"),this.resourcesService.getRes().get("enemy-1-1-shadow-separate"));
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateRock(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Rock(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("enemy-2-1-v2"), this.resourcesService.getRes().get("enemy-2-2-v2"), 108, 140, new HitBox(0, 0, 108, 140), this.resourcesService.getRes().get("enemy-2-damaged-v2"));
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateDrone(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
				let newBot = new Drone(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("enemy-2-1"),
				this.resourcesService.getRes().get("enemy-2-2"), 56, 78,new HitBox(0, 0, 56, 78),this.resourcesService.getRes().get("drone-damaged"));

        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateCreeper(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -60, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Creeper(config, posObj.posX, posObj.posY,
            this.resourcesService.getRes().get("enemy-07"),
            this.resourcesService.getRes().get("enemy-07-damaged"),

            [this.resourcesService.getRes().get("enemy-07-firing-1"),
            this.resourcesService.getRes().get("enemy-07-firing-2"),
            this.resourcesService.getRes().get("enemy-07-firing-3")],

            this.resourcesService.getRes().get("enemy-07-firing-4"),

            [this.resourcesService.getRes().get("enemy-07-firing-5"),
            this.resourcesService.getRes().get("enemy-07-firing-6")]);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateLevel1SubBoss1(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -300, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Level1SubBoss(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("boss-sub-1"), this.resourcesService.getRes().get("boss-sub-1_2"), this.resourcesService.getRes().get("miniboss-1-damaged"),196, 252);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateLevel1SubBoss2(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -300, config: any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let hitz = new HitBox(44, 0, 162, 160);
        let newBot = new Level1SubBoss2(config, posObj.posX, posObj.posY,
            this.resourcesService.getRes().get("miniboss-2-muzzle-flash"),
            this.resourcesService.getRes().get("miniboss-2-1"),
            this.resourcesService.getRes().get("miniboss-2-2"),
            this.resourcesService.getRes().get("miniboss-2-damaged"),
            224, 236, hitz);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

		generateLevel2SubBoss1(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 250, posY: number = -300, config: any = {}): any {
			let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
      let newBot = new Level2SubBoss1V2(config, posObj.posX, posObj.posY,
        this.resourcesService.getRes().get("miniboss-3-muzzle-flash"),
        this.resourcesService.getRes().get("miniboss-3-1-cannon"),
        this.resourcesService.getRes().get("miniboss-3-no-cannon"),
        this.resourcesService.getRes().get("miniboss-3-no-cannon-damage"),
        this.resourcesService.getRes().get("miniboss-3-no-cannon-shadow"),
        242,302);
			this.botsArr.push(newBot);
			this.botCreated.next(newBot);
	  }

    generateLevel1Boss1(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -300, config: any = {}): any {
        let newBot = new Level1Boss1(config, posX, posY,
            this.resourcesService.getRes().get("boss1-main-boss-1-weakpoint"),
            this.resourcesService.getRes().get("boss1-main-boss-1-weakpoint-damag"),

            this.resourcesService.getRes().get("boss1-main-boss-armor-1"),
            this.resourcesService.getRes().get("boss1-main-boss-armor-2"),
            this.resourcesService.getRes().get("boss1-main-boss-armor-3"),
            this.resourcesService.getRes().get("boss1-main-boss-armor-4"),
            this.resourcesService.getRes().get("boss1-main-boss-armor-5"),
            this.resourcesService.getRes().get("boss1-main-boss-armor-6"),
            this.resourcesService.getRes().get("boss1-main-boss-armor-7"),
            this.resourcesService.getRes().get("boss1-main-boss-armor-8"),

            this.resourcesService.getRes().get("boss1-laser-1"),
            this.resourcesService.getRes().get("boss1-laser-2"),
            this.resourcesService.getRes().get("boss1-laser-3"),
            this.resourcesService.getRes().get("boss1-laser-4"),
            this.resourcesService.getRes().get("boss1-laser-5"),
            this.resourcesService.getRes().get("boss1-laser-6"),
            this.resourcesService.getRes().get("boss1-laser-7"),
            this.resourcesService.getRes().get("boss1-laser-8"),
            this.resourcesService.getRes().get("boss1-laser-9"),
            this.resourcesService.getRes().get("boss1-laser-9-1"),
            this.resourcesService.getRes().get("boss1-laser-9-2"),
            this.resourcesService.getRes().get("boss1-laser-10"));
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

	createBotDeath(x,y){
		this.spriteSheetArr.push(new SpriteSheet(x-40,y-40,
			[this.resourcesService.getRes().get("bot-explosion-1"),
			this.resourcesService.getRes().get("bot-explosion-2"),
			this.resourcesService.getRes().get("bot-explosion-3"),
			this.resourcesService.getRes().get("bot-explosion-4")],
			80,80,this.deathAnimtionTimer,this.deathAnimtionTimer)
		);
  }

  generateTankTrack(posX: number, posY: number, rotationAngle: number) {
    this.backgroundElementsArr.push(new BackgroundElement(posX,posY,
			this.resourcesService.getRes().get("aa-tank-track-horizontal"),
			1,62,rotationAngle)
		);
  }


  // createTankTrack(x,y,angle=null, ctx=null){
	// 	this.spriteSheetArr.push(new SpriteSheet(x,y,
	// 		[this.resourcesService.getRes().get("aa-tank-track-horizontal")],
	// 		1,62,60,60,angle,ctx)
	// 	);
  // }

  createMisslePlume(x,y,angle=null) {
		this.spriteSheetArr.push(new SpriteSheet(x-20,y-20,
			[this.resourcesService.getRes().get("explosion-small-1"),
			this.resourcesService.getRes().get("explosion-small-2"),
			this.resourcesService.getRes().get("explosion-small-3"),
			this.resourcesService.getRes().get("explosion-small-4")],
			40,40,this.deathAnimtionTimer,this.deathAnimtionTimer,angle)
		);
	}

	createPlayerDeath(x,y){
		this.spriteSheetArr.push(new SpriteSheet(x-40,y-40,
			[this.resourcesService.getRes().get("player-explosion-1"),
			this.resourcesService.getRes().get("player-explosion-2"),
			this.resourcesService.getRes().get("player-explosion-3"),
			this.resourcesService.getRes().get("player-explosion-4")],
			80,80,this.deathAnimtionTimer,this.deathAnimtionTimer)
		);
	}

    getBotPostion(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = 0) {
        if (levelInstance.isVertical()) {
            let pos = (randomPosition) ? Math.floor(Math.random() * Math.floor(levelInstance.getMapWidth() - 50)) + 10 : posX;
            return { posX: pos, posY: posY };
        } else {
            let pos = (randomPosition) ? Math.floor(Math.random() * Math.floor(levelInstance.getMapHeight() - 50)) + 10 : posY;
            return { posX: levelInstance.getMapHeight() + 60, posY: pos };
        }
    }

    addSpriteSheet(sprite: SpriteSheet) {
        this.spriteSheetArr.push(sprite);
    }

    addBGElment(bg: BackgroundElement) {
      this.backgroundElementsArr.push(bg);
    }

    removeBGElement(elmentToRemove: BackgroundElement) {
      //this.backgroundElementsArr = this.backgroundElementsArr.filter(el => el !== elmentToRemove);
      this.backgroundElementsArr.splice(this.backgroundElementsArr.indexOf(elmentToRemove),1);
    }

    removeBot(bot: BotInstance) {
		this.createBotDeath(bot.getCenterX(),bot.getCenterY());
        this.botsArr.splice(this.botsArr.indexOf(bot), 1);
        this.botRemoved.next(bot);
    }

    removeSpriteSheet(bot: SpriteSheet) {
        this.spriteSheetArr.splice(this.spriteSheetArr.indexOf(bot), 1);
    }

    getBotDestroyed(): Subject<BotInstance> {
        return this.botDestroyed;
    }

    getBotCreated(): Subject<BotInstance> {
        return this.botCreated;
    }

    getBotRemoved(): Subject<BotInstance> {
        return this.botRemoved;
    }

    getBots(): BotInstance[] {
        return this.botsArr;
    }
}
