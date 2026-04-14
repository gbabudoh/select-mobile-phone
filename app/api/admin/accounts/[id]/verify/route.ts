import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// POST — Approve or reject KYC document, update profile verification
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const { kycDocumentId, action, notes } = body; // action: "APPROVE" | "REJECT"

    if (!kycDocumentId || !action) {
      return NextResponse.json({ error: "kycDocumentId and action are required" }, { status: 400 });
    }

    const adminId = (session?.user as { id?: string })?.id || "system";

    // Update KYC document status
    const kycDoc = await prisma.kycDocument.update({
      where: { id: kycDocumentId },
      data: {
        status: action === "APPROVE" ? "VERIFIED" : "REJECTED",
        notes: notes || null,
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
    });

    // If approved, check if all required documents are verified
    if (action === "APPROVE") {
      const user = await prisma.user.findUnique({ where: { id }, select: { role: true } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const verifiedDocs = await prisma.kycDocument.count({
        where: { userId: id, status: "VERIFIED" },
      });

      // Require at least 1 verified doc (SSN or Passport) to activate
      if (verifiedDocs >= 1) {
        // Update profile verification status
        switch (user.role) {
          case "WHOLESALER":
            await prisma.wholesalerProfile.updateMany({ where: { userId: id }, data: { verification: "VERIFIED" } });
            break;
          case "RETAILER":
            await prisma.retailerProfile.updateMany({ where: { userId: id }, data: { verification: "VERIFIED" } });
            break;
          case "NETWORK_PROVIDER":
            await prisma.networkProviderProfile.updateMany({ where: { userId: id }, data: { verification: "VERIFIED" } });
            break;
          case "INDIVIDUAL_SELLER":
            await prisma.individualSellerProfile.updateMany({ where: { userId: id }, data: { verification: "VERIFIED" } });
            break;
        }

        // Activate the account
        await prisma.user.update({
          where: { id },
          data: { status: "ACTIVE" },
        });
      }
    }

    return NextResponse.json({ kycDoc, message: `Document ${action === "APPROVE" ? "approved" : "rejected"} successfully` });
  } catch (err) {
    console.error("Verify POST error:", err);
    return NextResponse.json({ error: "Failed to process verification" }, { status: 500 });
  }
}
