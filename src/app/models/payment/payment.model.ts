import { VodProgram } from '../vodprogram/vodprogram.model';

export interface PaymentElement {
    invoiceable: any;
    created_at: string;
    amount: string;
    payment_method: string;
}

export interface CouponResponse {
    product: VodProgram;
    price: number;
    with_discount: boolean;
    old_price: number;
    coupon_id: number;
    tax: number;
    amount: number;
}
