import { Expense } from "@/models";
import React from "react";
import {LineChart, CartesianGrid, Line, XAxis, YAxis, } from 'recharts'
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
        {/* <LineChart width={500} height={300} data={}>
    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
    <XAxis dataKey="name"/>
    <YAxis/>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
  </LineChart> */}
      </div>
    </div>
  );
};

export default Expenses;
