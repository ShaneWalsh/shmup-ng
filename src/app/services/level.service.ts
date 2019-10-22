import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
    // loads the different levels, and decides the bots and how long it runs etc.

    private paused:boolean = false;

    public mapWidth:number=640;
    public mapHeight:number=480;



    constructor() { }

    getPaused():boolean{
        return this.paused;
    }

    getNotPaused():boolean{
        return !this.paused;
    }

    loadLevel(level:any){

    }

}
