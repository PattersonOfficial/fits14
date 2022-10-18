import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// ------------ Material ---------------
import { MatDialog } from '@angular/material/dialog';
import {
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material';
// ------------ ngx Bootstrap ---------------
import { ModalDirective } from 'ngx-bootstrap/modal';
// ------------ Services ---------------
import { StorageService } from '../../../../services/auth/storage.service';
import { RegisterService } from '../../../../components/register/register.service';
import { BuilderService } from '../../../admin/modules/users/components/builder/builder.service';
import { ProfileService } from '../../../client/modules/profile/components/profile/profile.service';
import { HomeService } from '../../../client/modules/home/components/home/home.service';
// ------------ Models & Components ---------------
import { PaymentElement } from '../../../../models/payment/payment.model';
import {
  PassData,
  User,
  UserBasicInfo,
  UserGeneralInfo,
} from '../../../../models/user/user.model';
import { Memberships } from '../../../../models/memberships/memberships.model';
import { Country } from '../../../../models/common/country.model';
import { ChangePlanComponent } from '../change-plan/change-plan.component';
import { CardOpenDialogComponent } from '../creditcarddetail/creditcarddetail.component';
import { CancelPlanComponent } from '../cancel-plan/cancel-plan.component';
import { QuestionsComponent } from '../questions/questions.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

export const GRI_DATE_FORMATS: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: {
      day: 'numeric',
      year: 'numeric',
      month: 'long',
    } as Intl.DateTimeFormatOptions,
  },
};

@Component({
  selector: 'app-client-card',
  templateUrl: './card-new.component.html',
  styleUrls: ['./card.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: GRI_DATE_FORMATS,
    },
    DatePipe,
  ],
})
export class CardComponent implements OnInit {
  memberships: Memberships;
  user: User;
  generalInfo: UserGeneralInfo;
  passData: PassData;
  userLogo: string;
  userCover: string;
  basicInfo: UserBasicInfo;

  registerFields: User;
  loadingBox = false;
  countryObj: Country;
  countries: Country[];
  mailExist: boolean;
  phoneExist: boolean;

  id: string;
  userAge: any;
  passMatch: boolean;
  shortPassword = true;
  animal: string;
  name: string;
  mycustomDropdown = false;
  paramsDisplay = true;
  paramsEdit = false;
  passValidate = '';
  tab: number;
  generalSaved = false;
  passwordUpdated = false;
  bioUpdated = false;
  bigFile = false;
  emailOptIn = false;
  emailOptOut = false;
  dontCall = false;
  dontCallDateTime = null;
  emailOptInDateTime = null;
  emailOptOutDateTime = null;

  @ViewChild('modalRef', { static: false }) modalRef: ModalDirective;
  @ViewChild('phone', { static: false }) phone: ElementRef;

  // ------------ Payment History Table: Mock data ---------------
  displayedColumns = ['description', 'date', 'amount', 'payment method'];
  dataSource: PaymentElement[];

  emailNotification = false;
  dialCode = '';

  constructor(
    public _registerService: RegisterService,
    public _route: ActivatedRoute,
    public _storageService: StorageService,
    public _homeService: HomeService,
    public _builderService: BuilderService,
    public _profileService: ProfileService,
    public dialog: MatDialog,
    private toastService: ToastrService,
    private datepipe: DatePipe
  ) {
    this.mailExist = false;
    this.phoneExist = true;
    this.id = this._storageService.getCurrentUser().id;
    this.passMatch = true;
    this.shortPassword = false;
    this.passData = new PassData();
    this.user = new User();
    this.generalInfo = new UserGeneralInfo();
    this.basicInfo = new UserBasicInfo();
    this.registerFields = new User();
    this.countries = [];
    this.phoneExist = true;
    this.tab = 0;
  }

