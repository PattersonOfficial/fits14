import { User } from "../../user/user.model";

export class WaterWidget {
  public id: number;
  public created_at: string;
  public updated_at: string;
  public ml: number;
  public oz: number;
  public user: User;
}

export class ReportWaterWidget {
  public name: string;
  public series: WaterWidget[] | any[];
}
