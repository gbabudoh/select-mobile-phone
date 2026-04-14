import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — List accounts with filters and pagination
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || undefined;
  const status = searchParams.get("status") || undefined;
  const verification = searchParams.get("verification") || undefined;
  const country = searchParams.get("country") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  try {
    const where: Record<string, unknown> = {};

    if (role) where.role = role;
    if (status) where.status = status;
    if (country) where.country = country;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by verification status (across all profile types)
    if (verification) {
      where.OR = [
        { wholesalerProfile: { verification } },
        { retailerProfile: { verification } },
        { networkProviderProfile: { verification } },
        { sellerProfile: { verification } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: where as Parameters<typeof prisma.user.findMany>[0] extends { where?: infer W } ? W : never,
        include: {
          wholesalerProfile: true,
          retailerProfile: true,
          networkProviderProfile: true,
          sellerProfile: true,
          kycDocuments: { orderBy: { uploadedAt: "desc" } },
          _count: { select: { ordersAsSeller: true, ordersAsBuyer: true, listings: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: where as Parameters<typeof prisma.user.count>[0] extends { where?: infer W } ? W : never }),
    ]);

    return NextResponse.json({
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Accounts GET error:", err);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
