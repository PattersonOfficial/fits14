import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { CigarsWidget } from "../../../../models/widgets/cigars/cigars.model";

@Injectable({
  providedIn: 'root'
})
export class CigarsService {
  public url: string;
  constructor(
    public _http: HttpClient,
  ) {
    this.url = environment.api;
  }

  getSmokeToday(): Observable<any> {
    const path = '/account/widgets/cigars/smoke/today';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  saveCigars(smoke: CigarsWidget): Observable<any> {
    const path = '/account/widgets/cigars/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, smoke, { headers: headers });
  }

  getLogSmoke(): Observable<any> {
    const path = '/account/widgets/cigars/report/last-week';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }
}
