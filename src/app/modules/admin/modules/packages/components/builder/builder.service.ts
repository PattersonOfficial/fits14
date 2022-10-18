import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../../environments/environment';
import { StorageService } from "../../../../../../services/auth/storage.service";

import { Contents } from "../../../../../../models/contents/contents.model";
import { RecipeDescriptionTable } from "../../../../../../models/contents/recipeDescriptionTable.model";
import { RecipeNutrientsTable } from "../../../../../../models/contents/recipeNutrientsTable.model";
import { Data } from "../../../../../../models/contents/data.model";

@Injectable({
  providedIn: 'root'
})
export class BuilderService {

  public url: string;
  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  /**
   * Envia información de contenido al servidor
   *
   * @return void
   */
  saveContent(content: Contents): Observable<any> {
    const path = '/contents/register';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(this.url + path, content, { headers: headers });
  }

  /**
   * Envia información de contenido al servidor
   *
   * @return void
   */
  updateContent(content: Contents): Observable<any> {
    const path = '/contents/update';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.put(this.url + path, content, { headers: headers });
  }


  /**
   * Obtiene información de contenido
   *
   * @return void
   */
  getContent(content: Contents): Observable<any> {
    const path = '/contents/find';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${content.id}`, { headers: headers });
  }


  /**
   * Obtiene información de contenido
   *
   * @return void
   */
  getRecipes(recipe): Observable<any> {
    const path = '/contents/find-by-recipe';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get(this.url + path + `?id=${recipe}`, { headers: headers });
  }

  delAnswers(response: RecipeDescriptionTable): Observable<any> {
    const path = '/contents/delete-ingredient';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + path + `?id=${response.id}`, { headers: headers });
  }

  getSubcategories(): Observable<any[]> {
    const path = '/subcategories/list';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<any[]>(this.url + path, { headers: headers });
  }

  getSubcategoriesByCategoryId(category): Observable<any[]> {
    const path = '/subcategories/list-by-categoryid';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.get<any[]>(this.url + path + `?category_id=${category}`, { headers: headers });
  }

  delNutrients(response: RecipeDescriptionTable): Observable<any> {
    const path = '/contents/delete-nutrients';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.delete(this.url + path + `?id=${response.id}`, { headers: headers });
  }

  
  /**
   * Envia archivos al servidor
   *
   * @return void
   */
  public uploadFiles(files: FormData): Observable<any> {
    const req = new HttpRequest<FormData>('POST', this.url + '/storage/file-upload', files, {
      reportProgress: true
    });

    return this._http.request(req);
  }
}
