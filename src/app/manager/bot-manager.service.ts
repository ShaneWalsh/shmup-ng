import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { BotInstance } from 'src/app/domain/bots/BotInstance';
import { LevelInstance } from 'src/app/manager/level-manager.service';
import { Diver } from 'src/app/domain/bots/Diver';
import { ResourcesService } from 'src/app/services/resources.service';

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

    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D): any {
        //throw new Error("Method not implemented.");
        let botArrClone = [...this.botsArr]; // why clone it? So I can update the original array without effecting the for loop.
        for(let i = 0; i< botArrClone.length; i++){
            const bot = botArrClone[i];
            bot.update(levelInstance, ctx, this);
        }
    }

    generateDiver(levelInstance:LevelInstance): any {
        let pos = Math.floor(Math.random() * Math.floor(levelInstance.getMapWidth()-50))+10;
        let newBot = new Diver(2,pos,-54, this.resourcesService.getRes().get("enemy-3-1"), 46,52);
        this.botsArr.push(newBot);
        this.botCreated.next(newBot);
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
