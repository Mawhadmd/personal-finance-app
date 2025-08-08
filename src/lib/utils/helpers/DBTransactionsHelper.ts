import ConvertCurrency from "../ConvertCurrency";
import GetUserExpenses from "./getUserExpensesList";
import GetUserIncome from "./getUserIncomeList";
const now = new Date();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();
const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

export async function getDBExpeneses(currency: string) {
  const spendingsarr = (await GetUserExpenses()).map((expense) => {
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
export async function getDBIncome(currency: string) {
  const Incomearr = (await GetUserIncome()).map((income) => {
    const amount = ConvertCurrency({
      amount: income.amount,
      toCurrency: currency,
    });
    return { ...income, amount };
  });

  const incomeThisMonth = Incomearr.filter((income) => {
    const date = new Date(income.date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).reduce((acc, income) => acc + income.amount, 0);

  const incomeLastMonth = Incomearr.filter((income) => {
    const date = new Date(income.date);
    return (
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    );
  }).reduce((acc, income) => acc + income.amount, 0);
  const totalIncome = Incomearr.reduce((acc, income) => acc + income.amount, 0);
  return {
    Incomearr,
    totalIncome,
    incomeThisMonth,
    incomeLastMonth,
  };
}
