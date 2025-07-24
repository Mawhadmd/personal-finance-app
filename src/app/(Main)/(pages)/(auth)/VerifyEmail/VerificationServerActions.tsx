"use server";

import { createAccessToken } from "@/app/api/CreateAccessToken";
import pool from "@/db/postgres";
import { AccessToken } from "@/models/tokens";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


async function sendEmail(): Promise<{ success?: boolean; error?: string }> {
  const Cookies = await cookies();
  if (Cookies.get("AccessToken") === undefined) {
    return { error: "You must be logged in to send a verification email." };
  }
  const requestverifcationreq = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/SendVerificationEmail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${Cookies.toString()}`,
      },
    }
  );

  const requestverifcation = await requestverifcationreq.json();
  if (!requestverifcationreq.ok) {
    return {
      error: requestverifcation.error || "Failed to send verification email",
    };
  }
  return { success: requestverifcation.success };
}



async function verify(
  state: { success?: boolean; error?: string },
  formdata: FormData
): Promise<{ success?: boolean; error?: string }> {
  "use server";
  const code = formdata.get("code")?.toString();
  if (!code) {
    return { error: "Verification code is required" };
  }
  if (code.length !== 6) {
    return { error: "Verification code must be 6 characters long" };
  }
  console.log("Verification code received:", code);

  const cookieStore = await cookies();
  const token = cookieStore.get("AccessToken")?.value;
  if (!token) {
    return { error: "No access token found" };
  }

  try {
    // 1) Verify JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!)
    );

    // 2) Check code in DB
    const { rows } = await pool.query(
      `SELECT code FROM verification_codes WHERE email = $1 AND expires_at > NOW()`,
      [payload.email]
    );
    if (!rows[0] || rows[0].code !== code) {
      return { error: "Invalid or expired verification code" };
    }

    // 3) Mark user as verified
    await pool.query(
      `UPDATE "users" SET is_verified = true WHERE email = $1`,
      [payload.email]
    );

    // 4) Issue new token & set cookie
    const newToken = await createAccessToken({
      ...payload,
      is_verified: true,
      type: "access",
    } as AccessToken);
    console.log('token:', newToken)
    cookieStore.delete("AccessToken");
    cookieStore.set({
      name: "AccessToken",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
 

    console.log("Email verified, redirecting…");

    return {success: true};
  } catch (err) {
    console.error("Verification failed:", err);
    return { error: "Failed to verify email. Please try again." };
  }
}

export { sendEmail, verify };
