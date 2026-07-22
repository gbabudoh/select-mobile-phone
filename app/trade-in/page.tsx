"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight, ChevronRight, Lock, Zap, ShieldCheck,
  CheckCircle, AlertCircle, Truck, Clock, CreditCard,
  Wifi, WifiOff, Package, Star, Smartphone, RefreshCw,
  Check, ArrowRight, DollarSign, Award, Sparkles
} from "lucide-react";
import { Navigation } from "../../components/Navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

// ─── Data ────────────────────────────────────────────────────────────────────

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Nothing", "Motorola"];

const DEVICES_BY_BRAND: Record<string, { name: string; base: number; tag?: string }[]> = {
  Apple: [
    { name: "iPhone 17 Pro Max", base: 680, tag: "Popular" },
    { name: "iPhone 17 Pro",     base: 580 },
    { name: "iPhone 17",         base: 420 },
    { name: "iPhone 16 Pro Max", base: 520, tag: "High Value" },
    { name: "iPhone 16 Pro",     base: 440 },
    { name: "iPhone 16",         base: 320 },
    { name: "iPhone 15 Pro Max", base: 380 },
    { name: "iPhone 15 Pro",     base: 310 },
    { name: "iPhone 15",         base: 230 },
    { name: "iPhone 14 Pro Max", base: 260 },
    { name: "iPhone 14 Pro",     base: 210 },
  ],
  Samsung: [
    { name: "Galaxy S26 Ultra",  base: 560, tag: "Popular" },
    { name: "Galaxy S25 Ultra",  base: 430 },
    { name: "Galaxy S25+",       base: 340 },
    { name: "Galaxy S25",        base: 280 },
    { name: "Galaxy S24 Ultra",  base: 360 },
    { name: "Galaxy S24+",       base: 280 },
    { name: "Galaxy S24",        base: 220 },
    { name: "Galaxy Z Fold 6",   base: 520, tag: "Foldable" },
    { name: "Galaxy Z Flip 6",   base: 300 },
  ],
  Google: [
    { name: "Pixel 10 Pro XL", base: 400, tag: "Popular" },
    { name: "Pixel 10 Pro",    base: 340 },
    { name: "Pixel 10",        base: 260 },
    { name: "Pixel 9 Pro XL",  base: 310 },
    { name: "Pixel 9 Pro",     base: 260 },
    { name: "Pixel 9",         base: 200 },
    { name: "Pixel 8 Pro",     base: 210 },
    { name: "Pixel 8",         base: 160 },
  ],
  OnePlus: [
    { name: "OnePlus 13",  base: 280, tag: "Popular" },
    { name: "OnePlus 12",  base: 200 },
    { name: "OnePlus 12R", base: 150 },
  ],
  Nothing: [
    { name: "Nothing Phone (3)",  base: 260, tag: "Popular" },
    { name: "Nothing Phone (2a)", base: 150 },
    { name: "Nothing Phone (2)",  base: 180 },
  ],
  Motorola: [
    { name: "Moto Edge 50 Ultra", base: 220 },
    { name: "Moto Edge 50 Pro",   base: 170 },
    { name: "Razr+ 2025",         base: 280, tag: "Foldable" },
  ],
};

const STORAGE_OPTIONS = [
  { label: "128 GB", multiplier: 1.00, bonus: "Base" },
  { label: "256 GB", multiplier: 1.10, bonus: "+10%" },
  { label: "512 GB", multiplier: 1.22, bonus: "+22%" },
  { label: "1 TB",   multiplier: 1.38, bonus: "+38%" },
];

