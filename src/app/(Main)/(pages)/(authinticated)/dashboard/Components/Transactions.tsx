"use client";
import React, { useEffect } from "react";
import { Income, Expense } from "@/models";
import TransactionCard from "../../components/TransactionCard";
import TwoLinesChart from "../../components/TwoLinesChart";

export default function Transactions({
  currencySympol,
  initialData,
}: {
  currencySympol: string | undefined;
  initialData?: {
    combinedtransactions: Array<Income | Expense>;
    CombinedPlaidIncomearr: Income[];
    CombinedPlaidspendingsarr: Expense[];
  };
}) {
  const {
    combinedtransactions,
    CombinedPlaidIncomearr,
    CombinedPlaidspendingsarr,
  } = initialData || {
    combinedtransactions: [],
    CombinedPlaidIncomearr: [],
    CombinedPlaidspendingsarr: [],
  };

  const [transactions, setTransactions] =
    React.useState<Array<Income | Expense>>(combinedtransactions);

  const [spendingarr, setSpendingarr] = React.useState<Array<Expense>>(
    CombinedPlaidspendingsarr
  );
  const [incomearr, setIncomearr] = React.useState<Array<Income>>(
    CombinedPlaidIncomearr
  );
  const [daysAgo, setDaysAgo] = React.useState(30);
  
  const [filter, setFilter] = React.useState("all");

  // Combined useEffect that runs when either filter or daysAgo changes
  useEffect(() => {
    let filteredTransactions = combinedtransactions;

    // Apply type filter first
    if (filter === "income") {
      filteredTransactions = CombinedPlaidIncomearr;
    } else if (filter === "expense") {
      filteredTransactions = CombinedPlaidspendingsarr;
    }

    // Apply date filter
    const time = new Date().getTime() - daysAgo * 24 * 60 * 60 * 1000;
    filteredTransactions = filteredTransactions.filter(
      (transaction) => new Date(transaction.date).getTime() >= time
    );
    setIncomearr(
      CombinedPlaidIncomearr.filter(
        (transaction) => new Date(transaction.date).getTime() >= time
      )
    );
    setSpendingarr(
      CombinedPlaidspendingsarr.filter(
        (transaction) => new Date(transaction.date).getTime() >= time
      )
    );

    setTransactions(filteredTransactions);
  }, [
    daysAgo,
    filter,
    combinedtransactions,
    CombinedPlaidIncomearr,
    CombinedPlaidspendingsarr,
  ]);

  function handleDaysAgoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const days = parseInt(e.target.value, 10);
    setDaysAgo(days);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value);
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <h2 className="border-b border-border">Transactions</h2>
        <select
          onChange={handleFilterChange}
          className="border border-border rounded p-1 bg-foreground"
        >
          <option value="all" defaultChecked>
            All
          </option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          onChange={handleDaysAgoChange}
          className="border border-border rounded p-1 bg-foreground"
        >
          <option value="30" defaultChecked>
            Last 30 days
          </option>
          <option value="7">Last 7 days</option>
          <option value="60">Last 60 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
      {transactions.length > 0 ? (
        <div className="flex gap-2 box-border">
          <div className="relative w-1/3 pb-3">
            <div className="flex flex-col  overflow-y-scroll  h-100 ">
              {transactions.map((transaction, i) => (
                <TransactionCard
                  transaction={transaction}
                  type={"income_id" in transaction ? "income" : "expense"}
                  currencySymbol={currencySympol}
                  key={
                    "income_id" in transaction
                      ? transaction.income_id
                      : "expense_id" in transaction
                      ? transaction.expense_id
                      : i
                  }
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none from-80% to-100% to-background"></div>
            </div>
          </div>
          <div className=" w-2/3 flex justify-center items-center h-calc(100vh_-_5rem)">
            {spendingarr.length > 0 || incomearr.length > 0 ? (
              <TwoLinesChart Expenses={spendingarr} Income={incomearr} />
            ) : (
              <div className="text-muted text-center">
                <p>Add both income and expenses to see the chart</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-muted text-center  flex items-center justify-center h-100 text-2xl">
          <p>No transactions found</p>
        </div>
      )}
    </div>
  );
}
