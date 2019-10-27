import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ResourcesService } from 'src/app/services/resources.service';

export enum LevelEnum{
    LevelOne='LevelOne',
    LevelTwo='LevelTwo',
    LevelThree='LevelThree',
    LevelFour='LevelFour',
}

@Injectable({
  providedIn: 'root'
})
export class LevelManagerService {

    private levelLoaded: Subject<LevelInstance>;
    private currentLevel:LevelInstance;

    private paused:boolean = false;

    constructor(private resourcesService:ResourcesService) { }

    initLevel(level:LevelEnum){
        if(level == LevelEnum.LevelOne){
            this.currentLevel = new LevelOneInstance(this.resourcesService);
            this.levelLoaded.next(this.currentLevel);
        }
    }

    getCurrentLevel():LevelInstance{
        return this.currentLevel;
    }

    getPaused():boolean{
        return this.paused;
    }

    getNotPaused():boolean{
        return !this.paused;
    }

    getLevelLoadedSubject() : Subject<LevelInstance>{
        return this.levelLoaded;
    }

}

export interface LevelInstance {
    update(ctx:CanvasRenderingContext2D);
    getMapWidth():number;
    getMapHeight():number;
    isVertical():boolean;
}

class LevelOneInstance implements LevelInstance{
    public mapWidth:number=640;
    public mapHeight:number=480;
    private backgroundImage = new Image();

    // keeps track of the infinite scrolling of the background.
    private scrollerXIncrement:number = 0;
    private scrollerYIncrement:number = 0;

    constructor(public resourcesService:ResourcesService){
        this.backgroundImage = this.resourcesService.getRes().get("level-1-background");
    }

    update(ctx:CanvasRenderingContext2D) {
        // infinite scroller
        ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, this.scrollerYIncrement, this.mapWidth, this.mapHeight);
        if(this.isVertical()) {
            ctx.drawImage(this.backgroundImage, this.scrollerXIncrement, (this.scrollerYIncrement - this.mapHeight), this.mapWidth, this.mapHeight);
            this.scrollerYIncrement++;
            if(this.scrollerYIncrement > this.mapHeight){this.scrollerYIncrement = 0};
        } else {
            ctx.drawImage(this.backgroundImage, (this.scrollerXIncrement-this.mapWidth), this.scrollerYIncrement, this.mapWidth, this.mapHeight);
            this.scrollerXIncrement++;
            if(this.scrollerXIncrement > this.mapWidth){this.scrollerXIncrement = 0};
        }
    }

    getMapHeight() {
        return this.mapHeight;
    }

    getMapWidth() {
        return this.mapWidth;
    }

    isVertical() {
        return true;
    }
}
