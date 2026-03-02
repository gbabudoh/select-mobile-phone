"use client";
import React from "react";
import { Smartphone, Plus, Search, Filter } from "lucide-react";

export default function IndividualListingsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">My Devices</h1>
          <p className="text-[#0f172a]/60">Manage your personal device listings and trade-ins.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> List New Device
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search your listings..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-[#0f172a]/70 hover:bg-gray-50 cursor-pointer">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No active listings</h3>
        <p className="text-sm text-[#0f172a]/50 mb-6">
          List your phone or accessory to reach thousands of buyers instantly.
        </p>
        <button className="px-6 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 cursor-pointer">
          Start Selling
        </button>
      </div>
    </div>
  );
}
