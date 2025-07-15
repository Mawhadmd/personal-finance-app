"use server";

import { Income } from "@/models";
import GetUserId from "@/lib/getUserId";
import { revalidatePath } from "next/cache";

export async function AddExpense(
  prevState: { error: string; success: boolean },
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  try {
    // Get user ID from token
    const user_id = await GetUserId();
    if (!user_id) {
      return {
        error: "User not authenticated",
        success: false,
      };
    }

    // Extract form data
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const method = formData.get("Method") as string;

    // Validate required fields
    if (!amount || !category || !date) {
      return {
        error: "Please fill in all required fields",
        success: false,
      };
    }

    // Call the expenses API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/expenses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          amount,
          date,
          category,
          description: description || null,
          method: method || null,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.error || "Failed to add expense",
        success: false,
      };
    }

    // Revalidate paths to update the UI
    revalidatePath("/dashboard");
    revalidatePath("/expenses");

    return {
      error: "",
      success: true,
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    return {
      error: "An unexpected error occurred",
      success: false,
    };
  }
}

export async function AddIncome(
  prevState: { error: string; success: boolean },
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  try {
    // Get user ID from token
    const user_id = await GetUserId();
    if (!user_id) {
      return {
        error: "User not authenticated",
        success: false,
      };
    }

    // Extract form data
    const amount = parseFloat(formData.get("amount") as string);
    const category = formData.get("category") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const method = formData.get("Method") as string;

    // Validate required fields
    if (!amount || !category || !date) {
      return {
        error: "Please fill in all required fields",
        success: false,
      };
    }

    // Call the income API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/income`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          amount,
          date,
          category, // API now expects 'category' field for income
          method: method || null,
          description: description || null,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.error || "Failed to add income",
        success: false,
      };
    }

    // Revalidate paths to update the UI
    revalidatePath("/dashboard");
    revalidatePath("/income");

    return {
      error: "",
      success: true,
    };
  } catch (error) {
    console.error("Error adding income:", error);
    return {
      error: "An unexpected error occurred",
      success: false,
    };
  }
}
