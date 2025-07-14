import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/postgres";
import bcrypt from "bcryptjs";

import zod, { ZodError } from "zod";
import { SignJWT } from "jose";


interface RegisterResponse {
  success: boolean;
  error?: string;
  token?: string;
}
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

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, Currency } = await request.json();

    // Validation schema

    try {
      validator.parse({ name, email, password, Currency });
    } catch (error: unknown) {
      const zoderror = error as ZodError;

      return NextResponse.json(
        {
          error: zoderror.issues[0].message,
          success: false,
        } as RegisterResponse,
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserQuery = 'SELECT user_id FROM "User" WHERE email = $1';
    const existingUser = await pool.query(existingUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          error: "User with this email already exists.",
          success: false,
        } as RegisterResponse,
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertUserQuery = `
      INSERT INTO "User" (name, email, password, Currency) 
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
      return NextResponse.json(
        {
          error: "Failed to create User.",
          success: false,
        } as RegisterResponse,
        { status: 500 }
      );
    }

    const user = newUser.rows[0];

    // Generate JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
        user_id: user.user_id,
        email: user.email,
        is_verified: user.is_verified,
        name: user.name,
        type: "access",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(secret);



    const response: RegisterResponse = {
      success: true,
      token: token,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error.",
        success: false,
      } as RegisterResponse,
      { status: 500 }
    );
  }
}
