import { Expense } from "@/models";
import getDateRanges from "./getDateRanges";

// Helper function to calculate expense totals
const calculateExpenseAmounts = (expenseTransactions: Expense[]) => {
  const { thisMonthStart, lastMonthStart, lastMonthEnd } = getDateRanges();

  const plaidTotalExpense = expenseTransactions.reduce(
    (sum: number, transaction: Expense) => sum + transaction.amount,
    0
  );

  const plaidExpenseThisMonth = expenseTransactions
    .filter(
      (transaction: Expense) => new Date(transaction.date) >= thisMonthStart
    )
    .reduce((sum: number, transaction: Expense) => sum + transaction.amount, 0);

  const plaidExpenseLastMonth = expenseTransactions
    .filter((transaction: Expense) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd
      );
    })
    .reduce((sum: number, transaction: Expense) => sum + transaction.amount, 0);

  return {
    plaidTotalExpense,
    plaidExpenseThisMonth,
    plaidExpenseLastMonth
  };
};

export default calculateExpenseAmounts;
