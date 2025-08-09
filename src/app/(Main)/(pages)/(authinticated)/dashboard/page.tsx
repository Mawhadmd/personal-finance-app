import currencies from "@/constants/currencies";
import GetUserId from "@/lib/utils/getUserId";
import { Expense, Income } from "@/models";
import { BanknoteArrowDown, Download, Upload, Wallet } from "lucide-react";
import BalanceCard from "@/app/(Main)/(pages)/(authinticated)/components/BalanceCard";
import PieChartComponent from "@/app/(Main)/(pages)/(authinticated)/components/pieChart";
import ConvertCurrency from "@/lib/utils/ConvertCurrency";
import { cookies } from "next/headers";
import AddtransactionModal from "@/app/(Main)/(pages)/(authinticated)/components/AddTransactionsModal/AddTransactionsModal";
import GettingStarted from "./Components/GettingStarted";
import { formatNumber } from "@/lib/utils/formatNumber";

import Link from "next/link";

import { decodeJwt } from "jose";
import Transactions from "./Components/Transactions";
import combineTransactions from "./util/combineTransactions";
import  getDBIncome  from "@/lib/utils/helpers/getDBIncome";
import { fetchPlaidTransactions } from "@/lib/utils/helpers/plaid/fetchPlaidTransactions";
import getDBExpenses from "@/lib/utils/helpers/getDBExpenses";

export default async function Home() {
  const user_id = await GetUserId();
  const AccessToken = (await cookies()).get("AccessToken")?.value;

  const { currency, name }: { currency: string; name: string } = decodeJwt(
    AccessToken!
  )!;
  console.log(currency, name);
  const expRes = await getDBExpenses(currency);

  const { spendingsarr } = expRes;
  let { totalSpending, spendingThisMonth, spendingLastMonth } = expRes;

  const incRes = await getDBIncome(currency);
  const { Incomearr } = incRes;
  let { incomeThisMonth, incomeLastMonth, totalIncome } = incRes;
  const {
    allTransactions: plaidTransactions,
    plaidTotalExpense,
    plaidExpenseThisMonth,
    plaidExpenseLastMonth,
    plaidTotalIncome,
    plaidIncomeThisMonth,
    plaidIncomeLastMonth,
  } = await fetchPlaidTransactions("both");

  incomeThisMonth += plaidIncomeThisMonth!;
  incomeLastMonth += plaidIncomeLastMonth!;
  totalIncome += plaidTotalIncome!;

  totalSpending += plaidTotalExpense!;
  spendingThisMonth += plaidExpenseThisMonth!;
  spendingLastMonth += plaidExpenseLastMonth!;

  const balance = ConvertCurrency({
    amount: totalIncome - totalSpending,
    toCurrency: currency,
  });

  // Calculate the difference between this month and last month

  function calculatePercentageChange(
    current: number,
    previous: number
  ): number {
    if (previous === 0) {
      return current > 0 ? 999 : 0; // Return 999% if
      // previous is 0 and current is positive, otherwise return 0%
    }
    return ((current - previous) / previous) * 100 || 0; // Calculate
  }

  const percentageChangeIncome = parseInt(
    calculatePercentageChange(incomeThisMonth, incomeLastMonth).toFixed(2)
  );

  const percentageChangeSpending = parseInt(
    calculatePercentageChange(spendingThisMonth, spendingLastMonth).toFixed(2)
  );

  const combinedtransactions: Array<Income | Expense> = combineTransactions(
    Incomearr,
    [],
    plaidTransactions
  );
  const CombinedPlaidIncomearr: Income[] = combineTransactions(
    Incomearr,
    [],
    plaidTransactions.filter((transaction: Income) => transaction.income_id)
  );
  const CombinedPlaidspendingsarr: Expense[] = combineTransactions(
    [],
    spendingsarr,
    plaidTransactions.filter((transaction: Expense) => transaction.expense_id)
  );

  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol;

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
              <h1>Welcome, {name}</h1>
              <small className="text-muted">
                This is your financial summary
              </small>
            </div>
            <div className="flex gap-2 mt-4">
              <BalanceCard
                balance={balance}
                icon={<Wallet className="size-full" />}
                currencySymbol={currencySymbol ?? ""}
                text="Current Balance"
              />

              <BalanceCard
                balance={incomeThisMonth}
                icon={<Download className="text-green-500 size-full" />}
                currencySymbol={currencySymbol ?? ""}
                text="Income This Month"
                changepercentage={percentageChangeIncome}
              />

              <BalanceCard
                balance={spendingThisMonth}
                icon={<Upload className="text-red-500 size-full" />}
                currencySymbol={currencySymbol ?? ""}
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
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/groq-Ai?user_id=${user_id}&name=${name}&income=${incomeThisMonth}&expenses=${spendingThisMonth}&currency=${currency}`,
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
            <h1>Welcome, {name}</h1>
            <div className="flex gap-2 mb-2 items-center">
              <small className="text-muted">
                This is your financial summary
              </small>

              <Link
                href="/Bank"
                className="bg-accent rounded-full p-1 text-sm cursor-pointer hover:opacity-80 ring ring-border"
              >
                Connect My bank
              </Link>
            </div>
          </div>
          <div className="flex gap-2  ">
            <BalanceCard
              balance={balance}
              icon={<Wallet className="" />}
              currencySymbol={currencySymbol ?? ""}
              text="Current Balance"
            />

            <BalanceCard
              balance={incomeThisMonth}
              icon={<Download className="text-green-500" />}
              currencySymbol={currencySymbol ?? ""}
              text="Income This Month"
              changepercentage={percentageChangeIncome}
            />

            <BalanceCard
              balance={spendingThisMonth}
              icon={<Upload className="text-red-500" />}
              currencySymbol={currencySymbol ?? ""}
              text="Spending This Month"
              changepercentage={percentageChangeSpending}
            />
          </div>
        </div>
        <Transactions
          currencySymbol={currencySymbol ?? ""}
       
          currency={currency}
        />
      </div>
      <div className=" m-2 p-4 bg-foreground rounded w-1/3 space-y-2 flex flex-col border border-border  ">
        <h3 className="flex gap-1 items-center">
          <BanknoteArrowDown /> Expenses by category
        </h3>
        <div className="flex flex-col h-4/7">
          <div className=" flex justify-center items-center  h-full">
            {CombinedPlaidspendingsarr.length > 0 ? (
              <PieChartComponent COLORS={COLORS} spendingsarr={CombinedPlaidspendingsarr} />
            ) : (
              <div className="text-muted text-center">
                <p>No expenses recorded yet.</p>
                <p>Add some to see the pie chart</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-around items-center p-2">
            {[...new Set(CombinedPlaidspendingsarr.map((e) => e.category ?? "Uncategorized"))].map(
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
                      const value = CombinedPlaidspendingsarr.reduce((acc, data) => {
                        if ((data.category ?? "Uncategorized") === entry) {
                          return acc + data.amount;
                        }
                        return acc;
                      }, 0);
                      return (
                        <span>
                          
                          {currencySymbol}
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
