"use client";
import React from "react";
import { Coins, Download, TrendingUp } from "lucide-react";

export default function NetworkProviderRevenuePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Bounty Revenue</h1>
          <p className="text-[#0f172a]/60">Track referral bonuses and per-activation commissions.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-[#0f172a]/70 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer">
          <Download className="w-4 h-4" /> Statements
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Commissions</p>
          </div>
          <p className="text-3xl font-black text-[#0f172a]">$0.00</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <Coins className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No earnings yet</h3>
        <p className="text-sm text-[#0f172a]/50">
          Your revenue from plan activations and referrals will be calculated and shown here.
        </p>
      </div>
    </div>
  );
}
