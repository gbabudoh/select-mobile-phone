import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Browse listings with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const brand = searchParams.get("brand");
    const country = searchParams.get("country");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { status: "ACTIVE" };

    if (category) where.product = { ...((where.product as object) || {}), category };
    if (brand) where.product = { ...((where.product as object) || {}), brand };
    if (condition) where.condition = condition;
    if (country) where.country = country;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          product: true,
          seller: { select: { id: true, name: true, role: true } },
          diagnosticReport: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create a new listing (seller/wholesaler/retailer)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, productId, title, description, price, condition, quantity, imei, country } = body;

    if (!sellerId || !productId || !title || !price || !condition) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        sellerId,
        productId,
        title,
        description,
        price,
        condition,
        quantity: quantity || 1,
        imei,
        country: country || "US",
        status: "ACTIVE",
      },
      include: { product: true },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
