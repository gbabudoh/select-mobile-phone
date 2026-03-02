"use client";
import React from "react";
import { ShoppingCart, Search, Filter } from "lucide-react";

export default function RetailerOrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Store Orders</h1>
          <p className="text-[#0f172a]/60">Monitor and process incoming customer orders.</p>
        </div>
      </div>

      {/* Basic Filters placeholder */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID or customer..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-[#0f172a]/70 hover:bg-gray-50 cursor-pointer">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No orders yet</h3>
        <p className="text-sm text-[#0f172a]/50">
          When customers purchase from your store, their orders will appear here.
        </p>
      </div>
    </div>
  );
}
