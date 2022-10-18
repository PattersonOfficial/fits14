import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Packages } from "../../../../../../models/packages/packages.model";

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";


@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getContentByClientType(): Observable<any[]> {
    const path = '/account/my-program/by-client-type';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<any[]>(this.url + path, { headers: headers });
  }

  getImagesState(): Observable<any[]> {
    const path = '/account/image-state';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<any[]>(this.url + path, { headers: headers });
  }




  getContentByCategory(category): Observable<Packages> {
    const path = '/account/my-program/by-category';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Packages>(this.url + path + `?id=${category}`, { headers: headers });
  }

  startStepOfProgram(step: number): Observable<any[]> {
    const path = '/account/my-program/start-step';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put<any[]>(this.url + path + `?id=${step}`, { headers: headers });
  }

  finishStepOfProgram(step: number): Observable<any[]> {
    const path = '/account/my-program/end-step';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put<any[]>(this.url + path + `?id=${step}`, { headers: headers });
  }

  restartProgram(program: number): Observable<any[]> {
    const path = '/account/my-program/restart/' + program;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete<any[]>(this.url + path, { headers: headers });
  }


  sendImage(image): Observable<any[]> {
    const path = '/account/register/image-state';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post<any[]>(this.url + path, image, { headers: headers });
  }


  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadFiles(files: FormData): Observable<any> {
    const req = new HttpRequest<FormData>('POST', this.url + '/account/feed/file-upload', files, {
      reportProgress: true
    });

    return this._http.request(req);
  }
}
