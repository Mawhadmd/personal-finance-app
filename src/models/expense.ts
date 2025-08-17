// Expense model based on seed.sql schema
export type Expense = {
  expense_id: number | string; // Use string for Plaid transaction IDs
  user_id: number | null;
  amount: number;
  meta_data?: { // only in plaid
    merchant_name: string;
    merchant_logo: string;
  };
  date: string;
  category?: string;
  method?: string;
  description?: string;
};
