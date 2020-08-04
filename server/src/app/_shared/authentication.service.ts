import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IUser } from '../modals/interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { EnvironmentUrlService } from './environment-url.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  private currentUserToken: BehaviorSubject<string>;
  public currentUser: Observable<IUser>;

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
    let user = localStorage.getItem('currentUser') === 'undefined' ? "{}" : localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(user));
    this.currentUserToken = new BehaviorSubject<string>(localStorage.getItem('token'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
      return this.currentUserSubject.value;
  }

  public get currentUserTokenValue() {
    return this.currentUserToken.value;
  }

  public login(route: string, email: string, password: string) {
    return this.http.post < any > (`${this.envUrl.environmentUrl}/${route}`, {
            email,
            password
        })
        .pipe(map(response => {
            // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
            if (response) {
                let user = response.user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(user);
                this.currentUserToken.next(response.token);
                return user;
            }

        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        }));

  }

  public logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      this.currentUserSubject.next(null);
      this.currentUserToken.next(null);
  }


}
