import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LogicService } from 'src/app/services/logic.service';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {

  private timeout1;
  @ViewChild('canvasBG') public canvasBG: ElementRef;
  bgCtx: any;

  currentTextIndex = 0;
  currentTextLimit = 1;
  public currentText = "Loading Data from moon base"
  public currentTexts = ["Loading Data from moon base","Calibrating Shields and Thrusters", "Initialising bot targeting Systems"]

  loopValue = 0;
  loopLimit = 9;

  resToLoadIndex= 0;

  constructor(private resourcesService:ResourcesService) {
    this.currentTextLimit = this.currentTexts.length;
    this.currentText = this.currentTexts[0];
  }

  ngOnInit() {

  }

  public ngAfterViewInit() {
    console.log("LOADING")
    this.canvasBG.nativeElement.width = 480;
    this.canvasBG.nativeElement.height = 640;
    this.bgCtx = this.canvasBG.nativeElement.getContext('2d');
    this.drawLoadingScreen();
  }

  drawLoadingScreen(){
    this.bgCtx.clearRect(0, 0, this.canvasBG.nativeElement.width, this.canvasBG.nativeElement.height);

    if(this.resToLoadIndex % 20 == 0) { // I only want to draw update every too loops.
      this.loopValue = LogicService.incrementLoop(this.loopValue,this.loopLimit);
      if(this.loopValue == 0){
        this.currentTextIndex = LogicService.incrementLoop(this.currentTextIndex,this.currentTextLimit);
        this.currentText = this.currentTexts[this.currentTextIndex];
      }
    }

    LogicService.drawBorder(80,300,320,60,this.bgCtx,'#FF00FF');
    for(let i = 0; i < this.loopValue; i++) {
      let move = (40*i)+10;
      LogicService.drawBox(80+move,305,20,50,this.bgCtx,'#FF00FF','#FF00FF');
    }

    this.resourcesService.allowRerun();
    this.resourcesService.loadResources(this.resToLoadIndex, 5);
    this.resToLoadIndex += 5;
    this.timeout1 = setTimeout(()=> {
      this.drawLoadingScreen();
    }, 20)
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout1);
  }

}
