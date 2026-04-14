import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — Full dispute detail
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        raisedBy: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        defending: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
        order: {
          include: {
            items: { include: { listing: { include: { product: true } } } },
          },
        },
        escrow: true,
        messages: {
          include: { sender: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    return NextResponse.json(dispute);
  } catch (err) {
    console.error("Dispute GET error:", err);
    return NextResponse.json({ error: "Failed to fetch dispute" }, { status: 500 });
  }
}

// PUT — Update dispute status and resolution
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.status) updateData.status = body.status;
    if (body.resolution) updateData.resolution = body.resolution;

    const dispute = await prisma.dispute.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.dispute.update>[0]["data"],
    });

    // Handle escrow resolution
    if (body.status === "RESOLVED_REFUND" && dispute.escrowId) {
      await prisma.escrow.update({
        where: { id: dispute.escrowId },
        data: { status: "REFUNDED_TO_BUYER" },
      });
    } else if (body.status === "RESOLVED_RELEASE" && dispute.escrowId) {
      await prisma.escrow.update({
        where: { id: dispute.escrowId },
        data: { status: "RELEASED_TO_SELLER", releasedAt: new Date() },
      });
    }

    return NextResponse.json(dispute);
  } catch (err) {
    console.error("Dispute PUT error:", err);
    return NextResponse.json({ error: "Failed to update dispute" }, { status: 500 });
  }
}

// POST — Add admin message to dispute thread
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const adminId = (session?.user as { id?: string })?.id || "system";

    const message = await prisma.disputeMessage.create({
      data: {
        disputeId: id,
        senderId: adminId,
        content: body.content,
        evidenceUrl: body.evidenceUrl || null,
        isAdminMsg: true,
      },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("Dispute message POST error:", err);
    return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
  }
}
