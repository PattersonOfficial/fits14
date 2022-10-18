import { Childs } from './childs.model';
import { Role } from './roles.model';
import { Client } from './client.model';
import { Image } from '../images/image.model';
import { Note } from './note.model';

export class User {
  public id: string;
  public role_id: number;
  public socket: string;
  public firestore_uid: string;
  public name: string;
  public last_name: string;
  public bio: string;
  public email: string;
  public profile_image: Image;
  public cover_image: Image;
  public code_dialling: number;
  public phone: string;
  public country: string;
  public city: string;
  public zip: string;
  public date_birth: string;
  public gender: string;
  public status: UserStatus;
  public age: number;
  public password: string;
  public timezone: string;
  public timezone_by_country: string;
  public rol: Role = new Role();
  public client: Client = new Client();
  public childs: Childs[];
  public smoke: number;
  public alcohol: number;
  public terms: boolean;
  public source: any;
  public last_tp: string;
  public is_payment_success: boolean;
  public manager: any;
  public manager_id: number;
  public local_time: string;
  public last_login_at: string;
  public is_active: boolean;
  public is_social_account: number;
  public status_id: number;
  public subscription_ends_at: string;
  public is_subscription_active: boolean;
  public notes: Note[];
  public address: string;
  public additional_email: string;
  public account_company: string;
  public is_agree_to_terms: boolean;
  public is_agree_to_emails: boolean;
  public dont_call_again: boolean;
  public opt_datetime: string;
  public dont_call_again_datetime: string;
  public created_at: string;
}

export class UserGeneralInfo {
  name: string;
  last_name: string;
  gender: string;
  date_birth: string;
  email: string;
  code_dialling: number;
  phone: string;
  country: string;
  city: string;
  zip: string;
  smoke: string;
  alcohol: string;
  bio: string;
}

export class UserBasicInfo {
  height = '';
  weight = '';
}

export class PassData {
  user_id: any;
  currentPassword = '';
  password = '';
  password_confirmation = '';
}

export class UserStatus {
  public id: number;
  public name: string;
}
