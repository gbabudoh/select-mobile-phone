import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — Full user detail
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        wholesalerProfile: true,
        retailerProfile: true,
        networkProviderProfile: true,
        sellerProfile: true,
        buyerProfile: true,
        kycDocuments: { orderBy: { uploadedAt: "desc" } },
        addresses: true,
        ordersAsBuyer: { take: 10, orderBy: { createdAt: "desc" } },
        ordersAsSeller: { take: 10, orderBy: { createdAt: "desc" } },
        listings: { take: 10, orderBy: { createdAt: "desc" } },
        raisedDisputes: { take: 5, orderBy: { createdAt: "desc" } },
        _count: {
          select: { ordersAsSeller: true, ordersAsBuyer: true, listings: true, reviews: true, reviewsReceived: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Account GET error:", err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PUT — Update account status, verification
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.status) updateData.status = body.status;
    if (body.role) updateData.role = body.role;
    if (body.name) updateData.name = body.name;

    const user = await prisma.user.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.user.update>[0]["data"],
    });

    // Update role-specific profile verification if provided
    if (body.verification) {
      const profileMap: Record<string, string> = {
        WHOLESALER: "wholesalerProfile",
        RETAILER: "retailerProfile",
        NETWORK_PROVIDER: "networkProviderProfile",
        INDIVIDUAL_SELLER: "sellerProfile",
      };

      const profileTable = profileMap[user.role];
      if (profileTable) {
        // Use dynamic update based on role
        switch (user.role) {
          case "WHOLESALER":
            await prisma.wholesalerProfile.updateMany({ where: { userId: id }, data: { verification: body.verification } });
            break;
          case "RETAILER":
            await prisma.retailerProfile.updateMany({ where: { userId: id }, data: { verification: body.verification } });
            break;
          case "NETWORK_PROVIDER":
            await prisma.networkProviderProfile.updateMany({ where: { userId: id }, data: { verification: body.verification } });
            break;
          case "INDIVIDUAL_SELLER":
            await prisma.individualSellerProfile.updateMany({ where: { userId: id }, data: { verification: body.verification } });
            break;
        }
      }
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Account PUT error:", err);
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}

// DELETE — Delete user account with safety checks
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    // Safety checks: no active orders, no escrow holdings
    const activeOrders = await prisma.order.count({
      where: { 
        OR: [{ buyerId: id }, { sellerId: id }],
        status: { in: ["PENDING_PAYMENT", "PAYMENT_HELD", "PROCESSING", "SHIPPED"] },
      },
    });

    if (activeOrders > 0) {
      return NextResponse.json(
        { error: "Cannot delete user with active orders. Resolve all orders first." },
        { status: 400 }
      );
    }

    const activeEscrows = await prisma.escrow.count({
      where: {
        OR: [{ buyerId: id }, { sellerId: id }],
        status: "HOLDING",
      },
    });

    if (activeEscrows > 0) {
      return NextResponse.json(
        { error: "Cannot delete user with active escrow holdings. Release or refund first." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Account DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
