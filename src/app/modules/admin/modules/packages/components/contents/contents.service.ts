import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {environment} from '../../../../../../../environments/environment';
import {StorageService} from '../../../../../../services/auth/storage.service';

import {Contents} from '../../../../../../models/contents/contents.model';
import {Subcategory} from '../../../../../../models/categories/categories.model';

@Injectable({
    providedIn: 'root'
})
export class ContentsService {

    public url: string;

    constructor(
        public _http: HttpClient,
        private _storageService: StorageService
    ) {
        this.url = environment.api;
    }

    getListByFilter(params): Observable<Contents[]> {
        const path = '/contents';
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        return this._http.get<Contents[]>(this.url + path, {headers: headers, params: params});
    }

    getContents(category): Observable<Contents[]> {
        const path = '/contents/list-by';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<Contents[]>(this.url + path + `?category=${category}`, {headers: headers});
    }

    getSubcategoriesByCategoryId(category): Observable<Subcategory[]> {
        const path = '/subcategories/list-by-categoryid';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<Subcategory[]>(this.url + path + `?category_id=${category}`, {headers: headers});
    }

    getSubcategories(): Observable<any[]> {
        const path = '/subcategories/list';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<any[]>(this.url + path, {headers: headers});
    }

    trashContent(content: Contents): Observable<any> {
        const path = '/contents/trash';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.delete(this.url + path + `?id=${content.id}`, {headers: headers});
    }
}
