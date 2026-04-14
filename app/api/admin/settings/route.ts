import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET: Fetch all deletion requests with obligation counts
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const requests = await prisma.deletionRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            country: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Enriched requests with current platform data
    const enrichedRequests = await Promise.all(requests.map(async (dr) => {
      const activeOrders = await prisma.order.count({
        where: {
          OR: [{ buyerId: dr.userId }, { sellerId: dr.userId }],
          status: { notIn: ["COMPLETED", "CANCELLED", "REFUNDED"] }
        }
      });
 
      const escrowSum = await prisma.escrow.aggregate({
        where: {
          OR: [{ buyerId: dr.userId }, { sellerId: dr.userId }],
          status: "HOLDING"
        },
        _sum: { amount: true }
      });
 
      return {
        ...dr,
        activeOrders,
        escrowBalance: escrowSum._sum.amount || 0
      };
    }));

    return NextResponse.json({ requests: enrichedRequests });
  } catch (err) {
    console.error("Admin Settings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch settings data" }, { status: 500 });
  }
}

// POST: Process deletion request (Approve/Reject)
export async function POST(req: NextRequest) {
  const { error: adminError } = await requireAdmin();
  if (adminError) return adminError;

  try {
    const body = await req.json();
    const { requestId, action, adminNotes } = body; // action: 'APPROVE', 'REJECT'

    const request = await prisma.deletionRequest.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    if (action === "APPROVE") {
      // 1. Verify no active obligations again before destructive action
      const activeOrders = await prisma.order.count({
        where: {
          OR: [{ buyerId: request.userId }, { sellerId: request.userId }],
          status: { notIn: ["COMPLETED", "CANCELLED", "REFUNDED"] }
        }
      });

      if (activeOrders > 0) {
        return NextResponse.json({ error: "Cannot delete user with active orders" }, { status: 400 });
      }

      // 2. Perform Account Deletion (or status change to DELETED/BANNED)
      // Standard GDPR practice is often hard-deletion or anonymization.
      // Here we will set status to BANNED (or a future DELETED status) as a safety measure.
      await prisma.user.update({
        where: { id: request.userId },
        data: { status: "BANNED" } // Safety first: Soft delete/Ban instead of hard delete for record keeping
      });

      await prisma.deletionRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          adminNotes,
          processedAt: new Date()
        }
      });

      return NextResponse.json({ success: true, message: "Account processed and restricted." });
    } else if (action === "REJECT") {
      await prisma.deletionRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          adminNotes,
          processedAt: new Date()
        }
      });
      return NextResponse.json({ success: true, message: "Request rejected." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Admin Settings POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
