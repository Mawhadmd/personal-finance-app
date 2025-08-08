import AddtransactionModal from "@/app/(Main)/(pages)/(authinticated)/components/AddTransactionsModal/AddTransactionsModal";
import Chart from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/components/OneLinechart";
import TransactionCard from "@/app/(Main)/(pages)/(authinticated)/components/TransactionCard";
import currencies from "@/constants/currencies";

import { CircleOff } from "lucide-react";
import { cookies } from "next/headers";
import React from "react";
import AmountCard from "../components/AmountCard";

import { decodeJwt } from "jose";
import { getDBIncome } from "@/lib/utils/helpers/DBTransactionsHelper";

import { fetchPlaidTransactions } from "@/lib/utils/helpers/plaid/PlaidHelpers";
import combineTransactions from "../../dashboard/util/combineTransactions";
import { Income } from "@/models";

const IncomePage = async () => {
  const AccessToken = (await cookies()).get("AccessToken")?.value;

  const { currency }: { currency: string } = decodeJwt(AccessToken!)!;

  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol;

  const { Incomearr, totalIncome, incomeThisMonth, incomeLastMonth } =
    await getDBIncome(currency);
  const plaidData = await fetchPlaidTransactions("income");
  const {
    allTransactions: plaidTransactions,
   plaidTotalIncome,
  plaidIncomeThisMonth,
 plaidIncomeLastMonth,
  } = plaidData;
  const combinedtransactions: Array<Income> = combineTransactions<Income>(
    Incomearr,
    [],
    plaidTransactions
  );

  // Combine database and Plaid amounts
  const combinedTotalIncome = totalIncome + plaidTotalIncome!;
  const combinedIncomeThisMonth = incomeThisMonth + plaidIncomeThisMonth!;
  const combinedIncomeLastMonth = incomeLastMonth + plaidIncomeLastMonth!;

  return (
    <>
      <div className="flex flex-col mt-2 h-full ">
        <h2 className="font-bold text-2xl">Your Income</h2>
        <div className="flex   space-x-2  pb-2">
          <AmountCard
            amount={combinedIncomeThisMonth}
            label="This month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={combinedIncomeLastMonth}
            label="Last month"
            currencySymbol={currencySymbol}
          />
          <AmountCard
            amount={combinedTotalIncome}
            label="Overall"
            currencySymbol={currencySymbol}
          />
        </div>
        <div className="flex justify-between gap-2 items-start flex-1">
          <div className="shadow-custom w-1/3 bg-foreground rounded-xl p-2 py-4 flex flex-col h-full">
            <h3 className="border-b py-1 border-border my-2">Latest</h3>
            {combinedtransactions.length > 0 ? (
              combinedtransactions
                .slice(0, 3)
                .map((income) => (
                  <TransactionCard
                    key={income.income_id}
                    transaction={income}
                    type="income"
                    currencySymbol={currencySymbol}
                  />
                ))
            ) : (
              <div className="py-4 flex-1 text-muted flex flex-col items-center justify-center ">
                <CircleOff className="w-1/3 h-fit text-red-500" />{" "}
                <h3 className="text-center">
                  You have no recent income recorded.
                </h3>
              </div>
            )}
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg w-fit bg-foreground text-accent border border-border hover:border-white cursor-pointer transition-colors text-start">
                See All
              </button>
              <AddtransactionModal type="income" />
            </div>
          </div>
          <div className="shadow-custom  h-full bg-foreground rounded-xl  w-2/3 flex justify-center items-center">
            {combinedtransactions.length > 0 ? (
              <Chart data={combinedtransactions} />
            ) : (
              <div className="text-muted text-3xl flex items-center justify-center flex-1">
                <p>No income recorded for this month.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IncomePage;
