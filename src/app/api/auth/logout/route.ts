import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookies = request.headers.get("cookie");
    const token = cookies?.split("; ").find((cookie) => cookie.startsWith("token="));
    if (!token) {
        return NextResponse.redirect('/login');
    }

  try {
    // Clear the token cookie
  
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    response.cookies.set("token", "", { path: "/", expires: new Date(0) });
    return response;
 
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed. Please try again." }, { status: 500 });
  }
}


