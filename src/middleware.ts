import { NextResponse, NextRequest } from "next/server";
import { decodeJwt, jwtVerify } from "jose";
import { JWTExpired } from "jose/errors";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const Cookies = request.cookies;
  if (
    pathname === "/" ||
    pathname.startsWith("/#") ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff)$/i.test(pathname)
    || pathname.endsWith('/api-doc')
  ) {
    return NextResponse.next();
  }
  const Secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isVerifyApi =
    pathname == "/api/auth/verifyEmail" ||
    pathname == "/api/auth/SendVerificationEmail";
  const AccessToken = Cookies.get("AccessToken");
  const RefreshToken = Cookies.get("RefreshToken");
  console.log(pathname);
  let AccessTokenpayload;
  if (!AccessToken) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "No Access token" }, { status: 401 });
    }
    if (isAuthPage) {
      return NextResponse.next();
    }
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  } //This will check if the tokens exists in the cookies
  if (!RefreshToken) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "No Refresh token" }, { status: 401 });
    }
    if (isAuthPage) {
      return NextResponse.next();
    }
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  //#TODO make all api routes use the id/emails from the token only

  try {
    AccessTokenpayload = decodeJwt(AccessToken.value);
    await jwtVerify(AccessToken.value, Secret);

    if (pathname !== "/VerifyEmail") {
      if (isVerifyApi) {
        return NextResponse.next();
      }
      if (!AccessTokenpayload?.is_verified) {
        console.log("User is not verified, redirecting to verify email");
        if (pathname.startsWith("/api")) {
          return NextResponse.json(
            { error: "User not verified" },
            { status: 401 }
          );
        }
        return NextResponse.redirect(new URL("/VerifyEmail", request.url));
      }
    } else {
      console.log("User is on verify email page, allowing access");
      return NextResponse.next();
    }

    if (pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (error) {
    if (error instanceof JWTExpired) {
      console.log("Token Expired, trying to refresh");
      try {
        await jwtVerify(
          RefreshToken.value,
          new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!)
        );
        console.log("Refresh token is valid, proceeding to refresh");
      } catch (error) {
        console.log("Refresh token expired or invalid, redirecting to login");
        if (pathname.startsWith("/api")) {
          return NextResponse.json(
            { error: "Refresh token expired" },
            { status: 401 }
          );
        }
        // If the token is invalid, redirect to login
        console.log("Invalid token:", error);
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("AccessToken");
        response.cookies.delete("RefreshToken");
        return response;
      }
      const refresh = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh_token`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: AccessTokenpayload?.user_id,
            refresh_token: RefreshToken?.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const refreshData = await refresh?.json();
      if (!refresh.ok) {
        console.log(
          "Failed to refresh token, redirecting to login",
          refreshData.error
        );
        if (!isAuthPage)
          return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL));
      } else {
        console.log("Token refreshed successfully", refreshData.error);
        let response;
        if (isAuthPage)
        response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
        else
          response = NextResponse.next();
        response.cookies.set("AccessToken", refreshData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        
        return response;
      }
    }
    // If the token is invalid, redirect to login
    console.log("Invalid token:", error);

    // Clear invalid token
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("AccessToken");
    response.cookies.delete("RefreshToken");

    return response;
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/refresh_token (refresh token API route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth/refresh_token|_next/static|_next/image|favicon.ico).*)",
  ],
};
