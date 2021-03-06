import { Component, HostListener } from '@angular/core';
import { KeyboardEventService } from './services/keyboard-event.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { AudioServiceService } from './services/audio-service.service';
import { NgApiService } from './services/ng-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shmup-ng';
  loaded:boolean=false;

  // when doing the ng build make sure to change <base href="./"> in index.html
  // ng build --prod --base-href ./

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
      if(this.loaded)
      this.keyboardEventService.publishKeyboardUpEvent(event);
  }
  @HostListener('window:keydown', ['$event'])
  keydownEvent(event: KeyboardEvent) {
      if(this.loaded)
      this.keyboardEventService.publishKeyboardDownEvent(event);
  }

  constructor(private keyboardEventService:KeyboardEventService, private resourcesService:ResourcesService, private audioServiceService:AudioServiceService, private ngApiService:NgApiService){
      this.resourcesService.getResourcesLoaded().subscribe(load=>{
        this.resourcesService.setAudio(audioServiceService);
        this.loaded = load;
        console.log("loaded");
      })
      this.resourcesService.loadResources();
      this.ngApiService.loadAll();
  }
}
