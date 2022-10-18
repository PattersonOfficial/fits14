import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {StorageService} from '../../../../../../services/auth/storage.service';
import {User} from '../../../../../../models/user/user.model';
import {Client} from '../../../../../../models/user/client.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    public url: string;

    constructor(
        public _http: HttpClient,
        private _storageService: StorageService
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

        return this._http.post(this.url + path, content, {headers: headers});
    }

    checkPass(password: string, userId: any) {
        const path = '/users/validate/pass';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.post(this.url + path, {'password': password, 'user_id': userId}, {headers: headers});
    }

    removePaymentMethod(): Observable<Client> {
        const path = `/payment/remove-payment-method`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.delete<Client>(this.url + path, {headers: headers});
    }

    editPaymentMethod(body: object): Observable<any> {
        const path = '/payment/edit-payment-method';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.put(this.url + path, body, {headers: headers});
    }
}
