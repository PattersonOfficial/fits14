import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {VodProgram} from '../../models/vodprogram/vodprogram.model';


@Injectable({
    providedIn: 'root'
})
export class VodService {

    public url: string;
    constructor(
        public _http: HttpClient,
    ) {
        this.url = environment.api;
    }

    getVodPrograms(): Observable<any> {
        const path = '/vod-programs';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, { headers: headers });
    }

    getMorePrograms(): Observable<any> {
        const path = '/vod-programs';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path + '?display_in_more_vod', { headers: headers });
    }

    getVodProgramData(id: any): Observable<any> {
        const path = `/vod-programs/${id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, { headers: headers });
    }

    createVodProgram(program: VodProgram): Observable<any> {
        const path =  '/vod-programs';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, program, { headers: headers });
    }

    editVodProgram(program: VodProgram): Observable<any> {
        const path =  `/vod-programs/${program.id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.put(this.url + path, program, { headers: headers });
    }

    deleteVodProgram(id: any): Observable<any> {
        const path =  `/vod-programs/${id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.delete(this.url + path, { headers: headers });
    }

    getUserSubscriptions(): Observable<any> {
        const path = '/vod-programs/ordered';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, { headers: headers });
    }

    buyVodProgram(id: any): Observable<any> {
        const path =  `/vod-programs/${id}/buy`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, { headers: headers });
    }

    purchaseProgram(data: any): Observable<any> {
        const path =  `/vod-programs/add-to-list/${data.id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, { headers: headers });
    }

    removePurchasedProgram(data: any): Observable<any> {
        const path =  `/vod-programs/remove-from-list/${data.id}/${data.invoice.id}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get(this.url + path, { headers: headers });
    }
}
