// User model based on seed.sql schema
export interface User {
  user_id: number;
  email: string;
  password: string;
  name: string;
  balance: number;
  currency: string;
  field?: string;
}
