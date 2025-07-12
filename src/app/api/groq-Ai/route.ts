import { redirect } from "next/navigation";
import { askgroq } from "./groq";
import { NextRequest, NextResponse } from "next/server";

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
