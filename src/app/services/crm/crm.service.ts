import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user/user.model';
import { Ticket } from '../../models/crm/support-ticket.model';
import { SupportEmail } from '../../models/crm/support-email.model';
import { TicketReply } from '../../models/crm/support-ticket-reply.model';
import { Reason } from '../../models/crm/repot-reason.model';
import { Invoice } from '../../models/payment/invoice.model';
import { map } from 'rxjs/operators';
import { CouponResponse } from '../../models/payment/payment.model';
import { IMembershipUpgrade } from '../../modules/admin/modules/crm-user/components/user-info/user-info.component';

@Injectable({
  providedIn: 'root',
})
export class CrmService {
  public url: string;

  constructor(public _http: HttpClient) {
    this.url = environment.api;
  }

  getCrmData(
    amount: number = 25,
    page: number = 1,
    filters: object = { membership: 5 },
    datatype: string = 'users'
  ): Observable<any> {
    const path = `/crm/${datatype}`;
    let query_string = `?per-page=${amount}&page=${page}`;
    Object.entries(filters).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((item) => {
          query_string += `&${key}[]=${item}`;
        });
      } else {
        query_string += `&${key}=${val}`;
      }
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url + path + query_string, { headers: headers });
  }

  getCrmFilters(dataType: string = 'users'): Observable<any> {
    const path = `/crm/${dataType}/filters`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url + path, { headers: headers });
  }

  updateUserData(userFields: User, userId: number): Observable<any> {
    const path = `/users/${userId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.put(this.url + path, userFields, { headers: headers });
  }

  updateTicketData(ticketFields: Ticket, ticketId: number): Observable<any> {
    const path = `/tickets/${ticketId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.put(this.url + path, ticketFields, { headers: headers });
  }

  createNewLead(userFields: User) {
    const path = '/users';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, userFields, { headers: headers });
  }

  createNewTicket(ticketFields: Ticket) {
    const path = '/tickets';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, ticketFields, { headers: headers });
  }

  getReportReasons(): Observable<Reason[]> {
    const path = `/reports/reasons`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<Reason[]>(this.url + path, { headers: headers });
  }

  createNewSupportEmail(emailFields: SupportEmail, ticketId: number) {
    const path = `/crm/tickets/${ticketId}/reply`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, emailFields, { headers: headers });
  }

  getTicketMailHistory(ticketId: number) {
    const path = `/crm/tickets/${ticketId}/replies`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<TicketReply[]>(this.url + path, { headers: headers });
  }

  deleteTicket(ticketId: number) {
    const path = `/tickets/${ticketId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.delete(this.url + path, { headers: headers });
  }

  getUser(id: string) {
    const path = `/users/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<User>(this.url + path, { headers: headers });
  }

  updateUser(user: User) {
    const path = `/users/${user.id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.put<User>(this.url + path, user, { headers: headers });
  }

  upgradeSubscription(userId: string, membership: IMembershipUpgrade) {
    const path = `/crm/users/${userId}/membership-details`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.put<any>(this.url + path, membership, {
      headers: headers,
    });
  }

  getEnrollmentsSummary(
    client_id
  ): Observable<{
    vod_purchases: boolean;
    vod_free_coupon: boolean;
    cancel_membership: boolean;
  }> {
    const path = `/crm/clients/${client_id}/enrollments-summary`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<{
      vod_purchases: boolean;
      vod_free_coupon: boolean;
      cancel_membership: boolean;
    }>(this.url + path, { headers: headers });
  }

  sendEmailToUser(userId: string, emailFields: SupportEmail) {
    const path = `/crm/users/${userId}/send-email`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.post(this.url + path, emailFields, { headers: headers });
  }

  sendTemporaryPassword(userId: string) {
    const path = `/crm/users/${userId}/send-temporary-password`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.get(this.url + path, { headers: headers });
  }

  getCouponCode(params = new HttpParams()): Observable<CouponResponse> {
    const path = '/payment/product-data';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get<CouponResponse>(this.url + path, {
      headers: headers,
      params: params,
    });
  }

  getInvoicesListFiltered(params = new HttpParams()): Observable<Invoice[]> {
    const path = '/payment/invoices';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http
      .get<Invoice[]>(this.url + path, { headers: headers, params: params })
      .pipe(
        map((data) => data.map((invoice) => new Invoice().deserialize(invoice)))
      );
  }

  generateInvoice(id): Observable<string> {
    const path = `/payment/invoices/${id}/generate-pdf`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.get<string>(this.url + path, { headers: headers });
  }

  deleteUsers(payload) {
    const path = '/crm/delete/users';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, payload, {
      headers: headers,
    });
  }

  deleteTickets(payload) {
    const path = '/tickets/delete';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(this.url + path, payload, {
      headers: headers,
    });
  }
}
