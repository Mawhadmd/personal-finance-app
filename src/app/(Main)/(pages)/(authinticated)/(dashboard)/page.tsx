import currencies from "@/constants/currencies";
import GetUserExpenses from "@/lib/getUserExpenses";
import GetUserId from "@/lib/getUserId";
import GetUserIncome from "@/lib/getUserIncome";
import { Expense, Income, User } from "@/models";
import { Download, LineChart, PieChart, Upload, Wallet } from "lucide-react";
import BalanceCard from "@/components/BalanceCard";
import TransactionCard from "@/components/TransactionCard";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Cell,
  Pie,
  ResponsiveContainer,
} from "recharts";
import TwoLinesChart from "@/components/TwoLinesChart";
import Expenses from "../expenses/page";
import PieChartComponent from "@/components/pieChart";

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
    <div className="flex">
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
                <TransactionCard
                  transaction={v}
                  type={"source" in v ? "income" : "expense"}
                  currencySymbol={currencySympol}
                  key={i}
                />
              ))}
            </div>
            <div>
              <TwoLinesChart Expenses={spendingsarr} Income={Incomearr} />
            </div>
          </div>
        </div>
      </div>
      <div className=" m-2 p-4 bg-foreground rounded w-1/3 space-y-2 flex flex-col border border-border overflow-hidden ">
        <h3 className="">Expenses by catagory</h3>
        <div className="flex flex-col h-4/7">
          {" "}
          <div className="h-full">
            {" "}
            <PieChartComponent COLORS={COLORS} spendingsarr={spendingsarr} />
          </div>
          <div>
            {[...new Set(spendingsarr.map((e) => e.category))].map(
              (entry, index) => (
                <div className="flex space-x-2 items-center" key={index}>
                  <div
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    className={`size-3 rounded-full `}
                  ></div>
                  <span className="text-sm">{entry}</span>
                  <span>
                    {spendingsarr.reduce((acc, data) => {
                      if (data.category === entry) {
                        return acc + 1;
                      }
                      return acc;
                    }, 0)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className="h-3/7 border-t border-border  space-y-1 p-1">
          <h3>Ai evaluation</h3>
          <div className="overflow-auto h-40">
            
            {aiEvaluation.response} 
            
            
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et esse atque laborum ipsam quis repudiandae optio est cumque praesentium velit quidem impedit voluptate tenetur possimus totam, repellat quisquam blanditiis. Perferendis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam dolores aliquam perspiciatis in debitis, veritatis soluta sint totam nemo distinctio nisi dignissimos quo architecto autem eaque blanditiis libero explicabo hic?Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, facere officia amet excepturi minima est maiores voluptate corporis! Sit dicta, debitis atque voluptatibus minus beatae? Obcaecati qui similique repellendus suscipit. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores nisi unde recusandae, iste nemo id culpa tempore eius, nam sint autem! Natus nemo tempora neque eveniet voluptatem vitae debitis molestiae? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio quae cupiditate nostrum aut accusamus? Corrupti placeat ipsa dolorem sit vel quidem explicabo dolor optio repellat, porro consectetur accusantium cum assumenda. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi aspernatur nulla obcaecati illo quisquam culpa cupiditate sed ullam dolore ducimus! Voluptatem sunt accusantium soluta quas. Ut quae vero dolores quam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, commodi iusto consectetur saepe, aliquid numquam, ab nulla culpa ad soluta illo asperiores ipsa cum totam quia eaque atque minima eligendi?</div>
        </div>
      </div>
    </div>
  );
}
