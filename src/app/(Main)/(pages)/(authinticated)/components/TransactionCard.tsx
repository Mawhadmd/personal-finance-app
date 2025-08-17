import { Upload, Download,Landmark } from "lucide-react";
import { Expense, Income } from "@/models";
import { formatNumber } from "@/lib/utils/formatNumber";

type TransactionCardProps = {
  transaction: Expense | Income;
  type: "expense" | "income";
  currencySymbol?: string;
};

const TransactionCard = ({
  transaction,
  type,
  currencySymbol = "$",
}: TransactionCardProps) => {
  const isExpense = type === "expense";
  const expense = transaction as Expense;
  const income = transaction as Income;

  console.log(expense, income)
  return (
    <div className="bg-foreground relative border-border dark:shadow-none dark:border shadow-custom p-2 rounded-lg my-1 w-full">
      {(typeof expense.expense_id === "string" || typeof income.income_id === "string") && (
        <div className="absolute text-muted top-2 right-2">
          <Landmark />
        </div>
      )}
      <div
        className={`flex items-center font-bold text-2xl ${
          isExpense ? "text-red-500" : "text-green-500"
        }`}
      >  
       
        {currencySymbol}
        {formatNumber(transaction.amount)}
        {isExpense ? (
          <Upload size={18} className="inline ml-1" />
        ) : (
          <Download size={18} className="inline ml-1" />
        )}
      </div>
      {((isExpense && expense.meta_data?.merchant_name != null) || (!isExpense && income.meta_data?.merchant_name != null)) && (
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <img src={isExpense ? expense.meta_data?.merchant_logo : income.meta_data?.merchant_logo} alt={`${isExpense ? expense.meta_data?.merchant_name : income.meta_data?.merchant_name}`} className="w-6 h-6 rounded-full" />
          - {isExpense ? expense.meta_data?.merchant_name : income.meta_data?.merchant_name}
        </div>
      )}
      {transaction.description && <p>{transaction.description}</p>}

      <small className="text-muted">
        {new Date(transaction.date).toLocaleDateString(undefined, {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}
        {isExpense && expense.category && ` | ${expense.category}`}
        {isExpense && expense.method && ` | ${expense.method}`}
        {!isExpense && income.category && ` | ${income.category}`}
      </small>
    </div>
  );
};

export default TransactionCard;
