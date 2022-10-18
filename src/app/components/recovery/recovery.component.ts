import { Component, ViewChild, Input, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StorageService } from '../../services/auth/storage.service';
import { RecoveryMail, RecoveryNewPassword } from './recovery.model';
import { RecoveryService } from './recovery.service';
import { mixinInitialized } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bodyer',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css'],
})
export class RecoveryComponent implements OnInit {
  public requestRecoveryForm: RecoveryMail;
  public newPasswordForm: RecoveryNewPassword;
  public error: string;
  public showMessage: boolean;
  public token;
  public isEmailSent = false;
  public userEmail: string;
  public isResettingPassword = false;
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

  constructor(
    public _storageService: StorageService,
    public _recoveryService: RecoveryService,
    public _route: ActivatedRoute,
    public _router: Router,
    private spinner: NgxSpinnerService,
    private toastService: ToastrService
  ) {
    _route.params.subscribe((params) => {
      this.token = params.token || null;
      // console.log(this.token);
      if (this.token) {
        this.isResettingPassword = true;
      }
    });
    this.requestRecoveryForm = {
      email: '',
    };
    this.newPasswordForm = {
      token: this.token,
      password: '',
      password2: '',
    };
    this.error = '';
    this.showMessage = false;
  }

  ngOnInit() {
    this._storageService.isValidAuth.subscribe((status) => {
      if (status) {
        this._storageService.isValidAuth.next(false);
      }
    });
    this._storageService.removeCurrentSession();
    // document.querySelector('body').style.backgroundColor = '#FFF';
  }

  requestRestore(e) {
    e.preventDefault();
    this.spinner.show();
    this.showMessage = false;
    this.error = '';
    this._recoveryService.recoveryRequest(this.requestRecoveryForm).subscribe(
      (res) => {
        this.userEmail = this.requestRecoveryForm.email;
        (<HTMLInputElement>document.getElementById('email')).value = '';
        this.isEmailSent = true;
        this.spinner.hide();
      },
      (error) => {
        if (error.status === 401) {
          this.error = 'Not authorized';
          this.spinner.hide();
        } else {
          this.error = error.error.error;
          this.spinner.hide();
        }
      }
    );
  }

  changePassword(e) {
    e.preventDefault();
    this.error =
      this.newPasswordForm.password !== this.newPasswordForm.password2
        ? 'Entered passwords are not the same'
        : '';
    if (!this.error) {
      this.spinner.show();
      this._recoveryService
        .recoverySendNewPassword(this.newPasswordForm)
        .subscribe(
          (res) => {
            this.spinner.hide();
            this.toastService.success('Password Reset Successful');
            this._router.navigate(['/login']);
          },
          (error) => {
            if (error.status === 401) {
              this.error = 'Not authorized';
              this.spinner.hide();
            } else {
              // console.log(error)
              this.error = error.error.error;
              this.spinner.hide();
            }
          }
        );
    } else {
      this.isMatching = false;
    }
  }

  verifyPassword() {
    this.error = '';
    if (this.newPasswordForm.password !== this.newPasswordForm.password2) {
      this.isMatching = false;
    } else {
      this.isMatching = true;
    }
  }

  resetCard() {
    this.isEmailSent = false;
  }

  resendResetLink() {
    this.spinner.show();
    this._recoveryService.recoveryRequest(this.requestRecoveryForm).subscribe(
      (res) => {
        this.isEmailSent = true;
        this.spinner.hide();
      },
      (error) => {
        if (error.status === 401) {
          this.error = 'Not authorized';
          this.spinner.hide();
        } else {
          this.error = error.error.error;
          this.spinner.hide();
        }
      }
    );
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

  togglePassVis(e) {
    const input = e.target.closest('.form-controls').querySelector('input');
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
