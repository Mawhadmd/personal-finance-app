"use client";
import { formatNumber } from "@/lib/utils/formatNumber";
import { Expense, Income } from "@/models";
import React from "react";
import {
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function Chart({ data }: { data: Array<Expense | Income> }) {
  // Format data for the chart
  const chartData = data
    .map((data) => ({
      date: new Date(data.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: data.amount,
      category: "category" in data ? data.category || "Other" : "Other",
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let color = "#10B981";
    if (typeof data[0] === "object" && "expense_id" in data[0]) {
      color = "#EF4444"; // Red for expenses
    }

  return (
    <div className="w-full h-80 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `${formatNumber(value)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-background)",
              border: "var(--color-border)",
              borderRadius: "6px",
              color: "var(--color-text)",
            }}
            formatter={(value: number) => [`${formatNumber(value)}`, "Amount"]}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, stroke: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
