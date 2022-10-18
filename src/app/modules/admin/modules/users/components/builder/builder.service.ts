import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import {Observable, throwError} from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from '../../../../../../services/auth/storage.service';

import { User, UserGeneralInfo, UserBasicInfo, PassData} from '../../../../../../models/user/user.model';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getUser(id: string): Observable<User> {
    const path = '/users/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<User>(this.url + path + `?id=${id}`, {
      headers: headers,
    });
  }

  getUserBySocket(id: string): Observable<User> {
    const path = '/users/find-by-socket';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<User>(this.url + path + `?id=${id}`, {
      headers: headers,
    });
  }

  myPersonsalInformation() {
    const path = '/account/personal-information';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  getMyPrograms() {
    const path = '/account/my-program/list/all';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  getPrograms(id) {
    const path = '/account/my-program/list/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url + path + `?id=${id}`, { headers: headers });
  }

  updateSocket(fields: User) {
    const path = '/account/update-socket';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.put(this.url + path, fields, { headers: headers });
  }

  saveUser(fields: User) {
    const path = '/users/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, fields, { headers: headers });
  }

  updateUser(fields: User) {
    const path = '/users/update';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.put(this.url + path, fields, { headers: headers });
  }

  // ---------------------------------------------
  updateGeneralUserInfo(generalInfo: UserGeneralInfo) {
    const path = '/users/update/general';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, generalInfo, { headers: headers });
  }

  updateUserPassword(passData: PassData) {
    const path = '/users/update/pass';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, passData, { headers: headers });
  }

  updateUserLogo(userLogo: string) {
    const path = '/users/update/logo';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(
      this.url + path,
      { image: userLogo },
      { headers: headers }
    );
  }

  updateUserCover(userCover: string) {
    const path = '/users/update/cover';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(
      this.url + path,
      { image: userCover },
      { headers: headers }
    );
  }

  updateBasicUserInfo(basicInfo: UserBasicInfo) {
    const path = '/users/update/basic';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, basicInfo, { headers: headers });
  }

  updateUserData(user: User) {
    const path = `/users/${user.id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.put(this.url + path, user, { headers: headers });
  }

  getUsers(role: string): Observable<User[]> {
    const path = '/users/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<User[]>(this.url + path + `?role=${role}`, {
      headers: headers,
    });
  }

  updateUserImage(formData: FormData): Observable<any> {
    const path = '/profile';
    return this._http
      .post(this.url + path, formData, {
        observe: 'events',
        reportProgress: true,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  updateCommunicationCompliance(payload) {
    const path = '/users/compliance';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, payload, { headers: headers });
  }

  private handleError(error: any) {
    return throwError(error);
  }
}
