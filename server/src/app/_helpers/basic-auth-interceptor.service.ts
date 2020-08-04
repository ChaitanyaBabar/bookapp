import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_shared/authentication.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthInterceptorService implements HttpInterceptor{

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    const currentToken = this.authenticationService.currentUserTokenValue;
    if (currentToken) {
        request = request.clone({
            setHeaders: {
                'Authorization': `Basic ${currentToken}`,
                'Content-Type':  'application/json',
            }
        });
    }

    return next.handle(request);
}
}
