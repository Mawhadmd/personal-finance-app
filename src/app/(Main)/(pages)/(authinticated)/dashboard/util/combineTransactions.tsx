import { Income, Expense } from "@/models";

type WithDate = { date: string | Date };

export default function combineTransactions<T extends WithDate>(
  Incomearr: Array<T> | [],
  spendingsarr: Array<T> | [],
  plaidTransactions: Array<T>
): Array<T> {
  let combinedtransactions: Array<T>;
  if (!plaidTransactions) {
    throw new Error("Plaid transactions are required");
  }
  if (!Incomearr && spendingsarr) {
    combinedtransactions = [...spendingsarr, ...plaidTransactions].sort(
      (a, b) => {
        return new Date(b.date!).getTime() - new Date(a.date!).getTime();
      }
    );
  } else if (!spendingsarr && Incomearr) {
    combinedtransactions = [...Incomearr, ...plaidTransactions].sort((a, b) => {
      return new Date(b.date!).getTime() - new Date(a.date).getTime();
    });
  } else {
   
    combinedtransactions = [
      ...(Incomearr || []),
      ...(spendingsarr || []),
      ...plaidTransactions,
    ].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }
  return combinedtransactions;
}
