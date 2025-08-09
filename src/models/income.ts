// Income model based on seed.sql schema
export type Income = {
  income_id: number | string; // Use string for Plaid transaction IDs
  user_id: number | null;
  amount: number;
  date: string ;
  category?: string;
  method?: string;
  description?: string;
};
