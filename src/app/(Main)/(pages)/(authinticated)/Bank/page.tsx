import React from "react";

import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ConnectBank from "./ConnectBank";
import BankConnected from "./BankConnected";

export default async function page() {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/check`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
    }
  );

  const reqJSON = await req.json();

  if (reqJSON.linked === false) {
    return ConnectBank();
  }

  if (!req.ok) {
    console.error("Failed to check bank link status:", reqJSON.error);
    return notFound();
  }

  const datareq = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/getTransactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
    }
  );

  const data = await datareq.json();

  if (!datareq.ok) {
    console.error("Failed to fetch transactions:", data.error);
    return notFound();
  }

  return <BankConnected data={data} />;
}
