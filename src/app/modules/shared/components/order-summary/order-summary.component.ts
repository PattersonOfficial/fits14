import { StorageService } from './../../../../services/auth/storage.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentForm } from '../../../../models/payment/form.model';
import { CrmService } from '../../../../services/crm/crm.service';
import { HttpParams } from '@angular/common/http';
import { Memberships } from '../../../../models/memberships/memberships.model';
import { User } from '../../../../models/user/user.model';
import { PaymentService } from '../../../admin/modules/packages/components/payment-form/payment.service';

interface IOrderSummary {
  title: string;
  description: string;
  isVatActivated: boolean;
  mode: 'VOD' | 'PLAN' | 'UPGRADE' | 'DOWNGRADE';
  img?: string;
  subtitle?: string;
  paymentConfig: PaymentForm;
  membership: Memberships;
}

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  user: User;

  constructor(
    public dialogRef: MatDialogRef<OrderSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IOrderSummary,
    private crmService: CrmService,
    public _storageService: StorageService,
    private paymentService: PaymentService
  ) {}

  discount: string;
  focusedInputField: boolean;
  priceNew = null;
  invoicePrice: number;
  taxAmount: number;
  responseError: string;
  form: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });
  taxPrice = '';
  discountAmount = '';
  mainAmount = null;

  get codeControl() {
    return this.form.get('code') as FormControl;
  }

  get isCodeValue() {
    return !!this.codeControl.value;
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    this.mainAmount = this.data.paymentConfig.amount;

    // for checking if we have tax(VAT 17%)
    this.checkSubscriptionStatus();
  }

  // this is for checking coupon code validation 
  checkCode(event?: KeyboardEvent) {
    if (!event || event.key === 'Enter') {
      let has_entered_coupon = false;
      let coupon_code = '';
      let params = new HttpParams()
        .set('product_id', String(this.data.paymentConfig.product_id))
        .set('product_type', this.data.paymentConfig.product_type);
      if (this.isCodeValue) {
        params = params.set('coupon_code', this.codeControl.value);
        has_entered_coupon = true;
        coupon_code = this.codeControl.value;
      }
      this.reset();
      this.codeControl.reset();
      this.crmService.getCouponCode(params).subscribe(
        (resp: any) => {

          if (resp.with_discount) {
            this.discount = coupon_code;
            this.discountAmount = resp.discount_amount;

            // checking if user has a tax impact
            if (resp.tax) {
              this.taxAmount = resp.tax;
              this.taxPrice = resp.tax;
            }

            // checking if there is a new price with discount
            if (resp.old_price) {
              this.priceNew = resp.price_before_tax;
              // set invoice for clients that have tax(VAT 17%)
              if (resp.tax) {
                this.invoicePrice = resp.price;
              } else {
                this.invoicePrice = resp.price_before_tax;
              }
            }

            this.responseError = '';
          } else if (has_entered_coupon && !resp.with_discount) {
            this.responseError = 'No discount on coupon applied';
          }
        },
        (error) => {
          // console.log({ error, errorText: error.error.text });
          this.responseError = error.error.error;
        }
      );
    }
  }

  checkSubscriptionStatus() {
    let has_entered_coupon = false;
    let coupon_code = '';
    let params = new HttpParams()
      .set('product_id', String(this.data.paymentConfig.product_id))
      .set('product_type', this.data.paymentConfig.product_type);

    params = params.set('coupon_code', 'void_coupon');
    has_entered_coupon = true;
    coupon_code = 'void_coupon';

    this.codeControl.reset();
    this.crmService.getCouponCode(params).subscribe(
      (resp: any) => {
        // checking if user has a tax impact
        if (resp.tax) {
          this.taxAmount = resp.tax;
          this.taxPrice = resp.tax;
        }

        // checking if there is a new price for payment and mode not a plan
        if (resp.old_price && this.data.mode !== 'PLAN') {
          this.priceNew = resp.price_before_tax.toString();
          this.mainAmount = resp.price_before_tax.toString();
          this.invoicePrice = resp.price;
        }

        // checking if there is a new price for payment and mode a plan
        if (resp.old_price && this.data.mode === 'PLAN') {
          if (resp.tax) {
            this.invoicePrice = resp.price;
          } else {
            this.invoicePrice = resp.price_before_tax;
          }
        }

        this.responseError = '';
      },
      (error) => {
        console.log({ error, errorText: error.error.text });
        // this.responseError = error.error.error;
      }
    );
  }

  submit() {
    this.dialogRef.close({
      price: this.invoicePrice,
      coupon_code: this.discount,
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  reset() {
    this.invoicePrice = null;
    this.taxAmount = null;
    this.taxPrice = '';
    this.discountAmount = '';
    this.priceNew = null;
  }
}
