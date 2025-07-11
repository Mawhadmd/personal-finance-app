import { redirect } from 'next/navigation';
import { askgroq } from "./groq";
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
const spending = request.nextUrl.searchParams.get("spending");
const response = await askgroq("The user spends " + spending + " this month. What advice can you give them?");
  return NextResponse.json({
    message: response,});
}