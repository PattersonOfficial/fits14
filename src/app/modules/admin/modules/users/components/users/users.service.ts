import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {StorageService} from '../../../../../../services/auth/storage.service';
import {User} from '../../../../../../models/user/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    public url: string;

    constructor(
        public _http: HttpClient,
        private _storageService: StorageService
    ) {
        this.url = environment.api;
    }

    getUsers(params = new HttpParams()): Observable<User[]> {
        const path = '/users';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<User[]>(this.url + path, {headers: headers, params: params});
    }

    trashUser(content: User): Observable<any> {
        const path = '/users/trash';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.delete(this.url + path + `?id=${content.id}`, {headers: headers});
    }

    cancelPlan(): Observable<any> {
        const path = '/profile/unsubscribe';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, {headers: headers});
    }
}
