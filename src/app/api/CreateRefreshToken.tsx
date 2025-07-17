import { RefreshToken } from "@/models/tokens";
import { SignJWT } from "jose";

export async function createRefreshToken(payload: RefreshToken) {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);
 
    const refreshToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()  
        .setExpirationTime(process.env.REFRESH_TOKEN_TIMEOUT!)
        .sign(secret);
    return refreshToken;}