import { LevelInstance } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";

export interface BotInstance {
    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService);
    // checks if the provided hitbox has intersected with this bot
    hasBotBeenHit(hitter:any,hitterBox:HitBox);

    applyDamage(damage:number, botManagerService:BotManagerService, playerService:PlayerService, levelInstance:LevelInstance);

    getCenterX():number;

    getCenterY():number;

    getPlayerCollisionHitBox(): HitBox;
}


export class BotInstanceImpl implements BotInstance {

	constructor(public config:any={}){

	}

	getCenterY(): number {
        throw new Error("Method not implemented.");
    }
    getCenterX(): number {
        throw new Error("Method not implemented.");
    }
    applyDamage(damage: number, botManagerService: BotManagerService, playerService: PlayerService, levelInstance:LevelInstance) {
        throw new Error("Method not implemented.");
    }
    hasBotBeenHit(hitter: any, hitterBox: HitBox) {
        throw new Error("Method not implemented.");
    }
    update(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
        throw new Error("Method not implemented.");
    }
    getPlayerCollisionHitBox(): HitBox {
        throw new Error("Method not implemented.");
    }

	tryConfigValues(params){
		for(let param of params){
			if(this.config[param]){
				this[param] = this.config[param];
			}
		}
  }

}
