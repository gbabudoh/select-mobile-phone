import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — Fetch all homepage sections
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(sections);
  } catch (err) {
    console.error("Homepage GET error:", err);
    return NextResponse.json({ error: "Failed to fetch homepage sections" }, { status: 500 });
  }
}

// POST — Create or update a homepage section (upsert by sectionKey)
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const section = await prisma.homepageSection.upsert({
      where: { sectionKey: body.sectionKey },
      update: {
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        isVisible: body.isVisible ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
      create: {
        sectionKey: body.sectionKey,
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        isVisible: body.isVisible ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(section);
  } catch (err) {
    console.error("Homepage POST error:", err);
    return NextResponse.json({ error: "Failed to upsert homepage section" }, { status: 500 });
  }
}

// PUT — Update a specific homepage section
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const section = await prisma.homepageSection.update({
      where: { sectionKey: body.sectionKey },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.isVisible !== undefined && { isVisible: body.isVisible }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });
    return NextResponse.json(section);
  } catch (err) {
    console.error("Homepage PUT error:", err);
    return NextResponse.json({ error: "Failed to update homepage section" }, { status: 500 });
  }
}
