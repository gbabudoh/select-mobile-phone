import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "mock_key", {
  apiVersion: "2025-01-27" as any,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // 1. Fetch order details from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { escrow: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.buyerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized order access" }, { status: 403 });
    }

    // Check if Stripe API is active
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("Stripe key is missing. Simulating sandbox payment intent.");
      
      // Simulate Stripe integration in sandbox mode
      const mockPaymentIntentId = `pi_mock_${Math.random().toString(36).substring(2, 11)}`;
      
      // Update Escrow with mock Payment Intent
      if (order.escrow) {
        await prisma.escrow.update({
          where: { orderId: order.id },
          data: { stripePaymentId: mockPaymentIntentId },
        });
      }

      return NextResponse.json({
        clientSecret: `pi_mock_secret_${Math.random().toString(36).substring(2, 11)}`,
        paymentIntentId: mockPaymentIntentId,
        isMock: true,
      });
    }

    // 2. Create Stripe PaymentIntent with manual capture (escrow hold)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Stripe expects cents
      currency: order.currency.toLowerCase() || "usd",
      capture_method: "manual", // Holds funds in escrow
      metadata: {
        orderId: order.id,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        orderNumber: order.orderNumber,
      },
    });

    // 3. Save stripePaymentId in database Escrow record
    if (order.escrow) {
      await prisma.escrow.update({
        where: { orderId: order.id },
        data: { stripePaymentId: paymentIntent.id },
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Create PaymentIntent Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
