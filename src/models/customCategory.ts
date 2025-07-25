// Custom Category model based on seed.sql schema
export type CustomCategory = {
  id: number;
  user_id: number;
  name: string;
  type: "income" | "expense";
  created_at: string;
};
