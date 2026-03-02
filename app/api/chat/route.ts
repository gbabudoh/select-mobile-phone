import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are the Select Mobile AI Guide — a knowledgeable, friendly mobile phone marketplace assistant.

You help customers with:
- Finding the right unlocked phone (iPhone, Samsung Galaxy, Google Pixel, etc.)
- Comparing eSIM and BYOP plans for US and Canada cross-border coverage
- Trade-in valuations and locking in trade-in value early
- Preorder campaigns and queue tracking
- Total Cost of Ownership (TCO) comparisons: unlocked + BYOP vs carrier contracts
- Select-Verified product quality and escrow protection
- Accessories (cases, chargers, screen protectors)

Key marketplace facts:
- Select Mobile is a multi-vendor marketplace (wholesalers, retailers, individual sellers, network providers)
- All products go through Select-Verified diagnostics (scored out of 50)
- Escrow protection holds payment until buyer confirms delivery
- eSIM provisioning is instant at checkout — no physical SIM needed
- Cross-border plans cover both US and Canada seamlessly
- Buyers typically save $400-$800 over 2 years going unlocked + BYOP vs carrier contract
- Trade-in values can be locked in months before a new phone launches
- Preorders use a deposit + queue system with real-time position tracking

Current featured products:
- iPhone 18 Pro 256GB — $1,199 (5G, Dual eSIM, Titanium)
- Galaxy S26 Ultra 512GB — $1,299 (5G, S Pen, 200MP Camera)
- Pixel 10 Pro 256GB — $999 (AI-first, Tensor G5)

Be concise, helpful, and conversational. When relevant, suggest using the TCO Calculator, Trade-In tool, or Preorder page on the site. Do not make up specific prices or availability — guide users to check the marketplace.`;

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
        data: { userId: userId || null, title: message.slice(0, 80) },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "USER", content: message },
    });

    // Build conversation history
    const history = (session.messages || []).map((m) => ({
      role: m.role === "USER" ? "user" as const : "assistant" as const,
      content: m.content,
    }));

    // Call Groq
    const aiResponse = await callGroq([
      ...history,
      { role: "user", content: message },
    ]);

    // Save assistant message
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "ASSISTANT",
        content: aiResponse,
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

async function callGroq(
  messages: { role: "user" | "assistant" | "system"; content: string }[]
): Promise<string> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq error:", res.status, errText);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response. Please try again.";
  } catch (err) {
    console.error("Groq fetch error:", err);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
