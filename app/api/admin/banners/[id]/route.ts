import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// PUT — Update a banner
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const banner = await prisma.bannerSlide.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.ctaText !== undefined && { ctaText: body.ctaText }),
        ...(body.ctaLink !== undefined && { ctaLink: body.ctaLink }),
        ...(body.desktopImg !== undefined && { desktopImg: body.desktopImg }),
        ...(body.mobileImg !== undefined && { mobileImg: body.mobileImg }),
        ...(body.gradient !== undefined && { gradient: body.gradient }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });
    return NextResponse.json(banner);
  } catch (err) {
    console.error("Banner PUT error:", err);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

// DELETE — Remove a banner
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.bannerSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Banner DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
