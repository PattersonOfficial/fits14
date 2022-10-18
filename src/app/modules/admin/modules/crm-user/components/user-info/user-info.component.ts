import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../../../models/user/user.model';
import { getAllCountries } from 'countries-and-timezones';
import { CrmService } from '../../../../../../services/crm/crm.service';
import { Memberships } from '../../../../../../models/memberships/memberships.model';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../../../../../models/user/client.model';

export interface IMembershipUpgrade {
  membership_upgrade_id: number;
  upgrade_starts_at: any;
  upgrade_ends_at: any;
  // string | Date
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  showPersonal = true;
  showAddress = true;
  showMarketing = true;
  showCommunication = true;
  editPersonal = false;
  editAddress = false;
  editMembership = false;
  availableMemberships: Memberships[];
  selectedMembershipForUpgrade: IMembershipUpgrade;
  membershipTitle: string;
  countriesList: any[] = [];
  countryTimezones: string[];
  startDate = new Date(2015, 0, 1);
  minUpgradeDate: Date;
  subscription: Memberships;
  maxDate = new Date();
  filters: any;
  userCountry: string;
  isEdit = false;

  formEmails = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    additionalEmail: new FormControl('', [
      Validators.email,
    ]),
  });

  private _user: User;

  get emailControl() {
    return this.formEmails.get('email') as FormControl;
  }

  get additionalEmailControl() {
    return this.formEmails.get('additionalEmail') as FormControl;
  }

  get user(): User {
    return this._user;
  }

  @Output() getUser = new EventEmitter<any>();

  @Input()
  set user(val: User) {
    // this._user = { ...val };
    this._user = val;
    this.editPersonal = false;
    this.editAddress = false;
    this.updateSelectedMembershipUpgrade(val.client);
    if (this.user.client.subscription_upgrade) {
      this.changeMinEndDate();
    }
    this.subscription = this.user.client.membership;
    switch (this.subscription.title) {
      case 'Fitnuts':
        this.membershipTitle = 'Member - Fitnuts';
        break;
      case 'Fitnuts Pro':
        this.membershipTitle = 'Member - Pro';
        break;
      case 'Fitnuts Pro Premium':
        this.membershipTitle = 'Member - Premium';
        break;
      case 'Free':
      case 'Lead':
      default:
        this.membershipTitle = 'None';
    }
    if (this.user.country) {
      this.updateCountryName();
    }
    this.prepareUserTimezone();
    if (this.filters) {
      this.getAvailableUpgradeMemberships();
    }
  }

  @Output() saveUser = new EventEmitter<User>();

  constructor(private _crmService: CrmService) {
    const countriesObject = getAllCountries();

    for (const [, value] of Object.entries(countriesObject)) {
      this.countriesList.push(value);
    }
  }

  ngOnInit() {
    this._crmService.getCrmFilters().subscribe((data) => {
      this.filters = data;
      this.getAvailableUpgradeMemberships();
    });

    console.log({ user: this.user });
  }

  getAvailableUpgradeMemberships() {
    this.availableMemberships = this.filters.memberships
      .filter((membership) => membership.id < 4)
      .filter((membership) => {
        if (this.user.client.subscription_upgrade_active) {
          if (this.user.client.subscription_upgrade.id > 3) {
            return membership;
          } else {
            return this.user.client.subscription_upgrade.id <= membership.id;
          }
        }
        return membership;
      });
  }

  savePersonalChanges() {
    this.user.status_id = +this.user.status_id;
    this.saveUser.emit(this.user);
    this.editPersonal = false;
  }

  saveMembershipChanges() {
    this.editMembership = false;
    if (this.selectedMembershipForUpgrade.membership_upgrade_id) {
      const date = {
        ...this.selectedMembershipForUpgrade,
        upgrade_starts_at: moment(
          this.selectedMembershipForUpgrade.upgrade_starts_at
        ).format('YYYY-MM-DD'),
        upgrade_ends_at: moment(
          this.selectedMembershipForUpgrade.upgrade_ends_at
        ).format('YYYY-MM-DD'),
      };
      this._crmService
        .upgradeSubscription(this.user.id, date)
        .subscribe((resp) => {
          // console.log(resp);
          this.user.client.subscription_upgrade = resp.subscription_upgrade;
          this.user.client.upgrade_starts_at = resp.upgrade_starts_at;
          this.user.client.upgrade_ends_at = resp.upgrade_ends_at;
          this.updateSelectedMembershipUpgrade(resp);
          this.savePersonalChanges();
        });
    } else {
      this.savePersonalChanges();
    }
  }

  changeMinEndDate(event?) {
    if (
      !this.selectedMembershipForUpgrade.upgrade_ends_at ||
      this.selectedMembershipForUpgrade.upgrade_starts_at >
      this.selectedMembershipForUpgrade.upgrade_ends_at
    ) {
      const date = new Date(
        this.selectedMembershipForUpgrade.upgrade_starts_at
      );
      date.setDate(date.getDate() + 1);
      this.minUpgradeDate = date;
      if (event) {
        this.selectedMembershipForUpgrade.upgrade_ends_at = date;
      }
    }
  }

  openEditPersonal() {
    this.editPersonal = true;
    this.isEdit = true;
  }

  cancelEditPersonal() {
    if (this.emailControl.errors) {
      this.user.email = '';
    }
    if (this.additionalEmailControl.errors) {
      this.user.additional_email = '';
    }
    
    this.editPersonal = false;
    this.isEdit = false;
  }

  cancelEditMembership() {
    if (this.editMembership) {
      Object.keys(this.selectedMembershipForUpgrade).forEach(
        (field) => (this.selectedMembershipForUpgrade[field] = null)
      );
    }
    this.editMembership = !this.editMembership;
  }

  prepareUserTimezone(countryChanged?: boolean) {
    if (this.user.country) {
      this.countryTimezones = this.countriesList.find(
        (country) => country.id === this.user.country
      ).timezones;
      if (!this.user.timezone_by_country || countryChanged) {
        this.user.timezone_by_country = this.countryTimezones
          ? this.countryTimezones[0]
          : '';
      }
      this.user.local_time =
        new Date().toISOString().split('T')[0] +
        new Date()
          .toLocaleString('en-GB', { timeZone: this.user.timezone_by_country })
          .split(',')[1];
    }
  }

  private updateSelectedMembershipUpgrade(client: Client) {
    this.selectedMembershipForUpgrade = {
      membership_upgrade_id: client.subscription_upgrade
        ? client.subscription_upgrade.id
        : null,
      upgrade_starts_at: client.subscription_upgrade
        ? new Date(client.upgrade_starts_at)
        : null,
      upgrade_ends_at: client.subscription_upgrade
        ? new Date(client.upgrade_ends_at)
        : null,
    };
  }

  private updateCountryName() {
    this.userCountry = Object.entries(getAllCountries()).find(
      (item) => item[0] === this._user.country
    )[1].name;
  }

  dontCallAgain() {
    this.user.status_id = +this.user.status_id;
    this.saveUser.emit(this.user);
    this.editPersonal = false;
  }

  disableAgreementFields() {
    console.log({ isEdit: this.isEdit });
    if (this.isEdit === true) {
      return false;
    } else {
      return true;
    }
  }
}
