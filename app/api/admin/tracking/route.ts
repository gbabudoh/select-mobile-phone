import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — Fetch tracking configs (public — consumed by TrackingScripts on every page)
export async function GET() {
  try {
    const configs = await prisma.trackingConfig.findMany();
    return NextResponse.json({ configs });
  } catch (err) {
    console.error("Tracking GET error:", err);
    return NextResponse.json({ configs: [] });
  }
}

// PUT — Upsert a tracking config
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const config = await prisma.trackingConfig.upsert({
      where: { provider: body.provider },
      update: {
        trackingId: body.trackingId,
        isActive: body.isActive ?? true,
        metadata: body.metadata || null,
      },
      create: {
        provider: body.provider,
        trackingId: body.trackingId,
        isActive: body.isActive ?? true,
        metadata: body.metadata || null,
      },
    });
    return NextResponse.json(config);
  } catch (err) {
    console.error("Tracking PUT error:", err);
    return NextResponse.json({ error: "Failed to update tracking config" }, { status: 500 });
  }
}
