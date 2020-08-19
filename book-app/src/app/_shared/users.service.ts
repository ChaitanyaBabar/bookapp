import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl: string;

  constructor(private http: HttpClient,
              private envUrl: EnvironmentUrlService,
              private authService: AuthenticationService) {
    this.baseUrl = this.envUrl.environmentUrl;
  }

  login(email: string, password: string) {
      const url = this.baseUrl + '/login/v1/signin';
      const data = { email, password};
      return this.http.post<any>(url, data)
        .pipe(map(response => {
          if (response.message && response.user && response.token) {
              const user = response.user;
              this.authService.setCurrentUserSubject(user);
              this.authService.setCurrentUserToken(response.token);
              return user;
          }
          else{
              const error: HttpErrorResponse = new HttpErrorResponse(response.message);
              return throwError(error);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        }));

  }

  logout() {
    this.authService.setCurrentUserSubject(null);
    this.authService.setCurrentUserToken(null);

    /**
     * TODO Remove use of localStorage to authService only , as single place to perform authentication stuff.
     */
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

}
