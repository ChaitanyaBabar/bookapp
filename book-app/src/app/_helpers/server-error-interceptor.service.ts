import { Injectable } from '@angular/core';
import { HttpHandler, HttpEvent, HttpRequest, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';



import { UsersService } from '../_shared/users.service';


@Injectable({
  providedIn: 'root'
})
export class ServerErrorInterceptorService implements HttpInterceptor{

  constructor(private userService: UsersService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError(err => {
        let error = err.error.message || err.statusText;
        // TODO: verify of whether status checking is required here or not.
        // if (err.status === 401) {
        //     this.userService.logout();
        //     location.reload(true);
        // }
        return throwError(error);
    }));
  }
}
