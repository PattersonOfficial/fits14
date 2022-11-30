import { environment } from '../../../environments/environment';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';

import { Global } from '../../app.global';
import { LoginObject } from './login.model';
import { FacebookLoginObject } from './facebook.login.model';
import { LoginService } from './login.service';
import { Session } from '../../models/auth/session.model';
import { User } from '../../models/user/user.model';
import { StorageService } from '../../services/auth/storage.service';
import { BuilderService } from '../../modules/admin/modules/users/components/builder/builder.service';
import { FirestoreService } from '../../services/firebase/firestore.service';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;
declare var require: any;
const capslock = require('capslock');

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginFields: LoginObject;
  public fbData: FacebookLoginObject;
  public submitted = false;
  public error: { code: number; message: string }  | any;
  public capsLockIsActive: boolean = false;
  public isInvalidLogin = false;
  public loadingBox = false;
  public user: SocialUser | any;
  public loggedIn: boolean = false;
  errorMessage = '';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  rememberMeChecked = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    public _loginService: LoginService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _storageService: StorageService,
    public _builderService: BuilderService,
    public _firestoreService: FirestoreService,
    private _firestore: AngularFirestore,
    private _googleAuthService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.loginFields = new LoginObject('', '', 0, '');
    this.fbData = new FacebookLoginObject('');
  }

  ngOnInit() {
    if (
      this._router.url.indexOf('/login') !== -1 &&
      this._storageService.isAuthenticated()
    ) {
      this.navigateToBoard();
    } else {
      this._route.queryParams.subscribe((params) => {
        const fbToken = params.token;
        const socialError = params.error;
        if (fbToken) {
          this.fbData.token = fbToken;
          this._loginService.fbLogin(this.fbData).subscribe(
            (data) => {
              this.correctLogin(data);
            },
            () => {
              this.loginError();
              this._router.navigate(['/login'], { replaceUrl: true });
            }
          );
        }
        if (socialError) {
          this.loginError();
          this._router.navigate(['/login'], { replaceUrl: true });
        }
      });
    }
  }

  rememberMe() {
    this.rememberMeChecked = !this.rememberMeChecked;
  }

  ngAfterViewInit() {
    this.labelUp();

    capslock.observe((status) => {
      this.isInvalidLogin = false;
      this.capsLockIsActive = status;
    });
  }

  togglePassVis(e) {
    const input = e.target.closest('.form-controls').querySelector('input');
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  public submitLogin(): void {
    // this.submitted = true;
    this.spinner.show();
    this.error = null;
    this.loadingBox = true;
    this._loginService.login(this.loginFields).subscribe(
      (res) => {
        if (this.checkLeadValidity(res) === false) {
          this.correctLogin(res);
          window['dataLayer'].push({
            event: 'Login',
            login_method: 'Email',
            pageUrl: window.location.href,
          });
        } else {
          this.spinner.hide();
          this._router.navigate(['account/register/lead/' + res.user.id], {
            replaceUrl: true,
          });
        }
      },
      (error) => {
        console.log({error});
        this.errorMessage =
                'Please check your email and password and try again. If you used social login for registration, please use the social login';
        this.spinner.hide();
        this.loginError();
      }
    );
  }

  checkLeadValidity(res) {
    if (res.user.client) {
      if (res.user.client.is_lead === 1) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }

  public facebookLogin() {
    this._googleAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((data) => {
        // console.log({ FacebookResp: data });
        this.spinner.show();
        this._loginService.socialLogin(data).subscribe(
          (response) => {
            // console.log({ FacebookLogin: response });
            // if (response.user.client.is_lead === 1) {
            //   this.spinner.hide();
            //   this._router.navigate(
            //     ['account/register/lead/' + response.user.id],
            //     { replaceUrl: true }
            //   );
            // } else {
            //   this.correctLogin(response);
            //   window['dataLayer'].push({
            //     event: 'Login',
            //     login_method: 'Facebook',
            //     pageUrl: window.location.href,
            //   });
            // }
            if (this.checkLeadValidity(response) === false && response.user['email_verified_at']) {
              this.correctLogin(response);
              window['dataLayer'].push({
                event: 'Login',
                login_method: 'Facebook',
                pageUrl: window.location.href,
              });
            } else {
              this.spinner.hide();
              this._router.navigate(['account/register/lead/' + response.user.id], {
                replaceUrl: true,
              });
            }
          },
          (error) => {
            this.loginError();
            console.log({ FacebookError: error });
            if (error.error.status === 0) {
              this.errorMessage = error.error.error;
            } else {
              this.errorMessage =
                'Please check your email and password and try again';
            }
            this.spinner.hide();
            // this._router.navigate(['/login'], { replaceUrl: true });
          }
        );
      });
  }

  public googleLogin() {
    this._googleAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        // console.log({ GoogleResp: data });
        this.spinner.show();
        this._loginService.socialLogin(data).subscribe(
          (response) => {
            // console.log({ GoogleLogin: response });
            if (this.checkLeadValidity(response) === false && response.user['email_verified_at']) {
              this.correctLogin(response);
              window['dataLayer'].push({
                event: 'Login',
                login_method: 'Google',
                pageUrl: window.location.href,
              });
            } else {
              this.spinner.hide();
              this._router.navigate(['account/register/lead/' + response.user.id], {
                replaceUrl: true,
              });
            }
          },
          (error) => {
            this.loginError();
            console.log({ GoogleError: error });
            if (error.error.status === 0) {
              this.errorMessage = error.error.error;
            } else {
              this.errorMessage =
                'Please check your email and password and try again';
            }
            this.spinner.hide();
            // this._router.navigate(['/login'], { replaceUrl: true });
          }
        );
      });
  }

  public loginError() {
    this.isInvalidLogin = true;
    this.capsLockIsActive = false;
    this.loadingBox = false;
  }

  private correctLogin(data: Session) {
    this._storageService.setCurrentSession(data);

    this._firestoreService.addMentorsAsFriendsOfUser(data.user.firestore_uid);

    // console.log(
    //   data.user.name + ' ' + data.user.last_name,
    //   data.user.firestore_uid
    // );
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
        console.log('done', done);
      });

    this.saveUserTimeZone();

    if (this._storageService.isAuthenticated()) {
      this.navigateToBoard();
    }
  }

  private navigateToBoard() {
    const currentUser: User = this._storageService.getCurrentUser();
    this.spinner.hide();
    this._router.navigate([Global.mains[currentUser.rol.id]]);
  }

  public labelUp() {
    'use strict';

    $('input, textarea').each(function () {
      $(this).val()
        ? $(this).addClass('has-value')
        : $(this).removeClass('has-value');
    });

    $(document).on('blur', 'input, textarea', function () {
      $(this).val()
        ? $(this).addClass('has-value')
        : $(this).removeClass('has-value');
    });
  }

  saveUserTimeZone() {
    const user = this._storageService.getCurrentUser();
    user.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this._storageService.setUserSession(user);

    this._builderService.updateUser(user).subscribe();
  }
}
