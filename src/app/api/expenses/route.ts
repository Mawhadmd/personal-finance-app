// GET - Fetch all expenses or filter by query params
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // TODO: Implement database query with filters
  return Response.json({
    message: "Fetching expenses",
    filters: { category, startDate, endDate },
  });
}

// POST - Create a new expense
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

// PUT - Update an existing expense (requires ID in request body)
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

// DELETE - Delete an expense (requires ID in request body)
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
