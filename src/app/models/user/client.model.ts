import { Memberships } from '../memberships/memberships.model';
import { Types } from '../types/types.model';

export class Client {
    [x: string]: any;

    public id!: number;
    public membership: Memberships = new Memberships;
    public types: Types[] = [];
    public unanswered_questions!: number;
    public unsigned_programs: any;
    public manager: any;
    public weight!: number;
    public measurement_weight!: string;
    public measurement_liquid!: string;
    public measurement_height!: string;
    public nutrition_type: any;
    public has_pending_downgrade: any;
    public daily_calories!: number;
    public card_last_four_digits!: string;
    public card_type!: string;
    public card_expiration_month!: string;
    public card_expiration_year!: string;
    public subscription_started_at!: string;
    public subscription_upgrade!: Memberships;
    public subscription_upgrade_active!: boolean;
    public upgrade_starts_at!: string;
    public upgrade_ends_at!: string;
}
