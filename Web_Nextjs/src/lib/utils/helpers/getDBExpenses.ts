import ConvertCurrency from "../ConvertCurrency";
import GetUserExpensesList from "./getUserExpensesList";
const now = new Date();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();
const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

// Returns 
//  spendingsarr,
//     totalSpending,
//     spendingThisMonth,
//     spendingLastMonth,

export default async function getDBExpenses(currency: string, startDate: string = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), endDate?: string) {
  const spendingsarr = (await GetUserExpensesList(startDate, endDate)).map((expense) => {
    const amount = ConvertCurrency({
      amount: expense.amount,
      toCurrency: currency,
    });
    return { ...expense, amount };
  });

  const totalSpending = spendingsarr.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

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
  return {
    spendingsarr,
    totalSpending,
    spendingThisMonth,
    spendingLastMonth,
  };
}
