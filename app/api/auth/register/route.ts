import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user and role-specific profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role as UserRole,
        },
      });

      // Initialize matching profile based on role
      switch (role) {
        case "WHOLESALER":
          await tx.wholesalerProfile.create({
            data: { userId: newUser.id, businessName: name || "New Wholesaler" },
          });
          break;
        case "RETAILER":
          await tx.retailerProfile.create({
            data: { userId: newUser.id, storeName: name || "New Retailer" },
          });
          break;
        case "NETWORK_PROVIDER":
          await tx.networkProviderProfile.create({
            data: { 
              userId: newUser.id, 
              carrierName: name || "New Provider",
              carrierType: "MVNO" // Default
            },
          });
          break;
        case "INDIVIDUAL_SELLER":
          await tx.individualSellerProfile.create({
            data: { userId: newUser.id, displayName: name || newUser.email.split('@')[0] },
          });
          break;
        case "BUYER":
          await tx.buyerProfile.create({
            data: { userId: newUser.id },
          });
          break;
      }

      return newUser;
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
