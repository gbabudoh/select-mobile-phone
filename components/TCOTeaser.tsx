"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calculateTCO, getHandsets, getEsimPlans } from "../lib/tco";

export function TCOTeaser() {
  const handsets = useMemo(() => getHandsets().slice(0, 3), []);
  const defaultPlan = useMemo(() => getEsimPlans()[0], []);

  const [selected, setSelected] = useState(handsets[0]);

  const result = useMemo(
    () =>
      calculateTCO({
        devicePrice: selected.price,
        carrierPlanMonthly: 85,
        byopPlanMonthly: defaultPlan.price,
        months: 24,
      }),
    [selected, defaultPlan]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full glass-panel rounded-[2.5rem] p-8 md:p-14 mb-24 mt-12 border-t border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Total Cost of Ownership</h2>
            <p className="text-foreground/70">
              Buying outright with an MVNO eSIM often crushes the 24-month carrier
              contract trap. Pick a device to see a quick preview.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium uppercase tracking-wider text-foreground/50">
              Quick Compare
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {handsets.map((phone) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={phone.id}
                  onClick={() => setSelected(phone)}
                  aria-pressed={selected.id === phone.id}
                  className={`p-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    selected.id === phone.id
                      ? "bg-[#04a1c6] text-white shadow-[0_0_20px_rgba(4,161,198,0.5)] border border-[#04a1c6]/50"
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {phone.name}
                </motion.button>
              ))}
            </div>
          </div>

          <Link href="/tco-calculator">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-2xl bg-[#04a1c6] text-white font-semibold cursor-pointer shadow-lg shadow-[#04a1c6]/20"
            >
              Full Calculator <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>

        {/* Right: Mini results */}
        <div className="flex-1 bg-[#1a1c23] rounded-3xl p-10 border border-white/5 flex flex-col justify-center relative overflow-hidden text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#04a1c6]/10 rounded-full blur-[100px] pointer-events-none" />
          <h3 className="text-xl font-semibold text-center mb-10 tracking-wide text-white/90">
            24-Month Snapshot
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-base mb-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-white/80 font-medium">Carrier Contract</span>
                <span className="font-semibold text-rose-300 text-lg">
                  ${result.carrierTotal.toFixed(0)}
                </span>
              </div>
              <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-base mb-3 mt-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-white/80 font-medium">Unlocked + eSIM</span>
                <span className="font-semibold text-emerald-300 text-lg">
                  ${result.byopTotal.toFixed(0)}
                </span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#04a1c6]/80"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((result.byopTotal / result.carrierTotal) * 100, 100)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <div
            className="mt-10 text-center p-6 rounded-2xl border relative overflow-hidden bg-emerald-500/10 border-emerald-500/20"
            role="status"
            aria-live="polite"
          >
            <p className="font-bold text-3xl mb-1 text-emerald-400">
              Save ${result.saved.toFixed(0)}
            </p>
            <p className="text-sm font-medium tracking-wide text-emerald-400/70">
              Over 24 Months vs Carrier
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
