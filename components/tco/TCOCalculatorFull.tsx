"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TCOPhoneSelector } from "./TCOPhoneSelector";
import { TCOPlanSelector } from "./TCOPlanSelector";
import { TCOResults } from "./TCOResults";
import { calculateTCO, getHandsets, getEsimPlans } from "../../lib/tco";
import { Calculator, Clock, BarChart3, ChevronDown, ShieldCheck, Zap, ArrowRight, DollarSign } from "lucide-react";

const MONTH_OPTIONS = [
  { value: 12, label: "12 mo", sub: "1 Year" },
  { value: 24, label: "24 mo", sub: "2 Years" },
  { value: 36, label: "36 mo", sub: "3 Years" },
];

export function TCOCalculatorFull() {
  const handsets = useMemo(() => getHandsets(), []);
  const plans = useMemo(() => getEsimPlans(), []);

  const [selectedPhone, setSelectedPhone] = useState(handsets[0]);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [carrierPrice, setCarrierPrice] = useState(85);
  const [months, setMonths] = useState(24);
  const [activationFee, setActivationFee] = useState(35);
  const [insurance, setInsurance] = useState(15);
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-12"
    >
      {/* ── Hero Header ── */}
      <div className="relative rounded-[3rem] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#04a1c6]/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#04a1c6]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-[#04a1c6]">
            <Calculator className="w-4 h-4 text-[#04a1c6]" />
            <span>Total Cost of Ownership (TCO) Optimizer</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Uncover Hidden Carrier Contract Costs
          </h1>

          <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
            Compare the true 1 to 3-year cost of traditional carrier financing against buying Unlocked with instant BYOP eSIM plans.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {[
              { icon: <DollarSign className="w-4 h-4 text-emerald-400" />, text: "Save Up to $720+ Over 2 Years" },
              { icon: <ShieldCheck className="w-4 h-4 text-[#04a1c6]" />, text: "Escrow-Protected Guarantee" },
              { icon: <Zap className="w-4 h-4 text-amber-400" />, text: "Instant eSIM Activation" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Layout: Inputs Left / Results Right ── */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Inputs Column */}
        <div className="flex-1 space-y-10 w-full">
          
          {/* Comparison Horizon Bar */}
          <div className="p-6 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#04a1c6]/10 flex items-center justify-center text-[#04a1c6]">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Comparison Timeline</span>
              </div>
              <span className="text-xs font-black text-[#04a1c6] px-3 py-1 rounded-full bg-[#04a1c6]/10">
                {months}-Month Total Projection
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100/70 rounded-2xl border border-slate-200/60">
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMonths(m.value)}
                  className={`py-3 px-4 rounded-xl text-center transition-all cursor-pointer ${
                    months === m.value
                      ? "bg-white text-[#0f172a] shadow-lg shadow-[#04a1c6]/10 font-black scale-[1.02]"
                      : "text-slate-500 hover:text-slate-900 font-bold"
                  }`}
                >
                  <div className="text-xs font-black uppercase tracking-widest">{m.label}</div>
                  <div className="text-[9px] font-bold text-slate-400">{m.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Device Selector */}
          <div className="p-6 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-sm">
            <TCOPhoneSelector
              phones={handsets}
              selected={selectedPhone}
              onSelect={setSelectedPhone}
            />
          </div>

          {/* Carrier vs BYOP Plan Selector */}
          <div className="p-6 rounded-[2.5rem] bg-white border border-slate-200/80 shadow-sm">
            <TCOPlanSelector
              plans={plans}
              selected={selectedPlan}
              onSelect={setSelectedPlan}
              carrierPrice={carrierPrice}
              onCarrierPriceChange={setCarrierPrice}
            />
          </div>

          {/* Advanced Parameters Accordion */}
          <div className="rounded-[2.5rem] bg-slate-900 text-white border border-slate-800 overflow-hidden shadow-xl">
            <button
              onClick={() => setAdvancedOpen((v) => !v)}
              className="w-full flex items-center justify-between p-6 text-xs font-black uppercase tracking-widest text-slate-300 cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-[#04a1c6]" />
                <span>Adjust Hidden Fees (Activation &amp; Insurance)</span>
              </div>
              <motion.div animate={{ rotate: advancedOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {advancedOpen && (
                <motion.div
                  key="advanced"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-6 pt-2 border-t border-slate-800">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier Activation Fee</label>
                        <span className="text-sm font-black text-[#04a1c6]">${activationFee}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={activationFee}
                        onChange={(e) => setActivationFee(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#04a1c6]"
                      />
                      <div className="flex justify-between text-[9px] font-bold text-slate-500">
                        <span>$0 (Waived)</span>
                        <span>$100 (Max)</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Device Insurance</label>
                        <span className="text-sm font-black text-[#04a1c6]">${insurance}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="1"
                        value={insurance}
                        onChange={(e) => setInsurance(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#04a1c6]"
                      />
                      <div className="flex justify-between text-[9px] font-bold text-slate-500">
                        <span>$0 (None)</span>
                        <span>$30/mo (AppleCare/Care+)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Results Column (Sticky Panel) */}
        <div className="lg:w-[420px] xl:w-[460px] w-full shrink-0">
          <TCOResults result={result} months={months} />
        </div>
      </div>
    </motion.div>
  );
}
