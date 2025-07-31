import AddtransactionModal from "@/app/(Main)/(pages)/(authinticated)/components/AddTransactionsModal/AddTransactionsModal";
import Chart from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/components/OneLinechart";
import TransactionCard from "@/app/(Main)/(pages)/(authinticated)/components/TransactionCard";
import currencies from "@/constants/currencies";
import ConvertCurrency from "@/lib/utils/ConvertCurrency";

import getUserExpenses from "@/lib/helpers/getUserExpenses";
import GetUserId from "@/lib/helpers/getUserId";
import { User } from "@/models";

import { CircleOff } from "lucide-react";
import { cookies } from "next/headers";

import React from "react";
import AmountCard from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/components/AmountCard";
import { notFound } from "next/navigation";

const Expenses = async () => {
  const user_id = await GetUserId();

  const currency = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/User?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  if (!currency.ok) {
    console.error("Failed to fetch user currency:", await currency.text());

    notFound();
  }
  const currencyjson: User = await currency.json();
  const currencySymbol = currencies.find(
    (c) => c.code === currencyjson.currency
  )?.symbol;

  const spendingarr = (await getUserExpenses(user_id)).map((expense) => {
    const amount = ConvertCurrency({
      amount: expense.amount,
      toCurrency: currencyjson.currency,
    });
    return { ...expense, amount };
  });
  // Calculate spending for this month, last month, and overall
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const spendingThisMonth = spendingarr
    .filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  const spendingLastMonth = spendingarr
    .filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  const spendingOverall = spendingarr.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  return (
    <>
      <div className="flex flex-col mt-2 h-full ">
        <h2 className="font-bold text-2xl">Your Expenses</h2>
        <div className="flex   space-x-2  pb-2">
          <AmountCard
            amount={spendingThisMonth}
            label="This month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={spendingLastMonth}
            label="Last month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={spendingOverall}
            label="Overall"
            currencySymbol={currencySymbol}
          />
        </div>
        <div className="flex justify-between gap-2 items-start flex-1">
          <div className="shadow-custom w-1/3 bg-foreground rounded-xl p-2 py-4 flex flex-col h-full">
            <h3 className="border-b py-1 border-border my-2">Latest</h3>
            {spendingarr.length > 0 ? (
              spendingarr
                .slice(0, 3)
                .map((expense) => (
                  <TransactionCard
                    key={expense.expense_id}
                    transaction={expense}
                    type="expense"
                    currencySymbol={currencySymbol}
                  />
                ))
            ) : (
              <div className="py-4 flex-1 text-muted flex flex-col items-center justify-center ">
                <CircleOff className="w-1/3 h-fit text-red-500" />{" "}
                <h3 className="text-center">
                  You have no recent expenses recorded.
                </h3>
              </div>
            )}
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg w-fit bg-foreground text-accent border border-border hover:border-white cursor-pointer transition-colors text-start">
                See All
              </button>
              <AddtransactionModal type="expense" />
            </div>
          </div>
          <div className="shadow-custom  h-full bg-foreground rounded-xl  w-2/3 flex justify-center items-center">
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
