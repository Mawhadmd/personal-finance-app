import { AccessToken } from "@/models/tokens";
import { SignJWT } from "jose";

export async function createAccessToken(
  payload: AccessToken
) {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

  const accessToken = await new SignJWT(payload)

    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_TIMEOUT!)
    .sign(secret);
  return accessToken;
}
