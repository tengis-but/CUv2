import { NextResponse } from "next/server";

export async function middleware(request: { nextUrl: { pathname: string; }; url: any; cookies: { get: (arg0: string) => { (): any; new(): any; value: any; }; }; }) {
  // Log request details for debugging
  console.log("Middleware triggered for:", request.nextUrl.pathname);
  console.log("Request URL:", request.url);
  console.log("Session cookie:", request.cookies.get("session")?.value);

  // Get session cookie and define routes
  const sessionCookie = request.cookies.get("session")?.value;
  const publicRoutes = ["/login", "/api/login2"];
  const sensitiveRoutes = ["/users_management", "/role_management", "/pdf_management"];

  // Check if the route is public or sensitive
  const isPublicRoute = publicRoutes.some((route) => {
    const matches = request.nextUrl.pathname.startsWith(route);
    console.log(`Checking if ${request.nextUrl.pathname} starts with ${route}: ${matches}`);
    return matches;
  });
  const isSensitiveRoute = sensitiveRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  console.log("Is public route:", isPublicRoute);
  console.log("Is sensitive route:", isSensitiveRoute);

  // Redirect to /login if no valid session cookie and not a public route
  if (!sessionCookie || sessionCookie.trim() === "") {
    if (!isPublicRoute) {
      console.log("No valid session cookie, redirecting to /login");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const redirectUrl = new URL("/login", baseUrl);
      console.log("Redirecting to:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Verify session for sensitive routes
  if (sessionCookie && isSensitiveRoute) {
    try {
      console.log("Verifying session for sensitive route...");
      const response = await fetch("http://0.0.0.0:5002/check_auth", {
        method: "GET",
        headers: { Cookie: `session=${sessionCookie}` },
        credentials: "include",
      });
      console.log("check_auth response status:", response.status);
      if (!response.ok) {
        console.log("Session invalid, redirecting to /login");
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        return NextResponse.redirect(new URL("/login", baseUrl));
      }
      // Role-based check for admin routes
      if (request.nextUrl.pathname.startsWith("/users_management")) {
        const data = await response.json();
        console.log("User roleid:", data.roleid);
        if (data.roleid !== "1") {
          console.log("User not authorized for admin route, redirecting to /");
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
          return NextResponse.redirect(new URL("/", baseUrl));
        }
      }
    } catch (error) {
      console.error("Middleware check_auth error:", error);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      return NextResponse.redirect(new URL("/login", baseUrl));
    }
  }

  // Allow request to proceed
  console.log("Allowing request to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/users_management", "/role_management", "/task_schedule", "/pdf_management", "/api/:path*"],
};