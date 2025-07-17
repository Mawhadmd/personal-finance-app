"use server";

import pool from "@/db/postgres";
import bcrypt from "bcryptjs";
import zod, { ZodError } from "zod";
import { createAccessToken } from "@/app/api/CreateAccessToken";
import { createRefreshToken } from "@/app/api/CreateRefreshToken";
import { hash } from "@/app/api/hash";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const validator = zod.object({
  Currency: zod
    .string()
    .min(3, "Currency must be at least 3 characters")
    .max(3, "Currency must be exactly 3 characters"),
  name: zod
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: zod.email("Invalid email format"),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

const register = async (
  formData: FormData
): Promise<{ error?: string; success?: boolean }> => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const Currency = formData.get("Currency") as string;

  try {
    // Validation
    try {
      validator.parse({ name, email, password, Currency });
    } catch (error: unknown) {
      const zoderror = error as ZodError;
      return { error: zoderror.issues[0].message };
    }

    // Check if user already exists
    const existingUserQuery = 'SELECT user_id FROM "users" WHERE email = $1';
    const existingUser = await pool.query(existingUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return { error: "User with this email already exists." };
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertUserQuery = `
      INSERT INTO "users" (name, email, password, currency) 
      VALUES ($1, $2, $3, $4) 
      RETURNING user_id, name, email, is_verified
    `;

    const newUser = await pool.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      Currency,
    ]);

    if (newUser.rows.length === 0) {
      return { error: "Failed to create User." };
    }

    const user = newUser.rows[0];

    // Generate tokens
    const accessToken = await createAccessToken({
      user_id: user.user_id,
      email: user.email,
      is_verified: user.is_verified,
      name: user.name,
      type: "access",
    });
    
    const refreshToken = await createRefreshToken({
      user_id: user.user_id,
      type: "refresh",
    });

    // Store hashed refresh token in database
    await pool.query(`UPDATE users SET refresh_token = $1 WHERE user_id = $2`, [
      hash(refreshToken),
      user.user_id,
    ]);

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

    console.log("Registration successful");
    return { success: true };
    
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Network error. Please try again." };
  }
};

export default register;
