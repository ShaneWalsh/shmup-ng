import { LevelManagerService } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";

// setup all four levels using this system, add a mini boss at the end of each one.
// to prove it all works. Then can think about how to expose this to yourman,
// how to get past the cors, the problem is my images are from file :/ not included in the pollyfils due to the way i load them.
export enum BotType {
  DIVER="DIVER",
  FIGHTER="FIGHTER",
  DRONE="DRONE",
  SWORDFISH="SWORDFISH",
  KAMIKAZE="KAMIKAZE",
  CREEPER="CREEPER",
  ROCK="ROCK",
	GUARDIAN1="GUARDIAN1",
  GUARDIANCREEPER="GUARDIANCREEPER",
  LAZERGUARDIAN="LAZERGUARDIAN",

  BUGGY="BUGGY",
  AATANK="AATANK",
  SENTRY="SENTRY",
  HEAVYJET="HEAVYJET",

  MINIBOSS1="MINIBOSS1", // move on a phase after a mini boss dies.
  MINIBOSS2 = "MINIBOSS2",
  MAINBOSS1 = "MAINBOSS1",
  MINIBOSS1L2 = "MINIBOSS1L2",
  STARSHIPL2 = "STARSHIPL2",
  JUDGEL2 = "JUDGEL2",
  MINIBOSS1L3 = "MINIBOSS1L3",
  MINIBOSS2L3 = "MINIBOSS2L3",
  FINALBOSS = "FINALBOSS",

  BOSS1="BOSS1", // move on a phase after a mini boss dies.
  // Animations
  CAUTIONANIMATION="CAUTIONANIMATION"
}

// Extract Events to an events class.
export class LevelEvent {
    public lastRepeatTickFire:number = 0; // used for repeating calculations.
    constructor(
        public phase:number = 0,
        public happenAfterTicks:number=60, // roughly sixty ticks in a second.
        public repeatUntilPhaseEnd:boolean=false,
		public repeatLoopTicks:number = happenAfterTicks
    ){

    }

    public triggerEvent(botManagerService:BotManagerService, levelManagerService:LevelManagerService){
		console.log("Not implemented");
    }

    public getPhase():number{
        return this.phase;
    }

    public getHappenAfterTicks(){
        return this.happenAfterTicks;
    }

    public canTrigger(tickCounter: number, phaseCounter: number): boolean {
        return (this.phase == phaseCounter && (this.happenAfterTicks+this.lastRepeatTickFire) == tickCounter);
    }

	public getRepeatLoopTicks():number {
		return this.repeatLoopTicks;
	}
}

export class SpawnBotEvent extends LevelEvent {
    constructor(
        public phase:number = 0,
        public happenAfterTicks:number=60,
        public repeatUntilPhaseEnd:boolean=false,
		public repeatLoopTicks:number=happenAfterTicks,
        public botType:BotType,
		public config:any={},
        public randomPosition:boolean=true,
        public posX:number = 0,
        public posY:number = 0
    ){
        super(phase, happenAfterTicks,repeatUntilPhaseEnd,repeatLoopTicks);

    }

    public triggerEvent(botManagerService:BotManagerService, levelManagerService:LevelManagerService){
		if(this.botType == BotType.DIVER){
			botManagerService.generateDiver(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
		} else if(this.botType == BotType.FIGHTER){
			botManagerService.generateFighterV2(levelManagerService.getCurrentLevel(),this.randomPosition, this.posX, this.posY, this.config);
      } else if(this.botType == BotType.ROCK){
			     botManagerService.generateRock(levelManagerService.getCurrentLevel(),this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.DRONE) {
            botManagerService.generateDrone(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.SWORDFISH) {
            botManagerService.generateSwordfish(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.KAMIKAZE) {
            botManagerService.generateKamikaze(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.CREEPER) {
            botManagerService.generateCreeper(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.GUARDIAN1) {
            botManagerService.generateGuardian1(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.GUARDIANCREEPER) {
            botManagerService.generateGuardianCreeper(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.LAZERGUARDIAN) {
            botManagerService.generateGuardianLaser(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.BUGGY) {
            botManagerService.generateBuggy(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.AATANK) {
            botManagerService.generateAATank(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.SENTRY) {
            botManagerService.generateSentry(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.HEAVYJET) {
            botManagerService.generateHeavyJet(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.MINIBOSS1) {
            botManagerService.generateLevel1SubBoss1(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.MINIBOSS2) {
            botManagerService.generateLevel1SubBoss2(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.MAINBOSS1) {
            botManagerService.generateLevel1Boss1(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.MINIBOSS1L2) {
            botManagerService.generateLevel2SubBoss1(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.STARSHIPL2) {
            botManagerService.generateLevel2Starship(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.JUDGEL2) {
            botManagerService.generateLevel2Judge(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.MINIBOSS1L3) {
            botManagerService.generateLevel3SubBoss(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.MINIBOSS2L3) {
            botManagerService.generateLevel3SubBoss2Bomber(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.FINALBOSS) {
            botManagerService.generateFinalBoss(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.CAUTIONANIMATION) {
            botManagerService.createCautionAnimation(this.posX, this.posY);
        } else {
					console.log("Not implemented");
		    }

    }
}

export class NextPhaseEvent extends LevelEvent{
    constructor(
        public phase:number = 1, // this would be the phase after the boss or mini boss forms
        public happenAfterTicks:number=120
    ){
        super(phase, happenAfterTicks, false);
    }

    public triggerEvent(botManagerService:BotManagerService, levelManagerService:LevelManagerService){
		levelManagerService.getCurrentLevel().updatePhaseCounter();
    }
}

export class LevelOverEvent extends LevelEvent{
    constructor(
        public phase:number = 1, // this would be the phase after the boss or mini boss forms, to trigger the moving onto the next level
        public happenAfterTicks:number=120 // provide time for death animation
    ){
        super(phase, happenAfterTicks, false);
    }

    public triggerEvent(botManagerService:BotManagerService, levelManagerService:LevelManagerService){
		  levelManagerService.getLevelCompleteSubject().next(levelManagerService.getCurrentLevel());
    }
}
