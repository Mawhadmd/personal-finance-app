import { Income } from "@/models";
import { cookies } from "next/headers";

export default async function GetUserIncome(
  user_id: number | null
): Promise<Array<Income>> {
  const incomerequest = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/income?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  const incomejson = await incomerequest.json();
  return (incomejson.income as Array<Income>) || [];
}
