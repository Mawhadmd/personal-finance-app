// Income model based on seed.sql schema
export type Income = {
  income_id: number;
  user_id: number;
  amount: number;
  date: string;
  category?: string;
  method?: string;
  description?: string;
};
