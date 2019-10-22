import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit {
    @Input() public level:number = 1; // which level to load up.

    @ViewChild('canvas') public canvas: ElementRef;

    canvasEl: any;
    ctx: CanvasRenderingContext2D;

    @Input() public width = 640;
    @Input() public height = 480;

    mousePosition: any;
    isMouseDown: boolean;
    dragoffx: number;
    dragoffy: number;

    circles: any;

    imageObj = new Image();
    //imageName = "../../../assets/img/player/player-1-ship.png";
    //imageName = "../../../assets/img/levels/level1/level-1-background.png";

    constructor(private resourcesService:ResourcesService) {
        this.imageObj = this.resourcesService.getRes().get("level-1-background");
    }

    ngOnInit() {

    }


//https://stackoverflow.com/questions/51214548/angular-5-with-canvas-drawimage-not-showing-up
    public ngAfterViewInit() {
        this.canvasEl = this.canvas.nativeElement;
        this.ctx = this.canvasEl.getContext('2d');

        this.canvasEl.width = this.width;
        this.canvasEl.height = this.height;

        this.draw();
        setTimeout(e => this.draw(), 500);
    }

    draw() {
        //clear canvas
        this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.ctx.drawImage(this.imageObj, 0, 0, this.canvasEl.width, this.canvasEl.height);
    }
}
