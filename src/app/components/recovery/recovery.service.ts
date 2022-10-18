import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RecoveryMail, RecoveryNewPassword } from './recovery.model';

@Injectable()
export class RecoveryService {
    public url: string;

    constructor(
        public _http: HttpClient,
    ) {
        this.url = environment.api;
    }

    recoveryRequest(mail: RecoveryMail): Observable<any> {
        const path = '/password/forget';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, mail, { headers: headers });
    }

    recoverySendNewPassword(password: RecoveryNewPassword): Observable<any> {
        const path = '/password/reset';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, password, { headers: headers });
    }

    
}
