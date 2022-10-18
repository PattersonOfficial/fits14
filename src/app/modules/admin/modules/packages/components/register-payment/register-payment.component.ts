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
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

declare const BlueSnap: any;

@Component({
  selector: 'app-register-payment',
  templateUrl: './register-payment.component.html',
  styleUrls: ['./register-payment.component.css'],
})
export class RegisterPaymentComponent implements OnInit {
  @ViewChild('paymentFormElement', { static: false })
  paymentFormElement: ElementRef;
  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  @Output() paymentCallback = new EventEmitter();

  @Input() configData: any;

  dataObject: any;
  responseError = '';
  newPrice = '';
  isDiscount = true;
  taxAmount = '';
  totalAmount = 0;

  private _params: PaymentForm;

  get params(): PaymentForm {
    return this._params;
  }

  @Input()
  set params(val: PaymentForm) {
    this.hostedPaymentPageLink = '';
    this.isLoaderActive = true;

    if (this.iframe) {
      this.iframe.nativeElement.setAttribute('src', this.hostedPaymentPageLink);
    }

    this.prepareForm();

    if (val) {
      this._params = { ...val };
      this.preparePayment();
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

  get codeControl() {
    return this.paymentForm.get('couponCode') as FormControl;
  }

  get isCodeValue() {
    return !!this.codeControl.value;
  }

  private observableRequest: Observable<any>;

  constructor(
    public _paymentService: PaymentService,
    public _storageService: StorageService,
    public _router: Router,
    public _profileService: ProfileService
  ) {
    this.prepareForm();
  }

  ngOnInit() {
    // this.onIframeLoad();
    // console.log({ Params: this.params });
    // console.log({ configData: this.configData });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.totalAmount = this.configData.amount;
    if (this.configData && this.configData.amount <= 0) {
      this.transactionError = null;
      this.transactionProcessing = true;
      this.isLoaderActive = true;
      this.makeZeroPayment();
    }
  }

  preparePayment() {
    if (this._params.product_id && this._params.product_type) {
      if (this._storageService.getCurrentSession()) {
        this.prepareHostedPaymentPageLink();
      } else {
        this._storageService.isLogged.subscribe((status) => {
          if (status) {
            this.prepareHostedPaymentPageLink();
          }
        });
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
        validators: [Validators.minLength(3), Validators.maxLength(3)],
        updateOn: 'blur',
      }),
      couponCode: new FormControl(null, [Validators.minLength(1)]),
    });

    this.isLoaderActive = false;
  }