  ngOnInit() {
    this.getListOfCountries();
    this.getIPAddress();
    this.registerFields = this._storageService.getCurrentUser();
    this.userAge = this.registerFields.age;
    this.getUser(this.id);
    this.passData.user_id = this.user.id;
    this.getPaymentHistory();
    this.listMemberships();

    this._storageService.isUserChanged.subscribe((user) => {
      this.userAge = user.age;
      this.basicInfo.height = user.client.height;
      this.basicInfo.weight = user.client.weight;
    });

    this._route.params.subscribe((params) => {
      switch (params['tab']) {
        case 'settings':
          this.tab = 1;
          break;
        case 'plans':
          this.tab = 2;
          break;
        default:
          this.tab = 0;
      }
    });
  }

  getPaymentHistory() {
    this._homeService
      .getPaymentHistory()
      .subscribe((data) => (this.dataSource = data));
  }

  // -------- Getting main initial data ----------------
  setUserInfo() {
    this.generalInfo.name = this.user.name;
    this.generalInfo.last_name = this.user.last_name;
    this.generalInfo.gender = this.user.gender;
    this.generalInfo.date_birth = this.user.date_birth;
    this.generalInfo.email = this.user.email;
    this.generalInfo.code_dialling = this.user.code_dialling;
    this.generalInfo.country = this.user.country;
    this.generalInfo.phone = this.user.phone;
    this.generalInfo.city = this.user.city;
    this.generalInfo.zip = this.user.zip;
    this.generalInfo.smoke = this.user.smoke + '';
    this.generalInfo.alcohol = this.user.alcohol + '';

    this.getUserCountry();

    this.basicInfo.height = this.user.client.height;
    this.basicInfo.weight = this.user.client.weight + '';

    this.userLogo = this.user.profile_image.public_url;
    this.userCover = this.user.cover_image.public_url;
    this._storageService.setUserSession(this.registerFields);
  }

  telInputObject(obj) {
    obj.setNumber(this.registerFields.phone);
  }

  checkCountry() {
    if (!this.generalInfo.phone.includes('+')) {
      this.generalInfo.phone = this.dialCode + this.generalInfo.phone;
    }
  }

  getUser(id: string) {
    this._builderService.getUser(id).subscribe((data) => {

      this.user = data;
      this.registerFields = { ...data };
      this.loadingBox = false;
      this.setUserInfo();

      this.dontCall = this.user.dont_call_again;
      this.emailOptIn = this.user.is_agree_to_emails;
      if(this.emailOptIn !== true) {
        this.emailOptOut = true;
        this.emailOptOutDateTime = this.user.opt_datetime;
      }
      this.emailOptInDateTime = this.user.opt_datetime;
      this.dontCallDateTime = this.user.dont_call_again_datetime;
    });
  }

