import pool from "@/db/postgres";
import { jwtDecrypt } from "jose";

import { NextResponse } from "next/server";
import { TransactionsGetRequest } from "plaid";
import PlaidClient from "@/hooks/usePlaidAPI";
import getUserId from "@/lib/utils/getUserId";

function formatDate(date: Date): string {
  return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function POST(request: Request) {
  try {
    // access token is assured by the middleware
    let { startDate, endDate } = await request.json();
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }
    startDate = formatDate(startDate);
    endDate = formatDate(endDate);
    const user_id = await getUserId();
    if (!user_id) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }
    const encrypt_plaid_access_token_req = await pool.query(
      "select plaid_access_token from users where user_id = $1",
      [user_id]
    );

    const encrypt_plaid_access_token =
      encrypt_plaid_access_token_req.rows[0].plaid_access_token;
    if (!encrypt_plaid_access_token) {
      return NextResponse.json(
        { error: "Plaid Access token is missing" },
        { status: 401 }
      );
    }

    const plaid_access_token_decrypt = await jwtDecrypt(
      encrypt_plaid_access_token,
      new TextEncoder().encode(process.env.ENCRYPTION_KEY!)
    );
    const plaid_access_token = (await plaid_access_token_decrypt.payload
      .accessToken) as string;

    const requestTransactions: TransactionsGetRequest = {
      access_token: plaid_access_token,
      end_date: endDate,
      start_date: startDate,
    };

    const client = await PlaidClient();
    const transactions = await client.transactionsGet(requestTransactions);

    return NextResponse.json(transactions.data, { status: 200 });
  } catch (err) {
    console.log("Something bad happened");
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
