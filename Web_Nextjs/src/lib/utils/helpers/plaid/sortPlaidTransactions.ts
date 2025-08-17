import { Expense, Income } from '@/models';
import { TransactionsGetResponse } from 'plaid';


const SortPlaidTransactions = <T>(data: TransactionsGetResponse, type?: 'in' | 'out') => {
  const DT = data.transactions.map((transaction: TransactionsGetResponse["transactions"][number]) => {

    if (transaction.amount > 0) {
      return {
        income_id: transaction.transaction_id + "P",
        user_id: null,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.personal_finance_category?.primary,
        method: transaction.payment_channel,
        meta_data: {
          merchant_name: transaction.merchant_name,
          merchant_logo: transaction.logo_url,
           
        },
        description: transaction.name,
      };
    } else {
      return {
        expense_id: transaction.transaction_id + "P",
        user_id: null,
        amount: Math.abs(transaction.amount),
        date: transaction.date,
        category: transaction.personal_finance_category?.primary,
        meta_data: {
          merchant_name: transaction.merchant_name,
          merchant_logo: transaction.logo_url,
        },
        description: transaction.name,
        method: transaction.payment_channel,
      };
    }
  });
  if (type == 'in')
    return DT.filter((e)=>e.income_id) as T[]
  else if (type == 'out')
    return DT.filter((e)=>e.expense_id) as T[]
  return DT as (T)[]
}

export default SortPlaidTransactions;
