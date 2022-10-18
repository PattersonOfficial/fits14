import { User } from "../../user/user.model";

export class CigarsWidget {
  public id: number;
  public created_at: string;
  public updated_at: string;
  public cigars: number;
  public user: User;
}
