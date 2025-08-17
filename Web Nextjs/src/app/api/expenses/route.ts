import pool from "@/db/postgres";
import ConvertCurrency from "@/lib/utils/ConvertCurrency";
import { AccessToken } from "@/models/tokens";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

// GET - Fetch expenses with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
      const accessToken = (await cookies()).get('AccessToken')?.value;
        const { user_id } = decodeJwt(accessToken!) as AccessToken;
    const category = searchParams.get("category");
    let startDate: number | string | null = searchParams.get("startDate"); //  As in yyyy/mm/dd
    let endDate: number | string | null = searchParams.get("endDate");
    // startDate = startDate && new Date(startDate).getTime();
    // endDate = endDate && new Date(endDate).getTime();
    // Validate required user_id
    
    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    // Build dynamic query based on filters
    let query = 'SELECT * FROM "expenses" WHERE user_id = $1';
    const params: (string | number)[] = [parseInt(user_id)];
    let paramIndex = 2;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += " ORDER BY date DESC";

    const result = await pool.query(query, params);
    const usercurrencyquery = await pool.query(
      'SELECT currency FROM "users" WHERE user_id = $1',
      [parseInt(user_id)]
    );
    const userCurrencyResult = usercurrencyquery.rows[0]?.currency || "USD"; //

    // Format the response data
    const expenses = result.rows.map((row) => ({
      expense_id: row.expense_id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      date: row.date,
      category: row.category,
      description: row.description,
      method: row.method,
      currency: userCurrencyResult,
    }));

    return Response.json({
      message: "Expenses retrieved successfully",
      filters: { user_id: parseInt(user_id), category },
      expenses,
      count: expenses.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST - Create a new expense
export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!body) {
      return Response.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const {  amount, date, category, description, method } = body;
    const accesstoken = (await cookies()).get("AccessToken")?.value;
    const { user_id } = decodeJwt(accesstoken!) as AccessToken;
    // Validate required fields
    if ( !amount || !date) {
      return Response.json(
        { error: "amount, and date are required" },
        { status: 400 }
      );
    }
    const fromCurrency = await pool.query(
      'SELECT currency FROM "users" WHERE user_id = $1',
      [parseInt(user_id)]
    );
    const amountToUSD = ConvertCurrency({
      amount: amount,
      toCurrency: "USD",
      fromCurrency: fromCurrency.rows[0].currency, // optional, if not provided, it will be assumed that the amount is in USD
    });
    console.log(amountToUSD, amount);
    // Insert expense into database
    const result = await pool.query(
      'INSERT INTO "expenses" (user_id, amount, date, category, description, method) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        user_id,
        amountToUSD,
        date,
        category || null,
        description || null,
        method || null,
      ]
    );

    const newExpense = result.rows[0];

    return Response.json(
      {
        message: "Expense created successfully",
        expense: {
          expense_id: newExpense.expense_id,
          user_id: newExpense.user_id,
          amount: parseFloat(newExpense.amount),
          date: newExpense.date,
          category: newExpense.category,
          description: newExpense.description,
          method: newExpense.method,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing expense
export async function PUT(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { expense_id, amount, date, category, description, method } = body;

    if (!expense_id) {
      return Response.json(
        { error: "expense_id is required" },
        { status: 400 }
      );
    }
    const fromCurrency = await pool.query(
      'SELECT currency FROM "users" WHERE user_id = (SELECT user_id FROM "expenses" WHERE expense_id = $1)',
      [expense_id]
    );

    const amountToUSD = amount
      ? ConvertCurrency({
          amount: amount,
          toCurrency: "USD",
          fromCurrency: fromCurrency.rows[0].currency, // optional, if not provided, it will be assumed that the amount is in USD
        })
      : undefined;
    console.log(amountToUSD, amount);
    // Build dynamic update query
    const updateFields: string[] = [];
    const params: (string | number)[] = [expense_id];
    let paramIndex = 2;

    if (amountToUSD !== undefined) {
      updateFields.push(`amount = $${paramIndex}`);
      params.push(amountToUSD);
      paramIndex++;
    }

    if (date !== undefined) {
      updateFields.push(`date = $${paramIndex}`);
      params.push(date);
      paramIndex++;
    }

    if (category !== undefined) {
      updateFields.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }

    if (method !== undefined) {
      updateFields.push(`method = $${paramIndex}`);
      params.push(method);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const query = `UPDATE "expenses" SET ${updateFields.join(
      ", "
    )} WHERE expense_id = $1 RETURNING *`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }

    const updatedExpense = result.rows[0];

    return Response.json({
      message: "Expense updated successfully",
      expense: {
        expense_id: updatedExpense.expense_id,
        user_id: updatedExpense.user_id,
        amount: parseFloat(updatedExpense.amount),
        date: updatedExpense.date,
        category: updatedExpense.category,
        description: updatedExpense.description,
        method: updatedExpense.method,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an expense
export async function DELETE(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { expense_id } = body;

    if (!expense_id) {
      return Response.json(
        { error: "expense_id is required" },
        { status: 400 }
      );
    }

    // Delete expense from database
    const result = await pool.query(
      'DELETE FROM "expenses" WHERE expense_id = $1 RETURNING expense_id',
      [expense_id]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: "Expense not found" }, { status: 404 });
    }

    return Response.json({
      message: "Expense deleted successfully",
      expense_id: result.rows[0].expense_id,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
