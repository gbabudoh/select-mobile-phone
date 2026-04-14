"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Globe, Zap, CheckCircle2 } from "lucide-react";
import type { Product } from "../../lib/products";

interface Props {
  plans: Product[];
  selected: Product | null;
  onSelect: (plan: Product) => void;
  carrierPrice: number;
  onCarrierPriceChange: (price: number) => void;
}

export function TCOPlanSelector({
  plans,
  selected,
  onSelect,
  carrierPrice,
  onCarrierPriceChange,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Carrier slider */}
      <div className="p-8 rounded-[2.5rem] bg-[#0f172a] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#04a1c6]/20 blur-[80px] group-hover:bg-[#04a1c6]/30 transition-all" />
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#04a1c6]" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Carrier Plan / Month
                </label>
              </div>
              <p className="text-xs text-white/60 font-medium">Standard unlimited data plan cost</p>
            </div>
            <span className="text-4xl font-black text-[#04a1c6]">${carrierPrice}</span>
          </div>
          <div className="space-y-2">
            <div className="relative h-6 flex items-center">
              <input
                id="carrier-plan-slider"
                type="range"
                min="50"
                max="150"
                step="5"
                value={carrierPrice}
                onChange={(e) => onCarrierPriceChange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#04a1c6]"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] font-bold text-white/30">$50</span>
              <span className="text-[10px] font-bold text-white/30">$150</span>
            </div>
          </div>
        </div>
      </div>

      {/* BYOP eSIM plan picker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#04a1c6]/10 flex items-center justify-center text-[#04a1c6]">
              <Globe className="w-4 h-4" />
            </div>
            <label className="text-sm font-black uppercase tracking-[0.2em] text-[#0f172a]/40">
              Select BYOP eSIM Plan
            </label>
          </div>
          <span className="text-[10px] font-black text-[#04a1c6] uppercase tracking-widest bg-[#04a1c6]/5 px-3 py-1 rounded-full">Save Big</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const isActive = selected?.id === plan.id;
            return (
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                key={plan.id}
                onClick={() => onSelect(plan)}
                aria-pressed={isActive}
                className={`group relative p-6 rounded-[2rem] text-left transition-all cursor-pointer border ${
                  isActive
                    ? "bg-white border-[#04a1c6] shadow-[0_20px_40px_-15px_rgba(4,161,198,0.2)]"
                    : "bg-white/50 border-white hover:bg-white hover:border-gray-100 shadow-sm"
                }`}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                     <div className={`p-3 rounded-2xl ${isActive ? "bg-[#04a1c6]/10 text-[#04a1c6]" : "bg-gray-100 text-gray-400"}`}>
                        <Zap className="w-5 h-5" />
                     </div>
                     {isActive && <CheckCircle2 className="w-5 h-5 text-[#04a1c6]" />}
                  </div>
                  <span className={`block font-black text-sm mb-1 transition-colors ${isActive ? "text-[#0f172a]" : "text-[#0f172a]/80"}`}>
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-[#0f172a]">${plan.price}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/mo</span>
                  </div>
                  {plan.planDetails && (
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                        <span className="text-[#04a1c6]">{plan.planDetails.data}</span> Data · {plan.planDetails.talk} Talk
                     </p>
                  )}
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="plan-active"
                    className="absolute inset-0 bg-gradient-to-br from-[#04a1c6]/5 to-transparent pointer-events-none rounded-[2rem]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
