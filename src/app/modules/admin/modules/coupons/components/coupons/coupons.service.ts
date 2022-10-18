import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from '../../../../../../services/auth/storage.service';
import {environment} from '../../../../../../../environments/environment';
import {Coupon} from '../../../../../../models/coupon/coupon.model';

@Injectable({
    providedIn: 'root'
})
export class CouponsService {

    public url: string;

    constructor(
        public _http: HttpClient,
        private _storageService: StorageService
    ) {
        this.url = environment.api;
    }

    getCouponsList(): Observable<Coupon[]> {
        const path = '/coupons';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.get<Coupon[]>(this.url + path, {headers: headers});
    }

    createCoupon(coupon: Coupon): Observable<Coupon> {
        const path = '/coupons';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.post<Coupon>(this.url + path, coupon, {headers: headers});
    }

    updateCoupon(coupon: Coupon): Observable<Coupon> {
        const path = '/coupons/';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.put<Coupon>(this.url + path + `${coupon.id}`, coupon, { headers: headers });
    }

    deleteCoupon(coupon: Coupon): Observable<any> {
        const path = '/coupons/';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this._http.delete(this.url + path + `${coupon.id}`, {headers: headers});
    }
}
