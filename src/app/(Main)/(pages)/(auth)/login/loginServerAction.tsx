"use server";

import pool from "@/db/postgres";
import bcrypt from "bcryptjs";
import { createAccessToken } from "@/app/api/CreateAccessToken";
import { createRefreshToken } from "@/app/api/CreateRefreshToken";
import { hash } from "@/app/api/hash";
import { cookies } from "next/headers";
import { AccessToken } from "@/models/tokens";


const login = async (
  state: { error?: string },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Login attempt with email:", email);

  try {
    // Get user from database
    const userQuery = 'SELECT * FROM "users" WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return { error: "This user doesn't exist" };
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid email or password." };
    }

    // Generate tokens
    const accessToken = await createAccessToken({
      user_id: user.user_id,
      email: user.email,
      currency: user.currency,
      name: user.name,
      is_verified: user.is_verified,
      type: "access",
    } as AccessToken );

    const refreshToken = await createRefreshToken({
      user_id: user.user_id,
      type: "refresh",
    });

    // Store hashed refresh token in database and update last login
    await pool.query(
      `UPDATE users SET refresh_token = $1, last_login = NOW() WHERE user_id = $2`,
      [hash(refreshToken), user.user_id]
    );

    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set("AccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",

    });

    cookieStore.set("RefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",

    });

    console.log("Login successful", accessToken, refreshToken);
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed. Please try again." };
  }
};

export default login;
