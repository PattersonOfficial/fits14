import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { StorageService } from "../../../../services/auth/storage.service";

import { Feed } from "../../../../models/feed/feed.model";
import { Categories } from "../../../../models/categories/categories.model";

@Injectable({
  providedIn: 'root'
})
export class PlanQuestionsService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }
  logout(): Observable<any> {
    const path = '/auth/logout'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.url + path, {}, { headers: headers });
  }
  getQuestionsOfMembership(): Observable<any> {
    const path = '/account/questions-of-membership';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }


  saveMedidas(data: any): Observable<any> {
    const path = '/account/save-medidas';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path, data, { headers: headers });
  }


  getQuestionsOfCategory(category: number): Observable<any> {
    const path = '/account/questions-of-category';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${category}`, { headers: headers });
  }

  setResponsesOfUser(responses: any[]): Observable<any> {
    const path = '/account/save-my-responses';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, responses, { headers: headers });
  }
}
