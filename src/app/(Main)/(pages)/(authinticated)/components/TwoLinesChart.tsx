"use client";
import { formatNumber } from "@/lib/formatNumber";
import { Expense, Income } from "@/models";
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

export default function TwoLinesChart({
  Expenses,
  Income,
}: {
  Expenses: Array<Expense>;
  Income: Array<Income>;
}) {
  // Merge Expenses and Income by date
  // Memoize the merged data for chart rendering
  const data = React.useMemo(() => {
    // Map to hold merged income and expense by date
    const map: Record<
      string,
      { date: string; income: number; expense: number }
    > = {};

    // Add income entries to the map
    Income.forEach((i) => {
      map[i.date] = { date: i.date, income: i.amount, expense: 0 };
    });

    // Add expense entries to the map, merging if date exists
    Expenses.forEach((e) => {
      if (map[e.date]) {
        map[e.date].expense = e.amount;
      } else {
        map[e.date] = { date: e.date, income: 0, expense: e.amount };
      }
    });

    // Return sorted array by date for chart
    Object.values(map).forEach((item) => {
      item.date = new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    });
    return Object.values(map).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [Expenses, Income]);

  return (
    <ResponsiveContainer width="100%" aspect={1.5 /* width / height = 2:1 */}>
      <AreaChart
        data={data}
        // margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
      >
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />

        <YAxis
          tickFormatter={(number) => `${formatNumber(number)}`}
          tick={{ fontSize: 12 }}
          width={60}
        />

        <CartesianGrid strokeDasharray="2 1" />

        <Tooltip
          formatter={(val) => formatNumber(val as number)}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{
            backgroundColor: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#22c55e"
          fill="url(#colorIncome)"
          fillOpacity={1}
          name="Income"
        />

        <Area
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          fill="url(#colorExpense)"
          fillOpacity={1}
          name="Expense"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
