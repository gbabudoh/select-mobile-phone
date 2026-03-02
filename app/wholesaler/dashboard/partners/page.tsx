"use client";
import React from "react";
import { Users, UserPlus, Search } from "lucide-react";

export default function WholesalerPartnersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Partner Network</h1>
          <p className="text-[#0f172a]/60">Manage your retailer relationships and distribution chains.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 transition-all cursor-pointer">
          <UserPlus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search partner by name or store ID..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No partners connected</h3>
        <p className="text-sm text-[#0f172a]/50">
          Invite retailers to join your distribution network to start processing orders.
        </p>
      </div>
    </div>
  );
}
