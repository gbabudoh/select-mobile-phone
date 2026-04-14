import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — List all SEO configs
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const seoConfigs = await prisma.seoMeta.findMany({
      orderBy: { pagePath: "asc" },
    });
    return NextResponse.json(seoConfigs);
  } catch (err) {
    console.error("SEO GET error:", err);
    return NextResponse.json({ error: "Failed to fetch SEO configs" }, { status: 500 });
  }
}

// POST — Create SEO config for a page
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const seo = await prisma.seoMeta.create({
      data: {
        pagePath: body.pagePath,
        title: body.title,
        description: body.description || null,
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImage: body.ogImage || null,
        canonicalUrl: body.canonicalUrl || null,
        robotsDirective: body.robotsDirective || "index,follow",
        structuredData: body.structuredData || null,
      },
    });
    return NextResponse.json(seo, { status: 201 });
  } catch (err) {
    console.error("SEO POST error:", err);
    return NextResponse.json({ error: "Failed to create SEO config" }, { status: 500 });
  }
}

// PUT — Update SEO config
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const seo = await prisma.seoMeta.update({
      where: { pagePath: body.pagePath },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.ogTitle !== undefined && { ogTitle: body.ogTitle }),
        ...(body.ogDescription !== undefined && { ogDescription: body.ogDescription }),
        ...(body.ogImage !== undefined && { ogImage: body.ogImage }),
        ...(body.canonicalUrl !== undefined && { canonicalUrl: body.canonicalUrl }),
        ...(body.robotsDirective !== undefined && { robotsDirective: body.robotsDirective }),
        ...(body.structuredData !== undefined && { structuredData: body.structuredData }),
      },
    });
    return NextResponse.json(seo);
  } catch (err) {
    console.error("SEO PUT error:", err);
    return NextResponse.json({ error: "Failed to update SEO config" }, { status: 500 });
  }
}
