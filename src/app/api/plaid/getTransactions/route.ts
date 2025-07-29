import pool from "@/db/postgres";
import { decodeJwt, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TransactionsGetRequest } from "plaid";
import PlaidClient from "@/hooks/usePlaidClient";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function POST() {
  try {
    const access_token = (await cookies()).get("AccessToken")?.value;

    // access token is assured by the middleware
    const { user_id } = decodeJwt(access_token!);

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

    const plaid_access_token_decrypt = await jwtDecrypt(encrypt_plaid_access_token, new TextEncoder().encode(process.env.ENCRYPTION_KEY!));
    const plaid_access_token = await (plaid_access_token_decrypt).payload.accessToken as string;
    const stateDate =  formatDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30));
    const endDate = formatDate(new Date(Date.now()));
    const request: TransactionsGetRequest = {
      access_token: plaid_access_token,
      end_date: endDate,
      start_date: stateDate,
    };

    const client =await PlaidClient();
    const transactions = await client.transactionsGet(request);
    
    return NextResponse.json(transactions.data, { status: 200 });
  } catch (err) {
    console.log("Something bad happened");
    console.log(err);
    return NextResponse.json(
      { error: "Failed to fetch transactions"  },
      { status: 500 }
    );
  }
}
