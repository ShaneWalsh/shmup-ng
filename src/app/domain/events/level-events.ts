import { LevelManagerService } from "src/app/manager/level-manager.service";
import { BotManagerService } from "src/app/manager/bot-manager.service";

// setup all four levels using this system, add a mini boss at the end of each one.
// to prove it all works. Then can think about how to expose this to yourman,
// how to get past the cors, the problem is my images are from file :/ not included in the pollyfils due to the way i load them.
export enum BotType {
    DIVER="diver",
    FIGHTER="fighter",

    MINIBOSS1="miniBoss1", // move on a phase after a mini boss dies.

    BOSS1="boss1" // move on a phase after a mini boss dies.
}

// Extract Events to an events class.
export class LevelEvent {
    public lastRepeatTickFire:number = 0; // used for repeating calculations.
    constructor(
        public phase:number = 0,
        public happenAfterTicks:number=60, // roughly sixty ticks in a second.
        public repeatUntilPhaseEnd:boolean=false,
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
}

export class SpawnBotEvent extends LevelEvent {
    constructor(
        public phase:number = 0,
        public happenAfterTicks:number=60,
        public repeatUntilPhaseEnd:boolean=false,
        public repeatLoopTicks:number = 60, // only used if repeatUntilPhaseEnd is true
        public botType:BotType,
		public config:any={},
        public randomPosition:boolean=true,
        public posX:number = 0,
        public posY:number = 0
    ){
        super(phase, happenAfterTicks,repeatUntilPhaseEnd);

    }

    public triggerEvent(botManagerService:BotManagerService, levelManagerService:LevelManagerService){
		if(this.botType == BotType.DIVER){
			botManagerService.generateDiver(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
		} else if(this.botType == BotType.FIGHTER){
			botManagerService.generateFighter(levelManagerService.getCurrentLevel(),this.randomPosition, this.posX, this.posY, this.config);
        } else if (this.botType == BotType.MINIBOSS1) {
            botManagerService.generateLevel1SubBoss1(levelManagerService.getCurrentLevel(), this.randomPosition, this.posX, this.posY, this.config);
        } else {
			console.log("Not implemented");
		}
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
		console.log("Not implemented");
    }
}
