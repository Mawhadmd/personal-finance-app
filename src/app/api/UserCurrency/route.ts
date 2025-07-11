import pool from "@/db/postgres";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return new Response("User ID is required", { status: 400 });
  }
  try {
    const res = await pool.query(
      'SELECT currency FROM "User" WHERE user_id = $1',
      [user_id]
    );
    if (res.rows.length === 0) {
      return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify({ currency: res.rows[0].currency }), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch user currency", { status: 500 });
  }
}
