"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const PHONES = [
  { id: "iphone18", name: "iPhone 18 Pro", price: 1199 },
  { id: "s26", name: "Galaxy S26 Ultra", price: 1299 },
  { id: "pixel10", name: "Pixel 10 Pro", price: 999 },
];

export function TCOCalculator() {
  const [selectedPhone, setSelectedPhone] = useState(PHONES[0]);
  const [carrierPlanPrice, setCarrierPlanPrice] = useState(85); // Monthly
  const [byopPlanPrice, setByopPlanPrice] = useState(35); // Monthly MVNO

  const contractTotal = (carrierPlanPrice * 24) + (selectedPhone.price * 0.2); // Simple math: 24mo plan + 20% down
  const byopTotal = (byopPlanPrice * 24) + selectedPhone.price; 
  
  const saved = contractTotal - byopTotal;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full glass-panel rounded-[2.5rem] p-8 md:p-14 mb-24 mt-12 border-t border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left Side: Inputs */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Total Cost of Ownership</h2>
            <p className="text-foreground/70">
              See the brilliant reality. Buying outright with an MVNO eSIM often crushes the 24-month carrier contract trap.
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium uppercase tracking-wider text-foreground/50">Select Device</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PHONES.map(phone => (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={phone.id}
                  onClick={() => setSelectedPhone(phone)}
                  className={`p-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    selectedPhone.id === phone.id 
                      ? "bg-[#04a1c6] text-white shadow-[0_0_20px_rgba(4,161,198,0.5)] border border-[#04a1c6]/50" 
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {phone.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium uppercase tracking-wider text-foreground/50">Average Carrier Plan / Mo</label>
                <span className="font-bold">${carrierPlanPrice}</span>
              </div>
              <input 
                type="range" 
                min="50" max="150" step="5"
                value={carrierPlanPrice}
                onChange={(e) => setCarrierPlanPrice(Number(e.target.value))}
                className="w-full h-2 bg-[gainsboro] rounded-full appearance-none cursor-pointer accent-[#504b4b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium uppercase tracking-wider text-black/60">SelectMobile BYOP eSIM / Mo</label>
                <span className="font-bold">${byopPlanPrice}</span>
              </div>
              <input 
                type="range" 
                min="15" max="60" step="5"
                value={byopPlanPrice}
                onChange={(e) => setByopPlanPrice(Number(e.target.value))}
                className="w-full h-2 bg-[gainsboro] rounded-full appearance-none cursor-pointer accent-[#04a1c6] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="flex-1 bg-[#1a1c23] rounded-3xl p-10 border border-white/5 flex flex-col justify-center relative overflow-hidden text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
          {/* Subtle glow orb inside the results panel */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#04a1c6]/10 rounded-full blur-[100px] pointer-events-none" />
          <h3 className="text-xl font-semibold text-center mb-10 tracking-wide text-white/90">24-Month Projection</h3>
          
          <div className="space-y-6">
            <div className="relative">
              <div className="flex justify-between items-center text-base mb-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-white/80 font-medium tracking-wide">Carrier Contract</span>
                <span className="font-semibold text-rose-300 text-lg">${contractTotal.toFixed(0)}</span>
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

            <div className="relative">
              <div className="flex justify-between items-center text-base mb-3 mt-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-white/80 font-medium tracking-wide">Unlocked + SelectMobile eSIM</span>
                <span className="font-semibold text-emerald-300 text-lg">${byopTotal.toFixed(0)}</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#04a1c6]/80"
                  initial={{ width: 0 }}
                  animate={{ width: `${(byopTotal / contractTotal) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <div className={`mt-10 text-center p-6 rounded-2xl border relative overflow-hidden transition-colors duration-500 ${
            saved >= 0 
              ? "bg-emerald-500/10 border-emerald-500/20" 
              : "bg-rose-500/10 border-rose-500/20"
          }`}>
            <p className={`font-bold text-3xl mb-1 relative z-10 transition-colors duration-500 ${
              saved >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}>
              {saved >= 0 ? `Save $${saved.toFixed(0)}` : `Costs $${Math.abs(saved).toFixed(0)} More`}
            </p>
            <p className={`text-sm font-medium tracking-wide relative z-10 transition-colors duration-500 ${
              saved >= 0 ? "text-emerald-400/70" : "text-rose-400/70"
            }`}>
              Over 24 Months vs Carrier
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
