import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth-options";
import { prisma } from "@/lib/prisma";

// GET: Fetch trade-ins for the authenticated user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tradeIns = await prisma.tradeIn.findMany({
    where: { userId: session.user.id },
    include: { product: true, preorder: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tradeIns });
}

// POST: Create a trade-in quote for the authenticated user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, deviceCondition, imei, lockIn } = await req.json();

    if (!productId || !deviceCondition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const conditionMultiplier: Record<string, number> = {
      NEW: 0.7,
      CERTIFIED_PRE_OWNED: 0.6,
      REFURBISHED: 0.5,
      USED_LIKE_NEW: 0.45,
      USED_GOOD: 0.35,
      USED_FAIR: 0.2,
    };

    const msrp = product.msrp || 999;
    const multiplier = conditionMultiplier[deviceCondition] || 0.2;
    const quotedValue = Math.round(msrp * multiplier);

    const tradeIn = await prisma.tradeIn.create({
      data: {
        userId: session.user.id,
        productId,
        deviceCondition,
        imei,
        quotedValue,
        status: lockIn ? "LOCKED_IN" : "QUOTE_GIVEN",
        lockedUntil: lockIn ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : null,
      },
      include: { product: true },
    });

    return NextResponse.json({ tradeIn });
  } catch (error) {
    console.error("Trade-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
