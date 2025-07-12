import { Income } from "@/models";

export default async function GetUserIncome(user_id: number | null): Promise<Array<Income>> {
     const incomerequest = await fetch(
    `http://localhost:3000/api/income?user_id=${user_id}`,
    { method: "GET" }
  );
  const incomejson = await incomerequest.json();
return incomejson.income as Array<Income>;
}