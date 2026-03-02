import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List active preorder campaigns
export async function GET() {
  try {
    const campaigns = await prisma.preorderCampaign.findMany({
      where: { isActive: true },
      include: { product: true, preorders: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    });

    const result = campaigns.map((c) => ({
      ...c,
      slotsRemaining: c.maxSlots ? c.maxSlots - c.slotsFilled : null,
      totalPreorders: c.preorders.length,
    }));

    return NextResponse.json({ campaigns: result });
  } catch (error) {
    console.error("Preorder campaigns error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Join a preorder queue
export async function POST(req: NextRequest) {
  try {
    const { userId, campaignId, tradeInProductId, tradeInCondition } = await req.json();

    if (!userId || !campaignId) {
      return NextResponse.json({ error: "userId and campaignId required" }, { status: 400 });
    }

    const campaign = await prisma.preorderCampaign.findUnique({ where: { id: campaignId } });
    if (!campaign || !campaign.isActive) {
      return NextResponse.json({ error: "Campaign not found or inactive" }, { status: 404 });
    }

    if (campaign.maxSlots && campaign.slotsFilled >= campaign.maxSlots) {
      return NextResponse.json({ error: "Preorder queue is full" }, { status: 409 });
    }

    // Create preorder with queue position
    const preorder = await prisma.$transaction(async (tx) => {
      const updated = await tx.preorderCampaign.update({
        where: { id: campaignId },
        data: { slotsFilled: { increment: 1 } },
      });

      const po = await tx.preorder.create({
        data: {
          userId,
          campaignId,
          queuePosition: updated.slotsFilled,
          status: "QUEUE_OPEN",
          depositPaid: campaign.depositAmount,
        },
      });

      // If trade-in requested, create trade-in with locked value
      if (tradeInProductId && tradeInCondition) {
        const quotedValue = estimateTradeInValue(tradeInCondition);
        await tx.tradeIn.create({
          data: {
            userId,
            productId: tradeInProductId,
            deviceCondition: tradeInCondition,
            quotedValue,
            status: "LOCKED_IN",
            preorderId: po.id,
            lockedUntil: campaign.estimatedShipDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        });
      }

      return po;
    });

    return NextResponse.json({ preorder }, { status: 201 });
  } catch (error) {
    console.error("Preorder error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Simple trade-in value estimator — replace with ML model in production
function estimateTradeInValue(condition: string): number {
  const values: Record<string, number> = {
    NEW: 600,
    CERTIFIED_PRE_OWNED: 500,
    REFURBISHED: 400,
    USED_LIKE_NEW: 350,
    USED_GOOD: 250,
    USED_FAIR: 150,
  };
  return values[condition] || 100;
}
