import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      activeSellers,
      pendingKyc,
      openDisputes,
      escrowAmount,
    ] = await Promise.all([
      prisma.user.count({ 
        where: { 
          role: { in: ["INDIVIDUAL_SELLER", "RETAILER", "WHOLESALER", "NETWORK_PROVIDER"] }, 
          status: "ACTIVE" 
        } 
      }),
      prisma.kycDocument.count({ where: { status: "PENDING" } }),
      prisma.dispute.count({ where: { status: "OPEN" } }),
      prisma.escrow.aggregate({
        where: { status: "HOLDING" },
        _sum: { amount: true }
      })
    ]);

    return NextResponse.json({
      activeSellers,
      pendingKyc,
      openDisputes,
      escrowHoldings: escrowAmount._sum.amount || 0
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
