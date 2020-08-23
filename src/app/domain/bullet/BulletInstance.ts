import { LevelInstance } from "src/app/manager/level-manager.service";
import { BulletManagerService } from "src/app/manager/bullet-manager.service";
import { PlayerService } from "src/app/services/player.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { CanvasContainer } from "../CanvasContainer";

export interface BulletInstance {
    update(levelInstance:LevelInstance, canvasContainer:CanvasContainer, bulletManagerService:BulletManagerService, botManagerService:BotManagerService, playerService:PlayerService );

    getPosX():number;
    getPosY():number;
    getCurrentRotation():number;

}
