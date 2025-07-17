// Verification Codes model based on seed.sql schema
export type VerificationCode = {
  id: number;
  user_id: number;
  code: string;
  expires_at: string;
  created_at: string;
  email: string;
};
