export type AccessToken = {
  user_id: string;
  email: string;
  name: string;
  is_verified: boolean; 
  currency: string;
  type: "access";
}
export type RefreshToken = {
  user_id: string;
  type: "refresh";
}