"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Product } from "../../lib/products";

interface Props {
  phones: Product[];
  selected: Product;
  onSelect: (phone: Product) => void;
}

export function TCOPhoneSelector({ phones, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium uppercase tracking-wider text-foreground/50">
        Select Device
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {phones.map((phone) => {
          const isActive = selected.id === phone.id;
          return (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={phone.id}
              onClick={() => onSelect(phone)}
              aria-pressed={isActive}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-[#04a1c6] text-white shadow-[0_0_20px_rgba(4,161,198,0.5)] border border-[#04a1c6]/50"
                  : "bg-white/5 hover:bg-white/10 border border-white/5"
              }`}
            >
              <span className="block text-sm font-semibold">{phone.name}</span>
              <span className={`block text-xs mt-1 ${isActive ? "text-white/80" : "text-foreground/50"}`}>
                {phone.condition} · ${phone.price}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
