import { redirect } from "next/navigation";
import { askgroq } from "./groq";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/postgres";

export async function POST(request: NextRequest) {
  const { name, income, expenses } = await request.json();

  if (!name || !income || !expenses) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const prompt = `The user with name ${name} has an income of ${JSON.stringify(income)} and expenses of ${JSON.stringify(expenses)} this month. What advice can you give them? please make the text as short at possible, and make sure to include the currency symbol in the response.`;
  const response = await askgroq(prompt);
  return NextResponse.json({
    response: response,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  try{
    const res = await pool.query(
    `SELECT * FROM "users" WHERE user_id = $1`,
    [user_id])
      return NextResponse.json({
        ...res.rows[0].ai_eval
      }, { status: 200 });
  }catch (error) {
    console.error("Error fetching AI evaluation:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI evaluation" },
      { status: 500 }
    );
  }

}