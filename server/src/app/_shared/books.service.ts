import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BooksService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getBooks(route: string): any {
    return this.http.get<any>(this.createCompleteRoute(route, this.envUrl.environmentUrl));
  }

  private createCompleteRoute(route: string, envAddress: string) {
    return `${envAddress}/${route}`;
  }


}
