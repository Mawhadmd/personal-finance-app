import { Expense, Income } from "@/models";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import calculateExpenseAmounts from "./calculateExpenseAmounts";
import calculateIncomeAmounts from "./calculateIncomesAmmounts";
import { TransactionsGetResponse } from "plaid";

// TODO continute calculate total spending this and last month then see total spending then integrate them back to the app
export const fetchPlaidAccounts = async () => {
  const datareq = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/getTransactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      body: JSON.stringify({
        startDate: Date.now(),
        endDate: Date.now(),
      }),
    }
  );

  const data = await datareq.json();

  if (!datareq.ok) {
    console.error("Failed to fetch transactions:", data.error);
    return notFound();
  }
  return data.accounts;
};
export const fetchPlaidTransactions = async (
  type?: "income" | "expense" | "both",
  daysAgo: number = 1000 * 60 * 60 * 24 * 30
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
        startDate: Date.now() - daysAgo,
        endDate: Date.now(),
      }),
    }
  );

  const data = await datareq.json();

  if (!datareq.ok) {
    console.error("Failed to fetch transactions:", data.error);
    return notFound();
  }
  const allTransactions = data.transactions.map((transaction: TransactionsGetResponse["transactions"][number]) => {
    if (transaction.amount > 0) {
      return {
        income_id: transaction.transaction_id + "P",

        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        method: transaction.payment_channel,
        description: transaction.name,
      };
    } else {
      return {
        expense_id: transaction.transaction_id + "P",

        amount: Math.abs(transaction.amount),
        date: transaction.date,
        category: transaction.category,
        description: transaction.name,
        method: transaction.payment_channel,
      };
    }
  });

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

export const checkPlaidToken = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/check`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
    }
  );

  const reqJSON = await req.json();

  if (reqJSON.linked === false) {
    return false;
  } else if (reqJSON.linked === true) {
    return true;
  }

  if (!req.ok) {
    console.error("Failed to check bank link status:", reqJSON.error);
    return notFound();
  }
};
