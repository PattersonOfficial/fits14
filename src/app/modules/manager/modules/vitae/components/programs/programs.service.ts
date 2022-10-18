import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Packages } from "../../../../../../models/packages/packages.model";

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";


@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getUser(id: number) {
    const path = '/users/find'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${id}`, { headers: headers });
  }


  getPrograms(id) {
    const path = '/reports/program/list/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${id}`, { headers: headers });
  }
}
