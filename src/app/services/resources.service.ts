import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

    private resourcesToLoad:{code:string,path:string, type:ResourcesEnum}[];
    private resourcesLoaded: Subject<boolean>; // all resources loaded
    private resources:Map<string,any>;// could be images, sounds, etc
    private loaderRun:boolean = false;
    constructor() {
      this.resources = new Map();
      this.resourcesLoaded = new Subject();
      this.resourcesToLoad = [
          {code:"level-1-background", path:"assets/img/levels/level1/level-1-background.png", type:ResourcesEnum.ImageRes},
          {code:"player-1-ship", path:"assets/img/player/player-1-ship.png", type:ResourcesEnum.ImageRes},
          {code:"player-1-bullets", path:"assets/img/player/player-1-bullets.png", type:ResourcesEnum.ImageRes},
          {code:"enemy-3-1", path:"assets/img/bots/enemy-3-1.png", type:ResourcesEnum.ImageRes}
      ];
    }

    getRes():Map<string,any> {
        return this.resources;
    }

    getResourcesLoaded():Subject<boolean>{
        return this.resourcesLoaded;
    }

    // should only be called once.
    loadResources(){
        if(!this.loaderRun){
            this.loaderRun = true;
            for(let i = 0; i < this.resourcesToLoad.length;i++){
                const res = this.resourcesToLoad[i];
                if(res.type == ResourcesEnum.ImageRes){
                    this.loadImage(res.code,res.path);
                } else {

                }
            }
        }
    }

    loadImage(code,path) {
        let loadedImage:HTMLImageElement = new Image();
        loadedImage.crossOrigin = "Anonymous";
        loadedImage.src = path;

        loadedImage.onload = function () {
            this.imageLoaded(code,loadedImage);
        }.bind(this);
    }

    imageLoaded(code,loadedImage:HTMLImageElement){
        this.resources.set(code,loadedImage);
        if(this.resources.size == this.resourcesToLoad.length){
            this.getResourcesLoaded().next(true);
        }
    }
}

export enum ResourcesEnum {
    ImageRes="ImageRes",
    SoundRes="SoundRes"
}
