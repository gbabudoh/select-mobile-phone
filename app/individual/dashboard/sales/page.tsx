"use client";
import React from "react";
import { DollarSign, Download } from "lucide-react";

export default function IndividualSalesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Sales & Earnings</h1>
          <p className="text-[#0f172a]/60">Track your successful sales and pending payouts.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-[#0f172a]/70 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all cursor-pointer">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-[#0f172a]/40 uppercase tracking-widest mb-2">Total Earned</p>
          <p className="text-3xl font-black text-[#0f172a]">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-[#0f172a]/40 uppercase tracking-widest mb-2">Pending Payout</p>
          <p className="text-3xl font-black text-[#04a1c6]">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-[#0f172a]/40 uppercase tracking-widest mb-2">Active Sales</p>
          <p className="text-3xl font-black text-[#0f172a]">0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No sales data found</h3>
        <p className="text-sm text-[#0f172a]/50">
          Your sales history and earnings will appear here once you start selling.
        </p>
      </div>
    </div>
  );
}
