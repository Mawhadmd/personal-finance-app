'use server'
import { Configuration, PlaidEnvironments, PlaidApi } from "plaid";

export default async function PlaidClient () {
  const config = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
        "PLAID-SECRET": process.env.PLAID_SECRET!,
      },
    },
  });
  return new PlaidApi(config)
}