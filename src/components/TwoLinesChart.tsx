"use client";
import { Expense, Income } from "@/models";
import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";



export default function TwoLinesChart({Expenses, Income}: {Expenses: Array<Expense>, Income: Array<Income>}) {

  // Merge Expenses and Income by date
  // Memoize the merged data for chart rendering
  const data = React.useMemo(() => {
    // Map to hold merged income and expense by date
    const map: Record<string, { date: string; income: number; expense: number }> = {};

    // Add income entries to the map
    Income.forEach(i => {
      map[i.date] = { date: i.date, income: i.amount, expense: 0 };
    });

    // Add expense entries to the map, merging if date exists
    Expenses.forEach(e => {
      if (map[e.date]) {
        map[e.date].expense = e.amount;
      } else {
        map[e.date] = { date: e.date, income: 0, expense: e.amount };
      }
    });

    // Return sorted array by date for chart
    Object.values(map).forEach(item => {
      item.date = new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
    })
    return Object.values(map).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [Expenses, Income]);

  return (
    <LineChart data={data} width={600} height={300} >
      <CartesianGrid stroke="#333333" strokeDasharray="5 5" />
      <XAxis dataKey="date"  />
      <YAxis />
      <Line type="monotone" dataKey="income" stroke="#4ade80"  name="Income" />
      <Line type="monotone" dataKey="expense" stroke="#f87171" name="Expense" />
    </LineChart>
  );
}
