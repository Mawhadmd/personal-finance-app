import pool from "@/db/postgres";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { createAccessToken } from "../../CreateAccessToken";
import { AccessToken } from "@/models/tokens";

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  if (!code) {
    return new Response(
      JSON.stringify({ error: "Verification code is required" }),
      { status: 400 }
    );
  }
  const { payload } = await jwtVerify(
    request.cookies.get("AccessToken")?.value as string,
    new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!)
  );
  const realcode = await pool.query(
    `SELECT code FROM verification_codes WHERE email = $1 AND expires_at > NOW()`,
    [payload.email]
  );
  console.log("Real code from DB:", realcode.rows[0]);
  if (realcode.rows[0].code == code) {
    try {
      pool.query(`UPDATE "users" SET is_verified = true WHERE email = $1`, [
        payload.email,
      ]);
      const update = await createAccessToken({ is_verified: true, ...payload } as AccessToken)
      // const update = await new SignJWT({ is_verified: true, ...payload })
      //   .setProtectedHeader({ alg: "HS256" })
      //   .setIssuedAt()
      //   .setExpirationTime(process.env.ACCESS_TOKEN_TIMEOUT!)
      //   .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!));

      return NextResponse.json(
        {
          success: true,
          message: "Email verified successfully.",
          token: update,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error verifying email:", error);
      return NextResponse.json(
        { error: "Failed to verify email. Please try again later." },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(
    { error: "Invalid verification code." },
    { status: 400 }
  );
}
