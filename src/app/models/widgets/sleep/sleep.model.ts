import { User } from "../../user/user.model";

export class SleepWidget {
  public id: number;
  public created_at: string;
  public updated_at: string;
  public hours: number;
  public user: User;
}

export class ReportSleepWidget {
  public name: string;
  public series: SleepWidget[] | any[];
}
