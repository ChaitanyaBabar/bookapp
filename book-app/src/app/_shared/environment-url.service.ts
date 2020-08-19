import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentUrlService {

  // tslint:disable-next-line: variable-name
  private _environmentUrl: string;

  constructor() {
    this._environmentUrl = environment.baseUrl;
  }

  public get environmentUrl(): string {
    return this._environmentUrl;
  }


  public generateHeaders() {
    const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'accept-encoding': 'application/json'
          })
    };

    return httpOptions;
  }
}
