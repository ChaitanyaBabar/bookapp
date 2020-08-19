import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RegisteredUser } from '../model/book.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { EnvironmentUrlService } from './environment-url.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<RegisteredUser>;
  private currentUserToken: BehaviorSubject<string>;
  public currentUser: Observable<RegisteredUser>;

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
    let user = localStorage.getItem('currentUser') === 'undefined' ? "{}" : localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<RegisteredUser>(JSON.parse(user));
    this.currentUserToken = new BehaviorSubject<string>(localStorage.getItem('token'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): RegisteredUser {
    return this.currentUserSubject.value;
  }

  public get currentUserTokenValue(): string {
    return this.currentUserToken.value;
  }

  public setCurrentUserSubject(user){
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  public setCurrentUserToken(token){
    localStorage.setItem('token', token);
    this.currentUserToken.next(token);
  }

}
