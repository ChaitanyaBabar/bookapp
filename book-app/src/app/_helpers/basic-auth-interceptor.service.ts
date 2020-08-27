import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_shared/authentication.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthInterceptorService implements HttpInterceptor{

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    const currentToken = this.authenticationService.currentUserTokenValue;
    let customContentType;

    if (request.headers.has('Content-Type')){
      customContentType  = request.headers.get('Content-Type');
    }


    if (currentToken) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${currentToken}`
            }
        });
    }

    return next.handle(request);
}
}
