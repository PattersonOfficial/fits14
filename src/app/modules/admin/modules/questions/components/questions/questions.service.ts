import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { Questions } from "../../../../../../models/questions/questions.model";
import { Responses } from "../../../../../../models/questions/responses.model";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  listQuestions(): Observable<Questions[]> {
    const path = '/questions/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Questions[]>(this.url + path, { headers: headers });
  }

  postQuestion(question: Questions): Observable<any> {
    const path = '/questions/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, question, { headers: headers });
  }

  putQuestion(question: Questions): Observable<any> {
    const path = '/questions/update';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // console.log(question);
    return this._http.put(this.url + path, question, { headers: headers });
  }

  postAnswers(responses: any[]): Observable<any> {
    const path = '/questions/answers/save';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, responses, { headers: headers });
  }


  trashQuestion(question: Questions): Observable<any> {
    const path = '/questions/trash';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + path + `?id=${question.id}`, { headers: headers });
  }


  delAnswers(response: Responses): Observable<any> {
    const path = '/questions/answers/trash';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + path + `?id=${response.id}`, { headers: headers });
  }
}
