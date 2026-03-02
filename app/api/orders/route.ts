import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Create a Normal Order with Escrow
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyerId, sellerId, items, shippingAddressId, country } = body;

    if (!buyerId || !sellerId || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const listing = item.listingId
        ? await prisma.listing.findUnique({ where: { id: item.listingId } })
        : null;
      const plan = item.networkPlanId
        ? await prisma.networkPlan.findUnique({ where: { id: item.networkPlanId } })
        : null;

      const unitPrice = listing?.price || plan?.monthlyPrice || 0;
      const qty = item.quantity || 1;
      const totalPrice = unitPrice * qty;
      subtotal += totalPrice;

      orderItems.push({
        listingId: item.listingId || null,
        networkPlanId: item.networkPlanId || null,
        quantity: qty,
        unitPrice,
        totalPrice,
      });
    }

    const tax = subtotal * 0.08; // Simplified tax
    const shippingCost = 9.99;
    const totalAmount = subtotal + tax + shippingCost;

    const order = await prisma.order.create({
      data: {
        buyerId,
        sellerId,
        orderType: "NORMAL",
        status: "PAYMENT_HELD",
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        shippingAddressId,
        country: country || "US",
        items: { create: orderItems },
        // Create escrow automatically
        escrow: {
          create: {
            buyerId,
            sellerId,
            amount: totalAmount,
            status: "HOLDING",
          },
        },
      },
      include: { items: true, escrow: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
