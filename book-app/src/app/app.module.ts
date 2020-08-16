import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


// FireBase
import { AngularFireModule } from '@angular/fire';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

import { LoginPageModule } from '../app/login/login.module';
import { MenuPageModule } from '../app/menu/menu.module';

import { MaterialModule } from '../app/material/material.module';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
     BrowserModule,
     MaterialModule,

     LoginPageModule,
     MenuPageModule,

     AppRoutingModule,
   
     AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
