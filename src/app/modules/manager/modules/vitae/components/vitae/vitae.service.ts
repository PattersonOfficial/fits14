import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { User } from "../../../../../../models/user/user.model";

@Injectable({
  providedIn: 'root'
})
export class VitaeService {

  public url: string;

  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getUser(id: string): Observable<User> {
    const path = '/users/find-firestore'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<User>(this.url + path + `?id=${id}`, { headers: headers });
  }
}
