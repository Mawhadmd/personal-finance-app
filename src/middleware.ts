import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const Cookies = request.cookies;
  // console.log("Request path:", pathname);
  const Secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const tokencookie = Cookies.get("AccessToken");
  // console.log(request.cookies)
  // console.log("Token:", tokencookie ? tokencookie.value : "No AccessToken cookie found");
  // Check if user has a valid token

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Handle verification token logic
  let isValidToken = false;
  if (tokencookie) {
    let payload;
    try {
      const data = await jwtVerify(tokencookie.value, Secret);
    isValidToken = true;
      if (pathname.startsWith("/api")) {
        return NextResponse.next();
      }
      payload = data.payload;
 
    } catch (error) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      console.log("Invalid token:", error);
      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("AccessToken");
      if (!isAuthPage) {
        return response;
      }
    }
  
    if (pathname !== "/VerifyEmail") {
      if (!payload?.is_verified) {
        return NextResponse.redirect(new URL("/VerifyEmail", request.url));
      }
    } else {
      console.log("User is on verify email page, allowing access");
      return NextResponse.next();
    }

  } else {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isValidToken && isAuthPage) {
    console.log(
      "Authenticated user trying to access auth page, redirecting to home"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
     * - api/auth/login (login API route)
     * - api/auth/register (register API route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth/login|api/auth/register|_next/static|_next/image|favicon.ico).*)",
  ],
};
