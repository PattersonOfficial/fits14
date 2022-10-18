import { User } from "../user/user.model";

export class Feed {
  public id: string;
  public uid: string;
  public public: boolean;
  public user: User;
  public content: string;
  public created_at: string;
  public last_update: string;
  public type: string;
  public source: string;
  public post_id: string;
}

export interface Post {
  id: string;
  uid: string;
  public: boolean;
  content: string;
  created_at: string;
  last_update: string;
  type: string;
  source: string;
}
