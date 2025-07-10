

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

