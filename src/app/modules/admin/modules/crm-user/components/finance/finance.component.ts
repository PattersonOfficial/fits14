import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {User} from '../../../../../../models/user/user.model';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {HttpParams} from '@angular/common/http';
import {Invoice} from '../../../../../../models/payment/invoice.model';
import * as printJS from 'print-js';
import {getAllCountries} from 'countries-and-timezones';
import {SendEmailComponent} from '../send-email/send-email.component';

@Component({
    selector: 'app-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.css', '../user-info/user-info.component.css']
})
export class FinanceComponent implements OnInit {
    @ViewChild(SendEmailComponent, {static: false}) sendEmail: SendEmailComponent;

    showEnrollments = true;
    showPurchases = true;
    showBilling = true;
    editPersonal = false;
    countriesList = [];

    showPersonal = true;
    showAddress = true;
    showMarketing = true;
    showCommunication = true;
    editAddress = false;
    needTimezone = false;
    countryTimezones: string[];
    startDate = new Date(2015, 0, 1);
    maxDate = new Date();
    filters: any;

    invoices: Invoice[];
    enrollmentsSummary = {
        vod_purchases: false,
        vod_free_coupon: false,
        cancel_membership: false
    };

    private _user: User;

    get user(): User {
        return this._user;
    }

    @Input()
    set user(val: User) {
        this._user = {...val};
    }

    @Output() saveUser = new EventEmitter<User>();

    constructor(
        private _crmService: CrmService
    ) {
        const countriesObject = getAllCountries();
        for (const [, value] of Object.entries(countriesObject)) {
            this.countriesList.push(value);
        }
    }

    ngOnInit() {
        this.getUserInvoices();
        this.getEnrollmentsSummary();
    }

    saveChanges() {
        this.saveUser.emit(this.user);
        this.editPersonal = false;
    }

    getUserInvoices() {
        const params = new HttpParams().append('client_id', String(this.user.client.id));

        this._crmService.getInvoicesListFiltered(params).subscribe(
            (invoices) => {
                this.invoices = invoices;
            });
    }

    getEnrollmentsSummary() {
        this._crmService.getEnrollmentsSummary(this.user.client.id).subscribe(
            (enrollmentsSummary) => {
                this.enrollmentsSummary = enrollmentsSummary;
            });
    }

    printInvoice(id) {
        this._crmService.generateInvoice(id).subscribe(
            (pdf) => {
                printJS({
                    printable: pdf,
                    type: 'pdf',
                    showModal: true
                });
            });
    }

    handleCountryChange() {
        this.checkIfTimezoneNeeded();
    }

    checkIfTimezoneNeeded() {
        if (this.user.country) {
            this.countryTimezones = this.countriesList.find(country => country.id === this.user.country).timezones;
            this.needTimezone = this.countryTimezones.length > 1;
            this.user.timezone = this.needTimezone ? '' : this.countryTimezones[0];
        } else {
            this.needTimezone = false;
        }
    }

    handleSendEmailBtnClick(invoice_id) {
        this.sendEmail.openModal(invoice_id);
    }
}
