export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/buyer/dashboard/:path*",
    "/retailer/dashboard/:path*",
    "/wholesaler/dashboard/:path*",
    "/network-provider/dashboard/:path*",
    "/individual/dashboard/:path*",
  ],
};
