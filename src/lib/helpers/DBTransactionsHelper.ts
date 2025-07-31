import ConvertCurrency from "../utils/ConvertCurrency";
import GetUserExpenses from "./getUserExpenses";
import GetUserId from "./getUserId";
import GetUserIncome from "./getUserIncome";
const now = new Date();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();
const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;


export async function getDBExpeneses({ currency }: { currency: string }) {
  const user_id = await GetUserId();
  const spendingsarr = (await GetUserExpenses(user_id)).map((expense) => {
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
export async function getDBIncome({ currency }: { currency: string }) {
  const user_id = await GetUserId();
  const Incomearr = (await GetUserIncome(user_id)).map((income) => {
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
export async function getDBTransactions({
  type,
  currency,
}: {
  type: "all" | "income" | "expense";
  currency: string;
}) {}
