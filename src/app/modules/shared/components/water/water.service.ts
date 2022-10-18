import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

import { WaterWidget } from '../../../../models/widgets/water/water.model';

@Injectable({
  providedIn: 'root'
})
export class WaterService {
  public url: string;
  constructor(
    public _http: HttpClient,
  ) {
    this.url = environment.api;
  }

  getIngested(): Observable<any> {
    const path = '/account/widgets/water/ingested/today';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  postIngestedToday(water: WaterWidget): Observable<any> {
    const path = '/account/widgets/water/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, water, { headers: headers });
  }

  saveInfoExtraClient(extra: object): Observable<any> {
    const path = '/account/widgets/water/register-info-extra';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, extra, { headers: headers });
  }

  getLogWater(measurement: string): Observable<any> {
    const path = '/account/widgets/water/report/last-week';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?measurement=${measurement}`, { headers: headers });
  }
}
