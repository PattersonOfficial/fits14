import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {StorageService} from '../../../../../../services/auth/storage.service';
import {Types} from '../../../../../../models/types/types.model';
import {Plan} from 'src/app/models/plan/plan.model';

@Injectable({
    providedIn: 'root'
})
export class PackagesService {
    public url: string;

    constructor(
        public _http: HttpClient,
        private _storageService: StorageService
    ) {
        this.url = environment.api;
    }

    getMemberships(): Observable<any> {
        const path = '/memberships/list';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, {headers: headers});
    }

    getCategories(): Observable<any> {
        const path = '/categories/list';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, {headers: headers});
    }

    getType(type_id: number): Observable<Types> {
        const path = '/types/';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<Types>(this.url + path + `${type_id}`, {headers: headers});
    }

    updateType(type: Types): Observable<any> {
        const path = '/types/';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.put(this.url + path + `${type.id}`, type, {headers: headers});
    }

    getPlans(): Observable<Plan[]> {
        const path = '/plans';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<Plan[]>(this.url + path, {headers: headers});
    }
}
