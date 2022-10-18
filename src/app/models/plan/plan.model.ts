import {Contents} from '../contents/contents.model';

export class Plan {
  public id: number;
  public name: string;
  public category_id: number;
  public subcategory_id: number;
  public valid_days: number;
  public content: Contents[];
}
