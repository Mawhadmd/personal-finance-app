import { Plus } from "lucide-react";
import React, { useActionState } from "react";
import { AddIncome } from "./AddTransactionsServerAction";

export default function IncomeForm() {
  const [Customcategory, setCustomcategory] = React.useState(false);
  const CustomcategoryHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Other") {
      setCustomcategory(true);
    } else {
      setCustomcategory(false);
    }
  };
  const [state, action, pending] = useActionState(AddIncome, {
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
          Income added successfully!
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
        <option value="Salary">Salary</option>
        <option value="Freelance">Freelance</option>
        <option value="Investment">Investment</option>
        <option value="Business">Business</option>
        <option value="Gift">Gift</option>
        <option value="Bonus">Bonus</option>
        <option value="Rental">Rental Income</option>
        <option value="Other">
          <Plus className="inline w-4 h-4 mr-1" />
          Add category
        </option>
      </select>

      {Customcategory && (
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
          placeholder="Category"
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
        <option defaultChecked value="Bank Transfer">
          Bank Transfer
        </option>
        <option value="Direct Deposit">Direct Deposit</option>
        <option value="Cash">Cash</option>
        <option value="Check">Check</option>
        <option value="PayPal">PayPal</option>
        <option value="Other">Other</option>
      </select>

      <small className="text-muted">
        This will be added to your total income
      </small>

      <button
        type="submit"
        disabled={pending}
        className="bg-accent hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors shadow-custom"
      >
        {pending ? "Adding Income..." : "Add Income"}
      </button>
    </form>
  );
}
