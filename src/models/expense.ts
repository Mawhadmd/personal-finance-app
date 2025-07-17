// Expense model based on seed.sql schema
export type Expense = {
  expense_id: number;
  user_id: number;
  amount: number;
  date: string;
  category?: string;
  description?: string;
  method?: string;
};
