import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {StorageService} from '../../services/auth/storage.service';
import {User} from '../../models/user/user.model';
import {Role} from '../../models/user/roles.model';
import {Session} from '../../models/auth/session.model';
import {Country} from '../../models/common/country.model';

@Injectable()
export class RegisterService {
    public url: string;

    constructor(
        public _http: HttpClient,
        private _storageService: StorageService
    ) {
        this.url = environment.api;
    }

    register(userObj: User): Observable<any> {
        const path = '/account/register';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, userObj, {headers: headers});
    }

    getCountries(): Observable<Country[]> {
        const path = 'assets/countries.json';
        return this._http.get<Country[]>(path);
    }

    getMemberships(): Observable<any> {
        const path = '/memberships/list';
        return this._http.get(this.url + path);
    }

    getTimeZones(): Observable<any> {
        const path = '/services/timezones/list-availables';
        return this._http.get(this.url + path);
    }

    getIpAddress(): Observable<any> {
        const path = '/user/getipaddress';
        return this._http.get(this.url + path);
    }

    checkEmail(email: string) {
        const path = '/services/validate/email';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, {'email': email}, {headers: headers});
    }

    sendEmailToken(email: string) {
        const path = '/user/send-email-token';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, {'email': email}, {headers: headers});
    }

    verifyEmailToken(data: any) {
        const path = '/user/verify-email-token';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, data, {headers: headers});
    }

    saveAccount(fields: User) {
        const path = '/account/register';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post<Session>(this.url + path, fields, {headers: headers});
    }

    saveBasicInformation(fields: User) {
        const path = '/account/update-gender-date_birth';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post<Session>(this.url + path, fields, {headers: headers});
    }

    checkPhone(phone: string): Observable<any> {
        const path = '/services/validate/phone';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, {'phone': phone}, {headers: headers});
    }

    getUser(id: string) {
        const path = '/users/find';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path + `?id=${id}`, {headers: headers});
    }

    getRoles(): Observable<Role[]> {
        return this._http.get<Role[]>(this.url + '/users/roles');
    }

    public uploadFiles(files: FormData): Observable<any> {
        const req = new HttpRequest<FormData>('POST', this.url + '/contents/files/upload', files, {
            reportProgress: true
        });

        return this._http.request(req);
    }

    generateInvoice(data) {
        const path = '/payment/generate-invoice';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post<Session>(this.url + path, data, {headers: headers});
    }

}
