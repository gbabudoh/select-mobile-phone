"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, ShieldCheck, ShoppingCart, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { TCOResult } from "../../lib/tco";

interface Props {
  result: TCOResult | null;
  months: number;
}

export function TCOResults({ result, months }: Props) {
  if (!result) return null;
  const { carrierTotal, byopTotal, saved, monthlySavings, carrierBreakdown, byopBreakdown } = result;
  const barRatio = carrierTotal > 0 ? (byopTotal / carrierTotal) * 100 : 0;

  const carrierMonthly = months > 0 ? carrierTotal / months : 0;
  const byopMonthly = months > 0 ? byopTotal / months : 0;
  const annualSavings = monthlySavings * 12;

  const animKey = `${carrierTotal.toFixed(0)}-${byopTotal.toFixed(0)}`;

  return (
    <div className="bg-white/95 rounded-[2.5rem] p-6 sm:p-8 sticky top-28 overflow-hidden border border-slate-200/80 shadow-2xl space-y-8 backdrop-blur-xl">
      {/* Background Glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#04a1c6]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#04a1c6] text-white flex items-center justify-center shadow-lg shadow-[#04a1c6]/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Projection Horizon</span>
            <h3 className="text-xl font-black text-[#0f172a]">
              {months}-Month TCO Comparison
            </h3>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div key={animKey} className="space-y-6">
        {/* Carrier Contract */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">Carrier Contract</span>
              <span className="text-sm font-black text-[#0f172a]">Retail Financing</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-rose-500">
                ${carrierTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="block text-[10px] font-bold text-rose-400">
                ≈ ${carrierMonthly.toFixed(0)}/mo
              </span>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600 shadow-lg shadow-rose-500/20"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">VS</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Unlocked + eSIM */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-[#04a1c6] uppercase tracking-widest block">Unlocked + Select eSIM</span>
              <span className="text-sm font-black text-[#0f172a]">BYOP Optimized</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-600">
                ${byopTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="block text-[10px] font-bold text-emerald-500">
                ≈ ${byopMonthly.toFixed(0)}/mo
              </span>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#04a1c6] to-emerald-500 shadow-lg shadow-[#04a1c6]/20"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(barRatio, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
            />
          </div>
        </div>
      </div>

      {/* Potential Savings Box */}
      <motion.div
        key={`savings-${animKey}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className={`p-6 rounded-[2rem] text-center border relative overflow-hidden transition-all ${
          saved >= 0
            ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
            : "bg-rose-50/80 border-rose-200 text-rose-950"
        }`}
      >
        <div className="relative z-10 space-y-2">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] block ${saved >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            Net Saved Over {months} Months
          </span>
          
          <div className="flex items-center justify-center gap-2">
            {saved >= 0 && <CheckCircle2 className="w-7 h-7 text-emerald-600" />}
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${saved >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              ${Math.abs(saved).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <p className="text-xs font-bold text-slate-600">
            {saved >= 0 ? "Cheaper than standard carrier retail financing" : "Carrier contract offers better promo rate"}
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              ${Math.abs(monthlySavings).toFixed(0)} / month
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
              ${Math.abs(annualSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })} / year
            </span>
          </div>
        </div>
      </motion.div>

      {/* Cost Breakdown Table */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Itemized Cost Breakdown</span>
        </div>

        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {/* Carrier Side */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">Carrier</span>
            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Device</span>
                <span className="font-bold text-slate-900">${carrierBreakdown.device.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Service</span>
                <span className="font-bold text-slate-900">${carrierBreakdown.plan.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Activation</span>
                <span className="font-bold text-slate-900">${carrierBreakdown.activation.toFixed(0)}</span>
              </div>
              {carrierBreakdown.insurance > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Insurance</span>
                  <span className="font-bold text-slate-900">${carrierBreakdown.insurance.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-200 text-xs font-black">
                <span className="text-slate-700">Total</span>
                <span className="text-rose-500">${carrierTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* BYOP Side */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#04a1c6] uppercase tracking-wider block">Unlocked</span>
            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Device</span>
                <span className="font-bold text-slate-900">${byopBreakdown.device.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Service</span>
                <span className="font-bold text-slate-900">${byopBreakdown.plan.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Activation</span>
                <span className="font-bold text-slate-900">$0</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-xs font-black">
                <span className="text-slate-700">Total</span>
                <span className="text-emerald-600">${byopTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marketplace Action CTAs */}
      {saved > 0 && (
        <div className="space-y-3 pt-2">
          <Link
            href="/normal-order"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#0f172a] text-white text-xs font-black uppercase tracking-wider hover:bg-[#04a1c6] transition-all shadow-xl shadow-slate-900/10 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Shop Unlocked Devices</span>
          </Link>
          <Link
            href="/preorder"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border border-slate-200 text-[#04a1c6] text-xs font-black uppercase tracking-wider hover:bg-[#04a1c6]/5 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>View Preorder Queue Bundles</span>
          </Link>
        </div>
      )}
    </div>
  );
}
