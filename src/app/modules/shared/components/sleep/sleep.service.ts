import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { SleepWidget } from "../../../../models/widgets/sleep/sleep.model";

@Injectable({
  providedIn: 'root'
})
export class SleepService {
  public url: string;
  constructor(
    public _http: HttpClient,
  ) {
    this.url = environment.api;
  }


  getSleepToday(): Observable<any> {
    const path = '/account/widgets/sleep/hours/today';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  postHoursToday(hours: SleepWidget): Observable<any> {
    const path = '/account/widgets/sleep/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, hours, { headers: headers });
  }


  getLogSleep(): Observable<any> {
    const path = '/account/widgets/sleep/report/last-week';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }
}
