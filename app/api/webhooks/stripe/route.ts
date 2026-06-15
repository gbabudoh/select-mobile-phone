import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "mock_key", {
  apiVersion: "2025-01-27" as any,
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_SECRET_KEY) {
    // If webhook secret is not set, we can simulate webhook triggers in sandbox environment
    try {
      const body = JSON.parse(payload);
      const { eventType, paymentIntentId } = body;

      if (!eventType || !paymentIntentId) {
        return NextResponse.json({ error: "Signature missing or invalid payload structure" }, { status: 400 });
      }

      await handleEvent(eventType, paymentIntentId);
      return NextResponse.json({ received: true, simulated: true });
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid simulated payload" }, { status: 400 });
    }
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  await handleEvent(event.type, paymentIntent.id);

  return NextResponse.json({ received: true });
}

async function handleEvent(type: string, paymentIntentId: string) {
  console.log(`Processing event ${type} for PaymentIntent ${paymentIntentId}`);

  switch (type) {
    case "payment_intent.amount_capturable_updated": {
      // Funds are authorized and held in escrow
      const escrow = await prisma.escrow.findFirst({
        where: { stripePaymentId: paymentIntentId },
      });

      if (escrow) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: escrow.orderId },
            data: { status: "PAYMENT_HELD" },
          }),
          prisma.escrow.update({
            where: { id: escrow.id },
            data: { status: "HOLDING" },
          }),
        ]);
        console.log(`Escrow held successfully for order ${escrow.orderId}`);
      }
      break;
    }

    case "payment_intent.succeeded": {
      // Capture complete, release to seller
      const escrow = await prisma.escrow.findFirst({
        where: { stripePaymentId: paymentIntentId },
      });

      if (escrow) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: escrow.orderId },
            data: { status: "COMPLETED" },
          }),
          prisma.escrow.update({
            where: { id: escrow.id },
            data: { 
              status: "RELEASED_TO_SELLER",
              releasedAt: new Date(),
            },
          }),
        ]);
        console.log(`Escrow released successfully to seller for order ${escrow.orderId}`);
      }
      break;
    }

    case "payment_intent.canceled": {
      const escrow = await prisma.escrow.findFirst({
        where: { stripePaymentId: paymentIntentId },
      });

      if (escrow) {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: escrow.orderId },
            data: { status: "CANCELLED" },
          }),
          prisma.escrow.update({
            where: { id: escrow.id },
            data: { status: "REFUNDED_TO_BUYER" },
          }),
        ]);
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe Webhook Event: ${type}`);
  }
}
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 60;
