/**
 * @swagger
 * /api/expenses/add:
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
 *               - amount
 *               - description
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The expense amount
 *                 example: 25.50
 *               description:
 *                 type: string
 *                 description: Description of the expense
 *                 example: "Lunch at restaurant"
 *               category:
 *                 type: string
 *                 description: Expense category
 *                 example: "Food & Dining"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the expense
 *                 example: "2025-07-10"
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method used
 *                 example: "Credit Card"
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense created successfully"
 *                 expense:
 *                   type: object
 *                   description: The created expense object
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request body"
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Expected body: { amount, description, category, date, paymentMethod }

    // TODO: Validate input and save to database
    return Response.json(
      {
        message: "Expense created successfully",
        expense: body,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