  getListOfCountries() {
    this._registerService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  getIPAddress() {
    this._registerService.getIpAddress().subscribe(data => {
      this.dialCode = '+' + data.dail_code.dail_code;
    });
  }

  getUserCountry() {
    if (this.countries.length && this.generalInfo.country) {
      this.countries.find((elem) => {
        if (
          elem.alpha2Code.toUpperCase() ===
          this.generalInfo.country.toUpperCase()
        ) {
          return (this.countryObj = elem);
        }
      });
    }
  }

  // -------- Update user data ----------------
  submitGeneralUserInfo() {
    if (
      this.generalInfo.name &&
      this.generalInfo.last_name &&
      this.generalInfo.date_birth &&
      this.generalInfo.email &&
      !this.mailExist &&
      this.generalInfo.phone &&
      this.generalInfo.city &&
      this.generalInfo.zip
    ) {
      this.changeDateOfBirth();

      this._builderService
        .updateGeneralUserInfo(this.generalInfo)
        .subscribe(() => {
          this.getUser(this.id);
          this.generalSaved = true;
        });
    }
  }

  submitBio() {
    if (this.generalInfo.bio) {
      const bioObj = new UserGeneralInfo();
      bioObj.bio = this.generalInfo.bio;

      this._builderService.updateGeneralUserInfo(bioObj).subscribe(() => {
        this.getUser(this.id);
        this.bioUpdated = true;
      });
    }
  }

  changeDateOfBirth() {
    let myDate = new Date(this.generalInfo.date_birth);
    const offset = -myDate.getTimezoneOffset();
    myDate = new Date(myDate.getTime() + offset * 60 * 1000);
    this.generalInfo.date_birth = myDate.toISOString().split('T')[0];
  }

  // -------- Update user Photo ----------
  submitPassword() {
    this._builderService.updateUserPassword(this.passData).subscribe(
      () => {
        this.passwordUpdated = true;
        return { result: 'Success' };
      },
      (error) => console.log(error)
    );
  }

  // -------- Update basic info ----------------
  submitBasicInfo() {
    this._builderService.updateBasicUserInfo(this.basicInfo).subscribe(
      () => {
        this.getUser(this.id);
        this.openUserParams();
      },
      (error) => console.log(error)
    );
  }

  // -------- Check Email Options ----------------
  checkEmailOptions(event, option) {
    console.log({ event, option });
    if (option === 'emailOptIn') {
      this.emailOptIn = event.target.checked;
      this.emailOptOut = !event.target.checked;
      if (this.emailOptIn === true) {
        this.emailOptInDateTime = this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd h:mm:ss'
        );
        this.emailOptOutDateTime = null;
      } else {
        this.emailOptInDateTime = null;
      }
    } else {
      this.emailOptOut = event.target.checked;
      this.emailOptIn = !event.target.checked;
      if (this.emailOptOut === true) {
        this.emailOptOutDateTime = this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd h:mm:ss'
        );
        this.emailOptInDateTime = null;
      } else {
        this.emailOptOutDateTime = null;
      }
    }
  }

  changeDontCall() {
    this.dontCall = !this.dontCall;

    if (this.dontCall === true) {
      this.dontCallDateTime = this.datepipe.transform(
        new Date(),
        'MM/dd/yy h:mm:ss'
      );
    } else {
      this.dontCallDateTime = null;
    }
  }

  // -------- Update Communication Compliance ----------------
  submitCompliance() {
    const body = {
      is_agree_to_emails: this.user.is_agree_to_emails,
      opt_datetime: this.datepipe.transform(new Date(), 'MM/dd/yy h:mm:ss'),
    };
  
    this._builderService.updateCommunicationCompliance(body).subscribe(
      (response) => {
        this.toastService.success(response['status']);
        this.getUser(this.id);
        this.openUserParams();
      },
      (error) => console.log(error)
    );
  }

  // -------- Update user Photo ----------
  upload(file) {
    const reader = new FileReader();

    if (file[0].size > 2000000) {
      this.bigFile = true;
    } else {
      this.bigFile = false;
      reader.readAsBinaryString(file[0]);
      this.submitUserLogo(file[0]);
    }
  }

  coverUpload(file) {
    const cover = new FileReader();
    cover.onload = this.handleCoverLoaded.bind(this);

    if (file[0].size > 2000000) {
      this.bigFile = true;
    } else {
      this.bigFile = false;
      cover.readAsBinaryString(file[0]);
      this.submitUserCover(file[0]);
    }
  }

  handleCoverLoaded(e) {
    this.userCover = 'data:image/png;base64,' + btoa(e.target.result);
  }

  submitUserLogo(img) {
    const postData = new FormData();
    postData.append('profile_image', img);

    this._builderService.updateUserImage(postData).subscribe(
      () => {
        this.getUser(this.id);
      },
      (error) => console.log(error)
    );
  }

  submitUserCover(img) {
    const postData = new FormData();
    postData.append('cover_image', img);

    this._builderService.updateUserImage(postData).subscribe(
      () => {
        this.getUser(this.id);
      },
      (error) => console.log(error)
    );
  }

  // ----------- Сhange User Country --------
  changeUserCountry(country) {
    this.countryObj = country;

    this.mycustomDropdown = !this.mycustomDropdown;
    this.generalInfo.country = this.countryObj.alpha2Code;
  }

  onCountryChange() {
    if (this.phone && this.phone.nativeElement) {
      this.generalInfo.phone = this.phone.nativeElement.value;
    }
  }

  // ----------- Open User params --------
  openUserParams() {
    this.paramsDisplay = !this.paramsDisplay;
    this.paramsEdit = !this.paramsEdit;
  }

  // ----------- Verification Data --------
  verifyEmail(email: string) {
    if (email.trim() !== this.registerFields.email.trim()) {
      this._registerService.checkEmail(email).subscribe((data) => {
        this.mailExist = !data['exist'];
      });
    } else {
      this.mailExist = false;
    }
  }

  verifyPhone(phone: string) {
    if (phone !== this.registerFields.phone) {
      this._registerService.checkPhone(phone).subscribe((data) => {
        this.phoneExist = data.exist;
      });
    }
  }

  verifyPassword() {
    this.shortPassword = this.passData.password.length < 6;
    this.passMatch =
      this.passData.password === this.passData.password_confirmation;
  }

  validateCurrentPass(password: string, userId: any) {
    if (password && userId) {
      this._profileService.checkPass(password, userId).subscribe(
        (data) => {
          if (data['result'] === 'Success') {
            this.passValidate = 'successValidate';
          }
        },
        () => {
          this.passValidate = 'errorValidate';
        }
      );
    }
  }

  // ----------- Dialog: Open Questionnaire --------
  openQuestionnaire(): void {
    if (this.user.client.membership.id !== 4) {
      this.dialog.open(QuestionsComponent, {
        height: '100vh',
        hasBackdrop: false,
      });
    } else {
      this.toastService.info('Only subscibed users can access this feature');
    }
  }

  // ----------- Dialog: Edit Payment Method --------
  editPaymentMethod(): void {
    const dialogRef = this.dialog.open(CardOpenDialogComponent, {
      minWidth: '30vw',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'creditCardDetail',
      data: {
        name: this.name,
        animal: this.animal,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
      this.getUser(this.user.id);
    });
  }

  removePaymentMethod() {
    this.loadingBox = true;

    this._profileService.removePaymentMethod().subscribe(
      () => {
        this.getUser(this.id);
        this.loadingBox = false;
      },
      (error) => {
        console.log({ RemoveCardError: error });
        this.toastService.error(error.error.error);
      }
    );
  }

  // ----------- Dialog: Change Plan ----------------
  openDialogPlan(): void {
    const dialogRef = this.dialog.open(ChangePlanComponent, {
      maxHeight: '90vh',
      data: 'Settings'
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log({ result });
      this.animal = result;
      this.listMemberships();
      this.getUser(this.user.id);
      this.getPaymentHistory();
    });
  }

  listMemberships() {
    this._registerService.getMemberships().subscribe((response) => {
      this.memberships = response;
      this.loadingBox = false;
    });
  }

  // ----------- Sort by: History payment ----------------
  sortBy(event) {
    const property = event.target.value;

    if (property === 'created_at') {
      return this.dataSource.sort((a: PaymentElement, b: PaymentElement) => {
        const dateA = new Date(a.created_at),
          dateB = new Date(b.created_at);
        return Number(dateA) - Number(dateB);
      });
    }

    if (property === 'amount') {
      return this.dataSource.sort((a: PaymentElement, b: PaymentElement) => {
        return a[property] - b[property];
      });
    } else {
      if (property === 'title') {
        return this.dataSource.sort((a: PaymentElement, b: PaymentElement) => {
          const titleA = a['invoiceable']['title']
            ? a['invoiceable']['title'].toLowerCase()
            : '';
          const titleB = b['invoiceable']['title']
            ? b['invoiceable']['title'].toLowerCase()
            : '';

          return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        });
      } else {
        return this.dataSource.sort((a: PaymentElement, b: PaymentElement) => {
          const titleA = a[property] ? a[property].toLowerCase() : '',
            titleB = b[property] ? b[property].toLowerCase() : '';
          return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
        });
      }
    }
  }

  // ----------- Dialog: Cancel Plan ----------------
  openDialogCancelPlan(): void {
    const dialogRef = this.dialog.open(CancelPlanComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUser(this.user.id);
      }
    });
  }

  countryChange(event) {
    this.dialCode = '+' +  event.dialCode;
  }
}
