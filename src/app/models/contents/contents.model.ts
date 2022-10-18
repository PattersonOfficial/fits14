import {Subcategory} from '../categories/categories.model';
import {Calories} from '../calories/calories.model';

export class Contents {
    category: any;
    id: number;
    category_id: number;
    client_id: number;
    title: string;
    duration: string;
    thumbnail: string;
    gender: string;
    recipe: string;
    valid_days: string;
    type: number;
    type_id: number;
    subcategory: Subcategory;
    category_food: number;
    subcategory_id: number;
    data: any[];
    video_path: any[];
    recipe_description: any[];
    recipe_nutrients: any[];
    meal_type_ids: number[];
    daily_calories: Calories[];
    tags: string;
    aws_url: string;
    description: string;
    created_at: string;
}

export const VIDEO_TYPE = 1;
export const ARTICLE_TYPE = 4;
