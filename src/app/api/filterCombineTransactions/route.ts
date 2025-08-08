import { fetchPlaidTransactions } from "@/lib/utils/helpers/plaid/PlaidHelpers";
import combineTransactions from "@/app/(Main)/(pages)/(authinticated)/dashboard/util/combineTransactions";
import { NextResponse } from "next/server";
import GetUserIncomeList from "@/lib/utils/helpers/getUserIncomeList";
import GetUserExpensesList from "@/lib/utils/helpers/getUserExpensesList";
import { Expense, Income } from "@/models";

export async function GET() {
  const plaidTransactions = await fetchPlaidTransactions();
  if (!plaidTransactions) {
    return new Response(JSON.stringify({ error: "No transactions found" }), {
      status: 404,
    });
  }
  const Incomearr = await GetUserIncomeList();
  const spendingsarr = await GetUserExpensesList();
  return NextResponse.json(
    {
      combinedtransactions: combineTransactions<Income | Expense>(
        Incomearr,
        spendingsarr,
        plaidTransactions.allTransactions
      ),
      Incomearr,
      spendingsarr,
    },
    {
      status: 200,
    }
  );
}
