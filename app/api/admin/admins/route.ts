import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@generated/prisma/client";
import { requireSuperAdmin } from "@/lib/super-admin-guard";
import bcrypt from "bcryptjs";

// GET — List all admins
export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const admins = await prisma.user.findMany({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ admins });
  } catch (err) {
    console.error("Admins GET error:", err);
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

// POST — Create a new basic Admin
export async function POST(req: NextRequest) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.ADMIN,
        status: "ACTIVE",
        emailVerified: true,
        country: "US", // Default
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    console.error("Admin POST error:", err);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
