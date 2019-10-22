import { Component, HostListener } from '@angular/core';
import { KeyboardEventService } from './services/keyboard-event.service';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shmup-ng';
  loaded:boolean=false;

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

  constructor(private keyboardEventService:KeyboardEventService, private resourcesService:ResourcesService){
      this.resourcesService.getResourcesLoaded().subscribe(load=>{
          this.loaded = load;
          console.log("loaded");
      })
      this.resourcesService.loadResources();
  }
}
