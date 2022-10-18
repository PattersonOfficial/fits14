import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Packages } from "../../../../../../models/packages/packages.model";

import { environment } from '../../../../../../../environments/environment';
import { Types } from "../../../../../../models/types/types.model";

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  public url: string;
  constructor(
    public _http: HttpClient,
  ) {
    this.url = environment.api;
  }

  getClientType(id): Observable<any> {
    const path = '/types/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${id}`, { headers: headers });
  }


  getRecipes(type): Observable<any> {
    const path = '/contents/find-by-type';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${type}`, { headers: headers });
  }



  getArticle(id): Observable<any> {
    const path = '/contents/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${id}`, { headers: headers });
  }


  getFoodByCategoryAndType(category, type): Observable<any> {
    const path = '/contents/get-food';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?category=${category}&type=${type}`, { headers: headers });
  }




  getMyClientTypes(): Observable<any> {
    const path = '/account/my-program/list/all';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  getWorkoutToday(type): Observable<any> {
    const path = '/account/my-program/workout-today';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${type}`, { headers: headers });
  }

  getAllWorkouts(): Observable<any> {
    const path = '/account/my-program/all-workouts';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  getAllArticles(type): Observable<any> {
    const path = '/account/my-program/articles';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${type}`, { headers: headers });
  }

  getContentByClientType(): Observable<any[]> {
    const path = '/account/my-program/by-client-type';
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

  startStepOfProgram(id: number, step: number): Observable<any[]> {
    const path = '/account/my-program/start-step';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put<any[]>(this.url + path + `?id=${id}&step=${step}`, { headers: headers });
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
}
