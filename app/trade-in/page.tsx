"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, ChevronRight, Lock, Zap, ShieldCheck } from "lucide-react";
import { Navigation } from "../../components/Navigation";
import Link from "next/link";

const TRADE_DEVICES = [
  { name: "iPhone 17 Pro Max", base: 600 },
  { name: "iPhone 17 Pro", base: 520 },
  { name: "iPhone 16 Pro Max", base: 440 },
  { name: "iPhone 16 Pro", base: 380 },
  { name: "Galaxy S26 Ultra", base: 480 },
  { name: "Galaxy S25 Ultra", base: 350 },
  { name: "Pixel 10 Pro", base: 320 },
  { name: "Pixel 9 Pro", base: 220 },
];

const CONDITIONS = [
  { label: "Like New", key: "USED_LIKE_NEW", multiplier: 1.0 },
  { label: "Good", key: "USED_GOOD", multiplier: 0.8 },
  { label: "Fair", key: "USED_FAIR", multiplier: 0.6 },
];

export default function TradeInPage() {
  const [selectedDevice, setSelectedDevice] = useState("");
  const [condition, setCondition] = useState("");
  const [imei, setImei] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const device = TRADE_DEVICES.find((d) => d.name === selectedDevice);
  const cond = CONDITIONS.find((c) => c.label === condition);
  const baseValue = device && cond ? Math.round(device.base * cond.multiplier) : 0;

  const canSubmit = selectedDevice && condition && baseValue > 0;

  return (
    <main className="min-h-screen">
      <div className="animated-bg" />
      <Navigation />

      <section className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04a1c6]/10 text-[#04a1c6] text-sm font-semibold mb-4">
              <ArrowLeftRight className="w-4 h-4" /> Trade-In Program
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">
              Get top value for your current device
            </h1>
            <p className="text-lg text-[#0f172a]/60 max-w-2xl mx-auto">
              Get an instant quote, lock in the value for up to 90 days, and apply it
              toward your next purchase or preorder. No surprises, no depreciation traps.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { step: "01", icon: <ArrowLeftRight className="w-5 h-5" />, title: "Select Your Device", desc: "Pick your current phone and its condition. We calculate a fair market quote instantly." },
              { step: "02", icon: <Lock className="w-5 h-5" />, title: "Lock Your Value", desc: "Lock in the quoted price for 90 days. Your device won't lose value while you decide." },
              { step: "03", icon: <Zap className="w-5 h-5" />, title: "Apply to Purchase", desc: "Use your locked value as credit toward any order or preorder on Select Mobile." },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Number(item.step) * 0.1 }}
                className="glass-panel rounded-2xl p-6 border border-white/10"
              >
                <span className="text-xs font-bold text-[#04a1c6]/50">{item.step}</span>
                <div className="flex items-center gap-3 mt-2 mb-3">
                  <div className="p-2 bg-[#04a1c6]/10 rounded-xl text-[#04a1c6]">{item.icon}</div>
                  <h3 className="font-bold text-[#0f172a]">{item.title}</h3>
                </div>
                <p className="text-sm text-[#0f172a]/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Quote form */}
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
              >
                <h2 className="text-2xl font-bold text-[#0f172a] mb-8">Get Your Instant Quote</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: inputs */}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="device-select" className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                        Your Current Device
                      </label>
                      <select
                        id="device-select"
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#0f172a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
                      >
                        <option value="">Select device...</option>
                        {TRADE_DEVICES.map((d) => (
                          <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                        Condition
                      </label>
                      <div className="flex gap-2">
                        {CONDITIONS.map((c) => (
                          <button
                            key={c.label}
                            onClick={() => setCondition(c.label)}
                            aria-pressed={condition === c.label}
                            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                              condition === c.label
                                ? "bg-[#04a1c6] text-white shadow-[0_0_16px_rgba(4,161,198,0.3)]"
                                : "bg-white border border-gray-200 text-[#0f172a]/70 hover:bg-gray-50"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="imei-input" className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                        IMEI (Optional)
                      </label>
                      <input
                        id="imei-input"
                        type="text"
                        value={imei}
                        onChange={(e) => setImei(e.target.value)}
                        placeholder="Enter 15-digit IMEI for a more accurate quote"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a] placeholder:text-[#0f172a]/30 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
                      />
                      <p className="text-xs text-[#0f172a]/40 mt-1">Dial *#06# on your phone to find it</p>
                    </div>
                  </div>

                  {/* Right: quote result */}
                  <div className="flex flex-col justify-between">
                    <div className={`rounded-2xl p-8 border transition-all duration-300 ${
                      baseValue > 0
                        ? "bg-[#0f172a] border-[#0f172a]/10 text-white"
                        : "bg-gray-50 border-gray-100 text-[#0f172a]/40"
                    }`}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-4 opacity-50">
                        Estimated Value
                      </p>
                      <p className={`text-5xl font-black mb-2 ${baseValue > 0 ? "text-[#04a1c6]" : ""}`}>
                        {baseValue > 0 ? `$${baseValue}` : "$—"}
                      </p>
                      {baseValue > 0 && (
                        <p className="text-sm text-white/50">
                          Lock this value for 90 days
                        </p>
                      )}

                      {baseValue > 0 && (
                        <div className="mt-6 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Escrow-protected transaction</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <Lock className="w-4 h-4 text-amber-400" />
                            <span>Price guaranteed for 90 days</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        disabled={!canSubmit}
                        onClick={() => setSubmitted(true)}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                          canSubmit
                            ? "bg-[#04a1c6] text-white shadow-lg shadow-[#04a1c6]/20 hover:shadow-[#04a1c6]/40"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Lock In Value
                      </button>
                      <button
                        disabled={!canSubmit}
                        onClick={() => setSubmitted(true)}
                        className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                          canSubmit
                            ? "border-[#04a1c6] text-[#04a1c6] hover:bg-[#04a1c6]/5"
                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Just Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel rounded-3xl p-12 border border-white/10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Quote Locked In</h2>
                <p className="text-[#0f172a]/60 mb-2">
                  Your <span className="font-semibold">{selectedDevice}</span> ({condition}) is valued at{" "}
                  <span className="font-bold text-[#04a1c6]">${baseValue}</span> for the next 90 days.
                </p>
                <p className="text-sm text-[#0f172a]/40 mb-8">
                  Sign in to track your trade-in and apply it toward a purchase.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard/trade-ins">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#04a1c6] text-white font-semibold text-sm cursor-pointer shadow-lg shadow-[#04a1c6]/20">
                      View in Dashboard <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>
                  <button
                    onClick={() => { setSubmitted(false); setSelectedDevice(""); setCondition(""); setImei(""); }}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-[#0f172a]/60 font-semibold text-sm cursor-pointer hover:bg-gray-50"
                  >
                    New Quote
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
