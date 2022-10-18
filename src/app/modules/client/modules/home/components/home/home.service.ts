import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { User } from "../../../../../../models/user/user.model";
import {Contents} from '../../../../../../models/contents/contents.model';
import {PaymentElement} from '../../../../../../models/payment/payment.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }
  getRecipes(params): Observable<any> {
    const path = '/contents/find-by-type';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, {headers: headers, params: params});
  }

  getTypesOfCategory(params): Observable<any> {
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
  getWorkoutToday(type, params?: HttpParams): Observable<Contents> {
    const path = '/account/my-program/workout-today';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Contents>(this.url + path + `?id=${type}`, { headers: headers, params: params });
  }
  getUsers(role: string): Observable<User[]> {
    const path = '/users/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<User[]>(this.url + path + `?role=${role}`, { headers: headers });
  }

  getPaymentHistory(): Observable<PaymentElement[]> {
    const path = '/account/payment-history';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<PaymentElement[]>(this.url + path, { headers: headers });
  }

  trashUser(content: User): Observable<any> {
    const path = '/users/trash';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, content, { headers: headers });
  }
}