const CONDITIONS = [
  {
    label: "Like New",
    key: "USED_LIKE_NEW",
    multiplier: 1.0,
    desc: "Flawless screen & body. 100% working order.",
    color: "text-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bg: "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/20",
  },
  {
    label: "Good",
    key: "USED_GOOD",
    multiplier: 0.80,
    desc: "Minor micro-scratches. Fully functional.",
    color: "text-[#04a1c6]",
    badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-200",
    bg: "bg-cyan-50/80 border-cyan-300 ring-2 ring-cyan-400/20",
  },
  {
    label: "Fair",
    key: "USED_FAIR",
    multiplier: 0.60,
    desc: "Visible scuffs or housing dents. No screen cracks.",
    color: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
    bg: "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20",
  },
  {
    label: "Poor",
    key: "USED_POOR",
    multiplier: 0.38,
    desc: "Cracked glass or heavy wear. Device powers on.",
    color: "text-rose-600",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
    bg: "bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/20",
  },
];

const CARRIER_OPTIONS = [
  { label: "Factory Unlocked", key: "unlocked", multiplier: 1.00, desc: "Compatible with any US & CA carrier", icon: <Wifi className="w-4 h-4 text-emerald-500" /> },
  { label: "Carrier Locked",    key: "locked",   multiplier: 0.85, desc: "Locked to AT&T, T-Mobile, Verizon, or Rogers", icon: <WifiOff className="w-4 h-4 text-amber-500" /> },
];

function imeiStatus(val: string): "empty" | "valid" | "invalid" {
  if (!val) return "empty";
  return /^\d{15}$/.test(val) ? "valid" : "invalid";
}

