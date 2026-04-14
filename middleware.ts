import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Admin routes require ADMIN or SUPER_ADMIN role
    if (pathname.startsWith("/admin")) {
      const role = token?.role as string | undefined;
      if (!role || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Allow the middleware function above to handle role checks
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/buyer/dashboard/:path*",
    "/retailer/dashboard/:path*",
    "/wholesaler/dashboard/:path*",
    "/network-provider/dashboard/:path*",
    "/individual/dashboard/:path*",
    "/admin/:path*",
  ],
};
