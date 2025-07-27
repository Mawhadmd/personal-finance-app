import pool from "@/db/postgres";
import { decodeJwt, EncryptJWT } from "jose";
import { cookies } from "next/headers";
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
} from "plaid";
const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
      "PLAID-SECRET": process.env.PLAID_SECRET!,
    },
  },
});
export async function POST(request: Request) {
  try {
    const userId = decodeJwt((await cookies()).get("AccessToken")?.value!).user_id;
    const { public_token } = await request.json();
    if (!public_token) {
      return Response.json(
        { error: "Public Token Not Found" },
        { status: 400 }
      );
    }
    const client = new PlaidApi(config);
    const response = await client.itemPublicTokenExchange({
      public_token: public_token,
    });
    console.log(response.data.access_token);
    const encryptedJWE = await new EncryptJWT({accessToken: response.data.access_token})
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
    .encrypt(new TextEncoder().encode(process.env.ENCRYPTION_KEY!));
        
    pool.query("UPDATE users SET plaid_access_token = $1 WHERE user_id = $2", [
      encryptedJWE,
      userId,
    ]);
    return Response.json(
      {
        success: true,
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
