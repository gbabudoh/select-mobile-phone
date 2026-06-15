import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateTax } from "@/lib/tax";
import { PRODUCTS } from "@/lib/products";

// POST: Create a Normal Order with Escrow
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyerId, sellerId, items, shippingAddressId, country } = body;

    if (!buyerId || !sellerId || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Dynamic resolution of buyerId and sellerId to valid UUIDs in database
    let resolvedBuyerId = buyerId;
    if (buyerId.includes("@")) {
      const buyerUser = await prisma.user.findUnique({ where: { email: buyerId } });
      if (buyerUser) resolvedBuyerId = buyerUser.id;
    }
    if (!resolvedBuyerId || resolvedBuyerId.length < 10) {
      const defaultBuyer = await prisma.user.findFirst({ where: { role: "BUYER" } });
      resolvedBuyerId = defaultBuyer?.id || buyerId;
    }

    let resolvedSellerId = sellerId;
    if (sellerId.includes("@")) {
      const sellerUser = await prisma.user.findUnique({ where: { email: sellerId } });
      if (sellerUser) resolvedSellerId = sellerUser.id;
    } else if (["WHOLESALER", "RETAILER", "NETWORK_PROVIDER", "INDIVIDUAL_SELLER"].includes(sellerId.toUpperCase())) {
      const sellerUser = await prisma.user.findFirst({ where: { role: sellerId.toUpperCase() as any } });
      if (sellerUser) resolvedSellerId = sellerUser.id;
    } else {
      const sellerUser = await prisma.user.findFirst({
        where: {
          OR: [
            { name: { contains: sellerId, mode: "insensitive" } },
            { email: { contains: sellerId, mode: "insensitive" } }
          ]
        }
      });
      if (sellerUser) resolvedSellerId = sellerUser.id;
    }
    if (!resolvedSellerId || resolvedSellerId.length < 10) {
      const defaultSeller = await prisma.user.findFirst({ where: { role: "WHOLESALER" } });
      resolvedSellerId = defaultSeller?.id || sellerId;
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const listing = item.listingId
        ? await prisma.listing.findUnique({ where: { id: item.listingId } })
        : null;
      const plan = item.networkPlanId
        ? await prisma.networkPlan.findUnique({ where: { id: item.networkPlanId } })
        : null;

      let unitPrice = listing?.price || plan?.monthlyPrice || 0;

      // Fallback for static mock products (demo environment compatibility)
      if (unitPrice === 0) {
        const matchingProduct = PRODUCTS.find((p) => p.id === (item.listingId || item.networkPlanId));
        if (matchingProduct) {
          unitPrice = matchingProduct.price;
        }
      }

      const qty = item.quantity || 1;
      const totalPrice = unitPrice * qty;
      subtotal += totalPrice;

      orderItems.push({
        listingId: item.listingId && item.listingId.length > 5 ? item.listingId : null,
        networkPlanId: item.networkPlanId && item.networkPlanId.length > 5 ? item.networkPlanId : null,
        quantity: qty,
        unitPrice,
        totalPrice,
      });
    }

    // 1. Fetch shipping address details or create address dynamically to run state/province tax rules
    let finalAddressId = shippingAddressId || null;
    let shipCountry = country || "US";
    let shipState = shipCountry === "CA" ? "ON" : "NY";
    let shipZip = shipCountry === "CA" ? "M5V 2T6" : "10001";

    if (body.shippingAddress) {
      const newAddress = await prisma.address.create({
        data: {
          userId: resolvedBuyerId,
          label: "Shipping Address",
          line1: body.shippingAddress.line1,
          line2: body.shippingAddress.line2 || "",
          city: body.shippingAddress.city,
          state: body.shippingAddress.state,
          postalCode: body.shippingAddress.postalCode,
          country: body.shippingAddress.country || "US",
        },
      });
      finalAddressId = newAddress.id;
      shipCountry = newAddress.country;
      shipState = newAddress.state;
      shipZip = newAddress.postalCode;
    } else if (shippingAddressId) {
      const address = await prisma.address.findUnique({ where: { id: shippingAddressId } });
      if (address) {
        shipCountry = address.country;
        shipState = address.state;
        shipZip = address.postalCode;
      }
    }

    // 2. Perform dynamic tax calculations
    const taxCalc = await calculateTax({
      country: shipCountry,
      stateOrProvince: shipState,
      postalCode: shipZip,
      amount: subtotal,
    });

    const tax = taxCalc.taxAmount;
    const shippingCost = subtotal > 150 ? 0 : 9.99; // Free shipping on orders over $150
    const totalAmount = subtotal + tax + shippingCost;

    // 3. Create the order in PENDING_PAYMENT state
    const order = await prisma.order.create({
      data: {
        buyerId: resolvedBuyerId,
        sellerId: resolvedSellerId,
        orderType: "NORMAL",
        status: "PENDING_PAYMENT", // Set to pending until Stripe authorization hold succeeds
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        shippingAddressId: finalAddressId,
        country: shipCountry,
        items: { create: orderItems },
        // Create escrow record
        escrow: {
          create: {
            buyerId: resolvedBuyerId,
            sellerId: resolvedSellerId,
            amount: totalAmount,
            status: "HOLDING",
          },
        },
      },
      include: { items: true, escrow: true },
    });

    return NextResponse.json({ order, taxBreakdown: taxCalc.breakdown }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

