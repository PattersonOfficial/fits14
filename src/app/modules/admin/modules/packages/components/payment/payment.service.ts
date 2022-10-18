import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "../../../../../../services/auth/storage.service";
import { environment } from "../../../../../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  readonly vodProgramProductType = "vod_program";
  readonly membershipProductType = "membership";

  public url: string;

  constructor(
    public _http: HttpClient,
    private _storageService: StorageService
  ) {
    this.url = environment.api;
  }

  payByCard(body: object): Observable<any> {
    const path = "/payment/card";
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this._http.post(this.url + path, body, { headers: headers });
  }

  getHostedPaymentPageLink(
    params
  ): Observable<{
    payment_page_link?: string;
    result?: boolean;
    coupon_code?: string;
  }> {
    const path = "/payment/hosted-page-link";
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this._http.get<{ payment_page_link?: string; result?: boolean }>(
      this.url + path,
      { headers: headers, params: params }
    );
  }

  switchChargeAmount(params): Observable<{ membership_id: string }> {
    const path = "/payment/switch-charge-amount";
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this._http.get<{ membership_id: string }>(this.url + path, {
      headers: headers,
      params: params,
    });
  }

  useCoupon(params: {
    coupon_code: string;
    product_id: number;
    product_type: string;
  }): Observable<{ discount_price: number }> {
    const path = "/coupons/use";
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this._http.post<{ discount_price: number }>(
      this.url + path,
      params,
      { headers: headers }
    );
  }

  couponCodeCheck(payload: object): Observable<any> {
    const path = '/payment/product-data-onregister';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, payload, { headers: headers });
  }

  authCaptureOnregisterPayment(payload: object): Observable<any> {
    const path = '/payment/auth-capture-onregister';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, payload, { headers: headers });
  }

  authCapturePayment(payload: object): Observable<any> {
    const path = "/payment/auth-capture";
    const headers = new HttpHeaders({
     "Content-Type": "application/json",
    });
    return this._http.post(this.url + path, payload, { headers: headers });
   }

  authCaptureZeroPayment(payload: object): Observable<any> {
    const path = "/payment/auth-capture-zero";
    const headers = new HttpHeaders({
     "Content-Type": "application/json",
    });
    return this._http.post(this.url + path, payload, { headers: headers });
   }
  
}
