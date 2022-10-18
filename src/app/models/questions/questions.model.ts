import { Memberships } from "../memberships/memberships.model";
import { Categories } from "../categories/categories.model";
import { Responses } from "./responses.model";

export class Questions {
  public id: number;
  public question: string;
  public description: string;
  public name: string;
  public icon: string;
  public type: string;
  public membership: Memberships = new Memberships;
  public category: Categories = new Categories;
  public responses: any[] = [];
}
