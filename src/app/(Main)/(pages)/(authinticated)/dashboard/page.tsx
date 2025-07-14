import currencies from "@/constants/currencies";
import GetUserExpenses from "@/lib/getUserExpenses";
import GetUserId from "@/lib/getUserId";
import GetUserIncome from "@/lib/getUserIncome";
import { Expense, Income, User } from "@/models";
import { Download, Upload, Wallet } from "lucide-react";
import BalanceCard from "@/components/BalanceCard";
import TransactionCard from "@/components/TransactionCard";
import TwoLinesChart from "@/components/TwoLinesChart";
import PieChartComponent from "@/components/pieChart";
import ConvertCurrency from "@/lib/ConvertCurrency";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  let user_id = await GetUserId();
  const user = await fetch(
    `http://localhost:3000/api/User?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        Cookie: `${(await cookies()).toString()}`,
      },
    }
  );
  const userjson: User = await user.json();
  const spendingsarr = (await GetUserExpenses(user_id)).map((expense) => {
    let amount = ConvertCurrency({
      amount: expense.amount,
      toCurrency: userjson.currency,
    });
    return { ...expense, amount };
  });
  const Incomearr = (await GetUserIncome(user_id)).map((income) => {
    let amount = ConvertCurrency({
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
    `http://localhost:3000/api/User/GetBalance?user_id=${user_id}`,
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

  const COLORS = [
    // "#4CAFA0", // Green
    // "#3B4AaC", // Dark Green
    // "#A21444", // Light Green
    // "#A556A7", // Pale Green
    // "#43A047", // Medium Green
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
  let aiEvaluation = { response: "Loading AI evaluation..." };
  try {
    const aieval = await fetch(`http://localhost:3000/api/groq-Ai`, {
      body: JSON.stringify({
        name: userjson.name,
        income: Incomearr.map((item) => ({ ...item })),
        expenses: spendingsarr.map((item) => ({ ...item })),
      }),
      headers: {
        "Content-Type": "application/json",
        Cookie: `${(await cookies()).toString()}`,
      },
      method: "POST",
    });
    aiEvaluation = await aieval.json();
  } catch (error) {
    console.error("Error fetching AI evaluation:", error);
    aiEvaluation = { response: "Failed to fetch AI evaluation." };
    alert("Failed to fetch AI evaluation. Please try again later.");
  }

  return (
    <div className="flex h-full">
      {/* Check if there are any transactions */}
      {combinedtransactions.length === 0 ? (
        // No transactions layout - centered and simplified
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

          {/* Transactions Section - Centered */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">No Transactions Yet</h2>
              <p className="text-muted text-lg">
                Start by adding your first transaction
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="/income">
                  <button className="bg-accent  cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-custom">
                    Add Income
                  </button>
                </Link>
                <Link href="/expenses">
                  <button className="bg-red-600 shadow-custom cursor-pointer hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Add Expense
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Full layout with transactions
        <>
          <div className="flex w-2/3 space-y-4 flex-col p-2">
            <div>
              <div>
                <h1>Welcome, {userjson.name}</h1>
                <small className="text-muted">
                  This is your financial summary
                </small>
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
            <div className="flex-1">
              <h2 className="border-b border-border">Transactions</h2>
              <div className="flex gap-2 box-border h-full scroll-auto">
                <div className="flex flex-col w-1/3">
                  {combinedtransactions.map((transaction, i) => (
                    <TransactionCard
                      transaction={transaction}
                      type={"source" in transaction ? "income" : "expense"}
                      currencySymbol={currencySympol}
                      key={i}
                    />
                  ))}
                </div>
                <div className=" w-2/3 flex justify-center items-center">
                  {spendingsarr.length > 0 && Incomearr.length > 0 ? (
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
          <div className=" m-2 p-4 bg-foreground rounded w-1/3 space-y-2 flex flex-col border border-border overflow-hidden ">
            <h3 className="">Expenses by category</h3>
            <div className="flex flex-col h-4/7">
              <div className=" flex justify-center items-center">
                {spendingsarr.length > 0 ? (
                  <PieChartComponent
                    COLORS={COLORS}
                    spendingsarr={spendingsarr}
                  />
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
                              {value} (
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
              <h3>AI evaluation</h3>
              <div className="overflow-auto h-40 flex justify-center items-center">
                {aiEvaluation.response}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
