"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Smartphone, CheckCircle2 } from "lucide-react";
import type { Product } from "../../lib/products";

interface Props {
  phones: Product[];
  selected: Product;
  onSelect: (phone: Product) => void;
}

export function TCOPhoneSelector({ phones, selected, onSelect }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#04a1c6]/10 flex items-center justify-center text-[#04a1c6]">
          <Smartphone className="w-4 h-4" />
        </div>
        <label className="text-sm font-black uppercase tracking-[0.2em] text-[#0f172a]/40">
          Select Device
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {phones.map((phone) => {
          const isActive = selected.id === phone.id;
          return (
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              key={phone.id}
              onClick={() => onSelect(phone)}
              aria-pressed={isActive}
              className={`group relative p-4 rounded-[2rem] text-left transition-all cursor-pointer overflow-hidden border ${
                isActive
                  ? "bg-white border-[#04a1c6] shadow-[0_20px_40px_-15px_rgba(4,161,198,0.2)]"
                  : "bg-white/50 border-white hover:bg-white hover:border-gray-100 shadow-sm"
              }`}
            >
              <div className="flex gap-4 items-center relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden relative shrink-0 border border-gray-100">
                  <Image 
                    src={phone.image} 
                    alt={phone.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block text-sm font-black line-clamp-1 transition-colors ${isActive ? "text-[#0f172a]" : "text-[#0f172a]/80"}`}>
                    {phone.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-[#04a1c6]" : "text-gray-400"}`}>
                      ${phone.price}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {phone.condition}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-0 right-0">
                    <CheckCircle2 className="w-5 h-5 text-[#04a1c6]" />
                  </div>
                )}
              </div>
              
              {isActive && (
                <motion.div 
                  layoutId="phone-active"
                  className="absolute inset-0 bg-gradient-to-br from-[#04a1c6]/5 to-transparent pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