export default function TradeInPage() {
  const { data: session } = useSession();

  // Form state
  const [brand, setBrand]               = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [storage, setStorage]           = useState("");
  const [condition, setCondition]       = useState("");
  const [carrier, setCarrier]           = useState("unlocked");
  const [imei, setImei]                 = useState("");

  // UI state
  const [loading, setLoading]   = useState(false);
  const [locked, setLocked]     = useState(false);
  const [quoted, setQuoted]     = useState(false);

  const devices = brand ? DEVICES_BY_BRAND[brand] : [];
  const device  = devices.find((d) => d.name === selectedDevice);
  const cond    = CONDITIONS.find((c) => c.label === condition);
  const stor    = STORAGE_OPTIONS.find((s) => s.label === storage);
  const carr    = CARRIER_OPTIONS.find((c) => c.key === carrier);

  const baseValue = useMemo(() => {
    if (!device || !cond) return 0;
    const storMul  = stor?.multiplier  ?? 1.0;
    const carrMul  = carr?.multiplier  ?? 1.0;
    return Math.round(device.base * cond.multiplier * storMul * carrMul);
  }, [device, cond, stor, carr]);

  const canQuote  = !!(selectedDevice && condition && storage && carrier && baseValue > 0);
  const imeiState = imeiStatus(imei);

  const dashboardPath =
    (session?.user as { role?: string })?.role === "RETAILER"          ? "/retailer/dashboard" :
    (session?.user as { role?: string })?.role === "WHOLESALER"        ? "/wholesaler/dashboard" :
    (session?.user as { role?: string })?.role === "NETWORK_PROVIDER"  ? "/network-provider/dashboard" :
    (session?.user as { role?: string })?.role === "INDIVIDUAL_SELLER" ? "/individual/dashboard" :
    "/buyer/dashboard";

  function reset() {
    setBrand("");
    setSelectedDevice("");
    setStorage("");
    setCondition("");
    setCarrier("unlocked");
    setImei("");
    setLocked(false);
    setQuoted(false);
  }

  async function handleLock() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setLocked(true);
  }

  function handleJustQuote() {
    setQuoted(true);
    document.getElementById("valuation-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="animated-bg" />
      <Navigation />

      <section className="pt-24 md:pt-28 px-6 max-w-7xl mx-auto space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* ── Hero Header ── */}
          <div className="relative rounded-[3rem] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-2xl border border-white/10 mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#04a1c6]/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-[#04a1c6]">
                <ArrowLeftRight className="w-4 h-4 text-[#04a1c6]" />
                <span>Instant Trade-In Valuation Engine</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Unlock Max Value for Your Current Device
              </h1>

              <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                Get an instant fair-market quote, lock in your payout for up to 90 days, and apply credit toward any smartphone or preorder on Select Mobile.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {[
                  { icon: <Lock className="w-4 h-4 text-amber-400" />, text: "90-Day Price Lock Guarantee" },
                  { icon: <Truck className="w-4 h-4 text-emerald-400" />, text: "Free Prepaid Courier Label" },
                  { icon: <ShieldCheck className="w-4 h-4 text-[#04a1c6]" />, text: "Escrow Protected Payout" },
                  { icon: <Zap className="w-4 h-4 text-purple-400" />, text: "Credit Applied in 3 Days" },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                    {badge.icon}
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Workflow Steps ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { step: "01", icon: <Smartphone className="w-5 h-5 text-[#04a1c6]" />, title: "Select Device", desc: "Choose your model, storage size, and condition rating." },
              { step: "02", icon: <Sparkles className="w-5 h-5 text-amber-500" />, title: "Get Instant Quote", desc: "Live market algorithm calculates highest value offer." },
              { step: "03", icon: <Lock className="w-5 h-5 text-emerald-500" />, title: "Lock Rate (90 Days)", desc: "Freeze your payout rate so device value never depreciates." },
              { step: "04", icon: <CreditCard className="w-5 h-5 text-purple-500" />, title: "Ship & Receive Payout", desc: "Ship with our prepaid label and get instant store credit." },
            ].map((item) => (
              <div key={item.step} className="relative bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm group hover:shadow-xl hover:border-[#04a1c6]/30 transition-all">
                <span className="text-4xl font-black text-slate-200 absolute top-5 right-5 group-hover:text-[#04a1c6]/20 transition-colors">{item.step}</span>
                <div className="relative z-10">
                  <div className="p-3 rounded-2xl bg-slate-50 w-fit mb-4 border border-slate-100">{item.icon}</div>
                  <h3 className="font-extrabold text-[#0f172a] text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Main Interactive Form / Success Panel ── */}
          <AnimatePresence mode="wait">
            {locked ? (
              /* ── Locked Success Screen ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[3rem] p-8 md:p-14 border border-slate-200/80 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-200 mb-4">
                  <Lock className="w-3.5 h-3.5" /> 90-Day Payout Locked
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-3">
                  ${baseValue} Trade-In Value Guaranteed!
                </h2>

                <p className="text-base text-slate-600 max-w-xl mx-auto mb-8 font-medium">
                  Your <strong className="text-[#0f172a] font-black">{selectedDevice}</strong> ({storage} · {condition} · {carrier === "unlocked" ? "Unlocked" : "Carrier Locked"}) is reserved at <span className="text-[#04a1c6] font-black">${baseValue}</span> until launch day.
                </p>

                {/* What Happens Next Checklist */}
                <div className="bg-slate-50 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto text-left border border-slate-200/80 mb-8 space-y-4">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Next Steps Checklist</div>
                  {[
                    { icon: <Truck className="w-4 h-4 text-[#04a1c6]" />, title: "Prepaid Courier Shipping Label", desc: "A free prepaid shipping label has been dispatched to your account." },
                    { icon: <Package className="w-4 h-4 text-amber-500" />, title: "Ship Within 30 Days", desc: "Pack your device safely and drop off at any authorized shipping hub." },
                    { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, title: "50-Point Inspection & Verification", desc: "Device is verified by Select-Shield technicians upon arrival." },
                    { icon: <CreditCard className="w-4 h-4 text-purple-500" />, title: "Credit Applied to Orders / Preorders", desc: "Instant credit applied directly toward your new order." },
                  ].map((s) => (
                    <div key={s.title} className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 shrink-0">{s.icon}</div>
                      <div>
                        <div className="text-sm font-black text-[#0f172a]">{s.title}</div>
                        <div className="text-xs text-slate-500 font-medium">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href={dashboardPath}>
                    <span className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#04a1c6] text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-xl shadow-[#04a1c6]/30 hover:bg-[#0390b0] transition-all">
                      View Trade-In Status <ChevronRight className="w-4 h-4" />
                    </span>
                  </Link>
                  <button
                    onClick={reset}
                    className="px-8 py-4 rounded-2xl border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    Calculate Another Device
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Interactive Valuation Wizard ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[3rem] p-7 md:p-12 border border-slate-200/80 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-black text-[#0f172a]">Instant Device Evaluator</h2>
                    <p className="text-xs text-slate-500 font-medium">Select your device specifications below to calculate real-time trade-in credit.</p>
                  </div>
                  {canQuote && (
                    <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Quote Ready
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left Column: Form Steps (7 Cols) */}
                  <div className="lg:col-span-7 space-y-7">

                    {/* Step 1: Select Brand */}
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2.5">
                        Step 1 · Select Brand
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {BRANDS.map((b) => {
                          const isSelected = brand === b;
                          return (
                            <button
                              key={b}
                              onClick={() => {
                                setBrand(b);
                                const firstDev = DEVICES_BY_BRAND[b]?.[0]?.name || "";
                                setSelectedDevice(firstDev);
                              }}
                              className={`py-3 px-2 rounded-2xl text-xs font-black transition-all cursor-pointer border text-center ${
                                isSelected
                                  ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-lg shadow-[#04a1c6]/30 scale-[1.02]"
                                  : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-[#04a1c6]/40"
                              }`}
                            >
                              {b}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Select Model */}
                    {brand && (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2.5">
                          Step 2 · Select Model ({brand})
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                          {devices.map((d) => {
                            const isSelected = selectedDevice === d.name;
                            return (
                              <button
                                key={d.name}
                                onClick={() => setSelectedDevice(d.name)}
                                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex items-center justify-between ${
                                  isSelected
                                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.01]"
                                    : "bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-400"
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-black">{d.name}</div>
                                  <div className={`text-[10px] font-bold ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                                    Up to ${d.base} base credit
                                  </div>
                                </div>
                                {d.tag && (
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                                    isSelected ? "bg-white/20 text-white" : "bg-cyan-100 text-cyan-800"
                                  }`}>
                                    {d.tag}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Select Storage */}
                    {selectedDevice && (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2.5">
                          Step 3 · Storage Capacity
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {STORAGE_OPTIONS.map((s) => {
                            const isSelected = storage === s.label;
                            return (
                              <button
                                key={s.label}
                                onClick={() => setStorage(s.label)}
                                className={`p-3 rounded-2xl text-center transition-all cursor-pointer border ${
                                  isSelected
                                    ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-md shadow-[#04a1c6]/30"
                                    : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-[#04a1c6]/40"
                                }`}
                              >
                                <div className="text-xs font-black">{s.label}</div>
                                <div className={`text-[9px] font-bold ${isSelected ? "text-white/80" : "text-[#04a1c6]"}`}>
                                  {s.bonus}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Device Condition */}
                    {storage && (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2.5">
                          Step 4 · Device Condition
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {CONDITIONS.map((c) => {
                            const isSelected = condition === c.label;
                            return (
                              <button
                                key={c.label}
                                onClick={() => setCondition(c.label)}
                                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                                  isSelected ? c.bg : "bg-slate-50 border-slate-200/80 hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-xs font-black ${isSelected ? c.color : "text-slate-900"}`}>
                                    {c.label}
                                  </span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border ${c.badgeBg}`}>
                                    {(c.multiplier * 100)}% value
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{c.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 5: Carrier Lock Status */}
                    {condition && (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2.5">
                          Step 5 · Carrier Network Lock
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {CARRIER_OPTIONS.map((c) => {
                            const isSelected = carrier === c.key;
                            return (
                              <button
                                key={c.key}
                                onClick={() => setCarrier(c.key)}
                                className={`flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                                  isSelected
                                    ? "bg-cyan-50/80 border-[#04a1c6] text-[#04a1c6] ring-2 ring-[#04a1c6]/20"
                                    : "bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300"
                                }`}
                              >
                                <div className="p-2 rounded-xl bg-white shadow-sm">{c.icon}</div>
                                <div>
                                  <div className="text-xs font-black">{c.label}</div>
                                  <div className="text-[10px] text-slate-400 font-medium">{c.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 6: Optional IMEI Validator */}
                    {carrier && (
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">
                          Step 6 · Device IMEI <span className="normal-case text-slate-400 font-bold">(Optional — Dial *#06#)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={15}
                            value={imei}
                            onChange={(e) => setImei(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 15-digit IMEI number for instant unlock check"
                            className={`w-full px-4 py-3 rounded-2xl border text-xs font-bold text-slate-900 focus:outline-none transition-colors ${
                              imeiState === "valid"
                                ? "border-emerald-500 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-400/20"
                                : imeiState === "invalid"
                                ? "border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-400/20"
                                : "border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#04a1c6]/30"
                            }`}
                          />
                          {imeiState === "valid" && (
                            <CheckCircle className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          )}
                          {imeiState === "invalid" && (
                            <AlertCircle className="w-4 h-4 text-rose-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Live Valuation Box (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-between" id="valuation-panel">
                    <div className="p-7 rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-2xl relative overflow-hidden space-y-6">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#04a1c6]/20 blur-[80px] pointer-events-none" />

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Guaranteed Valuation</span>
                        {baseValue > 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                            🔒 90-Day Lock
                          </span>
                        )}
                      </div>

                      {/* Live Price Tag */}
                      <div>
                        <div className="text-5xl md:text-6xl font-black text-[#04a1c6] tracking-tight">
                          {baseValue > 0 ? `$${baseValue}` : "$0"}
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-1">
                          {selectedDevice ? `${selectedDevice} (${storage} · ${condition})` : "Configure device options"}
                        </p>
                      </div>

                      {/* Calculation Breakdown */}
                      {baseValue > 0 && device && (
                        <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
                          <div className="flex justify-between text-slate-400 font-medium">
                            <span>Base Model Credit ({device.name})</span>
                            <span className="font-bold text-white">${device.base}</span>
                          </div>
                          {stor && stor.multiplier !== 1 && (
                            <div className="flex justify-between text-slate-400 font-medium">
                              <span>Storage Bonus ({stor.label})</span>
                              <span className="font-bold text-emerald-400">×{stor.multiplier.toFixed(2)}</span>
                            </div>
                          )}
                          {cond && (
                            <div className="flex justify-between text-slate-400 font-medium">
                              <span>Condition ({cond.label})</span>
                              <span className="font-bold text-cyan-400">×{cond.multiplier.toFixed(2)}</span>
                            </div>
                          )}
                          {carr && carr.multiplier !== 1 && (
                            <div className="flex justify-between text-slate-400 font-medium">
                              <span>Carrier Lock Adjustment</span>
                              <span className="font-bold text-amber-400">×{carr.multiplier.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-black text-white">
                            <span>Total Estimated Payout</span>
                            <span className="text-[#04a1c6]">${baseValue}</span>
                          </div>
                        </div>
                      )}

                      {/* Benefits List */}
                      <div className="space-y-2.5 text-xs text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Escrow-Protected Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#04a1c6] shrink-0" />
                          <span>Free Prepaid Courier Shipping Label</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Rate Locked for 90 Days</span>
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3 mt-6">
                      <button
                        disabled={!canQuote || loading}
                        onClick={handleLock}
                        className={`w-full py-4.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                          canQuote && !loading
                            ? "bg-[#04a1c6] text-white shadow-[#04a1c6]/30 hover:bg-[#0390b0] active:scale-95"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Locking Valuation...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Lock In Value — ${baseValue}
                          </>
                        )}
                      </button>

                      <button
                        disabled={!canQuote || loading}
                        onClick={handleJustQuote}
                        className={`w-full py-3.5 rounded-2xl font-bold text-xs border transition-all cursor-pointer ${
                          canQuote && !loading
                            ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                            : "border-slate-200 text-slate-300 cursor-not-allowed"
                        }`}
                      >
                        Review Quote Breakdown
                      </button>

                      {quoted && !locked && (
                        <p className="text-[10px] text-center text-slate-400 font-bold">
                          Quote summary displayed above. Click &quot;Lock In Value&quot; to reserve your rate.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </section>
    </main>
  );
}
