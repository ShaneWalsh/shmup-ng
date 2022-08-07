import { BotInstance, BotInstanceImpl } from "src/app/domain/bots/BotInstance";
import { LevelInstance } from "src/app/manager/level-manager.service";
import { HitBox } from "src/app/domain/HitBox";
import { BotManagerService } from "src/app/manager/bot-manager.service";
import { BulletManagerService, BulletDirection } from "src/app/manager/bullet-manager.service";
import { PlayerObj, PlayerService } from "src/app/services/player.service";
import { LogicService } from "src/app/services/logic.service";
import { CanvasContainer } from "../CanvasContainer";
import { ProfileService, ProfileValuesEnum } from "src/app/services/profile.service";

/**
 * Shellhead
 */
export class Level1Boss1 extends BotInstanceImpl {
    public boss1State: Boss1State = null;

    // todo make these config values
    public health: number = 50;
    public bulletSpeed: number = 6; // 6
    public moveSpeed: number = 5; // 5

    public bTimer: number = 0; // bullet timer
    public bTimerLimit: number = 20; // 30

    public anaimationTimer: number = 0;
    public anaimationTimerLimit: number = 4;

    public damAnaimationTimer: number = 8;
    public damAnaimationTimerLimit: number = 8;

    public score: number = 100;
    public angle: number;

    public hitBox: HitBox = new HitBox(140, 0, 200, 300);

    public imageObjCore: HTMLImageElement = null;
    public imageObjArmor: HTMLImageElement = null;
    public imageObjLazor: HTMLImageElement = null;

    constructor(
        public config: any = {},
        public posX: number = 0,
        public posY: number = 0,
        public imageObjWeakpoint: HTMLImageElement = null,
        public imageObjWeakpointDamanged: HTMLImageElement = null,
        public imageObjArmor1: HTMLImageElement = null,
        public imageObjArmor2: HTMLImageElement = null,
        public imageObjArmor3: HTMLImageElement = null,
        public imageObjArmor4: HTMLImageElement = null,
        public imageObjArmor5: HTMLImageElement = null,
        public imageObjArmor6: HTMLImageElement = null,
        public imageObjArmor7: HTMLImageElement = null,
        public imageObjArmor8: HTMLImageElement = null,

        public imageObjLazer1: HTMLImageElement = null,
        public imageObjLazer2: HTMLImageElement = null,
        public imageObjLazer3: HTMLImageElement = null,
        public imageObjLazer4: HTMLImageElement = null,
        public imageObjLazer5: HTMLImageElement = null,
        public imageObjLazer6: HTMLImageElement = null,
        public imageObjLazer7: HTMLImageElement = null,
        public imageObjLazer8: HTMLImageElement = null,
        public imageObjLazer9: HTMLImageElement = null,
        public imageObjLazer9_1: HTMLImageElement = null,
        public imageObjLazer9_2: HTMLImageElement = null,
        public imageObjLazer10: HTMLImageElement = null,

        public imageSizeX: number = 480,
        public imageSizeY: number = 640,
        public hitBoxWeakPoint: HitBox = new HitBox(140, 0, 200, 70),
        public hitBoxArmor1: HitBox = new HitBox(140, 0, 100, 200),
        public hitBoxArmor2: HitBox = new HitBox(240, 0, 100, 200)
    ) {
        super(config);
		this.tryConfigValues(["bTimer", "bTimerLimit", "health", "score"]);
        this.setState(new Boss1State(this));
    }

    update(levelInstance: LevelInstance, canvasContainer:CanvasContainer, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService, ) {
      let ctx = canvasContainer.mainCtx;
      this.boss1State.update(levelInstance, ctx, botManagerService, bulletManagerService, playerService);
    }


    hasBotBeenHit(hitter: any, hitterBox: HitBox): boolean {
        return this.boss1State.hasBotBeenHit(hitter, hitterBox);
    }

    hasBotArmorBeenHit(hitter: any, hitterBox: HitBox) {
        return this.boss1State.hasBotArmorBeenHit(hitter, hitterBox);
    }

    setState(boss1State:Boss1State){
      boss1State.setup();
      this.boss1State = boss1State;
    }

    // lazers go straight, nothing fancy so no need to make them do anything fancy, cal a stright direction.
    fireTracker(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, bulletManagerService: BulletManagerService, currentPlayer: PlayerObj) {

    }

