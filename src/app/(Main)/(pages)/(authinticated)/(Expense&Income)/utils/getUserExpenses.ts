import { Expense } from "@/models";
import { cookies } from "next/headers";

export default async function GetUserExpenses(
  user_id: number | null
): Promise<Array<Expense>> {
  const spendingrequest = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
    if (!spendingrequest.ok) {
    console.error("Failed to fetch user income:", await spendingrequest.text());
    return [];
  }
  const spendingjson = await spendingrequest.json();
  return (spendingjson.expenses as Array<Expense>) || [];
}
