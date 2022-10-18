import { CongratsComponent } from './../congrats/congrats.component';
import { ToastrService } from 'ngx-toastr';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FREE_MEMBERSHIP_ID,
  LEAD_MEMBERSHIP_ID,
  Memberships,
} from '../../../../models/memberships/memberships.model';
import { User } from '../../../../models/user/user.model';
import { StorageService } from '../../../../services/auth/storage.service';
import { RegisterService } from '../../../../components/register/register.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PaymentService } from '../../../admin/modules/packages/components/payment-form/payment.service';
import { PaymentForm } from '../../../../models/payment/form.model';
import { AutoUnsub } from '../../../../directives/rx-auto-unsubscribe';
import { GradePlanComponent } from '../grade-plan/grade-plan.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

const callback_url = '/board/u/profile/plans';

@Component({
  selector: 'app-change-plan',
  templateUrl: './change-plan.component.html',
  styleUrls: ['./change-plan.component.css'],
})
@AutoUnsub()
export class ChangePlanComponent implements OnInit {
  memberships: Memberships[];
  user: User;
  paymentFormConfig: PaymentForm = new PaymentForm();
  paymentFormModalTitle: string;
  isPaymentFormShown = false;
  selectedMembership: Memberships;
  dataModel: any;
  isMobile = false;
  isBasic = true;
  isPro = false;
  isPremium = false;
  mode = '';

  constructor(
    public _registerService: RegisterService,
    public _storageService: StorageService,
    public _paymentService: PaymentService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangePlanComponent>,
    public toastService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public payment: any
  ) {
    this.paymentFormConfig.product_type =
      this._paymentService.membershipProductType;
    this.paymentFormConfig.callback_url = callback_url;
  }

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();
    this.listMemberships();

    this.isMobile = this.getIsMobile();
    window.onresize = () => {
      this.isMobile = this.getIsMobile();
    };
  }

  closeModal(status): void {
    this.dialogRef.close({
      success: status,
    });
  }

  listMemberships() {
    this._registerService.getMemberships().subscribe((response) => {
      this.memberships = response;
    });
  }

  memberSelection(membership: Memberships) {
    this.paymentFormModalTitle = membership.title;

    this.paymentFormConfig.amount = membership.price.toString();
    this.paymentFormConfig.product_id = membership.id;
    this.paymentFormConfig = Object.assign({}, this.paymentFormConfig);

    this.selectedMembership = membership;
    if (
      this.user.client.membership.id &&
      ![FREE_MEMBERSHIP_ID, LEAD_MEMBERSHIP_ID].includes(
        this.user.client.membership.id
      )
    ) {
      const mode =
        this.selectedMembership.id > this.user.client.membership.id
          ? 'UPGRADE'
          : 'DOWNGRADE';
      this.dataModel = {
        membership: this.selectedMembership,
        paymentConfig: this.paymentFormConfig,
        mode: mode,
      };

      this.mode = mode;

      // check if user has a pending downgrade
      if (
        mode === 'DOWNGRADE' &&
        this.user.client.has_pending_downgrade &&
        this.user.client.has_pending_downgrade == 1
      ) {
        this.toastService.warning(
          'Downgrade not allowed. User has a pending downgrade'
        );
        this.closeModal(false);
      } else if (mode === 'UPGRADE') {

        // this is for upgrade flow
        this.dataModel = {
          title: this.selectedMembership.title,
          mode: mode,
          paymentConfig: this.paymentFormConfig,
        };
        this.dialog
          .open(OrderSummaryComponent, {
            data: {
              membership: this.selectedMembership,
              paymentConfig: this.paymentFormConfig,
              mode: mode,
            },
          })
          .afterClosed()
          .subscribe((resp) => {
            if (resp) {
              this.paymentFormConfig.amount = resp.price;
              this.paymentFormConfig.coupon_code = resp.coupon_code;
              this.dataModel = this.paymentFormConfig;
              this.dataModel = {
                ...this.dataModel,
                amount: resp.price,
                coupon_code: resp.coupon_code,
              };
              this.showPaymentForm();
            }
          });
      } else {
        //  this is for the downgrade flow
        this.dialog
          .open(GradePlanComponent, {
            data: {
              membership: this.selectedMembership,
              paymentConfig: this.paymentFormConfig,
              mode: mode,
            },
          })
          .afterClosed()
          .subscribe((resp) => {
            if (resp === true) {
              this.dialog
                .open(OrderSummaryComponent, {
                  data: {
                    membership: this.selectedMembership,
                    paymentConfig: this.paymentFormConfig,
                    mode: mode,
                  },
                })
                .afterClosed()
                .subscribe((resp) => {
                  this.paymentFormConfig.amount = resp.price;
                  this.paymentFormConfig.coupon_code = resp.coupon_code;
                  this.dataModel = {
                    ...this.dataModel,
                    amount: resp.price,
                    coupon_code: resp.coupon_code,
                  };
                  this.showPaymentForm();
                });
            } else {
              this.closeModal(false);
            }
          });
      }
    } else {
      this.dataModel = {
        title: this.selectedMembership.title,
        mode: 'PLAN',
        paymentConfig: this.paymentFormConfig,
      };
      this.mode = 'PLAN';
      this.dialog
        .open(OrderSummaryComponent, {
          data: {
            title: this.selectedMembership.title,
            mode: 'PLAN',
            paymentConfig: this.paymentFormConfig,
          },
        })
        .afterClosed()
        .subscribe((resp) => {
          if (resp) {
            this.paymentFormConfig.amount = resp.price;
            this.paymentFormConfig.coupon_code = resp.coupon_code;
            this.dataModel = this.paymentFormConfig;
            this.dataModel = {
              ...this.dataModel,
              amount: resp.price,
              coupon_code: resp.coupon_code,
            };
            this.showPaymentForm();
          }
      });
    }
  }

  paymentCallback(isPaymentSuccess) {
    this._storageService.refreshUserData();
    if (isPaymentSuccess === true) {
      this._storageService.refreshUserData();
      this.isPaymentFormShown = false;
      if (this.mode !== 'DOWNGRADE') {
        this.closeModal(true);
        this.dialog.open(CongratsComponent, {
          data: {
            membership: this.selectedMembership,
            paymentConfig: this.paymentFormConfig,
            mode: this.mode,
            user: this.user,
          },
        }).afterClosed().subscribe(() => {
          this._storageService.refreshUserData();
        });
      } else {
        this.closeModal(true);
        this.toastService.success('Plan downgraded successfully');
      }
    } else {
      this.closeModal(false);
    }
  }

  showPaymentForm() {
    this.isPaymentFormShown = true;
  }

  getIsMobile(): boolean {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const breakpoint = 768;

    return width <= breakpoint;
  }

  goToPlan(plan) {
    if (plan == 'Basic') {
      this.isBasic = true;
      this.isPro = false;
      this.isPremium = false;
    }

    if (plan == 'Pro') {
      this.isBasic = false;
      this.isPro = true;
      this.isPremium = false;
    }

    if (plan == 'Premium') {
      this.isBasic = false;
      this.isPro = false;
      this.isPremium = true;
    }
  }

}
