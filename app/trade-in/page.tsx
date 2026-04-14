"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight, ChevronRight, Lock, Zap, ShieldCheck,
  CheckCircle, AlertCircle, Truck, Clock, CreditCard,
  Wifi, WifiOff, Package, Star
} from "lucide-react";
import { Navigation } from "../../components/Navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

// ─── Data ────────────────────────────────────────────────────────────────────

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Nothing", "Motorola"];

const DEVICES_BY_BRAND: Record<string, { name: string; base: number }[]> = {
  Apple: [
    { name: "iPhone 17 Pro Max", base: 680 },
    { name: "iPhone 17 Pro",     base: 580 },
    { name: "iPhone 17",         base: 420 },
    { name: "iPhone 16 Pro Max", base: 520 },
    { name: "iPhone 16 Pro",     base: 440 },
    { name: "iPhone 16",         base: 320 },
    { name: "iPhone 15 Pro Max", base: 380 },
    { name: "iPhone 15 Pro",     base: 310 },
    { name: "iPhone 15",         base: 230 },
    { name: "iPhone 14 Pro Max", base: 260 },
    { name: "iPhone 14 Pro",     base: 210 },
  ],
  Samsung: [
    { name: "Galaxy S26 Ultra",  base: 560 },
    { name: "Galaxy S25 Ultra",  base: 430 },
    { name: "Galaxy S25+",       base: 340 },
    { name: "Galaxy S25",        base: 280 },
    { name: "Galaxy S24 Ultra",  base: 360 },
    { name: "Galaxy S24+",       base: 280 },
    { name: "Galaxy S24",        base: 220 },
    { name: "Galaxy Z Fold 6",   base: 520 },
    { name: "Galaxy Z Flip 6",   base: 300 },
  ],
  Google: [
    { name: "Pixel 10 Pro XL", base: 400 },
    { name: "Pixel 10 Pro",    base: 340 },
    { name: "Pixel 10",        base: 260 },
    { name: "Pixel 9 Pro XL",  base: 310 },
    { name: "Pixel 9 Pro",     base: 260 },
    { name: "Pixel 9",         base: 200 },
    { name: "Pixel 8 Pro",     base: 210 },
    { name: "Pixel 8",         base: 160 },
  ],
  OnePlus: [
    { name: "OnePlus 13",  base: 280 },
    { name: "OnePlus 12",  base: 200 },
    { name: "OnePlus 12R", base: 150 },
  ],
  Nothing: [
    { name: "Nothing Phone (3)",  base: 260 },
    { name: "Nothing Phone (2a)", base: 150 },
    { name: "Nothing Phone (2)",  base: 180 },
  ],
  Motorola: [
    { name: "Moto Edge 50 Ultra", base: 220 },
    { name: "Moto Edge 50 Pro",   base: 170 },
    { name: "Razr+ 2025",         base: 280 },
  ],
};

const STORAGE_OPTIONS = [
  { label: "128 GB", multiplier: 1.00 },
  { label: "256 GB", multiplier: 1.10 },
  { label: "512 GB", multiplier: 1.22 },
  { label: "1 TB",   multiplier: 1.38 },
];

const CONDITIONS = [
  {
    label: "Like New",
    key: "USED_LIKE_NEW",
    multiplier: 1.0,
    desc: "No visible scratches. May have original packaging.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-300",
  },
  {
    label: "Good",
    key: "USED_GOOD",
    multiplier: 0.80,
    desc: "Minor wear or light scratches. Fully functional.",
    color: "text-[#04a1c6]",
    bg: "bg-[#04a1c6]/5 border-[#04a1c6]/40",
  },
  {
    label: "Fair",
    key: "USED_FAIR",
    multiplier: 0.60,
    desc: "Visible scuffs or dents. No cracks. Fully functional.",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-300",
  },
  {
    label: "Poor",
    key: "USED_POOR",
    multiplier: 0.38,
    desc: "Cracked screen or heavy wear. Still powers on.",
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-300",
  },
];

const CARRIER_OPTIONS = [
  { label: "Unlocked",      key: "unlocked",  multiplier: 1.00, desc: "Works with any carrier",        icon: <Wifi className="w-4 h-4" /> },
  { label: "Carrier Locked", key: "locked",   multiplier: 0.85, desc: "Locked to a specific carrier",  icon: <WifiOff className="w-4 h-4" /> },
];

// ─── IMEI validation ──────────────────────────────────────────────────────────

