import { Component, OnInit, OnDestroy } from '@angular/core';
import { KeyboardEventService } from 'src/app/services/keyboard-event.service';
import { Subscription } from '../../../../node_modules/rxjs';
import { LevelService } from 'src/app/services/level.service';

@Component({
  selector: 'app-intro-screen',
  templateUrl: './intro-screen.component.html',
  styleUrls: ['./intro-screen.component.css']
})
export class IntroScreenComponent implements OnInit, OnDestroy  {
    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }
    private subs:Subscription[] =[];
    public screenId:number = 1;

    constructor(private keyboardEventService:KeyboardEventService, private levelService: LevelService) { }

    ngOnInit() {
      this.subs.push(this.keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
          console.log("customKeyboardEvent",customKeyboardEvent);
          if(customKeyboardEvent.event.keyCode == 13){ //  == 'Enter'
              this.screenId++;
              if(this.screenId == 5){ // boom, load up level one.
                  this.levelService.loadLevel(1);
              }
          }
      }));
    }




  // // load image
  // try {
  //     // get input stream
  //     InputStream ims = getAssets().open("avatar.jpg");
  //     // load image as Drawable
  //     Drawable d = Drawable.createFromStream(ims, null);
  //     // set image to ImageView
  //     mImage.setImageDrawable(d);
  // }
  // catch(IOException ex) {
  //     return;
  // }

}
