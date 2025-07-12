import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export default async function GetUserId() {
    // Get user ID from token
  const token = (await cookies()).get("token")?.value;
  let user_id = null; // fallback

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
      console.log("Token payload:", payload);
      user_id = payload.userId as number;
    } catch (error) {
      console.log("Token verification failed:", error);
    }
  }
  return user_id;
}