function imeiStatus(val: string): "empty" | "valid" | "invalid" {
  if (!val) return "empty";
  return /^\d{15}$/.test(val) ? "valid" : "invalid";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TradeInPage() {
  const { data: session } = useSession();

  // Form state
  const [brand, setBrand]               = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [storage, setStorage]           = useState("");
  const [condition, setCondition]       = useState("");
  const [carrier, setCarrier]           = useState("");
  const [imei, setImei]                 = useState("");

  // UI state
  const [loading, setLoading]   = useState(false);
  const [locked, setLocked]     = useState(false);  // committed (Lock In Value)
  const [quoted, setQuoted]     = useState(false);  // just-get-quote shown

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
    setBrand(""); setSelectedDevice(""); setStorage("");
    setCondition(""); setCarrier(""); setImei("");
    setLocked(false); setQuoted(false);
  }

  async function handleLock() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600)); // simulate API
    setLoading(false);
    setLocked(true);
  }

  function handleJustQuote() {
    setQuoted(true);
    // scroll to quote panel smoothly
    document.getElementById("quote-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <main className="min-h-screen">
      <div className="animated-bg" />
      <Navigation />

      <section className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* ── Header ── */}
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

          {/* ── How It Works ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { step: "01", icon: <ArrowLeftRight className="w-5 h-5" />, title: "Select Your Device", desc: "Pick your model, storage, and condition. We calculate a fair market quote instantly." },
              { step: "02", icon: <Lock className="w-5 h-5" />, title: "Lock Your Value", desc: "Lock in the quoted price for 90 days. Your device won't lose value while you decide." },
              { step: "03", icon: <Zap className="w-5 h-5" />, title: "Apply to Purchase", desc: "Use your locked value as credit toward any order or preorder on Select Mobile." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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

          {/* ── Trust Signals ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-14"
          >
            {[
              { icon: <Package className="w-4 h-4" />,    text: "12,000+ devices traded in" },
              { icon: <Truck className="w-4 h-4" />,      text: "Free prepaid shipping label" },
              { icon: <Clock className="w-4 h-4" />,      text: "Credit applied in 3–5 days" },
              { icon: <ShieldCheck className="w-4 h-4" />, text: "Escrow-protected transaction" },
              { icon: <Star className="w-4 h-4" />,       text: "4.8★ average seller rating" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm text-[#0f172a]/70 shadow-sm">
                <span className="text-[#04a1c6]">{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </motion.div>

          {/* ── Form / Success ── */}
          <AnimatePresence mode="wait">
            {locked ? (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-3xl p-10 md:p-14 border border-white/10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Quote Locked In</h2>
                <p className="text-[#0f172a]/60 mb-1">
                  Your <span className="font-semibold">{selectedDevice}</span> ({storage} · {condition}) is valued at{" "}
                  <span className="font-bold text-[#04a1c6] text-xl">${baseValue}</span> for the next 90 days.
                </p>

                {/* Conditional sign-in message — only for guests */}
                {!session?.user && (
                  <p className="text-sm text-[#0f172a]/40 mt-2 mb-6">
                    Sign in to track your trade-in and apply it toward a purchase.
                  </p>
                )}

                {/* What happens next */}
                <div className="mt-8 mb-10 text-left max-w-md mx-auto">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#0f172a]/30 mb-4 text-center">What happens next</p>
                  <div className="space-y-4">
                    {[
                      { icon: <Truck className="w-4 h-4 text-[#04a1c6]" />,      title: "Prepaid label emailed", desc: "We'll send a free shipping label within 1 business day." },
                      { icon: <Package className="w-4 h-4 text-amber-500" />,    title: "Ship within 30 days",   desc: "Drop your device at any carrier location — no box needed." },
                      { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, title: "We inspect & confirm", desc: "Our team verifies your device within 3–5 business days." },
                      { icon: <CreditCard className="w-4 h-4 text-indigo-500" />, title: "Credit applied",       desc: "Value is added to your account for any order or preorder." },
                    ].map((step) => (
                      <div key={step.title} className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 shrink-0">{step.icon}</div>
                        <div>
                          <p className="text-sm font-bold text-[#0f172a]">{step.title}</p>
                          <p className="text-xs text-[#0f172a]/50">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  {session?.user ? (
                    <Link href={dashboardPath}>
                      <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#04a1c6] text-white font-semibold text-sm cursor-pointer shadow-lg shadow-[#04a1c6]/20 hover:bg-[#0390b0] transition-colors">
                        View in Dashboard <ChevronRight className="w-4 h-4" />
                      </span>
                    </Link>
                  ) : (
                    <Link href="/login?callbackUrl=/trade-in">
                      <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#04a1c6] text-white font-semibold text-sm cursor-pointer shadow-lg shadow-[#04a1c6]/20 hover:bg-[#0390b0] transition-colors">
                        Sign In to Track <ChevronRight className="w-4 h-4" />
                      </span>
                    </Link>
                  )}
                  <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-[#0f172a]/60 font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    New Quote
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Quote Form ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
              >
                <h2 className="text-2xl font-bold text-[#0f172a] mb-8">Get Your Instant Quote</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* ── Left: inputs ── */}
                  <div className="space-y-7">

                    {/* Step 1: Brand */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                        1 · Brand
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {BRANDS.map((b) => (
                          <button
                            key={b}
                            onClick={() => { setBrand(b); setSelectedDevice(""); }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                              brand === b
                                ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-md shadow-[#04a1c6]/20"
                                : "bg-white border-gray-200 text-[#0f172a]/60 hover:border-[#04a1c6]/40 hover:text-[#04a1c6]"
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Model */}
                    <AnimatePresence>
                      {brand && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label htmlFor="device-select" className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                            2 · Model
                          </label>
                          <select
                            id="device-select"
                            value={selectedDevice}
                            onChange={(e) => setSelectedDevice(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#0f172a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 focus:border-[#04a1c6]/30"
                          >
                            <option value="">Select model...</option>
                            {devices.map((d) => (
                              <option key={d.name} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step 3: Storage */}
                    <AnimatePresence>
                      {selectedDevice && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                            3 · Storage
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {STORAGE_OPTIONS.map((s) => (
                              <button
                                key={s.label}
                                onClick={() => setStorage(s.label)}
                                className={`py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border text-center ${
                                  storage === s.label
                                    ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-md shadow-[#04a1c6]/20"
                                    : "bg-white border-gray-200 text-[#0f172a]/60 hover:border-[#04a1c6]/40 hover:text-[#04a1c6]"
                                }`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step 4: Condition */}
                    <AnimatePresence>
                      {storage && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                            4 · Condition
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {CONDITIONS.map((c) => (
                              <button
                                key={c.label}
                                onClick={() => setCondition(c.label)}
                                aria-pressed={condition === c.label}
                                className={`p-3 rounded-xl text-left transition-all cursor-pointer border-2 ${
                                  condition === c.label
                                    ? c.bg
                                    : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <span className={`text-sm font-bold block ${condition === c.label ? c.color : "text-[#0f172a]"}`}>
                                  {c.label}
                                </span>
                                <span className="text-[11px] text-[#0f172a]/50 leading-snug">{c.desc}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step 5: Carrier status */}
                    <AnimatePresence>
                      {condition && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                            5 · Carrier Status
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {CARRIER_OPTIONS.map((c) => (
                              <button
                                key={c.key}
                                onClick={() => setCarrier(c.key)}
                                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border-2 ${
                                  carrier === c.key
                                    ? "bg-[#04a1c6]/5 border-[#04a1c6]/40 text-[#04a1c6]"
                                    : "bg-white border-gray-200 text-[#0f172a]/60 hover:border-gray-300"
                                }`}
                              >
                                <span className={carrier === c.key ? "text-[#04a1c6]" : "text-[#0f172a]/40"}>{c.icon}</span>
                                <div>
                                  <span className="text-sm font-bold block">{c.label}</span>
                                  <span className="text-[11px] text-[#0f172a]/40">{c.desc}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step 6: IMEI */}
                    <AnimatePresence>
                      {carrier && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label htmlFor="imei-input" className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-2">
                            6 · IMEI <span className="normal-case text-[#0f172a]/30">(optional — improves accuracy)</span>
                          </label>
                          <div className="relative">
                            <input
                              id="imei-input"
                              type="text"
                              inputMode="numeric"
                              maxLength={15}
                              value={imei}
                              onChange={(e) => setImei(e.target.value.replace(/\D/g, ""))}
                              placeholder="15-digit IMEI"
                              className={`w-full px-4 py-3 pr-10 rounded-xl border text-sm text-[#0f172a] placeholder:text-[#0f172a]/30 focus:outline-none focus:ring-2 transition-colors ${
                                imeiState === "valid"
                                  ? "border-emerald-400 focus:ring-emerald-200 bg-emerald-50/30"
                                  : imeiState === "invalid"
                                  ? "border-rose-300 focus:ring-rose-200 bg-rose-50/20"
                                  : "border-gray-200 focus:ring-[#04a1c6]/30 bg-white"
                              }`}
                            />
                            {imeiState === "valid" && (
                              <CheckCircle className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                            {imeiState === "invalid" && (
                              <AlertCircle className="w-4 h-4 text-rose-400 absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-xs text-[#0f172a]/40">Dial <span className="font-mono font-bold">*#06#</span> to find it</p>
                            {imeiState === "invalid" && (
                              <p className="text-xs text-rose-500 font-medium">{imei.length}/15 digits</p>
                            )}
                            {imeiState === "valid" && (
                              <p className="text-xs text-emerald-600 font-medium">Valid IMEI ✓</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Right: quote panel ── */}
                  <div className="flex flex-col" id="quote-panel">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={baseValue > 0 ? "filled" : "empty"}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-2xl p-8 border transition-colors duration-300 ${
                          baseValue > 0
                            ? "bg-[#0f172a] border-[#0f172a]/10 text-white"
                            : "bg-gray-50 border-gray-100 text-[#0f172a]/40"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-4 opacity-50">
                          Estimated Value
                        </p>

                        <motion.p
                          key={baseValue}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                          className={`text-6xl font-black mb-2 tracking-tight ${baseValue > 0 ? "text-[#04a1c6]" : ""}`}
                        >
                          {baseValue > 0 ? `$${baseValue}` : "$—"}
                        </motion.p>

                        {baseValue > 0 ? (
                          <>
                            <p className="text-sm text-white/50 mb-1">
                              {selectedDevice} · {storage} · {condition}
                            </p>
                            <p className="text-sm text-white/50 mb-6">
                              Lock this value for 90 days
                            </p>
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Escrow-protected transaction</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>Price guaranteed for 90 days</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <Truck className="w-4 h-4 text-[#04a1c6] shrink-0" />
                                <span>Free prepaid shipping label</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                                <span>Credit applied in 3–5 business days</span>
                              </div>
                            </div>

                            {/* Breakdown */}
                            {stor && carr && cond && (
                              <div className="mt-6 pt-5 border-t border-white/10 space-y-1.5 text-xs text-white/40">
                                <div className="flex justify-between">
                                  <span>Base value</span>
                                  <span className="font-bold text-white/60">${device?.base ?? 0}</span>
                                </div>
                                {stor.multiplier !== 1 && (
                                  <div className="flex justify-between">
                                    <span>Storage ({stor.label})</span>
                                    <span className="font-bold text-white/60">×{stor.multiplier.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>Condition ({cond.label})</span>
                                  <span className="font-bold text-white/60">×{cond.multiplier.toFixed(2)}</span>
                                </div>
                                {carr.multiplier !== 1 && (
                                  <div className="flex justify-between">
                                    <span>Carrier locked</span>
                                    <span className="font-bold text-rose-400">×{carr.multiplier.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between pt-1.5 border-t border-white/10 text-white/70 font-bold">
                                  <span>Your quote</span>
                                  <span className="text-[#04a1c6]">${baseValue}</span>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm opacity-60">
                            Complete all steps on the left to see your quote.
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* CTAs */}
                    <div className="flex flex-col gap-3 mt-6">
                      {/* Primary: Lock In Value — commits quote */}
                      <button
                        disabled={!canQuote || loading}
                        onClick={handleLock}
                        className={`w-full py-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          canQuote && !loading
                            ? "bg-[#04a1c6] text-white shadow-lg shadow-[#04a1c6]/25 hover:bg-[#0390b0] hover:shadow-[#04a1c6]/40"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Locking in your quote…
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Lock In Value{baseValue > 0 ? ` — $${baseValue}` : ""}
                          </>
                        )}
                      </button>

                      {/* Secondary: Just Get Quote — no commitment, highlights the panel */}
                      <button
                        disabled={!canQuote || loading}
                        onClick={handleJustQuote}
                        className={`w-full py-3.5 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                          canQuote && !loading
                            ? "border-[#04a1c6] text-[#04a1c6] hover:bg-[#04a1c6]/5"
                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Just Show My Quote
                      </button>

                      {quoted && !locked && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-center text-[#0f172a]/40"
                        >
                          Your quote is shown above. Lock it in when you&apos;re ready — no commitment yet.
                        </motion.p>
                      )}

                      <p className="text-[11px] text-center text-[#0f172a]/30">
                        Locking reserves your quote at no cost. You decide when to ship.
                      </p>
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
