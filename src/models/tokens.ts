interface AccessToken {
  user_id: string;
  email: string;
  name: string;
  is_verified: boolean; 
  type: "access";
}