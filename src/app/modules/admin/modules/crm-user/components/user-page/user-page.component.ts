import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../../models/user/user.model';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from '../../../../../../services/crm/crm.service';
import { ToastrService } from 'ngx-toastr';
import { getAllCountries } from 'countries-and-timezones';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
    constructor(
        private _route: ActivatedRoute,
        private _crmService: CrmService,
        private _toastrService: ToastrService
    ) {
    }
    countriesList: any[] = [];
    userCountry: string;

    public loading = true;
    public user: User = null;
    public error: string = null;
    public tab: string;
    public updateError = false;
    public userID: any;

    ngOnInit() {
        this._route.params.subscribe(params => {
            if (params.userId && (!this.user || this.user.id !== params.userId)) {
                this.userID = params.userId;
                this.getUserData(params.userId);
            }
            this.tab = params.tab;
        });
    }

    getUserData(id) {
        this._crmService.getUser(id).subscribe(user => {
            this.user = user;
            this.error = null;
            this.loading = false;
            if (this.user.country) {
                this.updateUserCountry();
            }
            if (!user.local_time && user.timezone) {
                this.updateLocalTime();
            }
        }, () => {
            this.error = 'User not found';
            this.loading = false;
        });
    }

    callForUserData() {
        this.getUserData(this.userID);
    }

    handleUpdatedUser(user: User) {
        this.loading = true;
        this._crmService.updateUser(user).subscribe((resp) => {
            this.getUserData(resp.id);
            this._toastrService.success('User updated successfully');
        }, (error) => {
            console.log({ error });
            this.updateError = true;
            this.loading = false;
        });
    }

    updateUserCountry() {
        this.userCountry = Object.entries(getAllCountries()).find(item => item[0] === this.user.country)[1].name;
    }

    updateLocalTime() {
        this.user.local_time = new Date()
            .toLocaleString('en-US', {
                timeZone: this.user.timezone,
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });
    }

    sendTemporaryPassword() {
        this.loading = true;

        this._crmService.sendTemporaryPassword(this.user.id).subscribe(() => {
            this.loading = false;

            this._toastrService.success('The email sent successfully.');
        }, () => {
            this.loading = false;

            this._toastrService.error('The email was not sent.');
        });
    }

}
