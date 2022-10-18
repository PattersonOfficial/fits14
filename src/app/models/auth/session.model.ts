import { User } from '../user/user.model';
export class Session {
  public token: string;
  public date_time: string;
  public expire: number;
  public user: User;
}
