import { Expense } from "@/models";
import React from "react";

const Expenses = async () => {
  const spendingrequest = await fetch(
    "http://localhost:3000/api/expenses?user_id=1",
    { method: "GET" }
  );
  const spendingjson = await spendingrequest.json();
  const spendingarr = spendingjson.expenses as Array<Expense>;
  const spending = spendingarr.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);
  console.log("Spending data:", spending);
  if (!spending) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2 className=" font-bold text-2xl">Your Expenses</h2>
      <div className="flex flex-col mt-2 bac">
        <div>Your spending this month is around {spending} </div>
      </div>
    </div>
  );
};

export default Expenses;
