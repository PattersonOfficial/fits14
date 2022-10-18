import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';

import {environment} from '../../../../../environments/environment';
import {StorageService} from '../../../../services/auth/storage.service';

import {Friends, Contacts} from '../../../../models/user/friends.model';

@Injectable({
    providedIn: 'root'
})
export class FriendsService {
    public url: string;

    constructor(
        public _http: HttpClient,
        private _storageService: StorageService
    ) {
        this.url = environment.api;
    }

    postInvitationFriend(friends: Contacts): Observable<any> {
        const path = '/account/friends/invite';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, friends, {headers: headers});
    }


    getMyFriends(user): Observable<any> {
        const path = '/account/friends/list';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, user, {headers: headers});
    }

    searchUsers(name: string): Observable<any[]> {
        const path = '/users/find-by-name';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<any[]>(this.url + path + `?name=${name}`, {headers: headers});
    }

    getFriendshipRequestsByUserId(id: string): Observable<any[]> {
        const path = '/account/friends/list';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        // return this._http.post(this.url + path + `?user_id=${id}`, { headers: headers });
        return this._http.get<any[]>(this.url + path, { headers: headers });
    }

    
}
