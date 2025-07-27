import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";
const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
      "PLAID-SECRET": process.env.PLAID_SECRET!,
    },
  },
});
export async function GET(request: Request) {
  try {
    const id = decodeJwt((await cookies()).get("AccessToken")?.value!).user_id;
    const client = new PlaidApi(config);
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
