import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BotManagerService } from 'src/app/manager/bot-manager.service';
import { BulletManagerService } from 'src/app/manager/bullet-manager.service';
import { DeathManagerService } from 'src/app/manager/death-manager.service';
import { LevelManagerService } from 'src/app/manager/level-manager.service';
import { AudioServiceService } from 'src/app/services/audio-service.service';
import { KeyboardEventService } from 'src/app/services/keyboard-event.service';
import { LogicService } from 'src/app/services/logic.service';
import { OptionsService } from 'src/app/services/options.service';
import { PlayerService } from 'src/app/services/player.service';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-options-screen',
  templateUrl: './options-screen.component.html',
  styleUrls: ['./options-screen.component.css']
})
export class OptionsScreenComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }
  private subs:Subscription[] = [];
  
  @ViewChild('canvas') public canvasMain: ElementRef;
  
    mainCtx: any;
    tickComplete:boolean=true;

    @Input() public width = 480;
    @Input() public height = 640;
    @Input() public requestAnimFrame: any;

    constructor(
                private optionsService:OptionsService,
                private resourcesService:ResourcesService,
                private audioServiceService:AudioServiceService,
                protected levelManagerService:LevelManagerService,
                private bulletManagerService: BulletManagerService,
                private deathManagerService:DeathManagerService,
                private playerService:PlayerService, private botManagerService:BotManagerService, private keyboardEventService:KeyboardEventService) {
      this.subs.push(this.levelManagerService.getGameTickSubject().subscribe(result => {
        if(this.tickComplete){
            this.update();
        }
      }));

      this.subs.push(this.keyboardEventService.getKeyDownEventSubject().subscribe(customKeyboardEvent => {
        console.log("customKeyboardEvent",customKeyboardEvent);
        //var key = customKeyboardEvent.event.key || customKeyboardEvent.event.keyCode;
        // todo fix this deprecation.
        var key:any = customKeyboardEvent.event.keyCode;
        // Enter
        if(key == 'Enter' || key == 13) { //  == 'Enter'
          // options subject to return to MM
        }
        if(key == 38 || key == 40 || key == 87 || key == 83) {
          if (key == 87 || key == 38) { // up
            let opsMenuSelection =  this.optionsService.opsMenuIndex - 1 ;
            if(opsMenuSelection < 0) opsMenuSelection = 3;
            this.optionsService.opsMenuIndex = opsMenuSelection;
          } else { //down 83 40
            let opsMenuSelection =  this.optionsService.opsMenuIndex + 1;
            if(opsMenuSelection > 3) opsMenuSelection = 0;
            this.optionsService.opsMenuIndex = opsMenuSelection;
          }
        }
        if(key == 65 || key == 37 || key == 68 || key == 39){
          if (key == 65 || key == 37) { // left
            this.optionsService.opsMenuDecrease()
          } else { //right
            this.optionsService.opsMenuIncrease();
          }
        }
      }));

    }

    ngOnInit() {
        
    }


//https://stackoverflow.com/questions/51214548/angular-5-with-canvas-drawimage-not-showing-up
    public ngAfterViewInit() {
      let el = this.getCanvasEl(this.canvasMain, this.width, this.height)
      this.mainCtx = el.getContext('2d');
    }

    getCanvasEl(ref:ElementRef, width, height):any{
      var el = ref.nativeElement;
      el.width = width;
      el.height = height;
      return el;
    }

    update() {
        this.tickComplete = false;
        this.mainCtx.clearRect(0, 0, this.width, this.height);
        let res = this.resourcesService.getRes().get("options-menu");
        this.mainCtx.drawImage(res, 0,0,this.width,this.height);
        LogicService.writeOnCanvas(440,628,this.optionsService.backgroundSoundVolume*10,24,"#ff00ff",this.mainCtx);
    
        this.tickComplete = true;
    }
}
