import currencies from "@/constants/currencies";
import GetUserExpenses from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/utils/getUserExpenses";
import GetUserId from "@/lib/getUserId";
import GetUserIncome from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/utils/getUserIncome";
import { Expense, Income, User } from "@/models";
import {
  BanknoteArrowDown,
  Download,
  Upload,
  Wallet,
} from "lucide-react";
import BalanceCard from "@/app/(Main)/(pages)/(authinticated)/components/BalanceCard";
import TransactionCard from "@/app/(Main)/(pages)/(authinticated)/components/TransactionCard";
import TwoLinesChart from "@/app/(Main)/(pages)/(authinticated)/components/TwoLinesChart";
import PieChartComponent from "@/app/(Main)/(pages)/(authinticated)/components/pieChart";
import ConvertCurrency from "@/lib/ConvertCurrency";
import { cookies } from "next/headers";
import AddtransactionModal from "@/app/(Main)/(pages)/(authinticated)/components/AddTransactionsModal/AddTransactionsModal";
import GettingStarted from "./Components/GettingStarted";
import { formatNumber } from "@/lib/formatNumber";
import { notFound } from "next/navigation";

export default async function Home() {
  const user_id = await GetUserId();
  const user = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/User?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  if (!user.ok) {
    console.error("Failed to fetch user data:", await user.text());
    notFound();
  }
  const userjson: User = await user.json();
  const spendingsarr = (await GetUserExpenses(user_id)).map((expense) => {
    const amount = ConvertCurrency({
      amount: expense.amount,
      toCurrency: userjson.currency,
    });
    return { ...expense, amount };
  });
  const Incomearr = (await GetUserIncome(user_id)).map((income) => {
    const amount = ConvertCurrency({
      amount: income.amount,
      toCurrency: userjson.currency,
    });
    return { ...income, amount };
  });
  const totalSpending = spendingsarr.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const balancerq = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/User/GetBalance?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  const balancejson = await balancerq.json();
  const balance = ConvertCurrency({
    amount: balancejson.balance,
    toCurrency: userjson.currency,
  });

  // Calculate the difference between this month and last month
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const incomeThisMonth = Incomearr.filter((income) => {
    const date = new Date(income.date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).reduce((acc, income) => acc + income.amount, 0);

  const incomeLastMonth = Incomearr.filter((income) => {
    const date = new Date(income.date);
    return (
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    );
  }).reduce((acc, income) => acc + income.amount, 0);

  const spendingThisMonth = spendingsarr
    .filter((expense) => {
      const date = new Date(expense.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  const spendingLastMonth = spendingsarr
    .filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  const percentageChangeIncome =
    incomeLastMonth === 0
      ? incomeThisMonth > 0
        ? 999
        : 0
      : ((incomeThisMonth - incomeLastMonth) / incomeLastMonth) * 100 || 0;
  const percentageChangeSpending =
    spendingLastMonth === 0
      ? spendingThisMonth > 0
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

  const COLORS = [
    ...Array(6)
      .fill(0)
      .map(() => {
        // Generate random color with a bias towards green shades
        const r = Math.floor(110 + Math.random() * 100);
        const g = Math.floor(110 + Math.random() * 100); // More green
        const b = Math.floor(110 + Math.random() * 100);
        return `rgb(${r},${g},${b})`;
      }),
  ];

  if (combinedtransactions.length === 0) {
    return (
      // No transactions layout - centered and simplified
      <div className="h-full flex">
        <div className="w-full flex flex-col p-2">
          {/* Header Section */}
          <div className="mb-6">
            <div>
              <h1>Welcome, {userjson.name}</h1>
              <small className="text-muted">
                This is your financial summary
              </small>
            </div>
            <div className="flex gap-2 mt-4">
              <BalanceCard
                balance={balance}
                icon={<Wallet className="size-full" />}
                currencySymbol={currencySympol ?? ""}
                text="Current Balance"
              />

              <BalanceCard
                balance={incomeThisMonth}
                icon={<Download className="text-green-500 size-full" />}
                currencySymbol={currencySympol ?? ""}
                text="Income This Month"
                changepercentage={percentageChangeIncome}
              />

              <BalanceCard
                balance={spendingThisMonth}
                icon={<Upload className="text-red-500 size-full" />}
                currencySymbol={currencySympol ?? ""}
                text="Spending This Month"
                changepercentage={percentageChangeSpending}
              />
            </div>
          </div>

          {/* Transactions Section - Centered */}
          <AddtransactionModal />
        </div>
        {/* Get Started */}
        <GettingStarted />
      </div>
    );
  }

  const aieval = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/groq-Ai?user_id=${user_id}&name=${userjson.name}&income=${incomeThisMonth}&expenses=${spendingThisMonth}&currency=${userjson.currency}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  const aiEvaluation = await aieval.json();
  return (
    <div className="h-full flex">
      <div className="flex w-2/3 space-y-4 flex-col p-2">
        <div className="">
          <div>
            <h1>Welcome, {userjson.name}</h1>
            <small className="text-muted">This is your financial summary</small>
          </div>
          <div className="flex gap-2  ">
            <BalanceCard
              balance={balance}
              icon={<Wallet className="" />}
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
        <div className="">
          <h2 className="border-b border-border">Transactions</h2>
          <div className="flex gap-2 box-border">
            <div className="relative w-1/3 pb-3">
              <div className="flex flex-col  overflow-y-scroll  h-100 ">
                {combinedtransactions.map((transaction, i) => (
                  <TransactionCard
                    transaction={transaction}
                    type={"income_id" in transaction ? "income" : "expense"}
                    currencySymbol={currencySympol}
                    key={i}
                  />
                ))}

                <div className="absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none from-80% to-100% to-background"></div>
              </div>
            </div>
            <div className=" w-2/3 flex justify-center items-center h-calc(100vh_-_5rem)">
              {spendingsarr.length > 0 || Incomearr.length > 0 ? (
                <TwoLinesChart Expenses={spendingsarr} Income={Incomearr} />
              ) : (
                <div className="text-muted text-center">
                  <p>Add both income and expenses to see the chart</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className=" m-2 p-4 bg-foreground rounded w-1/3 space-y-2 flex flex-col border border-border  ">
        <h3 className="flex gap-1 items-center">
          <BanknoteArrowDown /> Expenses by category
        </h3>
        <div className="flex flex-col h-4/7">
          <div className=" flex justify-center items-center  h-full">
            {spendingsarr.length > 0 ? (
              <PieChartComponent COLORS={COLORS} spendingsarr={spendingsarr} />
            ) : (
              <div className="text-muted text-center">
                <p>No expenses recorded yet.</p>
                <p>Add some to see the pie chart</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-around items-center p-2">
            {[...new Set(spendingsarr.map((e) => e.category))].map(
              (entry, index) => (
                <div className="flex space-x-2 items-center" key={index}>
                  <div
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                    className={`size-3 rounded `}
                  ></div>
                  <span className="text-sm">{entry}</span>
                  <span className=" text-xs text-muted">
                    {(() => {
                      const value = spendingsarr.reduce((acc, data) => {
                        if (data.category === entry) {
                          return acc + data.amount;
                        }
                        return acc;
                      }, 0);
                      return (
                        <span>
                          {currencySympol}
                          {formatNumber(value)} (
                          {((value / totalSpending) * 100).toFixed(2)}
                          %)
                        </span>
                      );
                    })()}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="h-3/7 border-t border-border space-y-1 p-1">
          <div className="flex space-x-2 items-center justify-center">
            <h3>AI evaluation</h3>
            <div>
              {new Date(aiEvaluation.latest_ai_eval).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="overflow-auto h-40 flex justify-center items-center">
            {aiEvaluation.error ? (
              <div>{aiEvaluation.error}</div>
            ) : (
              <p className="text-muted">
                {aiEvaluation.ai_eval ??
                  "Please add transactions to get Ai Eval"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
