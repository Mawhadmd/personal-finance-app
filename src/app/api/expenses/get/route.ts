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