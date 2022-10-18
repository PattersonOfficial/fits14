import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Memberships,
  LEAD_MEMBERSHIP_ID,
} from './../../models/memberships/memberships.model';
import { LoginService } from './../login/login.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatStepper } from '@angular/material/stepper';
import { StorageService } from '../../services/auth/storage.service';
import { RegisterService } from '../register/register.service';
import { FREE_MEMBERSHIP_ID } from '../../models/memberships/memberships.model';
import { Session } from '../../models/auth/session.model';
import { User } from '../../models/user/user.model';
import { environment } from '../../../environments/environment';
import { FirestoreService } from '../../services/firebase/firestore.service';
import { PaymentService } from '../../modules/admin/modules/packages/components/payment/payment.service';
import { BuilderService } from '../../modules/admin/modules/users/components/builder/builder.service';
import { PaymentForm } from '../../models/payment/form.model';
import { CrmService } from '../../services/crm/crm.service';
import {
  AuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { Global } from '../../app.global';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

declare const BlueSnap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService],
})
export class RegisterComponent implements OnInit {
  @ViewChild('paymentFormElement', { static: false })
  paymentFormElement: ElementRef;
  @ViewChild('stepper', { static: false })
  stepper: MatStepper;
  registerFields: User;
  step: number;
  selectCountry: any;
  selectGender: any;
  countryPlaceholder: string;
  genderPlaceholder: string;
  countries: any;
  codes_dialling: any;
  mailExist: boolean;
  showTooltipBirthDay: boolean;
  phoneExist: boolean;
  passMatch: boolean;
  cPassword: string;
  memberPrice: string;
  memberships: Memberships[];
  maxDate: any;
  startDate = new Date(2015, 0, 1);
  paymentFormConfig: PaymentForm = new PaymentForm();
  paymentForm: FormGroup;
  transactionError: string;
  responseError: string;
  transactionProcessing: boolean;
  hostedPaymentPageLink = '';
  isLoaderActive = true;
  isTransactionSuccessfully: boolean;
  dataModel: any;
  otpCode = '';
  otpError = '';
  isOtpError = false;
  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    placeholder: '',
    inputStyles: {
      border: this.isOtpError === false ? '1px solid #529DFF' : '1px solid #FF5252',
      'border-radius': '50px',
      height: '50px',
    },
    containerStyles: {
      width: '100%',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    },
  };
  
  currentCountry = {
    initialCountry: this.getIPAddress(),
  };
  membership: any;
  taxAmount: string;
  isLead = false;
  dob: any;
  year: any;
  userData: any;
  isMatching = true;
  hasNumber = false;
  allChecks = true;
  hasUpperCase = false;
  hasLowerCase = false;
  hasSpecialCharacter = false;
  numberRegex = /\d/;
  lowerCaseRegex = /[a-z]/;
  upperCaseRegex = /[A-Z]/;
  specialRegex = /\W/;
  isSocialLogin = false;

  constructor(
    public _registerService: RegisterService,
    public _router: Router,
    public _route: ActivatedRoute,
    public _storageService: StorageService,
    public _firestoreService: FirestoreService,
    public _paymentService: PaymentService,
    private _firestore: AngularFirestore,
    private _crmService: CrmService,
    private _googleAuthService: AuthService,
    public _builderService: BuilderService,
    public _loginService: LoginService,
    private spinner: NgxSpinnerService,
    private toastService: ToastrService
  ) {
    _route.params.subscribe((params) => {
      if (params.id) {
        this.spinner.show();
        this.isLead = true;
        this.getUserInfo(params.id);
      }
    });

    this.registerFields = new User();
    this.step = 1;
    this.maxDate = new Date();
    this.mailExist = true;
    this.phoneExist = true;
    this.passMatch = true;
    this.cPassword = '';
    this.memberPrice = '';
    this.countryPlaceholder = 'Select Country';
    this.genderPlaceholder = 'Select Gender';

    this.paymentFormConfig.product_type =
      this._paymentService.membershipProductType;
    this.paymentFormConfig.callback_url = '/account/register/thankyou';

    this.paymentFormConfig = Object.assign({}, this.paymentFormConfig);
    this.prepareForm();
  }

  ngOnInit() {
    this._storageService.removeCurrentSession();
    this.listOfCountries();
    this.listMemberships();
    this.getIPAddress();
  }

  get cardHolder() {
    return this.paymentForm.get('cardHolder');
  }

  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }

  get cardExpire() {
    return this.paymentForm.get('cardExpire');
  }

  get cardSecurityCode() {
    return this.paymentForm.get('cardSecurityCode');
  }

  get couponCode() {
    return this.paymentForm.get('couponCode');
  }

  get codeControl() {
    return this.paymentForm.get('couponCode') as FormControl;
  }

  get isCodeValue() {
    return !!this.codeControl.value;
  }

  prepareForm() {
    this.transactionError = null;
    this.isTransactionSuccessfully = false;

    this.initForm();
  }

  initForm() {
    this.paymentForm = new FormGroup({
      cardHolder: new FormControl('', [Validators.required]),
      cardNumber: new FormControl('', [Validators.required]),
      cardExpire: new FormControl('', [Validators.required]),
      cardSecurityCode: new FormControl('', {
        validators: [Validators.minLength(3), Validators.maxLength(3)],
        updateOn: 'blur',
      }),
      couponCode: new FormControl(null, [Validators.minLength(1)]),
    });

    this.isLoaderActive = false;
  }

  // public redirectToFbApi() {
  //   window['dataLayer'].push({
  //     event: 'Login',
  //     login_method: 'Facebook',
  //     pageUrl: window.location.href,
  //   });

  //   window.location.href = environment.api + '/login/facebook';
  // }

  getUserInfo(userId: string) {
    const data = {
      user_id: userId,
    };
    this._loginService.userInformation(data).subscribe(
      (response) => {
        console.log({ response, email: response.user['email_verified_at'] });
        this.toastService.info(
          'Please follow the steps to complete the registration process'
          );
        const email = response.user['email_verified_at'];
        this.registerFields.email = response.user.email;
        this.registerFields.name = response.user.name;
        this.registerFields.last_name = response.user.last_name;
        this.registerFields.is_social_account = response.user.is_social_account;
        this.registerFields.id = response.user.id;

        if (email != null) {
          if (response.user.client.is_lead === 0) {
            this.correctLogin(response);
          } else {
            this.stepper.selectedIndex = 3;
          }
        } else if (email == null && response.user.client.is_lead === 1) {
          this.stepper.selectedIndex = 1;
        }
        else {
          this.sendEmailToken(this.stepper);
        }

        this.spinner.hide();
      },
      (error) => {
        console.log({ UserError: error });
        this.spinner.hide();
      }
    );
  }

  public facebookLogin() {
    this._googleAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((data) => {
        console.log({ FacebookResp: data });
        this.isSocialLogin = true;
        this.registerFields.is_social_account = 1;
        this.registerFields.email =data.email;
        this.registerFields.name = data.firstName;
        this.registerFields.last_name = data.lastName;
        this.stepper.next();
        // this._loginService.socialLogin(data).subscribe(
        //   (response) => {
        //     // console.log({ FacebookLogin: response });
        //     this.registerFields.email = response.user.email;
        //     this.registerFields.name = response.user.name;
        //     this.registerFields.last_name = response.user.last_name;
        //     if (response.user.client.is_lead === 1) {
        //       this.spinner.hide();
        //       this._router.navigate(
        //         ['account/register/lead/' + response.user.id],
        //         { replaceUrl: true }
        //       );
        //     } else {
        //       this.correctLogin(response);
        //       window['dataLayer'].push({
        //         event: 'Login',
        //         login_method: 'Facebook',
        //         pageUrl: window.location.href,
        //       });
        //     }
        //   },
        //   (error) => {
        //     // this.loginError();
        //     console.log({ FacebookError: error });
        //     this.spinner.hide();
        //     // this._router.navigate(['/login'], { replaceUrl: true });
        //   }
        // );
      });
  }

  public googleLogin() {
    this._googleAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        console.log({ GoogleResp: data });
        this.isSocialLogin = true;
        this.registerFields.email =data.email;
        this.registerFields.name = data.firstName;
        this.registerFields.last_name = data.lastName;
        this.stepper.next();
        // this._loginService.socialLogin(data).subscribe(
        //   (response) => {
        //     // console.log({ GoogleLogin: response });
        //     this.registerFields.email = response.user.email;
        //     this.registerFields.name = response.user.name;
        //     this.registerFields.last_name = response.user.last_name;
        //     if (response.user.client.is_lead === 1) {
        //       this.spinner.hide();
        //       this._router.navigate(
        //         ['account/register/lead/' + response.user.id],
        //         { replaceUrl: true }
        //       );
        //     } else {
        //       this.correctLogin(response);
        //       window['dataLayer'].push({
        //         event: 'Login',
        //         login_method: 'Google',
        //         pageUrl: window.location.href,
        //       });
        //     }
        //   },
        //   (error) => {
        //     // this.loginError();
        //     console.log({ GoogleError: error });
        //     this.spinner.hide();
        //     // this._router.navigate(['/login'], { replaceUrl: true });
        //   }
        // );
    });
  }

  verifyEmail(email: string) {
    this._registerService.checkEmail(email).subscribe((data) => {
      this.mailExist = data['exist'];
    });
  }

  verifyPhone(phone: string) {
    this._registerService.checkPhone(phone).subscribe((data) => {
      this.phoneExist = data.exist;
    });
  }

  getIPAddress() {
    this._registerService.getIpAddress().subscribe((data) => {
      this.currentCountry = data['countryCode'];
      return data['countryCode'];
    });
  }

  onOtpChange(event) {
    this.isOtpError = false;
    this.otpError = '';
    this.otpCode = event;
  }

  // verify user typed otp code
  verifyOtpCode(stepper: MatStepper) {
    if (this.otpCode.length < 6 || this.otpCode === '') {
      this.isOtpError = true;
      this.otpError = 'Code is incorrect. Please try again';
      return;
    } else {
      this.verifyEmailToken(stepper);
    }
  }

  sendEmailToken(stepper) {
    this.spinner.show();
    const email = this.registerFields.email;
    this._registerService.sendEmailToken(email).subscribe(
      (data) => {
        this.spinner.hide();
        if (this.registerFields.is_social_account === 1) {
          this.stepper.selectedIndex = 2;
        } else {
          stepper.next();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  resendEmailToken() {
    this.spinner.show();
    const email = this.registerFields.email;
    this._registerService.sendEmailToken(email).subscribe(
      (data) => {
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  verifyEmailToken(stepper) {
    this.spinner.show();
    const data = {
      email: this.registerFields.email,
      token: this.otpCode,
    };
    this._registerService.verifyEmailToken(data).subscribe(
      (data) => {
        this.getUserInfo(this.registerFields.id);
        // this.spinner.hide();
        // stepper.next();
      },
      (error) => {
        // console.log({ verifyTokenError: error });
        this.otpError = 'Code is incorrect or has expired. Please try again';
        this.isOtpError = true;
        this.spinner.hide();
      }
    );
  }

  memberSelection(price: string, id: number, membership, stepper: MatStepper) {
    // console.log({ price, id, membership });
    this.membership = membership;
    this.memberPrice = this.paymentFormConfig.amount = price;
    this.registerFields.client.membership.id =
      this.paymentFormConfig.product_id = id;

    this.paymentFormConfig = Object.assign({}, this.paymentFormConfig);

    if (id === 4) {
      this.submitRegister();
    } else {
      stepper.next();
    }
  }

  // heading back to previous form step
  previousStep(stepper: MatStepper) {
    this.membership = null;
    if (this.registerFields.is_social_account === 1)  {
      stepper.previous();
    } else {
      stepper.selectedIndex = 0;
    }
  }

  upToSecondStep(stepper: MatStepper) {
    if (
      !this.registerFields.name ||
      !this.registerFields.last_name ||
      !this.registerFields.email ||
      !this.registerFields.phone ||
      !this.registerFields.password ||
      !this.phoneExist ||
      !this.mailExist
    ) {
      this.registerFields.name = this.registerFields.name
        ? this.registerFields.name
        : '';
      this.registerFields.last_name = this.registerFields.last_name
        ? this.registerFields.last_name
        : '';
      this.registerFields.email = this.registerFields.email
        ? this.registerFields.email
        : '';
      this.registerFields.password = this.registerFields.password
        ? this.registerFields.password
        : '';
      this.registerFields.phone = this.registerFields.phone
        ? this.registerFields.phone
        : '';
    } else {
      this.isSocialLogin = false;
      this.createLead();
      this.sendEmailToken(stepper);
    }
  }

  upToSecondStepSocial(stepper: MatStepper) {
    if (
      !this.registerFields.name ||
      !this.registerFields.last_name ||
      !this.registerFields.email ||
      !this.registerFields.phone ||
      !this.phoneExist
    ) {
      this.registerFields.name = this.registerFields.name
        ? this.registerFields.name
        : '';
      this.registerFields.last_name = this.registerFields.last_name
        ? this.registerFields.last_name
        : '';
      this.registerFields.email = this.registerFields.email
        ? this.registerFields.email
        : '';
      this.registerFields.phone = this.registerFields.phone
        ? this.registerFields.phone
        : '';
    } else {
      this.createLead();
      this.sendEmailToken(stepper);
    }

    // pushing to the next step
    // stepper.next();
  }

  upToThirdStep(stepper: MatStepper) {
    if (
      !this.registerFields.country ||
      !this.registerFields.city ||
      !this.registerFields.date_birth ||
      !this.registerFields.gender ||
      !this.registerFields.is_agree_to_terms
    ) {
      if (!this.registerFields.country) {
        this.codes_dialling = null;
        this.registerFields.code_dialling = null;
      }

      this.registerFields.country = this.registerFields.country
        ? this.registerFields.country
        : '';
      this.registerFields.city = this.registerFields.city
        ? this.registerFields.city
        : '';
      this.registerFields.date_birth = this.registerFields.date_birth
        ? this.registerFields.date_birth
        : '';
      this.registerFields.gender = this.registerFields.gender
        ? this.registerFields.gender
        : '';
      this.registerFields.is_agree_to_terms = this.registerFields
        .is_agree_to_terms
        ? this.registerFields.is_agree_to_terms
        : false;
    } else {
      this.submitRegister();
    }
  }

  createLead() {
    const data = JSON.parse(JSON.stringify(this.registerFields));
    data.client.membership.id = LEAD_MEMBERSHIP_ID;

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      data.id = user.id;
    } 
    this._registerService.saveAccount(data).subscribe(
      (response) => {
        sessionStorage.setItem('user', JSON.stringify(response.user));
      },
      (error) => {
        console.log({ LeadError: error });
      }
    );
  }

  verifyPassword(cPass: string) {
    this.passMatch = this.registerFields.password === cPass;
    // console.log({ PassMatch: this.passMatch });
  }

  setCountryAndCode(country) {
    if (country) {
      this.codes_dialling = country.callingCodes;
      this.registerFields.code_dialling = country.callingCodes[0];
      this.registerFields.country = country.alpha2Code;
      this.selectCountry = country;
    } else {
      this.codes_dialling = null;
      this.registerFields.code_dialling = null;
      this.registerFields.country = '';
      this.selectCountry = undefined;
    }

    this.countryPlaceholder = this.selectCountry ? '' : 'Select Country';
  }

  setGender(gender) {
    if (gender) {
      this.registerFields.gender = gender;
      this.selectGender = gender;
    } else {
      this.registerFields.gender = '';
      this.selectGender = undefined;
    }

    this.genderPlaceholder = this.selectGender ? '' : 'Select Gender';
  }

  togglePassVis(e) {
    const input = e.target.closest('.form-controls').querySelector('input');
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  listOfCountries() {
    this._registerService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  submitRegister() {
    this.spinner.show();

    this.registerFields.timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    // if (this.isLead === false) {
    //   this.setDateOfBirth();

    //   this.dob = new Date(this.registerFields.date_birth);
    //   this.year = this.dob.getFullYear();
    // }

    // console.log({ Payload: this.registerFields });

    this._registerService.saveAccount(this.registerFields).subscribe(
      (data) => {
        window['dataLayer'].push(
          {
            event: 'Country',
            country: this.registerFields.country,
            pageUrl: window.location.href,
          },
          {
            event: 'City',
            city: this.registerFields.city,
            pageUrl: window.location.href,
          },
          {
            event: 'Gender',
            gender: this.registerFields.gender,
            pageUrl: window.location.href,
          },
          // {
          //   event: 'Year Of Birth',
          //   year: this.isLead ? null : this.year,
          //   pageUrl: window.location.href,
          // },
          {
            event: 'Allow To Receive Information From Fitnuts',
            allow_information: this.registerFields.is_agree_to_emails,
            pageUrl: window.location.href,
          }
        );
        this.correctRegister(data);
      },
      (error) => {
        this.spinner.hide();
        this.toastService.error(
          'Please try again, could not complete registration process'
        );
      }
    );
  }

  setDateOfBirth() {
    let myDate = new Date(this.registerFields.date_birth);
    const offset = myDate.getTimezoneOffset();

    myDate = new Date(myDate.getTime() - offset * 60 * 1000);
    this.registerFields.date_birth = myDate.toISOString().split('T')[0];
  }

  private correctRegister(data: Session) {
    this._storageService.setCurrentSession(data);

    this._firestoreService.addMentorsAsFriendsOfUser(data.user.firestore_uid);

    this._firestore
      .collection('users')
      .doc(data.user.firestore_uid)
      .set(
        {
          name: data.user.name + ' ' + (data.user.last_name || ''),
          email: data.user.email,
          profile_image: data.user.profile_image.public_url,
          id: data.user.id,
          status: 1,
        },
        { merge: true }
      );

    this.spinner.hide();

    this._router.navigate(['account/register/thankyou']);
  }

  listMemberships() {
    this.spinner.show();
    this._registerService.getMemberships().subscribe(
      (response) => {
        this.memberships = response.filter((item) => item.id !== 4);
        // console.log({ memberships: this.memberships });
        this.memberships.push({
          id: 4,
          price: 0.0,
          title: 'Free',
        });
        this.spinner.hide();
      },
      (error) => {
        this.spinner.show();
      }
    );
  }

  cardDefaultOff() {
    const activeDefaultItem = document.querySelector('.active-default');

    if (activeDefaultItem) {
      activeDefaultItem.classList.remove('active-default');
    }
  }

  cardDefaultOn() {
    const activeDefaultItem = document.querySelector(
      '.card-membership:nth-of-type(2)'
    );

    if (activeDefaultItem) {
      activeDefaultItem.classList.add('active-default');
    }
  }

  paymentCallback(isPaymentSuccess) {
    if (isPaymentSuccess) {
      this._router.navigate(['account/register/thankyou']);
    }
  }

  private correctLogin(data: Session) {
    // console.log({ LoginData: data });
    this._storageService.setCurrentSession(data);

    this._firestoreService.addMentorsAsFriendsOfUser(data.user.firestore_uid);

    this._firestore
      .collection('users')
      .doc(data.user.firestore_uid)
      .set(
        {
          name: data.user.name + ' ' + (data.user.last_name || ''),
          email: data.user.email,
          profile_image: data.user.profile_image.public_url,
          id: data.user.id,
          status: 1,
        },
        { merge: true }
      )
      .then((done) => {
        // console.log('done', done)
      });

    this.saveUserTimeZone();

    if (this._storageService.isAuthenticated()) {
      this.spinner.hide();
      this.navigateToBoard();
    }
  }

  private navigateToBoard() {
    const currentUser: User = this._storageService.getCurrentUser();
    this._router.navigate([Global.mains[currentUser.rol.id]]);
  }

  saveUserTimeZone() {
    const user = this._storageService.getCurrentUser();
    user.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this._storageService.setUserSession(user);

    this._builderService.updateUser(user).subscribe();
  }

  submitPayment() {
    this.spinner.show();
    const bluesnap = new BlueSnap(environment.bluesnapEncryptionKey, true);

    bluesnap.encrypt('payment-form');

    this.transactionError = null;
    this.transactionProcessing = true;

    const names = this.paymentForm.value.cardHolder;
    const lastName = names.split(' ').slice(1).join(' ');
    const splitNames = names.split(' ');

    const requestBody = {
      firstName: splitNames[0],
      lastName: lastName,
      encryptedCardNumber:
        this.paymentFormElement.nativeElement.elements['encryptedCreditCard']
          .value,
      encryptedSecurityCode:
        this.paymentFormElement.nativeElement.elements['encryptedCvv'].value,
      expirationMonth: this.cardExpire.value.split('/')[0],
      expirationYear: '20' + this.cardExpire.value.split('/')[1],
      amount: this.membership ? this.membership.price : 0.0,
    };

    this.paymentFormElement.nativeElement.elements[
      'encryptedCreditCard'
    ].remove();
    this.paymentFormElement.nativeElement.elements['encryptedCvv'].remove();

    // user make zero payment if amount is zero
    if (requestBody.amount === 0) {
      this.makeZeroPayment();
    } else {
      this.makePayment(requestBody);
    }
  }

  makePayment(payload) {
    if (this.membership) {
      const payData = {
        ...payload,
        description: 'membership',
        product_id: this.membership.id,
      };

      this._paymentService.authCaptureOnregisterPayment(payData).subscribe(
        (response) => {
          // console.log({ PaymentResp: response });
          if (response['status'] === 'success') {
            this.spinner.hide();
            this.paymentForm.reset();
            this.sendPaymentInvoice(response.data.data);
            this.submitRegister();
          } else if (response['status'] === 'error') {
            this.paymentForm.reset();
            this.transactionError =
              'Please ensure all card details are accurate and the card is active';
            this.spinner.hide();
          }
        },
        (error) => {
          console.log({ error, errorMsg: error.error.error });
          this.transactionError =
            'Please ensure all card details are accurate and the card is active';
          this.spinner.hide();
          this.paymentForm.reset();
        }
      );
    }
  }

  makeZeroPayment() {
    const payload = {
      amount: this.membership.price,
      description: 'membership',
      product_id: this.membership.id,
    };

    this._paymentService.authCaptureZeroPayment(payload).subscribe(
      (response) => {
        console.log({ PaymentResp: response.data.data });
        if (response.status === 'success') {
          this.paymentForm.reset();
          this.sendPaymentInvoice(response.data.data);
          this.submitRegister();
        } else if (response.status === 'error') {
          this.paymentForm.reset();
          this.spinner.hide();
          this.transactionError =
            'Please ensure all card details are accurate and the card is active';
        }
      },
      (error) => {
        // console.log({ error });
        this.transactionError = `Please ensure all card details are accurate and the <strong>card</> is still <strong><em>active</em></>`;
        this.paymentForm.reset();
        this.spinner.hide();
      }
    );
  }

  sendPaymentInvoice(paymentData) {
    let newObject = paymentData;

    let finalObject = { ...newObject, user: this.registerFields };

    this._registerService.generateInvoice(finalObject).subscribe(
      (response) => {},
      (error) => {
        console.log({ error });
      }
    );
  }

  checkErrorMessage() {
    if (this.transactionError) {
      this.transactionError = null;
    } else {
      return;
    }
  }

  checkCouponErrorMessage() {
    if (this.responseError) {
      this.responseError = '';
    } else {
      return;
    }
  }

  formatString(e) {
    const code = e.keyCode;

    const allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
      return;
    }

    e.target.value = e.target.value
      .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
      .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
      .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
      .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
      .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
      .replace(/[^\d\/]|^[\/]*$/g, '') // To allow only digits and `/`
      .replace(/\/\//g, '/'); // Prevent entering more than 1 `/`
  }

  checkCode() {
    this.spinner.show();
    if (this.codeControl.value) {
      let data = {
        product_id: this.membership.id,
        product_type: 'membership',
        country: this.currentCountry,
        coupon_code: '',
      };

      if (this.isCodeValue) {
        data.coupon_code = this.couponCode.value;
      }

      this.codeControl.reset();

      this._paymentService.couponCodeCheck(data).subscribe(
        (resp) => {
          this.spinner.hide();

          if (resp.with_discount) {
            this.membership.price = parseInt(resp.price, 10);
            this.responseError = '';
          } else if (!resp.with_discount) {
            this.responseError = 'No Discount on coupon applied';
          }

          if (resp.tax) {
            this.taxAmount = resp.tax;
            this.membership.price =
              parseInt(resp.price, 10) + parseInt(resp.tax, 10);
          }
        },
        (error) => {
          this.responseError = error.error.error;
          this.spinner.hide();
        }
      );
    }
  }

  validateInput(event) {
    this.checkLowerCase(event.target.value);
    this.checkUpperCase(event.target.value);
    this.checkSpecialCharacter(event.target.value);
    this.finalCheck();
  }

  checkUpperCase(data) {
    if (this.upperCaseRegex.test(data) === true) {
      this.hasUpperCase = true;
    } else {
      this.hasUpperCase = false;
    }
  }

  checkLowerCase(data) {
    if (this.lowerCaseRegex.test(data) === true) {
      this.hasLowerCase = true;
    } else {
      this.hasLowerCase = false;
    }
  }

  checkNumber(data) {
    if (this.numberRegex.test(data) === true) {
      this.hasNumber = true;
    } else {
      this.hasNumber = false;
    }
  }

  checkSpecialCharacter(data) {
    if (
      this.specialRegex.test(data) === true ||
      this.numberRegex.test(data) === true
    ) {
      this.hasSpecialCharacter = true;
    } else {
      this.hasSpecialCharacter = false;
    }
  }

  finalCheck() {
    if (
      this.hasSpecialCharacter &&
      this.hasLowerCase &&
      (this.hasNumber || this.hasSpecialCharacter)
    ) {
      this.allChecks = true;
    } else {
      this.allChecks = false;
    }
  }
}
