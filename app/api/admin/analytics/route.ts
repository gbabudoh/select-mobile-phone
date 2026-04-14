import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — Platform-wide analytics
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30"; // days
  const since = new Date();
  since.setDate(since.getDate() - parseInt(period));

  try {
    const [
      totalUsers,
      newUsers,
      usersByRole,
      totalOrders,
      recentOrders,
      revenue,
      escrowVolume,
      disputeCount,
      topSellers,
      totalListings,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      // New users in period
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      // Users by role
      prisma.user.groupBy({ by: ["role"], _count: true }),
      // Total orders
      prisma.order.count(),
      // Orders in period
      prisma.order.count({ where: { createdAt: { gte: since } } }),
      // Total revenue (GMV)
      prisma.order.aggregate({
        where: { status: { in: ["COMPLETED", "DELIVERED", "BUYER_CONFIRMED"] } },
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
        _count: true,
      }),
      // Escrow volume
      prisma.escrow.aggregate({
        where: { status: "HOLDING" },
        _sum: { amount: true },
        _count: true,
      }),
      // Dispute count
      prisma.dispute.groupBy({ by: ["status"], _count: true }),
      // Top sellers by order count
      prisma.order.groupBy({
        by: ["sellerId"],
        _count: true,
        _sum: { totalAmount: true },
        orderBy: { _count: { sellerId: "desc" } },
        take: 10,
      }),
      // Total active listings
      prisma.listing.count({ where: { status: "ACTIVE" } }),
    ]);

    // Commission revenue
    const commission = await prisma.platformCommission.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { commissionAmount: true, bountyFee: true },
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        newUsers,
        totalOrders,
        recentOrders,
        totalListings,
        gmv: revenue._sum.totalAmount || 0,
        avgOrderValue: revenue._avg.totalAmount || 0,
        completedOrders: revenue._count,
        escrowHoldings: escrowVolume._sum.amount || 0,
        escrowCount: escrowVolume._count,
      },
      usersByRole,
      disputes: disputeCount,
      topSellers,
      commission: {
        totalCommission: commission._sum.commissionAmount || 0,
        totalBountyFees: commission._sum.bountyFee || 0,
      },
      period: parseInt(period),
    });
  } catch (err) {
    console.error("Analytics GET error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
