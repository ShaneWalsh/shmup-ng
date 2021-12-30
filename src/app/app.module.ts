import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IntroScreenComponent } from './component/intro-screen/intro-screen.component';
import { GameContainerComponent } from './component/game-container/game-container.component';
import { LoadingScreenComponent } from './component/loading-screen/loading-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroScreenComponent,
    GameContainerComponent,
    LoadingScreenComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
