// User model based on seed.sql schema
export interface User {
  user_id: number;
  email: string;
  password: string;
  name: string;
  balance: number;
  currency: string;
  field?: string;
  refresh_token?: string;
  last_login: string;
  is_verified: boolean;
  created_at: string;
  verification_code?: string;
}
