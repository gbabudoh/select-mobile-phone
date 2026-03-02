"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Loader2, Cpu, Smartphone, Wifi,
  ArrowLeftRight, Calculator, ShieldCheck, Sparkles,
} from "lucide-react";
import { Navigation } from "../../components/Navigation";
import Link from "next/link";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
}

const QUICK_PROMPTS = [
  { icon: <Smartphone className="w-4 h-4" />, label: "Best phone under $800", prompt: "What's the best unlocked phone under $800 for US and Canada?" },
  { icon: <Wifi className="w-4 h-4" />, label: "Cross-border plans", prompt: "I travel between the US and Canada. What eSIM plans work in both countries?" },
  { icon: <ArrowLeftRight className="w-4 h-4" />, label: "Trade-in value", prompt: "What's my iPhone 16 Pro worth as a trade-in?" },
  { icon: <Calculator className="w-4 h-4" />, label: "Carrier vs BYOP", prompt: "How much do I save buying unlocked with a BYOP plan vs a carrier contract?" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "How escrow works", prompt: "How does Select-Verified escrow protect my purchase?" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Upcoming preorders", prompt: "What phones are available for preorder right now?" },
];

export default function AIGuidePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "USER", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId }),
      });
      const data = await res.json();

      if (data.sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [
        ...prev,
        {
          id: data.message?.id || (Date.now() + 1).toString(),
          role: "ASSISTANT",
          content: data.message?.content || "Sorry, something went wrong. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: "error", role: "ASSISTANT", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="min-h-screen flex flex-col">
      <div className="animated-bg" />
      <Navigation />

      <section className="flex-1 flex flex-col pt-28 pb-8 px-6 max-w-4xl mx-auto w-full">
        {/* Header — collapses once chat starts */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04a1c6]/10 text-[#04a1c6] text-sm font-semibold mb-4">
                <Cpu className="w-4 h-4" /> AI Mobile Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">
                Your personal mobile expert
              </h1>
              <p className="text-lg text-[#0f172a]/60 max-w-2xl mx-auto">
                Ask about phones, plans, trade-ins, cross-border coverage, or anything
                mobile. Powered by Select Mobile&apos;s marketplace intelligence.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick prompts — shown before first message */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8"
            >
              {QUICK_PROMPTS.map((qp) => (
                <motion.button
                  key={qp.label}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(qp.prompt)}
                  className="glass-panel p-4 rounded-2xl border border-white/10 text-left cursor-pointer hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#04a1c6]/10 rounded-xl text-[#04a1c6] group-hover:bg-[#04a1c6]/20 transition-colors">
                      {qp.icon}
                    </div>
                    <span className="text-sm font-medium text-[#0f172a]/70 group-hover:text-[#0f172a] transition-colors">
                      {qp.label}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat messages */}
        {hasMessages && (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "USER" ? "justify-end" : ""}`}
              >
                {msg.role === "ASSISTANT" && (
                  <div className="w-9 h-9 rounded-full bg-[#04a1c6] flex items-center justify-center shrink-0 shadow-lg shadow-[#04a1c6]/20">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "USER"
                      ? "bg-[#0f172a] text-white rounded-br-md"
                      : "glass-panel border border-white/10 text-[#0f172a] rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "USER" && (
                  <div className="w-9 h-9 rounded-full bg-[#0f172a] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#04a1c6] flex items-center justify-center shadow-lg shadow-[#04a1c6]/20">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="glass-panel border border-white/10 px-5 py-3.5 rounded-2xl rounded-bl-md text-sm text-[#0f172a]/50">
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse">Thinking</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                    <span className="animate-pulse delay-300">.</span>
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input bar */}
        <div className="mt-auto">
          <div className="glass-panel rounded-2xl border border-white/10 p-2 flex gap-2 shadow-lg">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about phones, plans, trade-ins..."
              className="flex-1 px-4 py-3 bg-transparent text-[#0f172a] text-sm focus:outline-none placeholder:text-[#0f172a]/30"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-[#04a1c6]/20"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-[#0f172a]/30 mt-3">
            AI Guide uses Select Mobile marketplace data. For account-specific help,{" "}
            <Link href="/dashboard/chat" className="text-[#04a1c6] hover:underline">
              sign in to your dashboard
            </Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
