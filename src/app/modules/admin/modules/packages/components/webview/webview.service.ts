import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { Contents } from "../../../../../../models/contents/contents.model";

@Injectable({
  providedIn: 'root'
})
export class WebViewService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  /**
   * Obtiene información de contenido
   *
   * @return void
   */
  getContent(content: Contents): Observable<any> {
    const path = '/contents/find'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${content.id}`, { headers: headers });
  }

  getContentByUrl(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(url, { headers: headers });
  }


  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadFiles(files: FormData): Observable<any> {
    const req = new HttpRequest<FormData>('POST', this.url + '/contents/files/upload', files, {
      reportProgress: true
    })

    return this._http.request(req);
  }
}
