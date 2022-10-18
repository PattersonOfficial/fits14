import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { Memberships } from "../../../../../../models/memberships/memberships.model";
import { Categories } from "../../../../../../models/categories/categories.model";
import { Types } from "../../../../../../models/types/types.model";

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getTypes(): Observable<Types[]> {
    const path = '/types/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Types[]>(this.url + path, { headers: headers });
  }

  getTypesByCategory(category): Observable<Types[]> {
    const path = '/types/list-by';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Types[]>(this.url + path + `?category=${category}`, { headers: headers });
  }



  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadFiles(files: FormData): Observable<any> {
    const req = new HttpRequest<FormData>('POST', this.url + '/storage/file-upload', files, {
      reportProgress: true
    })

    return this._http.request(req);
  }



  getTypesOfMembership(membership): Observable<Types[]> {
    const path = '/types/find-by-membership';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Types[]>(this.url + path + `?id=${membership.id}`, { headers: headers });
  }

  getQuestionsOfMemberships(membership: Memberships): Observable<any[]> {
    const path = '/types/questions/of-membership';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<any[]>(this.url + path + `?id=${membership.id}`, { headers: headers });
  }

  listQuestionsOfCategory(item: Types): Observable<any[]> {
    const path = '/types/questions/of-category';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<any[]>(this.url + path + `?membership=${item.membership.id}&category=${item.category.id}`, { headers: headers });
  }

  postType(type: Types): Observable<any> {
    const path = '/types/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, type, { headers: headers });
  }

  saveProgram(program): Observable<any> {
    const path = '/types/save-program';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, program, { headers: headers });
  }

  putType(type: Types): Observable<any> {
    const path = '/types/update';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path, type, { headers: headers });
  }

  trashType(type: Types): Observable<any> {
    const path = '/types/trash';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + path + `?id=${type.id}`, { headers: headers });
  }


  delQuestion(program): Observable<any> {
    const path = '/types/trash-question-of-program';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + path + `?id=${program.id}`, { headers: headers });
  }
}
