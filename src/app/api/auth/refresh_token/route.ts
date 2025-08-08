import pool from "@/db/postgres";
import { User } from "@/models";
import { AccessToken } from "@/models/tokens";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { createAccessToken } from "../../CreateAccessToken";

import { createRefreshToken } from "../../CreateRefreshToken";
import { hash } from "../../hash";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
  try {
    const { user_id, refresh_token } = await request.json();

    if (!user_id || !refresh_token) {
      return NextResponse.json(
        { error: "Missing user_id or refresh_token" },
        { status: 400 }
      );
    }

    // Get user from database
    const user: User = (
      await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id])
    ).rows[0];

    if (!user || !user.refresh_token) {
      return NextResponse.json(
        { error: "User not found or no refresh token" },
        { status: 401 }
      );
    }
    try {
      // Verify the refresh token is still valid (not expired)
      await jwtVerify(
        refresh_token,
        new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!)
      );
    } catch {
      return NextResponse.json(
        { error: "Refresh token expired or invalid" },
        { status: 401 }
      );
    }

    console.log("Stored token hash:", user.refresh_token, refresh_token);
    if (!bcrypt.compareSync(refresh_token, user.refresh_token)) {
      return NextResponse.json(
        { error: "Refresh token mismatch" },
        { status: 401 }
      );
    }

    // Create new access token
    const accessTokenPayload: AccessToken = {
      user_id: user_id,
      email: user.email,
      name: user.name,
      is_verified: user.is_verified,
      type: "access",
      currency: user.currency,
 
    };

    const newAccessToken = await createAccessToken(accessTokenPayload);
    const refreshToken = await createRefreshToken({
      user_id: user_id,
      type: "refresh",
    });
    await pool.query(`UPDATE users SET refresh_token = $1 WHERE user_id = $2`, [
      hash(refreshToken),
      user_id,
    ]);
    return NextResponse.json(
      {
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Invalid/Unreachable refresh token" },
      { status: 401 }
    );
  }
}
