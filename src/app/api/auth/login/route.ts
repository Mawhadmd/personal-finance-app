import { Request } from "./../../../../../node_modules/groq-sdk/_shims/index.d";
import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/models/login";
import zod from "zod";
import pool from "@/db/postgres";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const validator = zod.object({
  email: zod.email(),
  password: zod.string().min(6),
});
export async function POST(Request: NextRequest) {
  const connection = await pool.connect();
  const { email, password } = await Request.json();

  try {
    validator.parse({ email, password });
    const res = await connection.query(
      'SELECT * FROM "User" WHERE email = $1',
      [email]
    );
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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      userId: user.user_id,
      email: user.email,
      name: user.name,
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
        error: "Invalid email or password format.",
        success: false,
        token: "",
      } as LoginResponse,
      { status: 400 }
    );
  } finally {
    connection.release();
  }
}
