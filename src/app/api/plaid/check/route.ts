import pool from "@/db/postgres";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessToken = ( await cookies()).get("AccessToken")?.value;

    const { user_id } = decodeJwt(accessToken!);
    const dbQuery = await pool.query(
      "SELECT plaid_access_token FROM users WHERE user_id = $1",
      [user_id]
    );


    if (!dbQuery.rows[0]?.plaid_access_token) {
      return NextResponse.json(
        { linked: false },
        {
          status: 404,
        }
        );
    }

    
      return NextResponse.json(
        { linked: true },
        {
          status: 200,
        }
      );
  } catch (error) {
    console.error("Error checking bank link status:", error);
    return NextResponse.json({ linked: false }, {
      status: 500,
    });
  }
}