    applyDamage(damage: number, botManagerService: BotManagerService, bulletManagerService:BulletManagerService, playerService: PlayerService, levelInstance: LevelInstance) {
        this.health -= damage;
        this.triggerDamagedAnimation();
        if (this.health < 1) {
            playerService.currentPlayer.addScore(this.score);
            botManagerService.removeBot(this,1);
            ProfileService.setProfileValue(ProfileValuesEnum.BOTKILLER_LEVEL1_BOSS_SHELLHEAD,"true");
            levelInstance.updatePhaseCounter();
        }
    }

    triggerDamagedAnimation(): any {
        this.damAnaimationTimer = 1;// trigger damage animation
    }

    canShoot(levelInstance: LevelInstance, currentPlayer: PlayerObj) {
        if (levelInstance.isVertical() && this.getCenterY() < currentPlayer.getCenterY()) {
            return true;
        } else if (!levelInstance.isVertical() && this.getCenterX() > currentPlayer.getCenterX()) {
            return true;
        }
        return false;
    }

    getCenterX(): number {
        return this.posX + (this.imageSizeX / 2);
    }

    getCenterY(): number {
        return this.posY + (this.imageSizeY / 2);
    }

    isWithin(sourceX, tarX, distance): boolean {
        let val = sourceX - tarX;
        if (val < 0)
            val = val * -1;
        return (val < distance)
    }

    getPlayerCollisionHitBoxes(): HitBox[] {
        return this.boss1State.getPlayerCollisionHitBoxes();
    }

    isDeathOnColision():boolean{
      return false;
    }
}

class Boss1State {

    // todo add this behaviour
    public moveSide:boolean =false;

    constructor(public level1Boss1: Level1Boss1) {

    }

    setup(){
      let level1Boss1 = this.level1Boss1;
      level1Boss1.imageObjCore = level1Boss1.imageObjWeakpoint;
      level1Boss1.imageObjArmor = level1Boss1.imageObjArmor1;
      level1Boss1.imageObjLazor = null;
      level1Boss1.hitBoxArmor1 = new HitBox(160, 0, 80, 270);
      level1Boss1.hitBoxArmor2 = new HitBox(240, 0, 80, 270);
    }

    update(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
        let level1Boss1 = this.level1Boss1;

        if(level1Boss1.posY < 1){
          level1Boss1.posY++;
        } else {
          level1Boss1.posY = 0;
          level1Boss1.boss1State = new Boss1StateOpening(level1Boss1);
        }

        this.defaultUpdate(levelInstance,ctx,botManagerService,bulletManagerService,playerService);
    }

    defaultUpdate(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
      let level1Boss1 = this.level1Boss1;

      if (level1Boss1.damAnaimationTimer < level1Boss1.damAnaimationTimerLimit) {
          level1Boss1.damAnaimationTimer++;
          if (level1Boss1.damAnaimationTimer % 2 == 1) {
              level1Boss1.imageObjCore = level1Boss1.imageObjWeakpointDamanged;
          } else {
            level1Boss1.imageObjCore = level1Boss1.imageObjWeakpoint;
          }
      } else {
        level1Boss1.imageObjCore = level1Boss1.imageObjWeakpoint;
      }
      ctx.drawImage(level1Boss1.imageObjCore, 0, 0, level1Boss1.imageSizeX, level1Boss1.imageSizeY, level1Boss1.posX, level1Boss1.posY, level1Boss1.imageSizeX, level1Boss1.imageSizeY);

      if(level1Boss1.imageObjArmor != null){
        ctx.drawImage(level1Boss1.imageObjArmor, 0, 0, level1Boss1.imageSizeX, level1Boss1.imageSizeY, level1Boss1.posX, level1Boss1.posY, level1Boss1.imageSizeX, level1Boss1.imageSizeY);
      }
      if(level1Boss1.imageObjLazor != null){
            ctx.drawImage(level1Boss1.imageObjLazor, 0, 0, level1Boss1.imageSizeX, level1Boss1.imageSizeY, level1Boss1.posX, level1Boss1.posY, level1Boss1.imageSizeX, level1Boss1.imageSizeY);
      }
      if (levelInstance.drawHitBox()) {
          level1Boss1.hitBoxWeakPoint.drawBorder(level1Boss1.posX + level1Boss1.hitBoxWeakPoint.hitBoxX, level1Boss1.posY + level1Boss1.hitBoxWeakPoint.hitBoxY, level1Boss1.hitBoxWeakPoint.hitBoxSizeX, level1Boss1.hitBoxWeakPoint.hitBoxSizeY, ctx, "#FF0000");
          level1Boss1.hitBoxArmor1.drawBorder(level1Boss1.posX + level1Boss1.hitBoxArmor1.hitBoxX, level1Boss1.posY + level1Boss1.hitBoxArmor1.hitBoxY, level1Boss1.hitBoxArmor1.hitBoxSizeX, level1Boss1.hitBoxArmor1.hitBoxSizeY, ctx, "#FF0000");
          level1Boss1.hitBoxArmor2.drawBorder(level1Boss1.posX + level1Boss1.hitBoxArmor2.hitBoxX, level1Boss1.posY + level1Boss1.hitBoxArmor2.hitBoxY, level1Boss1.hitBoxArmor2.hitBoxSizeX, level1Boss1.hitBoxArmor2.hitBoxSizeY, ctx, "#FF0000");
          level1Boss1.hitBox.drawBorder(level1Boss1.posX + level1Boss1.hitBox.hitBoxX, level1Boss1.posY + level1Boss1.hitBox.hitBoxY, level1Boss1.hitBox.hitBoxSizeX, level1Boss1.hitBox.hitBoxSizeY, ctx, "#FFFF00");
      }
    }

