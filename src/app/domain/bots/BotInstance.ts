import { LevelInstance } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { HitBox } from "src/app/domain/HitBox";

export interface BotInstance {
    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, botManagerService:BotManagerService);
    // checks if the provided hitbox has intersected with this bot
    hasBotBeenHit(hitter:any,hitterBox:HitBox);
}
