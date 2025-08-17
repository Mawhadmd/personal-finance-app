import { cookies } from "next/headers";
import { notFound } from "next/navigation";

 const fetchPlaidAccounts = async () => {
  const datareq = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/getTransactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      body: JSON.stringify({
        startDate: Date.now(),
        endDate: Date.now(),
      }),
    }
  );

  const data = await datareq.json();

  if (!datareq.ok) {
    console.error("Failed to fetch transactions:", data.error);
    return notFound();
  }
  return data.accounts;
};
export default fetchPlaidAccounts;