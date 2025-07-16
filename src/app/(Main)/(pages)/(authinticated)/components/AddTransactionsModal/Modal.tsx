import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import ExpenseForm from './ExpenseForm'
import IncomeForm from './IncomeForm'

export default function Modal({showAdd, setShowAdd}: {showAdd?: "income" | "expense", setShowAdd: (type?: "income" | "expense") => void}) {

  return (
   <AnimatePresence mode="wait">
            {showAdd && (
              <motion.div
                key="modal-backdrop"
                onClick={() => setShowAdd(undefined)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-black/50 absolute inset-0 z-10"
              >
                <motion.div
                  key="modal-content"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                    <ExpenseForm button={<motion.button
                    className={
                      `bg-red-600 shadow-custom cursor-pointer hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors`
                        
                    }
                    layoutId={`${
                  "buttonExpense" 
                    }`}
                  >
                  Add Expense
                  </motion.button>}/>
                  ) : (
                    <IncomeForm button={<motion.button
                    className={
                       `bg-accent  cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-custom`
                    }
                    layoutId={`${
                     "buttonIncome"
                    }`}
                  >
                  Add Income
                  </motion.button>}/>
                  )}
                  
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
  )
}
