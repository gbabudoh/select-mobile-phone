import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// GET — Fetch all footer columns with links
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const columns = await prisma.footerColumn.findMany({
      include: { links: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(columns);
  } catch (err) {
    console.error("Footer GET error:", err);
    return NextResponse.json({ error: "Failed to fetch footer" }, { status: 500 });
  }
}

// POST — Create a new footer column with optional links
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const column = await prisma.footerColumn.create({
      data: {
        heading: body.heading,
        sortOrder: body.sortOrder || 0,
        isVisible: body.isVisible ?? true,
        links: body.links?.length
          ? {
              create: body.links.map((link: { label: string; href: string; sortOrder?: number }, i: number) => ({
                label: link.label,
                href: link.href,
                sortOrder: link.sortOrder ?? i,
              })),
            }
          : undefined,
      },
      include: { links: true },
    });
    return NextResponse.json(column, { status: 201 });
  } catch (err) {
    console.error("Footer POST error:", err);
    return NextResponse.json({ error: "Failed to create footer column" }, { status: 500 });
  }
}
