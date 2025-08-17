import AddtransactionModal from "@/app/(Main)/(pages)/(authinticated)/components/AddTransactionsModal/AddTransactionsModal";
import Chart from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/components/OneLinechart";
import TransactionCard from "@/app/(Main)/(pages)/(authinticated)/components/TransactionCard";
import currencies from "@/constants/currencies";

import { CircleOff } from "lucide-react";
import { cookies } from "next/headers";

import React from "react";
import AmountCard from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/components/AmountCard";
import { decodeJwt } from "jose";

import { Expense } from "@/models";
import combineTransactions from "../../dashboard/util/combineTransactions";
import { fetchPlaidTransactions } from "@/lib/utils/helpers/plaid/fetchPlaidTransactions";
import getDBExpenses from "@/lib/utils/helpers/getDBExpenses";

const Expenses = async () => {
  const AccessToken = (await cookies()).get("AccessToken")?.value;

  const { currency }: { currency: string } = decodeJwt(AccessToken!)!;

  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol;

  const { spendingsarr, totalSpending, spendingThisMonth, spendingLastMonth } =
    await getDBExpenses(currency);
  // Calculate spending for this month, last month, and overall
  const {
    allTransactions: plaidTransactions,
    plaidTotalExpense: plaidTotalSpending,
    plaidExpenseThisMonth: plaidSpendingThisMonth,
    plaidExpenseLastMonth: plaidSpendingLastMonth,
  } = await fetchPlaidTransactions("expense");
  const combinedtransactions: Array<Expense> = combineTransactions<Expense>(
    [],
    spendingsarr,
    plaidTransactions
  );

  // Combine database and Plaid amounts
  const combinedTotalSpending = totalSpending + plaidTotalSpending!;
  const combinedSpendingThisMonth = spendingThisMonth + plaidSpendingThisMonth!;
  const combinedSpendingLastMonth = spendingLastMonth + plaidSpendingLastMonth!;

  return (
    <>
      <div className="flex flex-col mt-2 h-full ">
        <h2 className="font-bold text-2xl">Your Expenses</h2>
        <div className="flex   space-x-2  pb-2">
          <AmountCard
            amount={combinedSpendingThisMonth}
            label="This month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={combinedSpendingLastMonth}
            label="Last month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={combinedTotalSpending}
            label="Overall"
            currencySymbol={currencySymbol}
          />
        </div>
        <div className="flex justify-between gap-2 items-start flex-1">
          <div className="shadow-custom w-1/3 bg-foreground rounded-xl p-2 py-4 flex flex-col h-full">
            <h3 className="border-b py-1 border-border my-2">Latest</h3>
            {combinedtransactions.length > 0 ? (
              combinedtransactions
           
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
            {combinedtransactions.length > 0 ? (
              <Chart data={combinedtransactions} />
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
