import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypesService {
  public url: string;
  constructor(
    public _http: HttpClient,
  ) {
    this.url = environment.api;
  }

  getTypesOfCategory(params: any): Observable<any> {
    const path = '/categories/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${params.id}`, { headers: headers });
  }


  getMyClientTypes(): Observable<any> {
    const path = '/account/my-program/list/all';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }


  startProgram(id: any): Observable<any> {
    const path = '/account/my-program/start';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path, { id: id }, { headers: headers });
  }

  startMyProgram(id: any): Observable<any> {
    const path = '/account/my-program/start/fitnes';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, { id: id }, { headers: headers });
  }
}
