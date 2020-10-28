import { LevelInstance } from "../manager/level-manager.service";
import { BotManagerService } from "../manager/bot-manager.service";
import { BulletManagerService } from "../manager/bullet-manager.service";
import { PlayerService } from "../services/player.service";
import { LogicService } from "../services/logic.service";
import { CanvasContainer } from "./CanvasContainer";

export class IntroAnimation {
  public animationTimer: number = 0;
  public spritePosition : number = 0;
  public complete : boolean = false;

  currentScene: HTMLImageElement[] = null;
  currentSceneAnimTimerLimit: number = 0;

  constructor(
    public scene1: HTMLImageElement[] = null,
    public scene2: HTMLImageElement[] = null,
    public scene3: HTMLImageElement[] = null,
    public scene4: HTMLImageElement[] = null,
    public scene1AnimTimerLimit: number = 7,
    public scene2AnimTimerLimit: number = 6,
    public scene3AnimTimerLimit: number = 8,
    public scene4AnimTimerLimit: number = 6,
    public imageSizeX: number = 480,
    public imageSizeY: number = 640,
    public posX: number = 0,
    public posY: number = 0,
  ) {
    this.currentScene = scene1;
    this.currentSceneAnimTimerLimit = scene1AnimTimerLimit;
  }

  update(canvasContainer:CanvasContainer) {
    if (this.animationTimer >= this.currentSceneAnimTimerLimit) {
      this.animationTimer = 0;
      this.spritePosition++;
      if (this.spritePosition >= this.currentScene.length){
        this.spritePosition = 0;
        if(this.currentScene == this.scene1){
          this.currentScene = this.scene2;
          this.currentSceneAnimTimerLimit = this.scene2AnimTimerLimit;
        } else if(this.currentScene == this.scene2){
          this.currentScene = this.scene3;
          this.currentSceneAnimTimerLimit = this.scene3AnimTimerLimit;
        } else if(this.currentScene == this.scene3){
          this.currentScene = this.scene4;
          this.currentSceneAnimTimerLimit = this.scene4AnimTimerLimit;
        } else if(this.currentScene == this.scene4){
          this.complete = true;
        } else {
          this.complete = true;
        }
      }
    } else {
      this.animationTimer++;
    }
    let ctxDraw = canvasContainer.mainCtx;
    ctxDraw.drawImage(this.currentScene[this.spritePosition], 0, 0, this.imageSizeX, this.imageSizeY, this.posX, this.posY, this.imageSizeX, this.imageSizeY);
  }

  isComplete() : boolean {
    return this.complete;
  }
}
