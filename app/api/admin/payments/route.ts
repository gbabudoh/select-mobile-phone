import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — Payment monitoring: transactions + revenue
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30";
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;
  const since = new Date();
  since.setDate(since.getDate() - parseInt(period));

  try {
    const orderWhere: Record<string, unknown> = { createdAt: { gte: since } };
    if (status) orderWhere.status = status;

    const [
      transactions,
      transactionCount,
      revenueOverview,
      escrowOverview,
      commissionRevenue,
    ] = await Promise.all([
      // Transaction list
      prisma.order.findMany({
        where: orderWhere as Parameters<typeof prisma.order.findMany>[0] extends { where?: infer W } ? W : never,
        include: {
          buyer: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
          escrow: { select: { id: true, status: true, amount: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: orderWhere as Parameters<typeof prisma.order.count>[0] extends { where?: infer W } ? W : never }),
      // Revenue overview
      prisma.order.aggregate({
        where: { 
          status: { in: ["COMPLETED", "DELIVERED", "BUYER_CONFIRMED"] },
          createdAt: { gte: since },
        },
        _sum: { totalAmount: true, tax: true, shippingCost: true },
        _count: true,
      }),
      // Escrow overview
      prisma.escrow.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { status: "HOLDING" },
      }),
      // Commission revenue
      prisma.platformCommission.aggregate({
        where: { createdAt: { gte: since } },
        _sum: { commissionAmount: true, bountyFee: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      transactions,
      pagination: { page, limit, total: transactionCount, totalPages: Math.ceil(transactionCount / limit) },
      overview: {
        gmv: revenueOverview._sum.totalAmount || 0,
        taxCollected: revenueOverview._sum.tax || 0,
        shippingRevenue: revenueOverview._sum.shippingCost || 0,
        completedOrders: revenueOverview._count,
        escrowHoldings: escrowOverview._sum.amount || 0,
        escrowCount: escrowOverview._count,
        commissionEarned: commissionRevenue._sum.commissionAmount || 0,
        bountyFees: commissionRevenue._sum.bountyFee || 0,
        totalPlatformRevenue: (commissionRevenue._sum.commissionAmount || 0) + (commissionRevenue._sum.bountyFee || 0),
      },
    });
  } catch (err) {
    console.error("Payments GET error:", err);
    return NextResponse.json({ error: "Failed to fetch payment data" }, { status: 500 });
  }
}
