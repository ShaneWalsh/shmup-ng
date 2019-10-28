import { LevelInstance } from "src/app/manager/level-manager.service";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerService } from "src/app/services/player.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";

export interface BulletInstance {
    update(levelInstance:LevelInstance, ctx:CanvasRenderingContext2D, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, playerService:PlayerService );

}
