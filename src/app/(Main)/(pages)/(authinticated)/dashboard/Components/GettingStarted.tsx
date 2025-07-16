import { Wallet, Banknote, Target, LockIcon } from 'lucide-react'
import React from 'react'

export default function GettingStarted() {
  return (
         <div className="w-1/3 flex flex-col shadow-custom rounded-4xl p-6 bg-foreground">
            <h2> 👋 Let’s Get Started</h2>
            <p className="text-muted">
              Follow these steps to begin managing your finances:
            </p>

            <ul className="flex flex-col  justify-around flex-1">
              <li className="flex items-start  p-1  space-x-2">
                <Wallet className="size-10 text-accent " />
                <div>
                  <strong>Add Your First Income</strong>
                  <p className="text-muted">
                    Log your salary, freelance payment, or any other income
                    source.
                  </p>
                </div>
              </li>
              <li className="flex items-start  p-1  space-x-2">
                <Banknote className="size-10 text-accent" />
                <div>
                  <strong>Add an Expense</strong>
                  <p className="text-muted">
                    Track daily spending like food, bills, or subscriptions.
                  </p>
                </div>
              </li>
              <li className="flex items-start  p-1  space-x-2">
                <Target className="size-10 text-accent" />
                <div>
                  <strong>Set a Monthly Goal</strong>
                  <p className="text-muted">
                    Plan ahead by creating a spending or saving goal.
                  </p>
                </div>
              </li>
              <li className="flex items-start  p-1  space-x-2">
                <LockIcon className="size-10 text-accent" />
                <div>
                  <strong>Your Data Is Safe</strong>
                  <p className="text-muted">
                    We value your privacy and never share your data.
                  </p>
                </div>
              </li>
            </ul>
          </div>
  )
}
