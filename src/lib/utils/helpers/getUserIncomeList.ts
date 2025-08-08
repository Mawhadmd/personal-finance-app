import { Income } from "@/models";
import { cookies } from "next/headers";

export default async function GetUserIncomeList(
): Promise<Array<Income>> {
  const incomerequest = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/income`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  if (!incomerequest.ok) {
    console.error("Failed to fetch user income:", await incomerequest.text());
    return [];
  }
  const incomejson = await incomerequest.json();
  return (incomejson.income as Array<Income>) || [];
}
