import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { Quotes } from "../../../../../../models/quotes/quotes.model";

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getQuote(): Observable<Quotes> {
    const path = '/quotes/load/day';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Quotes>(this.url + path, { headers: headers });
  }


  getQuotes(): Observable<Quotes[]> {
    const path = '/quotes/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Quotes[]>(this.url + path, { headers: headers });
  }

  postQuotes(list: any[]): Observable<any> {
    const path = '/quotes/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, list, { headers: headers });
  }
}
