import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { Memberships } from "../../../../../../models/memberships/memberships.model";

@Injectable({
  providedIn: 'root'
})
export class MembershipsService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getMemberships(): Observable<Memberships[]> {
    const path = '/memberships/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Memberships[]>(this.url + path, { headers: headers });
  }

  putMemberships(membership: Memberships): Observable<any> {
    const path = '/memberships/update';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path, membership, { headers: headers });
  }
}
