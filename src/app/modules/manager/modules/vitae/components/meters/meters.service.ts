import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Packages } from "../../../../../../models/packages/packages.model";

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";
import {User} from '../../../../../../models/user/user.model';


@Injectable({
  providedIn: 'root'
})
export class MetersService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getUser(id: number): Observable<User> {
    const path = '/users/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<User>(this.url + path + `?id=${id}`, { headers: headers });
  }

  getLogOfRangeSleep(params): Observable<any> {
    const path = '/reports/sleep-meter/log';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, params, { headers: headers });
  }


  getLogOfRangeWater(params, measurement): Observable<any> {
    const path = '/reports/water-meter/log';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path + `?measurement=${measurement}`, params, { headers: headers });
  }

  getLogOfRangeSmoke(params): Observable<any> {
    const path = '/reports/smoke-meter/log';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, params, { headers: headers });
  }
}
