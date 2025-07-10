/**
 * @swagger
 * /api/expenses/add:
 *   get:
 *     description: Returns the user's expenses
 *     responses:
 *       200:
 *         description: Hello World!
 *       400:
 *        description: Invalid request body
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