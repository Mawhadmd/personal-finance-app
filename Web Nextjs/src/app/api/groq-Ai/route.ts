import { askgroq } from "./groq";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/db/postgres";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  const name = searchParams.get("name");
  const income = searchParams.get("income");
  const expenses = searchParams.get("expenses");
  const currency = searchParams.get("currency");

  if (!user_id) {
    return NextResponse.json(
      { error: "Missing user_id parameter" },
      { status: 400 }
    );
  }

  try {
    // Check if we have recent AI evaluation (within last 24 hours)
    const lastApiEval = await pool.query(
      `SELECT latest_ai_eval, ai_eval FROM users WHERE user_id = $1`,
      [user_id]
    );
    console.log("Last API Eval:", lastApiEval.rows);

    if (lastApiEval.rows.length > 0) {
      const lastEval = lastApiEval.rows[0].latest_ai_eval;
      const existingEval = lastApiEval.rows[0].ai_eval;

      // If we have a recent evaluation, return it
      if (
        lastEval &&
        new Date(lastEval).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ) {
        return NextResponse.json(
          { ai_eval: existingEval, latest_ai_eval: lastEval },
          { status: 200 }
        );
      }
      console.log(expenses, income, name, currency);
      // If we have name, income, and expenses, generate new evaluation
      if (name && income && expenses) {
        const prompt = `The user with name ${name} has an income of ${currency}${income} and expenses of ${currency}${expenses} this month. What advice can you give them? please make the text as short at possible, and make sure to include the currency symbol in the response. please make sure to include the currency symbol in the response. and take a close look at . or , in the price`;

        const response = await askgroq(prompt);

        // Update the database with new evaluation
        await pool.query(
          `UPDATE users SET ai_eval = $1, latest_ai_eval = $2 WHERE user_id = $3`,
          [response, new Date(), user_id]
        );

        return NextResponse.json(
          {
            ai_eval: response,
            latest_ai_eval: new Date(),
          },
          { status: 201 }
        );
      }

      // If no recent evaluation and missing parameters for new one, return existing eval
      return NextResponse.json(
        { ai_eval: existingEval, latest_ai_eval: lastEval },
        { status: 200 }
      );
    }

    // No user found
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Error processing AI evaluation:", error);
    return NextResponse.json(
      { error: "Failed to process AI evaluation" },
      { status: 500 }
    );
  }
}
