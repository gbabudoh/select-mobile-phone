import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// AI Chatbot endpoint — "Mobile Guide"
// Handles questions about phones, networks, accessories, plans, cross-border, etc.
// In production, integrate with OpenAI/Anthropic API for real AI responses

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, userId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Get or create session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
      });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: userId || null,
          title: message.slice(0, 80),
        },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "USER",
        content: message,
      },
    });

    // Generate AI response (rule-based fallback — replace with LLM in production)
    const aiResponse = await generateResponse(message);

    // Save assistant message
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "ASSISTANT",
        content: aiResponse.text,
        metadata: aiResponse.metadata,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Rule-based response generator — placeholder for LLM integration
async function generateResponse(message: string) {
  const lower = message.toLowerCase();

  // Cross-border travel scenario
  if (lower.includes("travel") || lower.includes("cross-border") || lower.includes("roaming")) {
    const plans = await prisma.networkPlan.findMany({
      where: {
        isActive: true,
        coverageCountries: { array_contains: ["US", "CA"] },
      },
      include: { networkProviderProfile: true },
      take: 5,
    });

    return {
      text: plans.length > 0
        ? `For cross-border travel between the US and Canada, I found ${plans.length} plans with coverage in both countries. Look for phones with dual-eSIM capability for the best flexibility. Would you like me to compare these plans side by side?`
        : "For US-Canada travel, I recommend looking at phones with dual-eSIM support (like iPhone 18 Pro or Galaxy S26 Ultra) paired with a cross-border BYOP plan. This gives you seamless coverage without carrier lock-in. Want me to search for available cross-border plans?",
      metadata: { suggestedPlans: plans.map((p) => p.id), intent: "cross-border" },
    };
  }

  // Price / deal questions
  if (lower.includes("cheap") || lower.includes("budget") || lower.includes("deal") || lower.includes("save")) {
    return {
      text: "To find the best value, try our TCO Calculator — it compares buying unlocked with a BYOP eSIM plan vs. a 24-month carrier contract. Most buyers save $400-$800 over two years by going unlocked. Want me to run a comparison for a specific phone?",
      metadata: { intent: "value-seeking", suggestTCO: true },
    };
  }

  // eSIM questions
  if (lower.includes("esim") || lower.includes("sim") || lower.includes("activate")) {
    return {
      text: "Select Mobile supports instant eSIM provisioning — no waiting for a physical SIM in the mail. When you purchase a handset with a plan, the eSIM activates at checkout. Your phone is ready to use the moment it arrives. Which carrier are you interested in?",
      metadata: { intent: "esim-info" },
    };
  }

  // Trade-in
  if (lower.includes("trade") || lower.includes("old phone") || lower.includes("upgrade")) {
    return {
      text: "You can lock in your trade-in value today, even months before a new phone launches. This guarantees your down payment amount. Just tell me what phone you currently have and I'll get you a quote.",
      metadata: { intent: "trade-in" },
    };
  }

  // Accessories
  if (lower.includes("case") || lower.includes("charger") || lower.includes("accessor")) {
    const accessories = await prisma.listing.findMany({
      where: { status: "ACTIVE", product: { category: "ACCESSORY" } },
      include: { product: true },
      take: 5,
    });

    return {
      text: accessories.length > 0
        ? `I found ${accessories.length} Select-Verified accessories. All accessories go through our quality check before listing. What type are you looking for — cases, chargers, screen protectors?`
        : "We have a growing selection of Select-Verified accessories including cases, chargers, and screen protectors. What device do you need accessories for?",
      metadata: { intent: "accessories", suggestedListings: accessories.map((a) => a.id) },
    };
  }

  // Preorder
  if (lower.includes("preorder") || lower.includes("pre-order") || lower.includes("upcoming") || lower.includes("launch")) {
    const campaigns = await prisma.preorderCampaign.findMany({
      where: { isActive: true },
      include: { product: true },
      take: 5,
    });

    return {
      text: campaigns.length > 0
        ? `There are ${campaigns.length} active preorder campaigns right now. You can secure your spot with a deposit and track your queue position in real-time. Want details on any of these?`
        : "No active preorder campaigns right now, but new flagships are always around the corner. I can notify you when the next one opens. What phone are you waiting for?",
      metadata: { intent: "preorder", campaigns: campaigns.map((c) => c.id) },
    };
  }

  // Default
  return {
    text: "I'm your Select Mobile Guide — I can help you find the right phone, compare plans, check trade-in values, track preorders, or find accessories. What are you looking for today?",
    metadata: { intent: "general" },
  };
}
