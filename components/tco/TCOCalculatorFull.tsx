"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TCOPhoneSelector } from "./TCOPhoneSelector";
import { TCOPlanSelector } from "./TCOPlanSelector";
import { TCOResults } from "./TCOResults";
import { calculateTCO, getHandsets, getEsimPlans } from "../../lib/tco";
import { Calculator, Clock, BarChart3, ChevronDown } from "lucide-react";

const MONTH_OPTIONS = [12, 24, 36];

export function TCOCalculatorFull() {
  const handsets = useMemo(() => getHandsets(), []);
  const plans = useMemo(() => getEsimPlans(), []);

  const [selectedPhone, setSelectedPhone] = useState(handsets[0]);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [carrierPrice, setCarrierPrice] = useState(85);
  const [months, setMonths] = useState(24);
  const [activationFee, setActivationFee] = useState(35);
  const [insurance, setInsurance] = useState(15);

  const result = useMemo(
    () =>
      calculateTCO({
        devicePrice: selectedPhone.price,
        carrierPlanMonthly: carrierPrice,
        byopPlanMonthly: selectedPlan.price,
        months,
        carrierActivationFee: activationFee,
        insuranceMonthly: insurance,
      }),
    [selectedPhone, selectedPlan, carrierPrice, months, activationFee, insurance]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Inputs */}
        <div className="flex-1 space-y-12">
          <div className="space-y-4">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04a1c6]/10 border border-[#04a1c6]/20 text-[#04a1c6] text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Calculator className="w-3 h-3" /> Cost Optimizer
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-[0.9]">
              Total Cost of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#04a1c6] to-indigo-600">Ownership</span>
            </h1>
            <p className="text-[#0f172a]/40 text-lg font-medium max-w-xl">
              Uncover the hidden costs of carrier contracts. Compare the real long-term cost of Unlocked + BYOP versus standard retail financing.
            </p>
          </div>

          <div className="space-y-10">
            {/* Term selector as a premium segmented control */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[#04a1c6]/10 flex items-center justify-center text-[#04a1c6]">
                    <Clock className="w-4 h-4" />
                 </div>
                 <label className="text-sm font-black uppercase tracking-[0.2em] text-[#0f172a]/40">
                    Comparison Horizon
                 </label>
              </div>
              <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-fit border border-gray-100 shadow-sm">
                {MONTH_OPTIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`px-8 py-3 rounded-xl text-xs font-black transition-all cursor-pointer tracking-widest uppercase ${
                      months === m
                        ? "bg-white text-[#04a1c6] shadow-lg shadow-[#04a1c6]/10"
                        : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            <TCOPhoneSelector
              phones={handsets}
              selected={selectedPhone}
              onSelect={setSelectedPhone}
            />

            <TCOPlanSelector
              plans={plans}
              selected={selectedPlan}
              onSelect={setSelectedPlan}
              carrierPrice={carrierPrice}
              onCarrierPriceChange={setCarrierPrice}
            />

            {/* Advanced Options redesign */}
            <div className="p-8 rounded-[2.5rem] bg-indigo-50/10 border border-indigo-100/50">
               <details className="group">
                  <summary className="flex items-center justify-between text-sm font-black uppercase tracking-[0.2em] text-[#0f172a]/60 cursor-pointer select-none">
                    <div className="flex items-center gap-3">
                       <BarChart3 className="w-4 h-4 text-indigo-500" />
                       Advanced Parameters
                    </div>
                    <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                  </summary>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-indigo-100/30">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Carrier Activation</label>
                        <span className="text-sm font-black text-[#0f172a]">${activationFee}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={activationFee}
                        onChange={(e) => setActivationFee(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#04a1c6]"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Device Insurance / Mo</label>
                        <span className="text-sm font-black text-[#0f172a]">${insurance}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="1"
                        value={insurance}
                        onChange={(e) => setInsurance(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#04a1c6]"
                      />
                    </div>
                  </div>
               </details>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:w-[400px] xl:w-[450px]">
          <TCOResults result={result} months={months} />
        </div>
      </div>
    </motion.div>
  );
}
