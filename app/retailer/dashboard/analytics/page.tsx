"use client";
import React from "react";
import { BarChart3, TrendingUp, Users, ShoppingBag } from "lucide-react";

export default function RetailerAnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Analytics Hub</h1>
        <p className="text-[#0f172a]/60">Gain insights into your store&apos;s performance and trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Conversion Rate", value: "0%", icon: TrendingUp, color: "text-emerald-600" },
          { label: "Store Visitors", value: "0", icon: Users, color: "text-[#04a1c6]" },
          { label: "Best Seller", value: "N/A", icon: ShoppingBag, color: "text-indigo-600" },
          { label: "Return Rate", value: "0%", icon: BarChart3, color: "text-rose-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`p-2 w-fit rounded-lg bg-gray-50 mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-[#0f172a]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Insufficient data</h3>
        <p className="text-sm text-[#0f172a]/50">
          Continue selling and growing your store to unlock advanced analytics and insights.
        </p>
      </div>
    </div>
  );
}
