import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — List disputes with filters
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const reason = searchParams.get("reason") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  try {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (reason) where.reason = reason;

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where: where as Parameters<typeof prisma.dispute.findMany>[0] extends { where?: infer W } ? W : never,
        include: {
          raisedBy: { select: { id: true, name: true, email: true, role: true } },
          defending: { select: { id: true, name: true, email: true, role: true } },
          order: { select: { id: true, orderNumber: true, totalAmount: true, status: true } },
          escrow: { select: { id: true, amount: true, status: true } },
          messages: { orderBy: { createdAt: "asc" }, take: 3 },
          _count: { select: { messages: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.dispute.count({ where: where as Parameters<typeof prisma.dispute.count>[0] extends { where?: infer W } ? W : never }),
    ]);

    return NextResponse.json({
      disputes,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Disputes GET error:", err);
    return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
  }
}
