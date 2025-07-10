/**
 * @swagger
 * /api/expenses/delete:
 *   delete:
 *     summary: Delete an expense
 *     description: Deletes an expense record by ID
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
 *                 description: The expense ID to delete
 *                 example: "expense_123"
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expense deleted successfully"
 *                 id:
 *                   type: string
 *                   example: "expense_123"
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
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    // TODO: Delete expense from database
    return Response.json({
      message: "Expense deleted successfully",
      id,
    });
  } catch (error) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
}
