import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  const role = request.cookies.get("role")?.value?.toLowerCase() || "nonuser";
  let path = request.nextUrl.pathname;

  // Normalize path
  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  // Define routes
  const publicRoutes = [
    "/",
    "/map",
    "/auth/sign-up",
    "/auth/sign-in",
    "/auth/otp",
    "/auth/forget-password",
    "/leaderboard",
    "/report/reports",
    "/resources/aboutus",
  ];
  const adminRoutes = [
    "/admin",
    "/admin/reports/processed",
    "/admin/profile/edit",
    "/report/[id]",
  ];
  const userRoutes = [
    "/report/[id]",
    "/report/reports",
    "/user/profile/edit",
    "/user/leave-a-review",
    "/user/my-reports",
    "/user/ticket",
    "/user/submit-ticket",
  ];

  // Check if path matches any route category
  const isPublic = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  const isAdminRoute = adminRoutes.some(
    (route) =>
      path.startsWith(route) ||
      (route === "/report/[id]" && /^\/report\/[^/]+$/.test(path))
  );
  const isUserRoute = userRoutes.some(
    (route) =>
      path.startsWith(route) ||
      (route === "/report/[id]" && /^\/report\/[^/]+$/.test(path))
  );

  // Always allow 404 page
  if (path === "/404") return NextResponse.next();

  // Block non-authenticated users from protected routes
  if (!token || role === "nonuser") {
    return isPublic
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Admin access control
  if (role === "admin" && token) {
    if (isPublic || isAdminRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/404", request.url));
  }

  // User access control
  if (role === "user" && token) {
    if (isPublic || isUserRoute) return NextResponse.next();
    // Block any admin route access
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
    return NextResponse.redirect(new URL("/404", request.url));
  }

  // Fallback for invalid roles
  return NextResponse.redirect(new URL("/404", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|ico)$).*)",
  ],
};
