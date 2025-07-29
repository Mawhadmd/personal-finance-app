import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import {Products, CountryCode } from "plaid";
import PlaidClient from "@/hooks/usePlaidClient";
export async function GET(request: Request) {
  try {
    const id = decodeJwt((await cookies()).get("AccessToken")?.value!).user_id;
    const client = await PlaidClient();
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: `user-id-${id}`,
      },
      client_name: "Pfinance",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });
    return  Response.json(
        {
            link_token: response.data.link_token,
        },
        { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
