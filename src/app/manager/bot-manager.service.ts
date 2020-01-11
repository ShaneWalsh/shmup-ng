import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { BotInstance } from 'src/app/domain/bots/BotInstance';
import { LevelInstance } from 'src/app/manager/level-manager.service';
import { Diver } from 'src/app/domain/bots/Diver';
import { ResourcesService } from 'src/app/services/resources.service';
import { BulletManagerService } from 'src/app/manager/bullet-manager.service';
import { PlayerObj } from 'src/app/services/player.service';
import { Fighter } from '../domain/bots/Fighter';
import { Level1SubBoss } from '../domain/bots/Level1SubBoss';

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

    private botsArr:BotInstance[] = [];

    constructor(private resourcesService:ResourcesService) {

    }

    clean() {
        this.botsArr = [];
    }

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, bulletManagerService:BulletManagerService, currentPlayer:PlayerObj): any {
        //throw new Error("Method not implemented.");
        let botArrClone = [...this.botsArr]; // why clone it? So I can update the original array without effecting the for loop.
        for(let i = 0; i< botArrClone.length; i++){
            const bot = botArrClone[i];
            bot.update(levelInstance, ctx, this, bulletManagerService, currentPlayer);
        }
    }

    generateDiver(levelInstance:LevelInstance, randomPosition:boolean=true, posX:number = 0, posY:number = -60, config:any = {}): any {
		let posObj = this.getBotPostion(levelInstance,randomPosition,posX,posY);
		let newBot = new Diver(config, posObj.posX,posObj.posY, this.resourcesService.getRes().get("enemy-3-1"), 46,52);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateFighter(levelInstance:LevelInstance, randomPosition:boolean=true, posX:number = 0, posY:number = -60, config:any = {}): any {
		let posObj = this.getBotPostion(levelInstance,randomPosition,posX,posY);
        let newBot = new Fighter(config, posObj.posX,posObj.posY, this.resourcesService.getRes().get("enemy-1-1"), this.resourcesService.getRes().get("enemy-1-2"), 52,56);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

    generateLevel1SubBoss1(levelInstance: LevelInstance, randomPosition: boolean = true, posX: number = 0, posY: number = -300, config:any = {}): any {
        let posObj = this.getBotPostion(levelInstance, randomPosition, posX, posY);
        let newBot = new Level1SubBoss(config, posObj.posX, posObj.posY, this.resourcesService.getRes().get("boss-sub-1"), this.resourcesService.getRes().get("boss-sub-1_2"), 196, 252);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
    }

	getBotPostion(levelInstance:LevelInstance, randomPosition:boolean=true, posX:number = 0, posY:number = 0){
		if(levelInstance.isVertical()){
	        let pos = (randomPosition)? Math.floor(Math.random() * Math.floor(levelInstance.getMapWidth()-50))+10:posX;
	        return {posX:pos,posY:posY};
		} else {
			let pos = (randomPosition)? Math.floor(Math.random() * Math.floor(levelInstance.getMapHeight()-50))+10:posY;
			return {posX:levelInstance.getMapHeight()+60,posY:pos};
		}
	}

    removeBot(bot:BotInstance){
        this.botsArr.splice(this.botsArr.indexOf(bot),1);
        this.botRemoved.next(bot);
    }

    getBotDestroyed():Subject<BotInstance>{
        return this.botDestroyed;
    }

    getBotCreated():Subject<BotInstance>{
        return this.botCreated;
    }

    getBotRemoved():Subject<BotInstance>{
        return this.botRemoved;
    }

    getBots():BotInstance[]{
        return this.botsArr;
    }
}
