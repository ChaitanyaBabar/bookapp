import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


// FireBase
import { AngularFireModule } from '@angular/fire';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';


import { MaterialModule } from '../app/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    PageNotFoundComponent
  ],
  entryComponents: [],
  imports: [
     BrowserModule,
     ReactiveFormsModule,
     MaterialModule,
     FlexLayoutModule,

     AppRoutingModule,
     AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
