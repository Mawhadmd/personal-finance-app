import pool from "@/db/postgres";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id")!;
    await pool.query(
      'UPDATE "users" SET balance = (SELECT COALESCE(SUM(amount), 0) FROM "income" WHERE user_id = $1) - (SELECT COALESCE(SUM(amount), 0) FROM "expenses" WHERE user_id = $1) WHERE user_id = $1',
      [parseInt(user_id)]
    );
    const balance = await pool.query(
      'SELECT balance FROM "users" WHERE user_id = $1',
      [parseInt(user_id)]
    );
    if (balance.rows.length === 0) {
      return new NextResponse("User not found", { status: 404 });
    }
    return NextResponse.json(
      { message: "Balance updated successfully", ...balance.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating balance:", error);
    return new NextResponse("Failed to update balance", { status: 500 });
  }
}
