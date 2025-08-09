"use client";
import React, { useEffect } from "react";
import { Income, Expense } from "@/models";
import combineTransactions from "../util/combineTransactions";
import { LoaderCircleIcon } from "lucide-react";
import TransactionList from "./TransactionList";
import SortPlaidTransactions from "@/lib/utils/helpers/plaid/sortPlaidTransactions";

export default function Transactions({
  currency,
}: {
  currency: string;
  currencySymbol: string;
}) {
  const [transactions, setTransactions] = React.useState<
    Array<Income | Expense>
  >([]);

  const [spendingarr, setSpendingarr] = React.useState<Array<Expense>>([]);
  const [incomearr, setIncomearr] = React.useState<Array<Income>>([]);
  const [daysAgo, setDaysAgo] = React.useState(30);

  const [filter, setFilter] = React.useState<("all" | "income" | "expense")>("all");
  const [loading, setLoading] = React.useState(false);

  // Combined useEffect that runs when either filter or daysAgo changes
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const startDate = new Date().getTime() - daysAgo * 24 * 60 * 60 * 1000;
        const startDateISO = new Date(startDate).toISOString();
        const endDate = new Date().getTime();

        // Fetch all data in parallel
        const [incomeResponse, expenseResponse, plaidResponse] =
          await Promise.all([
            fetch(`/api/income?startDate=${startDateISO}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }).then((res) => res.json()),

            fetch(`/api/expenses?startDate=${startDateISO}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }).then((res) => res.json()),

            fetch("/api/plaid/getTransactions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ startDate, endDate }),
            }).then((res) => res.json()),
          ]);
          if (incomeResponse.error || expenseResponse.error || plaidResponse.error) {
 
            throw new Error("Error fetching transactions");
          }
        const plaidincomearr: Income[]= SortPlaidTransactions<Income>(plaidResponse, 'in')
        const plaidexpensesarr: Expense[] = SortPlaidTransactions<Expense>(plaidResponse, 'out')
        const plaidarr: (Income | Expense)[] = [...plaidexpensesarr , ...plaidincomearr]
        const INARR = incomeResponse.income
        const SARR = expenseResponse.expenses;
 
        // Combine transactions
        const CombinedPlaidIncomearr = combineTransactions<Income>(
          [],
          INARR,
          plaidincomearr
        );
        const CombinedPlaidspendingsarr = combineTransactions<Expense>(
          SARR,
          [],
          plaidexpensesarr
        );
        const combinedtransactions = combineTransactions<Expense | Income>(
          SARR,
          INARR,
          plaidarr
        );

        // Apply type filter
 
        // Set state (no need for additional date filtering since API already filters)
        setIncomearr(CombinedPlaidIncomearr);
        setSpendingarr(CombinedPlaidspendingsarr);
        setTransactions(combinedtransactions);

      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [daysAgo]);

  useEffect(() => {
           let filteredTransactions = transactions;
        if (filter === "income") {
          filteredTransactions = incomearr;
        } else if (filter === "expense") {
          filteredTransactions = spendingarr;
        }
  setTransactions(filteredTransactions);

  }, [filter]);
  function handleDaysAgoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const days = parseInt(e.target.value, 10);
    setDaysAgo(days);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value as ("all" | "income" | "expense"));
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
      {loading ? (
        <div className="h-100 relative w-full">
          <LoaderCircleIcon className="animate-spin  size-20 absolute inset-[50%] translate-x-[-50%] translate-y-[-50%]" />
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          currencySymbol={currency}
          spendingarr={spendingarr}
          incomearr={incomearr}
        />
      )}
    </div>
  );
}
