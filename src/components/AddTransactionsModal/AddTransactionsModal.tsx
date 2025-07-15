"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";

export default function AddtransactionModal() {
  const [showAdd, setShowAdd] = React.useState<"income" | "expense">();
 

  const toggleAddIncome = () => {
    setShowAdd("income");
  };
  const toggleAddExpense = () => {
    setShowAdd("expense");
  };

  const incomeButtonStyle =
    "bg-accent  cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-custom";
  const expenseButtonStyle =
    "bg-red-600 shadow-custom cursor-pointer hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors";
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     setShowAdd(undefined);
  //   };

  //   if (showAdd) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [showAdd]);
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
          <AnimatePresence mode="wait">
            {showAdd && (
              <motion.div
                key="modal-backdrop"
                onClick={() => setShowAdd(undefined)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/50 absolute inset-0 z-10"
              >
                <motion.div
                  key="modal-content"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="transition-all flex flex-col absolute rounded-2xl shadow-custom bg-foreground inset-1/2 z-11 w-100 h-fit translate-x-[-50%] p-4 translate-y-[-50%]"
                >
                  {" "}
                  <div>
                    <h2>Add an {showAdd}</h2>
                    <motion.small
                      className="text-small text-muted"
                      layoutId="NoTransaction"
                    >
                      No Transactions Yet
                    </motion.small>
                  </div>
                  {showAdd == "expense" ? (
                    <ExpenseForm />
                  ) : (
                    <IncomeForm />
                  )}
                  <motion.button
                    className={
                      showAdd == "expense"
                        ? expenseButtonStyle
                        : incomeButtonStyle
                    }
                    layoutId={`${
                      showAdd == "expense" ? "buttonExpense" : "buttonIncome"
                    }`}
                  >
                    {showAdd == "expense" ? "Add Expense" : "Add Income"}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            layoutId="buttonIncome"
            onClick={toggleAddIncome}
            className={incomeButtonStyle}
          >
            Add Income
          </motion.button>
          <motion.button
            onClick={toggleAddExpense}
            layoutId="buttonExpense"
            className={expenseButtonStyle}
          >
            Add Expense
          </motion.button>
        </div>
      </div>
    </div>
  );
}
