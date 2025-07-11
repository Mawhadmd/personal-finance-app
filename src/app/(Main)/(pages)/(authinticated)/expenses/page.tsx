import Chart from "@/components/chart";
import currencies from "@/constants/currencies";
import { Expense } from "@/models";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import React from "react";

const Expenses = async () => {
  // Get user ID from token
  const token = (await cookies()).get("token")?.value;
  let user_id = null; // fallback

  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
      console.log("Token payload:", payload);
      user_id = payload.userId as number;
    } catch (error) {
      console.log("Token verification failed:", error);
    }
  }

  const spendingrequest = await fetch(
    `http://localhost:3000/api/expenses?user_id=${user_id}`,
    { method: "GET" }
  );
  const currency = await fetch(
    `http://localhost:3000/api/UserCurrency?user_id=${user_id}`,
    { method: "GET" }
  );
  const currencyjson = await currency.json();
  const currencySymbol = currencies.find(
    (c) => c.code === currencyjson.currency
  )?.symbol;
  const spendingjson = await spendingrequest.json();
  const spendingarr = spendingjson.expenses as Array<Expense>;
  const spending = spendingarr.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  console.log("Spending data:", spending);

  return (
    <>
      <div className="flex flex-col mt-2 h-full space-y-2">
        <h2 className="font-bold text-2xl">Your Expenses</h2>
        <div className="bg-foreground p-4 rounded-lg mb-4">
          <h2>Total Spent this month</h2>
          <p>
            {currencySymbol}
            {spending.toFixed(2)}
          </p>
        </div>
        {spendingarr.length > 0 ? (
          <Chart data={spendingarr} />
        ) : (
          <div className="text-muted text-3xl flex items-center justify-center flex-1">
            <p>No expenses recorded for this month.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Expenses;
