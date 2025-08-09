import ConvertCurrency from "../ConvertCurrency";
import GetUserIncomeList from "./getUserIncomeList";
const now = new Date();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();
const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;


//Returns
    // Incomearr,
    // totalIncome,
    // incomeThisMonth,
    // incomeLastMonth,

export default async function getDBIncome(currency: string, startDate: string = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), endDate?: string) {
  const Incomearr = (await GetUserIncomeList(startDate, endDate)).map((income) => {
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
