import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — List all banners
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const banners = await prisma.bannerSlide.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(banners);
  } catch (err) {
    console.error("Banners GET error:", err);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST — Create a new banner
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const banner = await prisma.bannerSlide.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        ctaText: body.ctaText || null,
        ctaLink: body.ctaLink || null,
        desktopImg: body.desktopImg,
        mobileImg: body.mobileImg || null,
        gradient: body.gradient || null,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(banner, { status: 201 });
  } catch (err) {
    console.error("Banners POST error:", err);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
