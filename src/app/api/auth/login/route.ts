import { Request } from "./../../../../../node_modules/groq-sdk/_shims/index.d";
import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/models/login";
import zod, { jwt } from "zod";
import pool from "@/db/postgres";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const validator = zod.object({
  email: zod.email(),
  password: zod.string().min(6),
});
export async function POST(Request: NextRequest) {
  const { email, password } = await Request.json();
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  try {
    const res = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    try {
      validator.parse({ email, password });
    
    } catch (error) {
      return NextResponse.json(
        {
          error: "Email or password is invalid",
          success: false,
          token: "",
        } as LoginResponse,
        { status: 400 }
      );
    }
    if (res.rows.length === 0) {
      return NextResponse.json(
        {
          error: "User or password is incorrect",
          success: false,
          token: "",
        } as LoginResponse,
        { status: 401 }
      );
    }
    const user = res.rows[0];
    // Use bcrypt to compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        {
          error: "Invalid password",
          success: false,
          token: "",
        } as LoginResponse,
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      is_verified: user.is_verified,
      type: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);
    return NextResponse.json(
      {
        success: true,
        token: token,
      } as LoginResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "Error during login. Please try again.",
        success: false,
        token: "",
      } as LoginResponse,
      { status: 500 }
    );
  }
}
