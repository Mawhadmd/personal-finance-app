import { Plus } from "lucide-react";
import React, { useActionState } from "react";
import { AddExpense } from "./AddTransactionsServerAction";

export default function ExpenseForm(   {button}: {button: React.ReactNode}) {
  const [Customcategory, setCustomcategory] = React.useState(false);
  const CustomcategoryHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Other") {
      setCustomcategory(true);
    } else {
      setCustomcategory(false);
    }
  };
    const optionColors = {
    backgroundColor: "var(--color-background)",
    color: "var(--color-text)",
  };
  const [state, action, pending] = useActionState(AddExpense, {
    error: "",
    success: false,
  });

  return (
    <form action={action} className="flex flex-col gap-4 mt-4">
       {pending ? "Loading..." : (
      <>
        {state.error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="text-green-500 text-sm bg-green-50 p-2 rounded">
            Income added successfully!
          </div>
        )}
      </>
    )}

      <input
        type="number"
        min="0"
        step="0.01"
        className="border rounded px-3 py-2 focus:outline-none focus:ring"
        placeholder="Enter amount"
        required
        name="amount"
      />

      <select
        className="border  rounded p-2 focus:outline-none focus:ring"
        required
        name={`${Customcategory ? "" : "category"}`}
        onChange={CustomcategoryHandle}
      >
        <option style={optionColors}  disabled defaultChecked selected> 
          Select Category
        </option>
        <option style={optionColors} value="Food">Food</option>
        <option style={optionColors} value="Transport">Transport</option>
        <option style={optionColors} value="Entertainment">Entertainment</option>
        <option style={optionColors} value="Bills">Bills</option>
        <option style={optionColors} value="Health">Health</option>
        <option style={optionColors} value="Other">
          Add category
        </option>
      </select>

      {Customcategory && (
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
          placeholder="Catagory"
          type="text"
          name="category"
        />
      )}

      <input
        type="date"
        className="border rounded px-3 py-2 focus:outline-none focus:ring"
        required
        name="date"
      />

      <textarea
        className="border rounded px-3 py-2 focus:outline-none focus:ring resize-none"
        placeholder="description"
        name="description"
        rows={2}
      />
      <select
        name="Method"
        id="method"
        className="border rounded p-2 focus:outline-none focus:ring"
      >
        <option style={optionColors} disabled selected>
          Select Method
        </option>
        <option style={optionColors} value="Bank Transfer">
          Bank Transfer
        </option>
        <option style={optionColors} value="Direct Deposit">
          Direct Deposit
        </option>
        <option style={optionColors} value="Cash">
          Cash
        </option>
        <option style={optionColors} value="Check">
          Check
        </option>
        <option style={optionColors} value="PayPal">
          PayPal
        </option>
        <option style={optionColors} value="Other">
          Other
        </option>
      </select>
      <small className="text-muted">You are X amount away of your budget</small>

      {button}
    </form>
  );
}
