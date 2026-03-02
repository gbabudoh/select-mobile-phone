import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security, we should not reveal if an email exists or not
    // Instead, we return a success message regardless
    if (user) {
      console.log(`Password reset requested for: ${email}`);
      // In a real app, you would generate a reset token and send an email here
    }

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a reset link shortly.",
    });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
