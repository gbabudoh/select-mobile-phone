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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Robust scroll-to-bottom logic
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  useEffect(() => {
    // Small delay to allow layout to settle after animations
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]);

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
      // Focus after a tiny delay so it doesn't fight with scroll
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-[#f8fafc]/50">
      <div className="animated-bg opacity-30" />
      <Navigation />

      <section className="flex-1 flex flex-col pt-24 pb-4 px-6 max-w-5xl mx-auto w-full min-h-0 relative z-10">
        {/* Header — collapses once chat starts */}
        <AnimatePresence mode="wait">
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-12 py-10"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04a1c6]/10 text-[#04a1c6] text-[10px] font-black uppercase tracking-[0.2em] mb-6"
              >
                <Cpu className="w-3 h-3" /> AI Mobile Guide
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] mb-6 tracking-tight leading-[0.9]">
                Your personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#04a1c6] to-indigo-600">mobile expert</span>
              </h1>
              <p className="text-lg text-[#0f172a]/40 max-w-2xl mx-auto font-medium leading-relaxed">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            >
              {QUICK_PROMPTS.map((qp, idx) => (
                <motion.button
                  key={qp.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(qp.prompt)}
                  className="bg-white/80 backdrop-blur-sm p-5 rounded-[2rem] border border-white text-left cursor-pointer hover:shadow-xl hover:shadow-[#04a1c6]/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#04a1c6]/5 rounded-2xl flex items-center justify-center text-[#04a1c6] group-hover:bg-[#04a1c6] group-hover:text-white transition-all duration-300">
                      {qp.icon}
                    </div>
                    <span className="text-xs font-black text-[#0f172a]/60 group-hover:text-[#0f172a] transition-colors uppercase tracking-widest">
                      {qp.label}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat messages — fixed height, scrolls internally */}
        <div 
          ref={scrollContainerRef}
          className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pt-4 pb-8 space-y-6 chat-scroll ${!hasMessages ? "hidden" : ""}`}
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex gap-4 ${msg.role === "USER" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === "ASSISTANT" 
                  ? "bg-[#04a1c6] text-white shadow-[#04a1c6]/20" 
                  : "bg-[#0f172a] text-white shadow-[#0f172a]/20"
              }`}>
                {msg.role === "ASSISTANT" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div
                className={`max-w-[80%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm border ${
                  msg.role === "USER"
                    ? "bg-[#0f172a] text-white rounded-tr-sm border-[#0f172a]"
                    : "bg-white border-white text-[#0f172a] rounded-tl-sm"
                }`}
              >
                <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#04a1c6] flex items-center justify-center shrink-0 shadow-lg shadow-[#04a1c6]/20 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white border-white border text-[#0f172a]/40 px-6 py-4 rounded-[2rem] rounded-tl-sm text-xs font-black uppercase tracking-widest shadow-sm">
                <span className="flex gap-1 items-center">
                  Thinking
                  <span className="animate-bounce delay-0 w-1 h-1 rounded-full bg-current" />
                  <span className="animate-bounce delay-100 w-1 h-1 rounded-full bg-current" />
                  <span className="animate-bounce delay-200 w-1 h-1 rounded-full bg-current" />
                </span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Input bar — pined at bottom with glassmorphism */}
        <div className="shrink-0 pt-4 pb-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#04a1c6] to-indigo-600 rounded-[2.5rem] opacity-20 group-focus-within:opacity-40 blur transition-all duration-500" />
            <div className="relative bg-white rounded-[2.5rem] border border-white p-2 shadow-2xl flex items-center gap-2">
              <div className="pl-6 text-[#04a1c6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about phones, plans, trade-ins..."
                className="flex-1 px-2 py-4 bg-transparent text-[#0f172a] text-sm font-medium focus:outline-none placeholder:text-[#0f172a]/20"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-14 h-14 bg-[#04a1c6] text-white rounded-[2rem] flex items-center justify-center hover:bg-[#04a1c6]/90 disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-[#04a1c6]/20 active:scale-95 group/btn"
                aria-label="Send message"
              >
                <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#0f172a]/20 mt-6">
            AI Guide uses Select Mobile marketplace data. For account-specific help,{" "}
            <Link href="/buyer/dashboard/chat" className="text-[#04a1c6] hover:underline">
              sign in to your dashboard
            </Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
