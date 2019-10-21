import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IntroScreenComponent } from './component/intro-screen/intro-screen.component';
import { GameContainerComponent } from './component/game-container/game-container.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroScreenComponent,
    GameContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
