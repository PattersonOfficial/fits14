import {Component, OnInit, ViewChild} from '@angular/core';
import {CouponsService} from './coupons.service';
import {Coupon} from '../../../../../../models/coupon/coupon.model';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-coupons',
    templateUrl: './coupons.component.html',
    styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
    @ViewChild('modalCoupon', {static: false}) modalCoupon: ModalDirective;

    coupon: Coupon;
    coupons: Coupon[];
    requestErrors: any;

    isChecked = false;

    constructor(
        public _couponsService: CouponsService
    ) {
        this.coupon = new Coupon();
        this.requestErrors = {};
    }

    ngOnInit() {
        this.getCouponsList();
    }

    getCouponsList() {
        this._couponsService.getCouponsList().subscribe(
            (data) => {
                this.coupons = data;
            }
        );
    }

    saveCoupon() {
        this.requestErrors = {};

        if (this.coupon.id === null) {
            this._couponsService.createCoupon(this.coupon).subscribe(
                () => {
                    this.getCouponsList();
                    this.closeModal();
                },
                (response) => {
                    this.requestErrors = response.error;
                    console.log(this.requestErrors);
                }
            );
        } else {
            this._couponsService.updateCoupon(this.coupon).subscribe(
                () => {
                    this.getCouponsList();
                    this.closeModal();
                },
                (response) => {
                    this.requestErrors = response.error;
                    console.log(this.requestErrors);
                }
            );
        }
    }

    deleteCoupon(coupon: Coupon) {
        this._couponsService.deleteCoupon(coupon).subscribe(
            () => {
                this.getCouponsList();
            }
        );
    }

    createCoupon() {
        this.coupon = new Coupon();
        this.showModal();
    }

    editCoupon(coupon: Coupon) {
        this.coupon = Object.assign({}, coupon);
        this.showModal();
    }

    showModal() {
        this.modalCoupon.show();
    }

    closeModal() {
        this.modalCoupon.hide();
    }

    checkUsageStatus() {
        if (this.isChecked === true && this.coupon.usages > 1) {
            return false;
        }

        if (this.isChecked === true && this.coupon.usages === 1) {
            return true;
        }

        if (this.isChecked === false && this.coupon.usages > 1) {
            return true;
        }

        return false;
    }

    setIsChecked() {
        this.isChecked = !this.isChecked;
        // console.log({ isChecked: this.isChecked , Usages: this.coupon.usages});
    }
}
