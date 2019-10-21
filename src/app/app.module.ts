import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IntroScreenComponent } from './component/intro-screen/intro-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroScreenComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
