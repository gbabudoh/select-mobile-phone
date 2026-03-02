"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TCOPhoneSelector } from "./TCOPhoneSelector";
import { TCOPlanSelector } from "./TCOPlanSelector";
import { TCOResults } from "./TCOResults";
import { calculateTCO, getHandsets, getEsimPlans } from "../../lib/tco";

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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Inputs */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">Total Cost of Ownership</h1>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Compare the real cost of a carrier contract vs. buying unlocked with a
              BYOP eSIM plan. Pick your device, choose a plan, and see the numbers.
            </p>
          </div>

          {/* Term selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium uppercase tracking-wider text-foreground/50">
              Comparison Period
            </label>
            <div className="flex gap-2">
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    months === m
                      ? "bg-[#04a1c6] text-white shadow-[0_0_16px_rgba(4,161,198,0.4)]"
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {m} mo
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

          {/* Advanced: activation & insurance */}
          <details className="group">
            <summary className="text-sm font-medium uppercase tracking-wider text-foreground/50 cursor-pointer select-none">
              Advanced Options ▸
            </summary>
            <div className="mt-4 space-y-4 pl-1">
              <div>
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="activation-fee"
                    className="text-sm text-foreground/60"
                  >
                    Carrier Activation Fee
                  </label>
                  <span className="font-bold text-sm">${activationFee}</span>
                </div>
                <input
                  id="activation-fee"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={activationFee}
                  onChange={(e) => setActivationFee(Number(e.target.value))}
                  aria-label={`Activation fee: $${activationFee}`}
                  className="w-full h-2 bg-[gainsboro] rounded-full appearance-none cursor-pointer accent-[#504b4b]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="insurance-slider"
                    className="text-sm text-foreground/60"
                  >
                    Device Insurance / Mo
                  </label>
                  <span className="font-bold text-sm">${insurance}</span>
                </div>
                <input
                  id="insurance-slider"
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value))}
                  aria-label={`Insurance monthly: $${insurance}`}
                  className="w-full h-2 bg-[gainsboro] rounded-full appearance-none cursor-pointer accent-[#504b4b]"
                />
              </div>
            </div>
          </details>
        </div>

        {/* Right: Results */}
        <div className="flex-1">
          <TCOResults result={result} months={months} />
        </div>
      </div>
    </motion.div>
  );
}
