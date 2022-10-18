import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { Categories } from "../../../../../../models/categories/categories.model";
import {Meal} from '../../../../../../models/meal/meal.model';
import {Calories} from '../../../../../../models/calories/calories.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  getCategories(): Observable<Categories[]> {
    const path = '/categories/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Categories[]>(this.url + path, { headers: headers });
  }

  getMeals(): Observable<Meal[]> {
    const path = '/contents/recipe/meal-type-list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Meal[]>(this.url + path, { headers: headers });
  }

  getCaloriesList(): Observable<Calories[]> {
    const path = '/contents/recipe/daily-calories-list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<Calories[]>(this.url + path, { headers: headers });
  }

  postCategory(category: Categories): Observable<any> {
    const path = '/categories/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, category, { headers: headers });
  }

  putCategory(category: Categories): Observable<any> {
    const path = '/categories/update';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path, category, { headers: headers });
  }

  trashCategory(category: Categories): Observable<any> {
    const path = '/categories/trash';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + path + `?id=${category.id}`, { headers: headers });
  }
}
