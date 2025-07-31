import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { Products, CountryCode } from "plaid";
import PlaidClient from "@/hooks/usePlaidAPI";
import getUserId from "@/lib/helpers/getUserId";
export async function GET() {
  try {
    const user_id = await getUserId();
    const client = await PlaidClient();
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: `user-id-${user_id}`,
      },
      client_name: "Pfinance",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });
    return Response.json(
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
