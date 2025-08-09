import React from 'react';
import TransactionCard from '../../components/TransactionCard';
import TwoLinesChart from '../../components/TwoLinesChart';
import { Expense, Income } from '@/models';

const TransactionList = ({ transactions, currencySymbol, spendingarr, incomearr }: { transactions: (Income | Expense)[]; currencySymbol: string; spendingarr: Expense[]; incomearr: Income[]; }) => {
    return (
        <div>
             {transactions.length > 0 ? (
        <div className="flex gap-2 box-border">
          <div className="relative w-1/3 pb-3">
            <div className="flex flex-col  overflow-y-scroll  h-100 ">
              {transactions.map((transaction, i) => (
                <TransactionCard
                  transaction={transaction}
                  type={"income_id" in transaction ? "income" : "expense"}
                  currencySymbol={currencySymbol}
                  key={
                    "income_id" in transaction
                      ? transaction.income_id
                      : "expense_id" in transaction
                      ? transaction.expense_id
                      : i
                  }
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none from-80% to-100% to-background"></div>
            </div>
          </div>
          <div className=" w-2/3 flex justify-center items-center h-calc(100vh_-_5rem)">
            {spendingarr.length > 0 || incomearr.length > 0 ? (
              <TwoLinesChart Expenses={spendingarr} Income={incomearr} />
            ) : (
              <div className="text-muted text-center">
                <p>Add both income and expenses to see the chart</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-muted text-center  flex items-center justify-center h-100 text-2xl">
          <p>No transactions found</p>
        </div>
      )}
        </div>
    );
}

export default TransactionList;
