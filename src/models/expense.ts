// Expense model based on seed.sql schema
export type Expense = {
  expense_id: number | string; // Use string for Plaid transaction IDs
  user_id: number;
  amount: number;
  date: string ;
  category?: string;
  method?: string;
  description?: string;
};
