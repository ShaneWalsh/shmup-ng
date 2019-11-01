import { LevelInstance } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerObj } from "src/app/services/player.service";

export interface BotInstance {
    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService, bulletManagerService:BulletManagerService, currentPlayer:PlayerObj);
    // checks if the provided hitbox has intersected with this bot
    hasBotBeenHit(hitter:any,hitterBox:HitBox);

    applyDamage(damage:number, botManagerService:BotManagerService);

    getCenterX():number;

    getCenterY():number;
}
