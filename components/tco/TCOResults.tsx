"use client";
import React from "react";
import { motion } from "framer-motion";
import type { TCOResult } from "../../lib/tco";

interface Props {
  result: TCOResult;
  months: number;
}

export function TCOResults({ result, months }: Props) {
  const { carrierTotal, byopTotal, saved, carrierBreakdown, byopBreakdown } = result;
  const barRatio = carrierTotal > 0 ? (byopTotal / carrierTotal) * 100 : 0;

  return (
    <div className="bg-[#1a1c23] rounded-3xl p-8 md:p-10 border border-white/5 flex flex-col justify-between relative overflow-hidden text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
      {/* Glow orb */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#04a1c6]/10 rounded-full blur-[100px] pointer-events-none" />

      <h3 className="text-xl font-semibold text-center mb-8 tracking-wide text-white/90">
        {months}-Month Projection
      </h3>

      {/* Bars */}
      <div className="space-y-6">
        {/* Carrier */}
        <div>
          <div className="flex justify-between items-center text-base mb-3 bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-white/80 font-medium tracking-wide">Carrier Contract</span>
            <span className="font-semibold text-rose-300 text-lg">
              ${carrierTotal.toFixed(0)}
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

        {/* BYOP */}
        <div>
          <div className="flex justify-between items-center text-base mb-3 mt-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <span className="text-white/80 font-medium tracking-wide">
              Unlocked + BYOP eSIM
            </span>
            <span className="font-semibold text-emerald-300 text-lg">
              ${byopTotal.toFixed(0)}
            </span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#04a1c6]/80"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(barRatio, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <p className="text-white/40 uppercase text-xs tracking-wider font-medium">Carrier Breakdown</p>
          <p className="text-white/70">Device: <span className="text-white">${carrierBreakdown.device.toFixed(0)}</span></p>
          <p className="text-white/70">Plan: <span className="text-white">${carrierBreakdown.plan.toFixed(0)}</span></p>
          <p className="text-white/70">Activation: <span className="text-white">${carrierBreakdown.activation.toFixed(0)}</span></p>
          <p className="text-white/70">Insurance: <span className="text-white">${carrierBreakdown.insurance.toFixed(0)}</span></p>
          {carrierBreakdown.interest > 0 && (
            <p className="text-white/70">Interest: <span className="text-white">${carrierBreakdown.interest.toFixed(0)}</span></p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-white/40 uppercase text-xs tracking-wider font-medium">BYOP Breakdown</p>
          <p className="text-white/70">Device: <span className="text-white">${byopBreakdown.device.toFixed(0)}</span></p>
          <p className="text-white/70">Plan: <span className="text-white">${byopBreakdown.plan.toFixed(0)}</span></p>
        </div>
      </div>

      {/* Savings badge */}
      <div
        className={`mt-8 text-center p-6 rounded-2xl border relative overflow-hidden transition-colors duration-500 ${
          saved >= 0
            ? "bg-emerald-500/10 border-emerald-500/20"
            : "bg-rose-500/10 border-rose-500/20"
        }`}
        role="status"
        aria-live="polite"
      >
        <p
          className={`font-bold text-3xl mb-1 relative z-10 transition-colors duration-500 ${
            saved >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {saved >= 0
            ? `Save $${saved.toFixed(0)}`
            : `Costs $${Math.abs(saved).toFixed(0)} More`}
        </p>
        <p
          className={`text-sm font-medium tracking-wide relative z-10 transition-colors duration-500 ${
            saved >= 0 ? "text-emerald-400/70" : "text-rose-400/70"
          }`}
        >
          Over {months} Months vs Carrier
        </p>
      </div>
    </div>
  );
}
