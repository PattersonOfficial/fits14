import { Contents } from "../contents/contents.model";
import { Types } from "../types/types.model";
import { Plan } from "../plan/plan.model";

export class Step {
  public id: number;
  public step: number;
  public parent: number;
  public required: number;
  public duration: number;
  public extra: string;
  public $$expanded: boolean;
  public plan: Plan = new Plan();
  public content: Contents = new Contents();
  public type: Types = new Types();
  public children: Step[];
  public progress?;
  self: any;
  // self: { 'plan_id': any; 'plan_name': any; 'plan_content': any[]; 'category_id':number; 'validdays':number };
  
}
