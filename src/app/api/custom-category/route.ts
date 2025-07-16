import pool from "@/db/postgres";

/**
 * @swagger
 * /api/custom-category:
 *   get:
 *     summary: Get custom categories for a user
 *     description: Retrieves all custom categories created by the user
 *     tags:
 *       - Custom Categories
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to fetch custom categories for
 *         example: 1
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by category type
 *         example: "income"
 *     responses:
 *       200:
 *         description: Successfully retrieved custom categories
 *       400:
 *         description: Bad request - missing user_id
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new custom category
 *     description: Adds a new custom category for the user
 *     tags:
 *       - Custom Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - name
 *               - type
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The user ID who owns this category
 *                 example: 1
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: The category name
 *                 example: "Crypto Trading"
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 description: Category type
 *                 example: "income"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 */

// GET - Retrieve custom categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const type = searchParams.get("type");

    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    let query = "SELECT * FROM custom_category WHERE user_id = $1";
    const params: (number | string)[] = [parseInt(user_id)];

    if (type) {
      query += " AND type = $2";
      params.push(type);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);

    const categories = result.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      type: row.type,
      created_at: row.created_at,
    }));

    return Response.json({
      message: "Custom categories retrieved successfully",
      categories,
      count: categories.length,
      filters: { user_id: parseInt(user_id), type },
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to fetch custom categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new custom category
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

    const { user_id, name, type } = body;

    // Validate required fields
    if (!user_id || !name || !type) {
      return Response.json(
        { error: "user_id, name, and type are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== "income" && type !== "expense") {
      return Response.json(
        { error: "type must be either 'income' or 'expense'" },
        { status: 400 }
      );
    }

    // Check if category already exists for this user
    const existingResult = await pool.query(
      "SELECT id FROM custom_category WHERE user_id = $1 AND name = $2 AND type = $3",
      [user_id, name, type]
    );

    if (existingResult.rows.length > 0) {
      return Response.json(
        {
          error:
            "A custom category with this name already exists for this type",
        },
        { status: 400 }
      );
    }

    // Insert new custom category
    const result = await pool.query(
      "INSERT INTO custom_category (user_id, name, type) VALUES ($1, $2, $3) RETURNING *",
      [user_id, name, type]
    );

    const newCategory = result.rows[0];

    return Response.json(
      {
        message: "Custom category created successfully",
        category: {
          id: newCategory.id,
          user_id: newCategory.user_id,
          name: newCategory.name,
          type: newCategory.type,
          created_at: newCategory.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to create custom category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a custom category
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

    const { id } = body;

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    // Delete custom category from database
    const result = await pool.query(
      "DELETE FROM custom_category WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Custom category not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Custom category deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { error: "Failed to delete custom category" },
      { status: 500 }
    );
  }
}
