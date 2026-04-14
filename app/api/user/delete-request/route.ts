import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason } = await req.json();
    const userId = (session.user as { id: string }).id;

    // 1. Check for active orders
    const activeOrders = await prisma.order.count({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ],
        status: {
          notIn: ["COMPLETED", "CANCELLED", "REFUNDED"]
        }
      }
    });

    if (activeOrders > 0) {
      return NextResponse.json({
        error: "Active Obligations",
        message: "You have active orders that must be completed or cancelled before you can request account deletion."
      }, { status: 400 });
    }

    // 2. Check for escrow holdings
    const activeEscrows = await prisma.escrow.count({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ],
        status: "HOLDING"
      }
    });

    if (activeEscrows > 0) {
      return NextResponse.json({
        error: "Escrow Locked",
        message: "You have funds currently held in escrow. Please resolve all transactions before deletion."
      }, { status: 400 });
    }

    // 3. Create Deletion Request
    const request = await prisma.deletionRequest.create({
      data: {
        userId,
        reason,
        status: "PENDING"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Deletion request submitted. Our admin team will review it within 48 hours.",
      requestId: request.id 
    }, { status: 201 });

  } catch (error) {
    console.error("Deletion request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
