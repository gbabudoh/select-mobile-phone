import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

// PUT — Update a footer column and its links
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();

    // Update column heading and visibility
    await prisma.footerColumn.update({
      where: { id },
      data: {
        ...(body.heading !== undefined && { heading: body.heading }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
        ...(body.isVisible !== undefined && { isVisible: body.isVisible }),
      },
    });

    // If links are provided, replace all links
    if (body.links) {
      await prisma.footerLink.deleteMany({ where: { columnId: id } });
      if (body.links.length > 0) {
        await prisma.footerLink.createMany({
          data: body.links.map((link: { label: string; href: string; sortOrder?: number; isVisible?: boolean }, i: number) => ({
            columnId: id,
            label: link.label,
            href: link.href,
            sortOrder: link.sortOrder ?? i,
            isVisible: link.isVisible ?? true,
          })),
        });
      }
    }

    const updated = await prisma.footerColumn.findUnique({
      where: { id },
      include: { links: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Footer PUT error:", err);
    return NextResponse.json({ error: "Failed to update footer column" }, { status: 500 });
  }
}

// DELETE — Remove a footer column and all its links
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.footerColumn.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Footer DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete footer column" }, { status: 500 });
  }
}
