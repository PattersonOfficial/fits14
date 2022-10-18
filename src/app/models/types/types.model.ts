import {Memberships} from '../memberships/memberships.model';
import {Categories} from '../categories/categories.model';
import {Plan} from '../plan/plan.model';

export class Types {
    public id: number;
    public name: string;
    public image: string;
    public video: string;
    public mode_head: number;
    public membership: Memberships;
    public program: any[] = [];
    public category: Categories;
    public category_id: number;
    public plans: Plan[];
}
