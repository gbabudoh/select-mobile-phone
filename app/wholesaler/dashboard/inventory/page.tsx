"use client";
import React from "react";
import { Building2, Plus, Search, Filter } from "lucide-react";

export default function WholesalerInventoryPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Bulk Inventory</h1>
          <p className="text-[#0f172a]/60">Manage high-volume stock for B2B distribution.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Import Batch
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by lot, brand, or SKU..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-[#0f172a]/70 hover:bg-gray-50 cursor-pointer">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Warehouse is empty</h3>
        <p className="text-sm text-[#0f172a]/50 mb-6">
          Upload your inventory sheets to start distributing to our network of retailers.
        </p>
        <button className="px-6 py-3 border border-gray-200 text-[#0f172a] rounded-xl font-medium text-sm hover:bg-gray-50 cursor-pointer">
          Download Template
        </button>
      </div>
    </div>
  );
}
