import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from './payment.service';
import { StorageService } from '../../../../../../services/auth/storage.service';
import { PaymentForm } from '../../../../../../models/payment/form.model';
import { Router } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { ProfileService } from '../../../../../client/modules/profile/components/profile/profile.service';
import { ConnectableObservable, Observable } from 'rxjs';

declare const BlueSnap: any;
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
})
export class PaymentFormComponent implements OnInit {
  @ViewChild('paymentFormElement', { static: false })
  paymentFormElement: ElementRef;
  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  @Output() paymentCallback = new EventEmitter();

  @Input() configData: any;

  dataObject: any;

  private _params: PaymentForm;

  get params(): PaymentForm {
    return this._params;
  }

  @Input()
  set params(val: PaymentForm) {
    this.isLoaderActive = true;

  
    this.prepareForm();

    if (val) {
      this._params = { ...val };
    } else {
      this._params = null;
    }
  }

  paymentForm: FormGroup;

  transactionError: string;
  transactionProcessing: boolean;
  hostedPaymentPageLink = '';
  isLoaderActive = true;
  isTransactionSuccessfully: boolean;

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

  constructor(
    public _paymentService: PaymentService,
    public _storageService: StorageService,
    public _router: Router,
    public _profileService: ProfileService
  ) {
    this.prepareForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.configData && this.configData.amount <= 0) {
      //  this is for checking if user has a credit card input else pass it to make payment directly
      const user = this._storageService.getCurrentUser();
      console.log({ user });
      if (user.client.bluesnap_vaulted_shopper_id) {
        this.transactionError = null;
        this.transactionProcessing = true;
        this.isLoaderActive = true;
        this.makeZeroPayment();
      }
    }
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
        validators: [
          Validators.minLength(3),
          Validators.maxLength(3),
          Validators.required,
        ],
        // updateOn: 'blur',
      }),
      couponCode: new FormControl(null, [Validators.minLength(1)]),
    });

    this.isLoaderActive = false;
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

  submitPayment() {
    this.isLoaderActive = true;
    const bluesnap = new BlueSnap(environment.bluesnapEncryptionKey, true);

    bluesnap.encrypt('payment-form');

    console.log({ Params: this.params });

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
      amount: this.params ? this.params.amount : 0.0,
    };

    this.paymentFormElement.nativeElement.elements[
      'encryptedCreditCard'
    ].remove();
    this.paymentFormElement.nativeElement.elements['encryptedCvv'].remove();

    console.log({ requestBody });
    this.makePayment(requestBody);
  }

  makePayment(payload) {
    if (this.configData) {
      const payData = {
        ...payload,
        description: this.configData.product_type,
        product_id: this.configData.product_id,
        coupon_code: this.params.coupon_code
      };

      this._paymentService.authCapturePayment(payData).subscribe(
        (response) => {
          // console.log({ paymentResponse: response });
          if (response['status'] === 'success') {
            // this.isTransactionSuccessfully = true;
            this.isLoaderActive = false;
            this.paymentForm.reset();
            this.transactionProcessing = false;
            this.paymentCallback.emit(true);
          } else if (response['status'] === 'error') {
            this.isLoaderActive = false;
            this.transactionError =
              'Please ensure all card details are accurate and the card is active';
          }
        },
        (error) => {
          console.log({ authCapturePaymentError: error });
          this.transactionError =
            'Please ensure all card details are accurate and the card is active';
          this.isLoaderActive = false;
          this.paymentForm.reset();
          this.paymentCallback.emit(false);
        }
      );
    }
  }

  makeZeroPayment() {
    const payload = {
      amount: this.configData.amount,
      description: this.configData.product_type,
      product_id: this.configData.product_id,
      coupon_code: this.params.coupon_code
    };

    this._paymentService.authCaptureZeroPayment(payload).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.isTransactionSuccessfully = true;
          this.isLoaderActive = false;
          this.transactionProcessing = false;
          this.paymentForm.reset();
          this.paymentCallback.emit(true);
        } else if (response.status === 'error') {
          this.paymentCallback.emit(false);
          this.paymentForm.reset();
          this.isLoaderActive = false;
          this.transactionError =
            'Please ensure all card details are accurate and the card is active';
        }
      },
      (error) => {
        console.log({ authCaptureZeroPaymentError: error });
        this.transactionError = `Please ensure all card details are accurate and the <b>card</> is still <b>active</>`;
        this.isLoaderActive = false;
        this.paymentForm.reset();
        this.paymentCallback.emit(false);
      }
    );
  }

  checkErrorMessage() {
    if (this.transactionError) {
      this.transactionError = null;
      if (this.transactionProcessing) {
        this.transactionProcessing = false;
      }
    } else {
      return;
    }
  }
}