    hasBotArmorBeenHit(hitter: any, hitterBox: HitBox) {
      let level1Boss1 = this.level1Boss1;
      if (level1Boss1.hitBoxArmor1.areCentersToClose(hitter, hitterBox, level1Boss1, level1Boss1.hitBoxArmor1) ||
          level1Boss1.hitBoxArmor2.areCentersToClose(hitter, hitterBox, level1Boss1, level1Boss1.hitBoxArmor2)) {
          return true;
      } else {
          return false;
      }
    }

    hasBotBeenHit(hitter: any, hitterBox: HitBox): boolean {
        let level1Boss1 = this.level1Boss1;
        return level1Boss1.hitBoxWeakPoint.areCentersToClose(hitter, hitterBox, level1Boss1, level1Boss1.hitBoxWeakPoint);
    }

    getPlayerCollisionHitBoxes(): any {
      let level1Boss1 = this.level1Boss1;
      return [level1Boss1.hitBoxWeakPoint,level1Boss1.hitBoxArmor1,level1Boss1.hitBoxArmor2];
    }

}


class Boss1StateOpening extends Boss1State {
  armorCount = 1;
  armorCountLimit = 8;
  armorTransitionTime = 0;
  armorTransitionTimeLimit = 10;

  constructor(level1Boss1 : Level1Boss1){
    super(level1Boss1);
  }

  setup(){
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjCore = level1Boss1.imageObjWeakpoint;
    level1Boss1.imageObjArmor = level1Boss1.imageObjArmor1;
    level1Boss1.imageObjLazor = null;
    level1Boss1.hitBoxArmor1 = new HitBox(140, 0, 100, 300);
    level1Boss1.hitBoxArmor2 = new HitBox(240, 0, 100, 300);
  }

  update(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
      let level1Boss1 = this.level1Boss1;

      this.armorTransitionTime++;
      if(this.armorTransitionTime == this.armorTransitionTimeLimit){
        this.armorTransitionTime = 0;
        this.armorCount+= 1;
        this.changeArmor(this.armorCount);
      }
      if(this.armorCount == this.armorCountLimit){
        level1Boss1.boss1State = new Boss1StateCharging(level1Boss1);
      }

      this.defaultUpdate(levelInstance,ctx,botManagerService,bulletManagerService,playerService);
  }

  changeArmor(num){
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjArmor = level1Boss1["imageObjArmor"+num];
    let cal = num -1;
    level1Boss1.hitBoxArmor1 = new HitBox(160-(cal*12), 0, 80, 270);
    level1Boss1.hitBoxArmor2 = new HitBox(240+(cal*12), 0, 80, 270);
  }

}

class Boss1StateCharging extends Boss1State {
  armorCount = 0;
  armorCountLimit = 12;

  armorTransitionTime = 0;
  armorTransitionTimeLimit = 6;

  phases =[
    "imageObjLazer1",
    "imageObjLazer2",
    "imageObjLazer3",
    "imageObjLazer4",
    "imageObjLazer1",
    "imageObjLazer2",
    "imageObjLazer3",
    "imageObjLazer4",
    "imageObjLazer5",
    "imageObjLazer6",
    "imageObjLazer7",
    "imageObjLazer8",
  ]

  constructor(level1Boss1 : Level1Boss1) {
    super(level1Boss1);
  }

