import AddtransactionModal from "@/app/(Main)/(pages)/(authinticated)/components/AddTransactionsModal/AddTransactionsModal";
import Chart from "@/app/(Main)/(pages)/(authinticated)/(Expense&Income)/components/OneLinechart";
import TransactionCard from "@/app/(Main)/(pages)/(authinticated)/components/TransactionCard";
import currencies from "@/constants/currencies";

import { CircleOff } from "lucide-react";
import { cookies } from "next/headers";
import React from "react";
import AmountCard from "../components/AmountCard";

import { decodeJwt } from "jose";

import combineTransactions from "../../dashboard/util/combineTransactions";
import { Income } from "@/models";
import  getDBIncome from "@/lib/utils/helpers/getDBIncome";
import { fetchPlaidTransactions } from "@/lib/utils/helpers/plaid/fetchPlaidTransactions";

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
        <div className="flex justify-between gap-2 items-start flex-1 h-100">
          <div className="shadow-custom w-1/3 bg-foreground rounded-xl p-2 py-4 flex flex-col h-full justify-between">
            <h3 className="border-b py-1 border-border my-2">Latest</h3>
            <div className="flex-1 overflow-y-scroll">
              {combinedtransactions.length > 0 ? (
              combinedtransactions
   
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
            </div>
            <div className="flex space-x-2 mt-2 ">
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
