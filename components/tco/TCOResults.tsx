"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, ShieldCheck } from "lucide-react";
import type { TCOResult } from "../../lib/tco";

interface Props {
  result: TCOResult;
  months: number;
}

export function TCOResults({ result, months }: Props) {
  const { carrierTotal, byopTotal, saved, carrierBreakdown, byopBreakdown } = result;
  const barRatio = carrierTotal > 0 ? (byopTotal / carrierTotal) * 100 : 0;

  return (
    <div className="glass-panel p-8 md:p-10 rounded-[3rem] sticky top-32 overflow-hidden bg-white/40 border-white shadow-xl">
      {/* Glow orb */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#04a1c6]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#04a1c6] text-white flex items-center justify-center shadow-lg shadow-[#04a1c6]/20">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-black text-[#0f172a]">
          {months}-Month Projection
        </h3>
      </div>

      {/* Bars */}
      <div className="space-y-8">
        {/* Carrier */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Carrier Contract</span>
              <span className="text-lg font-black text-[#0f172a]">Standard Pricing</span>
            </div>
            <span className="text-xl font-black text-rose-500">
              ${carrierTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-600 shadow-lg shadow-rose-500/20"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "circOut" }}
            />
          </div>
        </div>

        {/* BYOP */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-[#04a1c6] uppercase tracking-widest block mb-1">Unlocked + BYOP eSIM</span>
              <span className="text-lg font-black text-[#0f172a]">Optimized Cost</span>
            </div>
            <span className="text-xl font-black text-emerald-500">
              ${byopTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#04a1c6] to-[#04a1c6]/80 shadow-lg shadow-[#04a1c6]/20"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(barRatio, 100)}%` }}
              transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Savings badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className={`mt-10 p-8 rounded-[2rem] text-center relative overflow-hidden transition-all duration-500 border ${
          saved >= 0
            ? "bg-emerald-50 border-emerald-100"
            : "bg-rose-50 border-rose-100"
        }`}
      >
        <div className="relative z-10">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${saved >= 0 ? "text-emerald-600/60" : "text-rose-600/60"}`}>
            Total Potential Savings
          </p>
          <div className="flex items-center justify-center gap-2 mb-1">
            {saved >= 0 && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
            <p className={`text-5xl font-black ${saved >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              ${Math.abs(saved).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <p className={`text-xs font-bold ${saved >= 0 ? "text-emerald-600/60" : "text-rose-600/60"}`}>
            {saved >= 0 ? "Cheaper than carrier contract" : "More expensive than carrier"}
          </p>
        </div>
        
        {/* Animated background element */}
        <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.2, 0.1]
           }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className={`absolute inset-0 m-auto w-32 h-32 blur-3xl rounded-full ${saved >= 0 ? "bg-emerald-400" : "bg-rose-400"}`}
        />
      </motion.div>

      {/* Breakdown */}
      <div className="mt-10 pt-10 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-6">
           <PieChart className="w-4 h-4 text-[#0f172a]/40" />
           <span className="text-[10px] font-black text-[#0f172a]/40 uppercase tracking-widest">Cost Breakdown</span>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Carrier Details</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-400 font-bold uppercase tracking-tighter">Device</span>
                 <span className="font-black text-[#0f172a]">${carrierBreakdown.device.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-400 font-bold uppercase tracking-tighter">Plan</span>
                 <span className="font-black text-[#0f172a]">${carrierBreakdown.plan.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-400 font-bold uppercase tracking-tighter">Activation</span>
                 <span className="font-black text-[#0f172a]">${carrierBreakdown.activation.toFixed(0)}</span>
              </div>
               {carrierBreakdown.insurance > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Insurance</span>
                  <span className="font-black text-[#0f172a]">${carrierBreakdown.insurance.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] font-black text-[#04a1c6] uppercase tracking-widest">BYOP Details</p>
             <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-400 font-bold uppercase tracking-tighter">Device</span>
                 <span className="font-black text-[#0f172a]">${byopBreakdown.device.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-400 font-bold uppercase tracking-tighter">Plan</span>
                 <span className="font-black text-[#0f172a]">${byopBreakdown.plan.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
