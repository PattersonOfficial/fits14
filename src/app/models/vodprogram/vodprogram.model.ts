import { Contents } from '../contents/contents.model';

export class VodProgram {
    public id: number;
    public mentor_id: number;
    public category_id: number;
    public title: string;
    public subtitle: string;
    public description: string;
    public thumbnail: string;
    public promo_video_url: string;
    public order_in_popular: number;
    public free_member_price: string;
    public pro_member_price: string;
    public premium_member_price: string;
    public created_at: string;
    public updated_at: string;
    public lessons: Contents[];
    public articles: Contents[];
    public display_in_more_vod: boolean;
    public daily_workout: Contents;
    public price: string;
    public lessons_count: string;
}
