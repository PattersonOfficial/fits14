import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginObject } from './login.model';
import { FacebookLoginObject } from './facebook.login.model';
import { Session } from '../../models/auth/session.model';
import { StorageService } from '../../services/auth/storage.service';

@Injectable()
export class LoginService {
  public url: string;

  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  login(loginObj: LoginObject): Observable<any> {
    const path = '/auth/login';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, loginObj, { headers: headers });
  }

  fbLogin(fbData: FacebookLoginObject) {
    const path = '/social-login';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post<Session>(this.url + path, fbData, { headers: headers });
  }

  googleLogin(googleData) {
    const path = '/login/google';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post<Session>(this.url + path, googleData, { headers: headers });
  }

  socialLogin(data) {
    const path = '/social-auth';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post<Session>(this.url + path, data, { headers: headers });
  }

  logout(): Observable<any> {
    const path = '/auth/logout';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, {}, { headers: headers });
  }

  userInformation(data) {
    const path = '/get-user-info';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post<Session>(this.url + path, data, { headers: headers });
  }
}
