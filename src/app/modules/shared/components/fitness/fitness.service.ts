import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {
  public url: string;
  constructor(
    public _http: HttpClient,
  ) {
    this.url = environment.api;
  }

  getProgress(): Observable<any> {
    const path = '/account/my-program/fitness';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }
}
