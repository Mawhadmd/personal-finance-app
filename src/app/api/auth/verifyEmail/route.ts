import pool from "@/db/postgres";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );
  const realcode = await pool.query(
    `SELECT code FROM verification_codes WHERE email = $1 AND expires_at > NOW()`,
    [payload.email]
  );
  console.log("Real code from DB:", realcode.rows[0]);
  if (realcode.rows[0].code == code) {
    try{
        pool.query(`UPDATE "User" SET is_verified = true WHERE email = $1`, [
      payload.email,
    ]);

    const update = await new SignJWT({ is_verified: true, ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
    (await cookies()).set("AccessToken",update, {
        path: "/",
        maxAge: parseInt(process.env.AccessTokenTimeout!), 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax", 
      });

    return NextResponse.json(
      { success: true, message: "Email verified successfully." },
      { status: 200 }
    )

    }catch (error) {
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
