"use client";
import React from "react";
import { Clock, Zap } from "lucide-react";

export default function PreordersPage() {
  const preorders = [
    {
      id: "PO-001",
      product: "iPhone 18 Pro Max 512GB — Titanium Blue",
      campaign: "iPhone 18 Pro Launch Day",
      queuePosition: 12,
      totalSlots: 500,
      deposit: "$199",
      status: "DEPOSIT_PAID",
      estimatedShip: "Sep 2026",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Preorders</h1>
      <p className="text-[#0f172a]/60 mb-8">
        Track your queue position and lock in trade-in values for upcoming launches.
      </p>

      <div className="space-y-4">
        {preorders.map((po) => (
          <div key={po.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#0f172a] text-lg">{po.product}</h3>
                <p className="text-sm text-[#0f172a]/50">{po.campaign}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {po.status.replace("_", " ")}
              </span>
            </div>

            {/* Queue progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#0f172a]/60 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Queue Position
                </span>
                <span className="font-semibold text-[#04a1c6]">#{po.queuePosition} of {po.totalSlots}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#04a1c6] rounded-full"
                  style={{ width: `${(po.queuePosition / po.totalSlots) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-6">
                <span className="text-[#0f172a]/50">Deposit: <span className="font-medium text-[#0f172a]">{po.deposit}</span></span>
                <span className="text-[#0f172a]/50">Est. Ship: <span className="font-medium text-[#0f172a]">{po.estimatedShip}</span></span>
              </div>
              <button className="flex items-center gap-1 text-[#04a1c6] font-medium hover:underline cursor-pointer">
                <Zap className="w-4 h-4" /> Lock Trade-In
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
