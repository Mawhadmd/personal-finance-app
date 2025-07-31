import pool from "@/db/postgres";
import PlaidClient from "@/hooks/usePlaidAPI";
import getUserId from "@/lib/helpers/getUserId";

import { decodeJwt, EncryptJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const user_id = await getUserId();
    const { public_token } = await request.json();
    if (!public_token) {
      return Response.json(
        { error: "Public Token Not Found" },
        { status: 400 }
      );
    }
    const client = await PlaidClient();
    const response = await client.itemPublicTokenExchange({
      public_token: public_token,
    });
    console.log(response.data.access_token);
    const encryptedJWE = await new EncryptJWT({
      accessToken: response.data.access_token,
    })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setIssuedAt()
      .encrypt(new TextEncoder().encode(process.env.ENCRYPTION_KEY!));

    pool.query("UPDATE users SET plaid_access_token = $1 WHERE user_id = $2", [
      encryptedJWE,
      user_id,
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
