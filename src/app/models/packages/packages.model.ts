import {Step} from './step.model';
import {Types} from '../types/types.model';

export class Packages {
    type_id: number;
    plan_id: number;
    items: Step[];
    item: Step = new Step;
    type: Types;
}
