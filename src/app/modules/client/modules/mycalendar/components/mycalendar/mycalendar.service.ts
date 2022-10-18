import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyCalendarService {
  public url: string;
  constructor(
      public _http: HttpClient,
  ) {
    this.url = environment.api;
  }

  getEventsDay(params): Observable<any> {
    const path = '/calendar/events/by-date';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `/${params.date}?uid=${params.user_id}`, { headers: headers });
  }

  setEventDay(params): Observable<any> {
    const path = '/calendar/events/save';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, params, { headers: headers });
  }

  setStateOfEvent(event, state): Observable<any> {
    const path = '/calendar/events/update/' + event;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path + `?state=${state}`, { headers: headers });
  }

  getEventsMonth(date): Observable<any> {
    const path = '/calendar/events/month/' + date;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }
}
