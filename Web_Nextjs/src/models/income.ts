// Income model based on seed.sql schema
export type Income = {
  income_id: number | string; // Use string for Plaid transaction IDs
  user_id: number | null;
  amount: number;
  date: string;
  meta_data?: { // only in plaid
    merchant_name: string;
    merchant_logo: string;
  };
  category?: string;
  method?: string;
  description?: string;
};
