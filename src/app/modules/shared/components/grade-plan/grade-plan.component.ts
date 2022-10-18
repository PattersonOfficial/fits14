import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../../../models/user/user.model';
import { StorageService } from '../../../../services/auth/storage.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UsersService } from '../../../admin/modules/users/components/users/users.service';
import { Memberships } from '../../../../models/memberships/memberships.model';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { PaymentForm } from '../../../../models/payment/form.model';
import { PaymentService } from '../../../admin/modules/packages/components/payment-form/payment.service';

interface IGradePlan {
  membership: Memberships;
  paymentConfig: PaymentForm;
  mode: 'UPGRADE' | 'DOWNGRADE';
}

@Component({
  selector: 'app-grade-plan',
  templateUrl: './grade-plan.component.html',
  styleUrls: ['./grade-plan.component.scss'],
})
export class GradePlanComponent implements OnInit {
  user: User;

  constructor(
    public _storageService: StorageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GradePlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGradePlan,
    private _userService: UsersService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.user = this._storageService.getCurrentUser();

    if (this.data.mode === 'UPGRADE') {
      const data = { membership_id: this.data.membership.id };
      this.paymentService.switchChargeAmount(data).subscribe((value) => {
        this.data.paymentConfig.price = String(value);
      });
    }
  }

  closeModal(action?): void {
    this.dialogRef.close(action);
  }

  changeMembership() {
    this.dialog
      .open(OrderSummaryComponent, {
        data: {
          title: this.data.membership.title,
          mode: 'PLAN',
          paymentConfig: this.data.paymentConfig,
        },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.closeModal({
            price: resp.price,
            coupon_code: resp.coupon_code,
          });
        }
      });
  }
}
