import Chart from "@/components/OneLinechart";
import TransactionCard from "@/components/TransactionCard";
import currencies from "@/constants/currencies";
import ConvertCurrency from "@/lib/ConvertCurrency";
import GetUserId from "@/lib/getUserId";
import GetUserIncome from "@/lib/getUserIncome";
import { Income as incometype, User } from "@/models";
import React from "react";

const Income = async () => {
  let user_id = await GetUserId();

  const currency = await fetch(
    `http://localhost:3000/api/User?user_id=${user_id}`,
    { method: "GET" }
  );
  const currencyjson: User = await currency.json();

  const currencySymbol = currencies.find(
    (c) => c.code === currencyjson.currency
  )?.symbol;

  const incomearr = (await GetUserIncome(user_id)).map((income) => {
    let amount = ConvertCurrency({
      amount: income.amount,
      toCurrency: currencyjson.currency ,
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
        <div className="flex space-x-2 border-b border-border pb-2">
          <div className="w-1/3 bg-foreground p-2 rounded-lg">
            <p className="text-3xl font-bold m-1 mb-0 ">
              {currencySymbol}
              {incomeThisMonth.toFixed(2)}
            </p>
            <p className="text-muted ml-1">This month</p>
          </div>
          <div className="w-1/3 bg-foreground p-2 rounded-lg">
            <p className="text-3xl font-bold m-1 mb-0 ">
              {currencySymbol}
              {incomeLastMonth.toFixed(2)}
            </p>
            <p className="text-muted ml-1">Last month</p>
          </div>
          <div className="w-1/3 bg-foreground p-2 rounded-lg">
            <p className="text-3xl font-bold m-1 mb-0 ">
              {currencySymbol}
              {incomeOverall.toFixed(2)}
            </p>
            <p className="text-muted ml-1">Overall</p>
          </div>
        </div>
        <div className="flex justify-between items-start flex-1">
          <div className="w-1/3 border-border border-b border-l p-2 py-4">
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
              <h3 className="py-4 text-muted">
                You have no recent income recorded.
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
