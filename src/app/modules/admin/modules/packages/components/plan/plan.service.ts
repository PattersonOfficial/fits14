import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {Contents} from '../../../../../../models/contents/contents.model';
import {Plan} from '../../../../../../models/plan/plan.model';

@Injectable({
    providedIn: 'root'
})
export class PlanService {

    public url: string;

    constructor(
        public _http: HttpClient,
    ) {
        this.url = environment.api;
    }

    getContents(cat_id): Observable<Contents[]> {
        const path = '/contents/list-by';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<Contents[]>(this.url + path + `?category=${cat_id}`, {headers: headers});
    }

    createPlan(plan: Plan): Observable<any> {
        const path = '/plans';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.post(this.url + path, plan, {headers: headers});
    }

    deletePlan(plan: Plan): Observable<any> {
        const path = '/plans/';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.delete(this.url + path + plan.id, {headers: headers});
    }

    getPlans(params): Observable<Plan[]> {
        const path = '/plans';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<Plan[]>(this.url + path, {headers: headers, params: params});
    }

    updatePlan(plan: Plan): Observable<any> {
        const path = '/plans/';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.put(this.url + path + plan.id, plan, {headers: headers});
    }

    getSubcategoriesByCategoryId(category): Observable<any[]> {
        const path = '/subcategories/list-by-categoryid';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this._http.get<any[]>(this.url + path + `?category_id=${category}`, {headers: headers});
    }
} 
