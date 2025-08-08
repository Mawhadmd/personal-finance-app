
import pool from "@/db/postgres";
import ConvertCurrency from "@/lib/utils/ConvertCurrency";
import { AccessToken } from "@/models/tokens";
import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';

// GET - Fetch income records with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = (await cookies()).get('AccessToken')?.value;
    const { user_id } = decodeJwt(accessToken!) as AccessToken;
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate required user_id
    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    // Build dynamic query based on filters
    let query = 'SELECT * FROM "income" WHERE user_id = $1';

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

    // Get user currency
    const usercurrencyquery = await pool.query(
      'SELECT Currency FROM "users" WHERE user_id = $1',
      [parseInt(user_id)]
    );
    const userCurrencyResult = usercurrencyquery.rows[0]?.currency || "USD";

    // Format the response data
    const income = result.rows.map((row) => ({
      income_id: row.income_id,
      user_id: row.user_id,
      amount: parseFloat(row.amount),
      date: row.date,
      category: row.category,
      method: row.method,
      description: row.description,
      currency: userCurrencyResult,
    }));

    return Response.json({
      message: "Income retrieved successfully",
      filters: {
        user_id: parseInt(user_id),
        category /* startDate, endDate */,
      },
      income,
      count: income.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: "Failed to fetch income" }, { status: 500 });
  }
}

// POST - Create a new income record
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

    const { user_id, amount, date, category, method, description } = body;

    // Validate required fields
    if (!user_id || !amount || !date) {
      return Response.json(
        { error: "user_id, amount, and date are required" },
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
    // Insert income into database
    const result = await pool.query(
      'INSERT INTO "income" (user_id, amount, date, category, method, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        user_id,
        amountToUSD,
        date,
        category || null,
        method || null,
        description || null,
      ]
    );

    const newIncome = result.rows[0];

    return Response.json(
      {
        message: "Income created successfully",
        income: {
          income_id: newIncome.income_id,
          user_id: newIncome.user_id,
          amount: parseFloat(newIncome.amount),
          date: newIncome.date,
          category: newIncome.category,
          method: newIncome.method,
          description: newIncome.description,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: "Failed to create income" }, { status: 500 });
  }
}

// PUT - Update an existing income record
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

    const { income_id, amount, date, category, method, description } = body;

    if (!income_id) {
      return Response.json({ error: "income_id is required" }, { status: 400 });
    }
    const fromCurrency = await pool.query(
      'SELECT currency FROM "users" WHERE user_id = (SELECT user_id FROM "income" WHERE income_id = $1)',
      [income_id]
    );
    const amountToUSD = amount
      ? ConvertCurrency({
          amount: amount,
          toCurrency: "USD",
          fromCurrency: fromCurrency.rows[0].currency, // optional, if not provided, it will be assumed that the amount is in USD
        })
      : undefined;
    // Build dynamic update query
    const updateFields: string[] = [];
    const params: (string | number)[] = [income_id];
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

    if (method !== undefined) {
      updateFields.push(`method = $${paramIndex}`);
      params.push(method);
      paramIndex++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const query = `UPDATE "income" SET ${updateFields.join(
      ", "
    )} WHERE income_id = $1 RETURNING *`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return Response.json({ error: "Income not found" }, { status: 404 });
    }

    const updatedIncome = result.rows[0];

    return Response.json({
      message: "Income updated successfully",
      income: {
        income_id: updatedIncome.income_id,
        user_id: updatedIncome.user_id,
        amount: parseFloat(updatedIncome.amount),
        date: updatedIncome.date,
        category: updatedIncome.category,
        method: updatedIncome.method,
        description: updatedIncome.description,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: "Failed to update income" }, { status: 500 });
  }
}

// DELETE - Delete an income record
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

    const { income_id } = body;

    if (!income_id) {
      return Response.json({ error: "income_id is required" }, { status: 400 });
    }

    // Delete income from database
    const result = await pool.query(
      'DELETE FROM "income" WHERE income_id = $1 RETURNING income_id',
      [income_id]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: "Income not found" }, { status: 404 });
    }

    return Response.json({
      message: "Income deleted successfully",
      income_id: result.rows[0].income_id,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ error: "Failed to delete income" }, { status: 500 });
  }
}
