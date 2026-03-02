"use client";
import React from "react";
import { motion } from "framer-motion";
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
    <div className="space-y-6">
      {/* Carrier slider */}
      <div>
        <div className="flex justify-between mb-2">
          <label
            htmlFor="carrier-plan-slider"
            className="text-sm font-medium uppercase tracking-wider text-foreground/50"
          >
            Avg. Carrier Plan / Mo
          </label>
          <span className="font-bold">${carrierPrice}</span>
        </div>
        <input
          id="carrier-plan-slider"
          type="range"
          min="50"
          max="150"
          step="5"
          value={carrierPrice}
          onChange={(e) => onCarrierPriceChange(Number(e.target.value))}
          aria-label={`Carrier plan monthly price: $${carrierPrice}`}
          className="w-full h-2 bg-[gainsboro] rounded-full appearance-none cursor-pointer accent-[#504b4b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
        />
      </div>

      {/* BYOP eSIM plan picker */}
      <div className="space-y-3">
        <label className="text-sm font-medium uppercase tracking-wider text-foreground/50">
          BYOP eSIM Plan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((plan) => {
            const isActive = selected?.id === plan.id;
            return (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={plan.id}
                onClick={() => onSelect(plan)}
                aria-pressed={isActive}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#04a1c6] text-white shadow-[0_0_20px_rgba(4,161,198,0.5)] border border-[#04a1c6]/50"
                    : "bg-white/5 hover:bg-white/10 border border-white/5"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {plan.name}
                </span>
                <span
                  className={`block text-xs mt-1 ${
                    isActive ? "text-white/80" : "text-foreground/50"
                  }`}
                >
                  ${plan.price}/mo
                  {plan.planDetails && ` · ${plan.planDetails.data} data`}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
