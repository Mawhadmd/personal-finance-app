// Income model based on seed.sql schema
export interface Income {
  income_id: number;
  user_id: number;
  amount: number;
  date: string;
  source?: string;
  description?: string;
}
