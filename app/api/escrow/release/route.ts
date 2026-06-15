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

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { escrow: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow the buyer or an administrator to release the escrow
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    if (order.buyerId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized operation" }, { status: 403 });
    }

    if (order.status !== "PAYMENT_HELD" && order.status !== "DIAGNOSTIC_CHECK" && order.status !== "SHIPPED" && order.status !== "DELIVERED") {
      return NextResponse.json({ error: "Order is not in an escrowed state" }, { status: 400 });
    }

    const stripePaymentId = order.escrow?.stripePaymentId;
    if (!stripePaymentId) {
      return NextResponse.json({ error: "No associated payment ID found" }, { status: 400 });
    }

    if (stripePaymentId.startsWith("pi_mock_")) {
      // Sandbox mode: simulate capture
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "COMPLETED" },
        }),
        prisma.escrow.update({
          where: { orderId: order.id },
          data: {
            status: "RELEASED_TO_SELLER",
            releasedAt: new Date(),
          },
        }),
      ]);

      return NextResponse.json({ success: true, simulated: true });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe key is missing, capture failed" }, { status: 500 });
    }

    // Capture the Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.capture(stripePaymentId);

    // Update database records
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: "COMPLETED" },
      }),
      prisma.escrow.update({
        where: { orderId: order.id },
        data: {
          status: "RELEASED_TO_SELLER",
          releasedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ success: true, status: paymentIntent.status });
  } catch (error: any) {
    console.error("Escrow Release Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