  setup(){
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjCore = level1Boss1.imageObjWeakpoint;
    level1Boss1.imageObjLazor = null;
  }

  update(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
      let level1Boss1 = this.level1Boss1;

      this.armorTransitionTime++;
      if(this.armorTransitionTime == this.armorTransitionTimeLimit){
        this.armorTransitionTime = 0;
        this.armorCount+= 1;
        if(this.armorCount < this.armorCountLimit){
          this.changeArmor(this.armorCount);
        } else {
          level1Boss1.setState(new Boss1StateAttack(level1Boss1));
        }
      }

      this.defaultUpdate(levelInstance,ctx,botManagerService,bulletManagerService,playerService);
  }

  changeArmor(num){
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjLazor = level1Boss1[this.phases[num]];
  }

}

class Boss1StateAttack extends Boss1State {
  armorCount = 0;
  armorCountLimit = 2;

  armorTransitionTime = 0;
  armorTransitionTimeLimit = 6;

  phases =[
    "imageObjLazer9_2",
    "imageObjLazer10"
  ]

  beamHitBox :HitBox = new HitBox(156, 0, 164, 640);

  constructor(level1Boss1 : Level1Boss1) {
    super(level1Boss1);
  }

  setup(){
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjCore = level1Boss1.imageObjWeakpoint;
    level1Boss1.imageObjArmor = level1Boss1.imageObjLazer9;
    level1Boss1.imageObjLazor = level1Boss1.imageObjLazer9_1;
  }

  update(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
	   let currentPlayer = playerService.currentPlayer;
      let level1Boss1 = this.level1Boss1;

      this.armorTransitionTime++;
      if(this.armorTransitionTime == this.armorTransitionTimeLimit){
        this.armorTransitionTime = 0;
        this.armorCount+= 1;
        if(this.armorCount <= this.armorCountLimit){
          this.changeArmor(this.armorCount);
        } else {
          level1Boss1.setState(new Boss1StateClosing(level1Boss1));
        }
      }
      ctx.fillRect(0, 0, level1Boss1.imageSizeX,level1Boss1.imageSizeY);
      this.defaultUpdate(levelInstance,ctx,botManagerService,bulletManagerService,playerService);
      // if we hit the player here, we need to kill them
      if (levelInstance.drawHitBox()) {
          this.beamHitBox.drawBorder(level1Boss1.posX + this.beamHitBox.hitBoxX, level1Boss1.posY + this.beamHitBox.hitBoxY, this.beamHitBox.hitBoxSizeX, this.beamHitBox.hitBoxSizeY, ctx, "#FF0000");
      }
      if(currentPlayer && currentPlayer.hasPlayerBeenHit(level1Boss1,this.beamHitBox)){
          playerService.killCurrentPlayer();
      }
  }

  changeArmor(num){
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjLazor = level1Boss1[this.phases[num-1]];
  }

}

class Boss1StateClosing extends Boss1State {
  armorCount = 8;
  armorCountLimit = 0;
  armorTransitionTime = 0;
  armorTransitionTimeLimit = 10;

  constructor(level1Boss1 : Level1Boss1){
    super(level1Boss1);
  }

  setup(){
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjCore = level1Boss1.imageObjWeakpoint;
    level1Boss1.imageObjArmor = level1Boss1.imageObjArmor8;
    level1Boss1.imageObjLazor = null;
  }

  update(levelInstance: LevelInstance, ctx: CanvasRenderingContext2D, botManagerService: BotManagerService, bulletManagerService: BulletManagerService, playerService: PlayerService) {
      let level1Boss1 = this.level1Boss1;

      this.armorTransitionTime++;
      if(this.armorTransitionTime == this.armorTransitionTimeLimit){
        this.armorTransitionTime = 0;
        this.armorCount-= 1;
        if(this.armorCount > this.armorCountLimit){
          this.changeArmor(this.armorCount);
        }
      }
      if(this.armorCount == this.armorCountLimit){
        level1Boss1.boss1State = new Boss1StateOpening(level1Boss1);
      }

      this.defaultUpdate(levelInstance,ctx,botManagerService,bulletManagerService,playerService);
  }

  changeArmor(num) {
    let level1Boss1 = this.level1Boss1;
    level1Boss1.imageObjArmor = level1Boss1["imageObjArmor"+num];
    let cal = num -1;
    level1Boss1.hitBoxArmor1 = new HitBox(160-(cal*12), 0, 80, 270);
    level1Boss1.hitBoxArmor2 = new HitBox(240+(cal*12), 0, 80, 270);
  }

}
