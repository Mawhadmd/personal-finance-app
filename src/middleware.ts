import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and public paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const tokencookie = request.cookies.get("token");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Check if user has a valid token
  let isValidToken = false;
  if (tokencookie) {
    try {
      jwt.verify(tokencookie.value, process.env.JWT_SECRET!);
      isValidToken = true;
    } catch (error) {
      console.log("Invalid token:", error);
      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      if (!isAuthPage) {
        return response;
      }
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isValidToken && isAuthPage) {
    console.log(
      "Authenticated user trying to access auth page, redirecting to home"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not authenticated and not on auth pages, redirect to login
  if (!isValidToken && !isAuthPage) {
    console.log("Unauthenticated user, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
