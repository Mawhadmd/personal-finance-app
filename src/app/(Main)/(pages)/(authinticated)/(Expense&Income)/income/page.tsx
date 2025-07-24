import AddtransactionModal from "@/app/(Main)/(pages)/(authinticated)/components/AddTransactionsModal/AddTransactionsModal";
import Chart from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/components/OneLinechart";
import TransactionCard from "@/app/(Main)/(pages)/(authinticated)/components/TransactionCard";
import currencies from "@/constants/currencies";
import ConvertCurrency from "@/lib/ConvertCurrency";
import GetUserId from "@/lib/getUserId";
import GetUserIncome from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/utils/getUserIncome";
import { User } from "@/models";
import { CircleOff } from "lucide-react";
import { cookies } from "next/headers";
import React from "react";
import AmountCard from "../components/AmountCard";
import { notFound } from "next/navigation";

const Income = async () => {
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

  const incomearr = (await GetUserIncome(user_id)).map((income) => {
    const amount = ConvertCurrency({
      amount: income.amount,
      toCurrency: currencyjson.currency,
    });
    return { ...income, amount };
  });

  // Calculate income for this month, last month, and overall
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const incomeThisMonth = incomearr
    .filter((income) => {
      const date = new Date(income.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((acc, income) => acc + income.amount, 0);

  const incomeLastMonth = incomearr
    .filter((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    })
    .reduce((acc, income) => acc + income.amount, 0);

  const incomeOverall = incomearr.reduce(
    (acc, income) => acc + income.amount,
    0
  );

  return (
    <>
      <div className="flex flex-col mt-2 h-full ">
        <h2 className="font-bold text-2xl">Your Income</h2>
        <div className="flex   space-x-2  pb-2">
          <AmountCard
            amount={incomeThisMonth}
            label="This month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={incomeLastMonth}
            label="Last month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={incomeOverall}
            label="Overall"
            currencySymbol={currencySymbol}
          />
        </div>
        <div className="flex justify-between gap-2 items-start flex-1">
          <div className="shadow-custom w-1/3 bg-foreground rounded-xl p-2 py-4 flex flex-col h-full">
            <h3 className="border-b py-1 border-border my-2">Latest</h3>
            {incomearr.length > 0 ? (
              incomearr
                .slice(0, 3)
                .map((income) => (
                  <TransactionCard
                    key={income.income_id}
                    transaction={income}
                    type="income"
                    currencySymbol={currencySymbol}
                  />
                ))
            ) : (
              <div className="py-4 flex-1 text-muted flex flex-col items-center justify-center ">
                <CircleOff className="w-1/3 h-fit text-red-500" />{" "}
                <h3 className="text-center">
                  You have no recent income recorded.
                </h3>
              </div>
            )}
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg w-fit bg-foreground text-accent border border-border hover:border-white cursor-pointer transition-colors text-start">
                See All
              </button>
              <AddtransactionModal type="income" />
            </div>
          </div>
          <div className="shadow-custom  h-full bg-foreground rounded-xl  w-2/3 flex justify-center items-center">
            {incomearr.length > 0 ? (
              <Chart data={incomearr} />
            ) : (
              <div className="text-muted text-3xl flex items-center justify-center flex-1">
                <p>No income recorded for this month.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Income;
