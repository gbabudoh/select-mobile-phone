import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Dashboard data endpoint — returns role-specific stats
// In production, protect with auth middleware
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ role: string }> }
) {
  try {
    const { role } = await params;
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, name: true, email: true },
    });

    if (!user || user.role.toLowerCase() !== role.toLowerCase()) {
      return NextResponse.json({ error: "User not found or role mismatch" }, { status: 404 });
    }

    let dashboardData: Record<string, unknown> = { user };

    switch (user.role) {
      case "WHOLESALER": {
        const [orders, listings, profile] = await Promise.all([
          prisma.order.count({ where: { sellerId: userId } }),
          prisma.listing.count({ where: { sellerId: userId, status: "ACTIVE" } }),
          prisma.wholesalerProfile.findUnique({
            where: { userId },
            include: { inventoryItems: true },
          }),
        ]);
        dashboardData = { ...dashboardData, totalOrders: orders, activeListings: listings, profile };
        break;
      }
      case "RETAILER": {
        const [orders, listings, profile] = await Promise.all([
          prisma.order.count({ where: { sellerId: userId } }),
          prisma.listing.count({ where: { sellerId: userId, status: "ACTIVE" } }),
          prisma.retailerProfile.findUnique({ where: { userId } }),
        ]);
        dashboardData = { ...dashboardData, totalOrders: orders, activeListings: listings, profile };
        break;
      }
      case "NETWORK_PROVIDER": {
        const profile = await prisma.networkProviderProfile.findUnique({
          where: { userId },
          include: { plans: true, esimPool: { where: { isAssigned: false } } },
        });
        const activePlans = profile?.plans.filter((p) => p.isActive).length ?? 0;
        const availableEsims = profile?.esimPool.length ?? 0;
        dashboardData = { ...dashboardData, activePlans, availableEsims, profile };
        break;
      }
      case "BUYER": {
        const [orders, preorders, tradeIns, profile] = await Promise.all([
          prisma.order.findMany({ where: { buyerId: userId }, orderBy: { createdAt: "desc" }, take: 10 }),
          prisma.preorder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
          prisma.tradeIn.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
          prisma.buyerProfile.findUnique({ where: { userId } }),
        ]);
        dashboardData = { ...dashboardData, recentOrders: orders, preorders, tradeIns, profile };
        break;
      }
      case "INDIVIDUAL_SELLER": {
        const [orders, listings, reviews, profile] = await Promise.all([
          prisma.order.count({ where: { sellerId: userId } }),
          prisma.listing.findMany({ where: { sellerId: userId }, orderBy: { createdAt: "desc" }, take: 20 }),
          prisma.review.findMany({ where: { targetId: userId }, orderBy: { createdAt: "desc" }, take: 10 }),
          prisma.individualSellerProfile.findUnique({ where: { userId } }),
        ]);
        dashboardData = { ...dashboardData, totalOrders: orders, listings, reviews, profile };
        break;
      }
      default:
        dashboardData = { ...dashboardData, message: "Admin dashboard" };
    }

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
