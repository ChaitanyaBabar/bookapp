import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


// FireBase
import { AngularFireModule } from '@angular/fire';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, AppRoutingModule, AngularFireModule.initializeApp(environment.firebase)],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
