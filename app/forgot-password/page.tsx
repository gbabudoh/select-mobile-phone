"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  SendHorizontal
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-white text-slate-900">
      <div className="animated-bg" />

      <div className="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <Link 
            href="/login"
            className="group flex items-center gap-3 text-slate-400 hover:text-[#04a1c6] mb-10 transition-all font-black uppercase tracking-widest text-sm"
          >
            <div className="p-2 rounded-full bg-slate-100 border border-slate-200 group-hover:border-[#04a1c6]/30 transition-all">
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#04a1c6]" />
            </div>
            Back to Sign In
          </Link>

          <div className="glass-panel p-12 rounded-[3.5rem] border border-black/5 relative overflow-hidden shadow-2xl bg-white/80">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#04a1c6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 rounded-3xl bg-[#04a1c6]/10 border border-[#04a1c6]/20 text-[#04a1c6]">
                        <KeyRound className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Reset Password</h2>
                        <p className="text-slate-500 font-medium">We&apos;ll send you a secure recovery link</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-600 text-sm font-bold flex gap-3 items-start"
                      >
                        <div className="mt-0.5 p-1 rounded-full bg-rose-500/10">
                          <CheckCircle2 className="w-4 h-4 rotate-45" />
                        </div>
                        {error}
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Registered Email</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#04a1c6] text-slate-300">
                          <Mail className="w-6 h-6" />
                        </div>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          required
                          className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:border-[#04a1c6] focus:bg-white transition-all duration-300 text-lg placeholder:text-slate-300 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#04a1c6] to-[#0284a5] text-white font-black py-6 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer uppercase tracking-widest"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </div>
                        ) : (
                          <>
                            Send Reset Link <SendHorizontal className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">Check Your Inbox</h2>
                  <p className="text-slate-500 text-lg font-medium mb-12 max-w-sm mx-auto">
                    If an account exists for <span className="text-slate-900 font-bold">{email}</span>, you&apos;ll receive reset instructions shortly.
                  </p>

                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest text-sm"
                    >
                      Return to Sign In
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                Need more help?{" "}
                <Link href="/support" className="text-[#04a1c6] font-black uppercase tracking-widest text-sm hover:underline ml-2">
                  Contact SelectSupport
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
