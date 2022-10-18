import {VodProgram} from '../vodprogram/vodprogram.model';
import {Memberships} from '../memberships/memberships.model';
import {Coupon} from '../coupon/coupon.model';

export class Invoice {
    id: number;
    client_id: number;
    invoiceable_id: number;
    invoiceable_type: string;
    status: string;
    amount: number;
    paid_amount: number;
    payment_method: string;
    created_at: string;
    updated_at: string;
    invoiceable: VodProgram | Memberships;
    coupon_id: number;
    coupon: Coupon;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    get isVodProgram() {
        return this.invoiceable_type === 'vod_program';
    }
}
