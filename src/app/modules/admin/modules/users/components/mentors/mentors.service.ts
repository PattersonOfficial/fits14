import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {User} from '../../../../../../models/user/user.model';

@Injectable({
    providedIn: 'root'
})
export class MentorsService {
    public url: string;

    constructor(
        public _http: HttpClient,
    ) {
        this.url = environment.api;
    }

    getUsers(role: string): Observable<User[]> {
        const path = '/users/list';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<User[]>(this.url + path + `?role=${role}`, {headers: headers});
    }

    trashUser(content: User): Observable<any> {
        const path = '/users/trash';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.delete(this.url + path + `?id=${content.id}`, {headers: headers});
    }
}
