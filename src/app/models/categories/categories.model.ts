export class Categories {
  public id: number;
  public title: string;
}

export class Subcategory {
  public category_id: string;
  public id: number;
  public subcategory_name: string;
}

export const FITNESS_CATEGORY_ID = 9;
export const NUTRITION_CATEGORY_ID = 10;
export const WELLNESS_CATEGORY_ID = 13;
