import { Component, HostListener } from '@angular/core';
import { KeyboardEventService } from './services/keyboard-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shmup-ng';

  @HostListener('window:keyup', ['$event'])
  keyupEvent(event: KeyboardEvent) {
      this.keyboardEventService.publishKeyboardUpEvent(event);
  }
  @HostListener('window:keydown', ['$event'])
  keydownEvent(event: KeyboardEvent) {
      this.keyboardEventService.publishKeyboardDownEvent(event);
  }

  constructor(private keyboardEventService:KeyboardEventService){

  }
}
