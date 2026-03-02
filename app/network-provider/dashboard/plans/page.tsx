"use client";
import React from "react";
import { Layers, Plus } from "lucide-react";

export default function NetworkProviderPlansPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Service Plans</h1>
          <p className="text-[#0f172a]/60">Configure data, voice, and text packages for the marketplace.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No active plans</h3>
        <p className="text-sm text-[#0f172a]/50 mb-6">
          Create competitive service plans to attract buyers on the Select Mobile platform.
        </p>
        <button className="px-6 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 cursor-pointer">
          Add First Plan
        </button>
      </div>
    </div>
  );
}
