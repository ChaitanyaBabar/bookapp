import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


// Other Parties
import { FlexLayoutModule } from '@angular/flex-layout';

// FireBase
import { AngularFireModule } from '@angular/fire';



import { environment } from '../environments/environment';

// Shared Modules
import { MaterialModule } from '../app/material/material.module';


// Feature Modules
import { BooksModule } from './books/books.module';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthenticationService } from './_shared/authentication.service';
import { EnvironmentUrlService } from './_shared/environment-url.service';
import { BooksService } from './_shared/books.service';
import { UsersService } from './_shared/users.service';
import { BasicAuthInterceptorService } from './_helpers/basic-auth-interceptor.service';
import { GlobalErrorHandlerService } from './_helpers/global-error-handler.service';
import { ServerErrorInterceptorService } from './_helpers/server-error-interceptor.service';
import { BookDialogComponent } from './book-dialog/book-dialog.component';



@NgModule({
  imports: [
     BrowserModule,
     ReactiveFormsModule,
     MaterialModule,
     FlexLayoutModule,
     HttpClientModule,

    // importing feature modules
     BooksModule,
     AppRoutingModule,
     AngularFireModule.initializeApp(environment.firebase),
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    PageNotFoundComponent,
    BookDialogComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptorService, multi: true }
   ],
  bootstrap: [AppComponent]
})
export class AppModule {}
