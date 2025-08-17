import { Income, Expense } from "@/models";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import calculateExpenseAmounts from "./calculateExpenseAmounts";
import calculateIncomeAmounts from "./calculateIncomesAmmounts";
import sortPlaidTransactions from "./sortPlaidTransactions";

export const fetchPlaidTransactions = async (
  type?: "income" | "expense" | "both",
  startDate: number = new Date().getTime() - 30 * 24 * 60 * 60 * 1000, // receives time in epoch
  endDate?: number
) => {
  const datareq = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/getTransactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate ?? new Date().getTime(),
      }),
    }
  );

  const data = await datareq.json();

  if (!datareq.ok) {
    console.error("Failed to fetch transactions:", data.error);
    return notFound();
  }
  const allTransactions: any = sortPlaidTransactions(data)

  if (type === "income") {
    const incomeTransactions = allTransactions.filter(
      (transaction: Income) => transaction.income_id
    );

    const amounts = calculateIncomeAmounts(incomeTransactions);

    return {
      allTransactions: incomeTransactions,
      // Income amounts
      plaidTotalIncome: amounts.plaidTotalIncome,
      plaidIncomeThisMonth: amounts.plaidIncomeThisMonth,
      plaidIncomeLastMonth: amounts.plaidIncomeLastMonth,
    };
  } else if (type === "expense") {
    const expenseTransactions = allTransactions.filter(
      (transaction: Expense) => transaction.expense_id
    );

    const amounts = calculateExpenseAmounts(expenseTransactions);

    return {
      allTransactions: expenseTransactions,
      plaidTotalExpense: amounts.plaidTotalExpense,
      plaidExpenseThisMonth: amounts.plaidExpenseThisMonth,
      plaidExpenseLastMonth: amounts.plaidExpenseLastMonth,
    };
  } else if (type === "both") {
    const incomeTransactions = allTransactions.filter(
      (transaction: Income) => transaction.income_id
    );
    const expenseTransactions = allTransactions.filter(
      (transaction: Expense) => transaction.expense_id
    );
    const incomeAmounts = calculateIncomeAmounts(incomeTransactions);
    const expenseAmounts = calculateExpenseAmounts(expenseTransactions);

    return {
      allTransactions,
      // Income amounts
      plaidTotalIncome: incomeAmounts.plaidTotalIncome,
      plaidIncomeThisMonth: incomeAmounts.plaidIncomeThisMonth,
      plaidIncomeLastMonth: incomeAmounts.plaidIncomeLastMonth,
      // Expense amounts
      plaidTotalExpense: expenseAmounts.plaidTotalExpense,
      plaidExpenseThisMonth: expenseAmounts.plaidExpenseThisMonth,
      plaidExpenseLastMonth: expenseAmounts.plaidExpenseLastMonth,
    };
  }
  // Return all transactions with combined totals if no specific type is requested
  return { allTransactions };
};
export default fetchPlaidTransactions;