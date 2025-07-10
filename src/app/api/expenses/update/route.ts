/**
 * @swagger
 * /api/expenses/update:
 *   put:
 *     summary: Update an existing expense
 *     description: Updates an expense record by ID
 *     tags:
 *       - Expenses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The expense ID to update
 *                 example: "expense_123"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Updated expense amount
 *                 example: 30.00
 *               description:
 *                 type: string
 *                 description: Updated description
 *                 example: "Updated lunch expense"
 *               category:
 *                 type: string
 *                 description: Updated expense category
 *                 example: "Food & Dining"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated date
 *                 example: "2025-07-10"
 *               paymentMethod:
 *                 type: string
 *                 description: Updated payment method
 *                 example: "Debit Card"
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense updated successfully"
 *                 id:
 *                   type: string
 *                   example: "expense_123"
 *                 updateData:
 *                   type: object
 *                   description: The updated fields
 *       400:
 *         description: Bad request - missing ID or invalid body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Expense ID is required"
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return Response.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    // TODO: Update expense in database
    return Response.json({
      message: "Expense updated successfully",
      id,
      updateData,
    });
  } catch (error) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
