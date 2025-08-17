"use client";
import {  motion } from "framer-motion";
import React from "react";
import Modal from "./Modal";

export default function AddtransactionModal({type}: {type?: "income" | "expense"}) {
  const [showAdd, setShowAdd] = React.useState<"income" | "expense">();


  const toggleAddIncome = () => {
    setShowAdd("income");
  };
  const toggleAddExpense = () => {
    setShowAdd("expense");
  };
  if (type === "expense") {
    return <><Modal setShowAdd={setShowAdd} showAdd={showAdd}/><motion.button onClick={toggleAddExpense}
            layoutId="buttonExpense" className="p-2 rounded-lg w-fit bg-red-500 border border-border hover:border-white cursor-pointer transition-colors text-start">Add</motion.button></>
  }
  if (type === "income") {
    return <><Modal setShowAdd={setShowAdd} showAdd={showAdd}/><motion.button onClick={toggleAddIncome}
            layoutId="buttonIncome" className="p-2 rounded-lg w-fit bg-accent  text-white  border-border hover:border-white cursor-pointer transition-colors text-start">Add</motion.button></>
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <motion.h2 layoutId="NoTransaction" className="text-2xl font-semibold">
          No Transactions
        </motion.h2>
        <p className="text-muted text-lg">
          Start by adding your first transaction
        </p>
        <div className="flex gap-4 mt-6">
          <Modal setShowAdd={setShowAdd} showAdd={showAdd}/>
          <motion.button
            layoutId="buttonIncome"
            onClick={toggleAddIncome}
            className={`bg-accent  cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-custom`}
          >
            Add Income
          </motion.button>
          <motion.button
            onClick={toggleAddExpense}
            layoutId="buttonExpense"
            className={`bg-red-600 shadow-custom cursor-pointer hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors`}
          >
            Add Expense
          </motion.button>
        </div>
      </div>
    </div>
  );
}
