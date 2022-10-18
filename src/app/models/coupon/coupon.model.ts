export class Coupon {
    constructor() {
        const now = new Date();
        const mm = now.getMonth() + 1;
        const dd = now.getDate();

        this.id = null;
        this.code = Math.random().toString(36).slice(-6).toUpperCase();
        this.discount_value = null;
        this.discount_type = 'percent';
        this.expires_at = [now.getFullYear() + 1, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
        this.usages = 1;
        this.description = '';
    }

    id: number;
    code: string;
    discount_value: number;
    discount_type: string;
    expires_at: string;
    usages: number;
    description: string;
}
