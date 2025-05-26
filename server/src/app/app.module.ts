/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information. 
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonAngularMaterialModule } from './common-angular-material/common-angular-material.module';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';


import { BookModule } from './book/book.module';
import { BooksService } from './_shared/books.service';

import { UserModule } from './user/user.module';

import { EnvironmentUrlService } from './_shared/environment-url.service';
import { SignupComponent } from './signup/signup.component';
import { AuthenticationService } from './_shared/authentication.service';
import { GlobalErrorHandlerService } from './_helpers/global-error-handler.service';
import { BasicAuthInterceptorService } from './_helpers/basic-auth-interceptor.service';
import { ServerErrorInterceptorService } from './_helpers/server-error-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    WelcomeComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonAngularMaterialModule,
    BookModule,
    UserModule,
    AppRoutingModule
  ],
  providers: [ BooksService,
               EnvironmentUrlService,
               AuthenticationService,
               { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
               { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptorService, multi: true },
               { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptorService, multi: true }
              ],
  bootstrap: [AppComponent]
})
export class AppModule { 


 /**
   * Demo change in the app.module.ts file
   * to test the GitHub Actions workflow
   * for rasing a PR , containing the file that does not
   * have copy-right headers and hence Github Actions
   * for check-copyright.yml make the PR to fail.
   */

}


// Dummy unrelated change in app.moudle.ts | server-acl | Batch 1
// Dummy unrelated change in server/src/app/app.moudle.ts | server-acl | Batch 2
// Dummy unrelated change in server/src/app/app.moudle.ts | server-acl | Batch 3
// Dummy unrelated change in server/src/app/app.moudle.ts | server-acl | Batch 4
// Dummy unrelated change in server/src/app/app.moudle.ts | server-acl | Batch 5
// Dummy unrelated change in server/src/app/app.moudle.ts | server-acl | Batch 6
// Dummy unrelated change in server/src/app/app.moudle.ts | server-acl | Batch 7
// Dummy unrelated change in server/src/app/app.moudle.ts | server-acl | Batch 8