  prepareHostedPaymentPageLink() {
    this.transactionError = null;
    this.hostedPaymentPageLink = null;

    const requestParams = {
      product_id: this.params.product_id,
      product_type: this.params.product_type,
      callback_url: window.location.origin + this.params.callback_url,
    };

    if (this.params.coupon_code) {
      requestParams['coupon_code'] = this.params.coupon_code;
    }

    this._paymentService.getHostedPaymentPageLink(requestParams).subscribe(
      (data) => {
        if (data.payment_page_link) {
          this.hostedPaymentPageLink = data.payment_page_link;
          this.iframe.nativeElement.setAttribute(
            'src',
            this.hostedPaymentPageLink
          );
        } else if (data.result) {
          this.isLoaderActive = false;
          this.isTransactionSuccessfully = true;

          setTimeout(() => {
            this._router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this._router.navigate([this.params.callback_url]));

            this.paymentCallback.emit(true);
          }, 1000);
        }
      },
      (res) => {
        this.transactionError = res.error
          ? res.error.error
            ? res.error.error
            : res.error
          : null;
      }
    );
  }

  onIframeLoad() {
    this.iframe.nativeElement.onload = () => {
      this.iframe.nativeElement.allowPaymentRequest = true;

      if (this.hostedPaymentPageLink) {
        this.isLoaderActive = false;
      }

      if (
        this.iframe.nativeElement.contentWindow.location.href ===
        window.location.origin + this.params.callback_url
      ) {
        this._router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this._router.navigate([this.params.callback_url]));

        this.paymentCallback.emit(true);
      }
    };
  }

  submitForm() {
    const bluesnap = new BlueSnap(environment.bluesnapEncryptionKey, true);

    bluesnap.encrypt('payment-form');

    this.transactionError = null;
    this.transactionProcessing = true;

    console.log({ Data: this.dataObject });

    const requestBody = {
      encryptedCardNumber:
        this.paymentFormElement.nativeElement.elements['encryptedCreditCard']
          .value,
      encryptedSecurityCode:
        this.paymentFormElement.nativeElement.elements['encryptedCvv'].value,
      expirationMonth: this.cardExpire.value.split('/')[0],
      expirationYear: '20' + this.cardExpire.value.split('/')[1],
      product_id: this.params ? this.params.product_id : null,
      product_type: this.params ? this.params.product_type : null,
      callback_url: this.params ? this.params.callback_url : null,
    };

    this.paymentFormElement.nativeElement.elements[
      'encryptedCreditCard'
    ].remove();
    this.paymentFormElement.nativeElement.elements['encryptedCvv'].remove();

    this.editPaymentMethod(requestBody);
  }

  editPaymentMethod(requestBody) {
    this.transactionError = null;

    this.observableRequest =
      this._profileService.editPaymentMethod(requestBody);

    if (this.observableRequest) {
      this.observableRequest.subscribe(
        () => {
          this.paymentCallback.emit(true);

          this.transactionProcessing = false;
        },
        (res) => {
          this.transactionError = res.error
            ? res.error.error
              ? res.error.error
              : res.error
            : null;
          this.paymentCallback.emit(false);

          this.transactionProcessing = false;
        }
      );
    } else {
      this.transactionProcessing = false;
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

  submitPayment() {
    this.isLoaderActive = true;
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
      amount: this.totalAmount,
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
    if (this.configData) {
      const payData = {
        ...payload,
        description: this.configData.product_type,
        product_id: this.configData.product_id,
      };

      this._paymentService.authCaptureOnregisterPayment(payData).subscribe(
        (response) => {
          // console.log({ response });
          if (response['status'] === 'success') {
            this.isTransactionSuccessfully = true;
            this.isLoaderActive = false;
            this.paymentForm.reset();
            this.paymentCallback.emit(true);
          } else if (response['status'] === 'error') {
            this.paymentCallback.emit(false);
            this.paymentForm.reset();
            this.isLoaderActive = false;
            this.transactionError =
              'Please ensure all card details are accurate and the card is active';
          }
        },
        (error) => {
          this.transactionError =
            'Please ensure all card details are accurate and the card is active';
          this.isLoaderActive = false;
          this.paymentForm.reset();
          // this.paymentCallback.emit(false);
        }
      );
    }
  }

  makeZeroPayment() {
    const payload = {
      amount: this.configData.amount,
      description: this.configData.product_type,
      product_id: this.configData.product_id,
    };

    this._paymentService.authCaptureZeroPayment(payload).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.isTransactionSuccessfully = true;
          this.isLoaderActive = false;
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
        console.log({ error });
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

  checkCode() {
    this.isLoaderActive = true;
    if (this.codeControl.value) {
      let data = {
        product_id: this.configData.product_id,
        product_type: this.configData.product_type,
        country: this.configData.country,
        coupon_code: '',
      };

      if (this.isCodeValue) {
        data.coupon_code = this.couponCode.value;
      }

      this.codeControl.reset();

      this._paymentService.couponCodeCheck(data).subscribe(
        (resp) => {
          this.isLoaderActive = false;

          if (resp.with_discount) {
            this.isDiscount = true;
            this.newPrice = resp.price;
            this.totalAmount = parseInt(resp.price, 10);
            this.responseError = '';
          } else if (!resp.with_discount) {
            this.responseError = 'No Discount on coupon applied';
          }

          if (resp.tax) {
            this.taxAmount = resp.tax;
            this.totalAmount =
              parseInt(resp.price, 10) + parseInt(resp.tax, 10);
          }
        },
        (error) => {
          this.responseError = error.error.error;
          this.isLoaderActive = false;
        }
      );
    }
  }
}
