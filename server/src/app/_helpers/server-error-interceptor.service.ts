import { Injectable } from '@angular/core';
import { HttpHandler, HttpEvent, HttpRequest, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


import { AuthenticationService } from '../_shared/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class ServerErrorInterceptorService implements HttpInterceptor{

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError(err => {
      let error = err.error.message || err.statusText;
      if (err.status === 401) {
          // auto logout if 401 response returned from api
          error = error + ' Page will reload in 5 sec';
          setTimeout(() => {
              this.authenticationService.logout();
              location.reload(true);
          }, 5000);
      };

      return throwError(error);
  }));
}
}
