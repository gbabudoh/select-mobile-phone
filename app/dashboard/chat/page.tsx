"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ASSISTANT",
      content:
        "Hey! I'm your Select Mobile Guide. I can help you find the right phone, compare plans across US and Canada, check trade-in values, track preorders, or find accessories. What can I help with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "USER", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });
      const data = await res.json();

      if (data.sessionId) setSessionId(data.sessionId);

      setMessages((prev) => [
        ...prev,
        { id: data.message?.id || Date.now().toString(), role: "ASSISTANT", content: data.message?.content || "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: "error", role: "ASSISTANT", content: "Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-[#0f172a] mb-2">AI Mobile Guide</h1>
      <p className="text-[#0f172a]/60 mb-4">
        Ask about phones, plans, trade-ins, accessories, or cross-border coverage.
      </p>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "USER" ? "justify-end" : ""}`}>
            {msg.role === "ASSISTANT" && (
              <div className="w-8 h-8 rounded-full bg-[#04a1c6] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "USER"
                  ? "bg-[#0f172a] text-white rounded-br-md"
                  : "bg-gray-100 text-[#0f172a] rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "USER" && (
              <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#04a1c6] flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md text-sm text-[#0f172a]/50">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about phones, plans, trade-ins..."
          className="flex-1 px-5 py-3 rounded-xl border border-gray-200 bg-white text-[#0f172a] text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 disabled:opacity-50 transition-all cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
