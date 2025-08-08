import { Income } from "@/models";
import getDateRanges from "./getDateRanges";
// Helper function to calculate income totals
const calculateIncomeAmounts = (incomeTransactions: Income[]) => {
  const { thisMonthStart, lastMonthStart, lastMonthEnd } = getDateRanges();

  const plaidTotalIncome = incomeTransactions.reduce(
    (sum: number, transaction: Income) => sum + transaction.amount,
    0
  );

  const plaidIncomeThisMonth = incomeTransactions
    .filter(
      (transaction: Income) => new Date(transaction.date) >= thisMonthStart
    )
    .reduce((sum: number, transaction: Income) => sum + transaction.amount, 0);

  const plaidIncomeLastMonth = incomeTransactions
    .filter((transaction: Income) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd
      );
    })
    .reduce((sum: number, transaction: Income) => sum + transaction.amount, 0);

  return {
    plaidTotalIncome,
    plaidIncomeThisMonth,
    plaidIncomeLastMonth,
  };
};
export default calculateIncomeAmounts;
