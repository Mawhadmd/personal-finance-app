import pool from "@/db/postgres";
import ConvertCurrency from "@/lib/ConvertCurrency";
/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get expenses with optional filtering
 *     description: Retrieves all expenses or filtered expenses based on query parameters
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to fetch expenses for
 *         example: 1
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter expenses by category
 *         example: "Food"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter expenses from this date onwards (inclusive)
 *         example: "2025-07-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter expenses up to this date (inclusive)
 *         example: "2025-07-31"
 *     responses:
 *       200:
 *         description: Successfully retrieved expenses
 *       400:
 *         description: Bad request - missing user_id
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new expense
 *     description: Adds a new expense record to the user's financial data
 *     tags:
 *       - Expenses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - amount
 *               - date
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The user ID who owns this expense
 *                 example: 1
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: The expense amount (up to 12 digits, 2 decimal places)
 *                 example: 25.50
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the expense (YYYY-MM-DD)
 *                 example: "2025-07-10"
 *               category:
 *                 type: string
 *                 maxLength: 50
 *                 description: Expense category (optional)
 *                 example: "Food"
 *               description:
 *                 type: string
 *                 description: Description of the expense (optional)
 *                 example: "Lunch at restaurant"
 *               method:
 *                 type: string
 *                 maxLength: 50
 *                 description: Payment method used (optional)
 *                 example: "Credit Card"
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update an existing expense
 *     description: Updates an expense record by expense_id
 *     tags:
 *       - Expenses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expense_id
 *             properties:
 *               expense_id:
 *                 type: integer
 *                 description: The expense ID to update
 *                 example: 1
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Updated expense amount
 *                 example: 30.00
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated date
 *                 example: "2025-07-10"
 *               category:
 *                 type: string
 *                 maxLength: 50
 *                 description: Updated expense category
 *                 example: "Food"
 *               description:
 *                 type: string
 *                 description: Updated description
 *                 example: "Updated lunch expense"
 *               method:
 *                 type: string
 *                 maxLength: 50
 *                 description: Updated payment method
 *                 example: "Debit Card"
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       400:
 *         description: Bad request - missing expense_id
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an expense
 *     description: Deletes an expense record by expense_id
 *     tags:
 *       - Expenses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expense_id
 *             properties:
 *               expense_id:
 *                 type: integer
 *                 description: The expense ID to delete
 *                 example: 1
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       400:
 *         description: Bad request - missing expense_id
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Internal server error
 */

// GET - Fetch expenses with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const category = searchParams.get("category");
    // const startDate = searchParams.get("startDate");
    // const endDate = searchParams.get("endDate");

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

    // if (startDate) {
    //   query += ` AND date >= $${paramIndex}`;
    //   params.push(startDate);
    //   paramIndex++;
    // }

    // if (endDate) {
    //   query += ` AND date <= $${paramIndex}`;
    //   params.push(endDate);
    //   paramIndex++;
    // }

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
    } catch (jsonError) {
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

    const { user_id, amount, date, category, description, method } = body;

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
    } catch (jsonError) {
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
    } catch (jsonError) {
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
