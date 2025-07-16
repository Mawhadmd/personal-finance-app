import { Upload, Download } from "lucide-react";
import { Expense, Income } from "@/models";
import { formatNumber } from "@/lib/formatNumber";

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

  return (
    <div className="bg-foreground border-border dark:shadow-none dark:border shadow-custom p-2 rounded-lg my-1 w-full">
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
