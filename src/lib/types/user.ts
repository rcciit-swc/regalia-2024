import { User } from "@supabase/supabase-js";

export interface IUser extends User {
  phone: string;
  name: string;
  college:string;
  college_roll:string;
  email: string;
  gender: string;
  id: string;
  referral_code: string;
  swc: boolean;
}