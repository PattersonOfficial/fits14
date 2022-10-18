import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {CrmService} from '../../../../../../services/crm/crm.service';
import {User} from '../../../../../../models/user/user.model';
import {Memberships} from '../../../../../../models/memberships/memberships.model';
import {Client} from '../../../../../../models/user/client.model';
import {getAllCountries} from 'countries-and-timezones';
import {RegisterService} from '../../../../../../components/register/register.service';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css']
})
export class AddLeadComponent implements OnInit {

  public isModal = false;
  public loader = false;
  public formFields: User;
  public startDate = new Date(2015, 0, 1);
  public maxDate = new Date();
  public countriesList: any[] = [];
  public needTimezone = false;
  public touched = false;
  public countryTimezones: string[];
  public phoneExist = false;
  public mailExist = false;

  @ViewChild('phone', {static: false}) phone: ElementRef;

  onHidden: EventEmitter<ModalDirective>;

  constructor(
      private _crmService: CrmService,
      private _registerService: RegisterService,
  ) {
    const countriesObject = getAllCountries();
    for (const [key, value] of Object.entries(countriesObject)) {
      this.countriesList.push(value);
    }
    this.clearUser();
  }

  @ViewChild('modalRef', {static: false}) modalRef: ModalDirective;
  @Output() userSaved = new EventEmitter<string>();

  ngOnInit() {

  }

  public clearUser() {
    const user = new User();
    const client = new Client();
    const membership = new Memberships();
    membership.id = 5;
    user.gender = 'M';
    client.membership = membership;
    user.client = client;
    this.formFields = user;
  }

  public hideModal(): void {
    this.isModal = false;
  }

  public openModal(): void {
    this.isModal = true;
  }



  public handleSubmit() {
    const isValid = this.validateForm();
    if (isValid) {
      this.setDateOfBirth();
      this.createUser();
    }
  }

  public validateForm() {
    this.touched = true;
    return !!(this.formFields.name
        && this.formFields.last_name
        && this.formFields.gender
        && this.formFields.date_birth
        && this.formFields.email
        && !this.mailExist
        && this.formFields.phone
        && !this.phoneExist
        && this.formFields.country
        && this.formFields.zip
        && this.formFields.city
        && this.formFields.timezone)
  }

  public createUser() {
    this.loader = true;
    this._crmService.createNewLead(this.formFields).subscribe(res => {
      this.userSaved.emit('User saved');
      this.clearUser();
      this.loader = false;
      this.hideModal();
      this.touched = false;
    }, err => {
      console.log(err);
      this.loader = false;
    });
  }

  public onCountryChange(country) {
    this.formFields.code_dialling = country.dialCode;
    if (this.phone && this.phone.nativeElement) {
      this.formFields.phone = this.phone.nativeElement.value;
    }
  }

  public telInputObject(obj) {
    obj.setCountry(this.formFields.country || 'il');
  }

  public handleCountryChange() {
    this.checkIfTimezoneNeeded();
  }

  public checkIfTimezoneNeeded() {
    if (this.formFields.country) {
      this.countryTimezones = this.countriesList.find(country => country.id === this.formFields.country).timezones;
      this.needTimezone = this.countryTimezones.length > 1;
      this.formFields.timezone = this.needTimezone ? '' : this.countryTimezones[0];
    } else {
      this.needTimezone = false;
    }
  }

  public verifyPhone(phone: string) {
      this._registerService.checkPhone(phone).subscribe(
          data => {
            this.phoneExist = !data.exist;
          }
      );
  }

  public verifyEmail(email: string) {
    this._registerService.checkEmail(email).subscribe(
        data => {
          this.mailExist = !data['exist'];
        }
    );
  }

  public setDateOfBirth() {
    let myDate = new Date(this.formFields.date_birth);
    const offset = myDate.getTimezoneOffset();

    myDate = new Date(myDate.getTime() - (offset * 60 * 1000));
    this.formFields.date_birth = myDate.toISOString().split('T')[0];
  }
}
