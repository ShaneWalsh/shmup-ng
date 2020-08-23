import { LevelInstance } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { CanvasContainer } from "../CanvasContainer";

export interface BotInstance {
    update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, playerService:PlayerService);
    // checks if the provided hitbox has intersected with this bot
    hasBotArmorBeenHit(hitter:any,hitterBox:HitBox);
    hasBotBeenHit(hitter:any,hitterBox:HitBox);

    applyDamage(damage:number, botManagerService:BotManagerService, playerService:PlayerService, levelInstance:LevelInstance);

    getCenterX():number;

    getCenterY():number;

    getPlayerCollisionHitBoxes() : HitBox[];

    isDeathOnColision():boolean;
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
    update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
        throw new Error("Method not implemented.");
    }
    getPlayerCollisionHitBoxes(): HitBox[] {
        throw new Error("Method not implemented.");
    }

    isDeathOnColision():boolean{
      return true;
    }

	tryConfigValues(params){
		for(let param of params){
			if(this.config[param]){
				this[param] = this.config[param];
			}
		}
  }

  hasBotArmorBeenHit(hitter: any, hitterBox: HitBox) {
    return false;
  }

  drawShadow(canvasContainer:CanvasContainer, imageObjShadow:HTMLImageElement,posX:number,posY:number,imageSizeX:number, imageSizeY:number, shadowX:number=30, shadowY:number =60){
    canvasContainer.shadowCtx.drawImage(imageObjShadow, 0, 0, imageSizeX, imageSizeY, posX+shadowX, posY+shadowY, imageSizeX, imageSizeY);
  }

}
