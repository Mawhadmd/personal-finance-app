
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

