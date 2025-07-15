import { Plus } from "lucide-react";
import React, { useActionState } from "react";
import { AddExpense } from "./AddTransactionsServerAction";

export default function ExpenseForm() {
  const [Customcategory, setCustomcategory] = React.useState(false);
  const CustomcategoryHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Other") {
      setCustomcategory(true);
    } else {
      setCustomcategory(false);
    }
  };
  const [state, action, pending] = useActionState(AddExpense, {
    error: "",
    success: false,
  });

  return (
    <form action={action} className="flex flex-col gap-4 mt-4">
      {state.error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="text-green-500 text-sm bg-green-50 p-2 rounded">
          Expense added successfully!
        </div>
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
        className="border rounded p-2 focus:outline-none focus:ring"
        required
        name={`${Customcategory ? "" : "category"}`}
        onChange={CustomcategoryHandle}
      >
        <option disabled defaultValue="" defaultChecked>
          category
        </option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Health">Health</option>
        <option value="Other">
          <Plus className="inline w-4 h-4 mr-1" />
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
        rows={2}
      />
      <select
        name="Method"
        id="method"
        className="border rounded p-2 focus:outline-none focus:ring text-text"
      >
        <option defaultChecked value="Credit Card">
          Credit Card
        </option>
        <option value="Debit Card">Debit Card</option>
        <option value="Cash">Cash</option>
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="Other">Other</option>
      </select>
      <small className="text-muted">You are X amount away of your budget</small>

      <button
        type="submit"
        disabled={pending}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors shadow-custom"
      >
        {pending ? "Adding Expense..." : "Add Expense"}
      </button>
    </form>
  );
}
