import Chart from "@/components/chart";
import currencies from "@/constants/currencies";
import { Expense } from "@/models";
import { jwtVerify } from "jose";
import { Download, Upload } from "lucide-react";
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
  // Calculate spending for this month, last month, and overall
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const spendingThisMonthUSD = spendingarr
    .filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  const spendingLastMonthUSD = spendingarr
    .filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  const spendingOverallUSD = spendingarr.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const spendingThisMonth =
    spendingThisMonthUSD * (currencyjson.exchangeRate || 1);
  const spendingLastMonth =
    spendingLastMonthUSD * (currencyjson.exchangeRate || 1);
  const spendingOverall = spendingOverallUSD * (currencyjson.exchangeRate || 1);

  return (
    <>
      <div className="flex flex-col mt-2 h-full ">
        <h2 className="font-bold text-2xl">Your Expenses</h2>
        <div className="flex   space-x-2 border-b border-border pb-2">
          <div className="w-1/3 bg-foreground p-2 rounded-lg">
            <p className="text-3xl font-bold m-1 mb-0 ">
              {currencySymbol}
              {spendingThisMonth.toFixed(2)}
            </p>
            <p className="text-muted  ml-1  ">This month</p>
          </div>
          <div className="w-1/3 bg-foreground p-2 rounded-lg">
            <p className="text-3xl font-bold m-1 mb-0 ">
              {currencySymbol}
              {spendingLastMonth.toFixed(2)}
            </p>
            <p className="text-muted ml-1  ">Last month</p>
          </div>
          <div className="w-1/3 bg-foreground p-2 rounded-lg">
            <p className="text-3xl font-bold m-1 mb-0 ">
              {currencySymbol}
              {spendingOverall.toFixed(2)}
            </p>
            <p className="text-muted ml-1">Overall </p>
          </div>
        </div>
        <div className="flex justify-between items-start flex-1">
          <div className="w-1/3 border-border border-b border-l p-2 py-4">
            <h3 className="border-b py-1 border-border my-2">
              Latest expenditures
            </h3>
            {spendingarr.length > 0 ? (
              spendingarr.slice(0, 3).map((expense) => (
                <div
                  className="bg-foreground p-2 rounded-lg mb-2"
                  key={expense.expense_id}
                >
                  <div className="flex items-center text-red-500 font-bold text-2xl">
                    {expense.amount}
                    <Upload size={18} className="inline ml-1" />{" "}
                  </div>

                  <p>{expense.description}</p>

                  <small className="text-muted">
                    {new Date(expense.date).toLocaleDateString(undefined, {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })}{" "}
                    | {expense.category} | {expense.method}
                  </small>
                </div>
              ))
            ) : (
              <h3 className="py-4 text-muted">
                You have no recent expenses recorded.
              </h3>
            )}
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg w-fit bg-foreground text-accent border border-border hover:border-white cursor-pointer transition-colors text-start">
              See All
            </button>
              <button className="p-2 rounded-lg w-fit bg-accent text-foreground border border-border hover:border-white cursor-pointer transition-colors text-start">
              Add
            </button>
            </div>
          </div>
          <div className="border-l border-border h-full w-2/3 flex justify-center items-center">
            {spendingarr.length > 0 ? (
              <Chart data={spendingarr} />
            ) : (
              <div className="text-muted text-3xl flex items-center justify-center flex-1">
                <p>No expenses recorded for this month.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Expenses;
