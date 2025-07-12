import currencies from "@/constants/currencies";
import GetUserExpenses from "@/lib/getUserExpenses";
import GetUserId from "@/lib/getUserId";
import GetUserIncome from "@/lib/getUserIncome";
import { Expense, Income, User } from "@/models";
import { Download, LineChart, Upload, Wallet } from "lucide-react";
import BalanceCard from "@/components/BalanceCard";
import TransactionCard from "@/components/TransactionCard";
import { CartesianGrid, XAxis, YAxis, Line } from "recharts";
import TwoLinesChart from "@/components/TwoLinesChart";
import Expenses from "../expenses/page";

export default async function Home() {
  let user_id = await GetUserId();
  const user = await fetch(
    `http://localhost:3000/api/User?user_id=${user_id}`,
    { method: "GET" }
  );
  const userjson: User = await user.json();
  const spendingsarr = await GetUserExpenses(user_id);
  const Incomearr = await GetUserIncome(user_id);
  const totalSpending = spendingsarr.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const totalIncome = Incomearr.reduce((acc, income) => acc + income.amount, 0);
  const balance =
    (totalIncome - totalSpending) *
    currencies.find((c) => c.code == userjson.currency)?.exchangeRate!;

  // Calculate the difference between this month and last month
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const incomeThisMonth =
    Incomearr.filter((income) => {
      const date = new Date(income.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).reduce((acc, income) => acc + income.amount, 0) *
    currencies.find((c) => c.code == userjson.currency)?.exchangeRate!;

  const incomeLastMonth =
    Incomearr.filter((income) => {
      const date = new Date(income.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    }).reduce((acc, income) => acc + income.amount, 0) *
    currencies.find((c) => c.code == userjson.currency)?.exchangeRate!;

  const spendingThisMonth =
    spendingsarr
      .filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      })
      .reduce((acc, expense) => acc + expense.amount, 0) *
    currencies.find((c) => c.code == userjson.currency)?.exchangeRate!;

  const spendingLastMonth =
    spendingsarr
      .filter((expense) => {
        const date = new Date(expense.date);
        return (
          date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
        );
      })
      .reduce((acc, expense) => acc + expense.amount, 0) *
    currencies.find((c) => c.code == userjson.currency)?.exchangeRate!;
  console.log(
    incomeThisMonth,
    incomeLastMonth,
    spendingThisMonth,
    spendingLastMonth
  );
  const percentageChangeIncome =
    incomeLastMonth === 0
      ? incomeThisMonth > 0
        ? 999
        : 0
      : ((incomeThisMonth - incomeLastMonth) / incomeLastMonth) * 100 || 0;
  const percentageChangeSpending =
    spendingLastMonth === 0
      ? incomeThisMonth > 0
        ? 999
        : 0
      : ((spendingThisMonth - spendingLastMonth) / spendingLastMonth) * 100 ||
        0;
  const combinedtransactions: Array<Income | Expense> = [
    ...spendingsarr,
    ...Incomearr,
  ].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const currencySympol = currencies.find(
    (c) => c.code === userjson.currency
  )?.symbol;
  return (
    <div className="flex w-2/3 space-y-4 flex-col p-2">
      <div>
        <div>
          <h1>Welcome, {userjson.name}</h1>
          <small className="text-muted">This is your financial summary</small>
        </div>
        <div className="flex gap-2 ">
          <BalanceCard
            balance={balance}
            icon={<Wallet />}
            currencySymbol={currencySympol ?? ""}
            text="Current Balance"
          />

          <BalanceCard
            balance={incomeThisMonth}
            icon={<Download className="text-green-500" />}
            currencySymbol={currencySympol ?? ""}
            text="Income This Month"
            changepercentage={percentageChangeIncome}
          />

          <BalanceCard
            balance={spendingThisMonth}
            icon={<Upload className="text-red-500" />}
            currencySymbol={currencySympol ?? ""}
            text="Spending This Month"
            changepercentage={percentageChangeSpending}
          />
        </div>
      </div>
      <div>
        <h2 className="border-b border-border">Transactions</h2>
        <div className="flex  gap-2 mt-4 scroll-auto">
          <div>
            {combinedtransactions.map((v, i) => (
              <>
                <TransactionCard
                  transaction={v}
                  type={"source" in v ? "income" : "expense"}
                  currencySymbol={currencySympol}
                  key={i}
                />
              </>
            ))}
          </div>
          <div>
            <TwoLinesChart Expenses={spendingsarr} Income={Incomearr} />
          </div>
        </div>
      </div>
    </div>
  );
}
