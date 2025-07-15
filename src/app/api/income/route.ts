import pool from "@/db/postgres";

/**
 * @swagger
 * /api/income:
 *   get:
 *     summary: Get income records with optional filtering
 *     description: Retrieves all income records or filtered income based on query parameters
 *     tags:
 *       - Income
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to fetch income for
 *         example: 1
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter income by category
 *         example: "Salary"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter income from this date onwards (inclusive)
 *         example: "2025-07-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter income up to this date (inclusive)
 *         example: "2025-07-31"
 *     responses:
 *       200:
 *         description: Successfully retrieved income records
 *       400:
 *         description: Bad request - missing user_id
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new income record
 *     description: Adds a new income record to the user's financial data
 *     tags:
 *       - Income
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
 *                 description: The user ID who owns this income
 *                 example: 1
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: The income amount (up to 12 digits, 2 decimal places)
 *                 example: 2000.00
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the income (YYYY-MM-DD)
 *                 example: "2025-07-10"
 *               category:
 *                 type: string
 *                 maxLength: 100
 *                 description: Income category (optional)
 *                 example: "Salary"
 *               method:
 *                 type: string
 *                 maxLength: 50
 *                 description: Payment method (optional)
 *                 example: "Bank Transfer"
 *               description:
 *                 type: string
 *                 description: Description of the income (optional)
 *                 example: "Monthly salary payment"
 *     responses:
 *       201:
 *         description: Income created successfully
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update an existing income record
 *     description: Updates an income record by income_id
 *     tags:
 *       - Income
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - income_id
 *             properties:
 *               income_id:
 *                 type: integer
 *                 description: The income ID to update
 *                 example: 1
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Updated income amount
 *                 example: 2100.00
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated date
 *                 example: "2025-07-10"
 *               category:
 *                 type: string
 *                 maxLength: 100
 *                 description: Updated income category
 *                 example: "Salary"
 *               method:
 *                 type: string
 *                 maxLength: 50
 *                 description: Updated payment method
 *                 example: "Bank Transfer"
 *               description:
 *                 type: string
 *                 description: Updated description
 *                 example: "Updated monthly salary"
 *     responses:
 *       200:
 *         description: Income updated successfully
 *       400:
 *         description: Bad request - missing income_id
 *       404:
 *         description: Income not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an income record
 *     description: Deletes an income record by income_id
 *     tags:
 *       - Income
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - income_id
 *             properties:
 *               income_id:
 *                 type: integer
 *                 description: The income ID to delete
 *                 example: 1
 *     responses:
 *       200:
 *         description: Income deleted successfully
 *       400:
 *         description: Bad request - missing income_id
 *       404:
 *         description: Income not found
 *       500:
 *         description: Internal server error
 */

// GET - Fetch income records with optional filtering
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
    let query = 'SELECT * FROM "income" WHERE user_id = $1';
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

    // Get user currency
    const usercurrencyquery = await pool.query(
      'SELECT Currency FROM "User" WHERE user_id = $1',
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

    const { user_id, amount, date, category, method, description } = body;

    // Validate required fields
    if (!user_id || !amount || !date) {
      return Response.json(
        { error: "user_id, amount, and date are required" },
        { status: 400 }
      );
    }

    // Insert income into database
    const result = await pool.query(
      'INSERT INTO "income" (user_id, amount, date, category, method, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        user_id,
        amount,
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
    } catch (jsonError) {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { income_id, amount, date, category, method, description } = body;

    if (!income_id) {
      return Response.json({ error: "income_id is required" }, { status: 400 });
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const params: (string | number)[] = [income_id];
    let paramIndex = 2;

    if (amount !== undefined) {
      updateFields.push(`amount = $${paramIndex}`);
      params.push(amount);
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
    } catch (jsonError) {
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
