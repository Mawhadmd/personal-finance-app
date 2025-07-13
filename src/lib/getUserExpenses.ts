import { Expense } from "@/models";
import { cookies } from "next/headers";

export default async function GetUserExpenses(
  user_id: number | null
): Promise<Array<Expense>> {
  const spendingrequest = await fetch(
    `http://localhost:3000/api/expenses?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  const spendingjson = await spendingrequest.json();
  return spendingjson.expenses as Array<Expense>;
}
