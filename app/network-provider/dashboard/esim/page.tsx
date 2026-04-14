"use client";
import React, { useState } from "react";
import {
  Cpu, Plus, Search,
  Smartphone, Signal, Wifi, Globe,
  TrendingUp, Activity, Clock, Zap,
  Eye, Power, Trash2,
  Check, Info, X,
  SlidersHorizontal, Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface ESIMProfile {
  id: string;
  iccid: string;
  imei: string;
  phoneNumber: string;
  subscriberName: string;
  deviceModel: string;
  planType: string;
  planSpeed: string;
  status: "Active" | "Suspended" | "Pending" | "Expired";
  dataUsedGB: number;
  dataTotalGB: number;
  activationDate: string;
  expiryDate: string;
  carrier: string;
  network: string;
}

// --- Mock Data ---
const MOCK_ESIMS: ESIMProfile[] = [];

const statusConfig = {
  Active: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  Suspended: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
  Pending: { dot: "bg-blue-400", bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  Expired: { dot: "bg-slate-300", bg: "bg-slate-50", text: "text-slate-500", ring: "ring-slate-100" }
};

export default function NetworkProviderESIMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [toasts, setToasts] = useState<{id: number; msg: string; type: "success" | "error" | "info"}[]>([]);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredESIMs = MOCK_ESIMS.filter(esim => {
    const matchesSearch =
      esim.iccid.toLowerCase().includes(searchLower) ||
      esim.phoneNumber.toLowerCase().includes(searchLower) ||
      esim.subscriberName.toLowerCase().includes(searchLower) ||
      esim.deviceModel.toLowerCase().includes(searchLower) ||
      esim.id.toLowerCase().includes(searchLower);
    const matchesTab = activeTab === "All" || esim.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const activeCount = MOCK_ESIMS.filter(e => e.status === "Active").length;
  const pendingCount = MOCK_ESIMS.filter(e => e.status === "Pending").length;
  const totalDataUsed = MOCK_ESIMS.reduce((sum, e) => sum + e.dataUsedGB, 0).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto space-y-6 antialiased font-sans pb-20 relative">

      {/* Toast Notification System */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`px-6 py-4 rounded-2xl shadow-xl backdrop-blur-3xl border flex items-center gap-4 min-w-[300px] pointer-events-auto ${
                toast.type === "error" ? "bg-white/90 border-rose-100 text-rose-700" :
                toast.type === "info" ? "bg-white/90 border-blue-100 text-blue-700" :
                "bg-white/90 border-emerald-100 text-emerald-700"
              }`}
            >
              <div className={`p-1.5 rounded-full ${
                toast.type === "error" ? "bg-rose-100" : toast.type === "info" ? "bg-blue-100" : "bg-emerald-100"
              }`}>
                {toast.type === "error" ? <X className="w-3 h-3" /> : toast.type === "info" ? <Info className="w-3 h-3" /> : <Check className="w-3 h-3" />}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest">{toast.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">eSIM Management</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monitor activations, manage profiles, and provision MVNO services</p>
        </div>
        <button
          onClick={() => addToast("eSIM provisioning wizard initiated...", "info")}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Provision New
        </button>
      </div>

      {/* KPI Analytics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Profiles", value: MOCK_ESIMS.length.toString(), icon: Cpu, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active eSIMs", value: activeCount.toString(), icon: Signal, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Data Consumed", value: `${totalDataUsed} GB`, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Pending Activation", value: pendingCount.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" }
        ].map((stat, idx) => (
          <div key={idx} className="p-4 bg-white border border-[#dcdcdc]/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <stat.icon className={`w-12 h-12 ${stat.color}`} />
            </div>
            <div className={`inline-flex p-2 ${stat.bg} rounded-xl mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-black text-[#0f172a]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl p-2.5 shadow-sm sticky top-6 z-30">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1.5 lg:pb-0 scrollbar-hide">
            {["All", "Active", "Suspended", "Pending", "Expired"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20" : "text-slate-400 hover:text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72 group">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search ICCID, phone, subscriber..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button className="p-2.5 bg-white border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] hover:border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* eSIM Profile Cards */}
      <div className="space-y-4">
        {filteredESIMs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#dcdcdc] p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#dcdcdc]">
              <Cpu className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] mb-2 uppercase tracking-wide">No eSIM Profiles Found</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adjust your filters or provision new eSIM profiles</p>
          </div>
        ) : (
          filteredESIMs.map((esim, idx) => {
            const status = statusConfig[esim.status];
            const usagePercent = esim.dataTotalGB > 0 ? Math.round((esim.dataUsedGB / esim.dataTotalGB) * 100) : 0;
            const usageColor = usagePercent > 80 ? "bg-rose-500" : usagePercent > 50 ? "bg-amber-500" : "bg-emerald-500";

            return (
              <motion.div
                key={esim.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white border border-[#dcdcdc] rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
              >
                <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center">

                  {/* Profile Identity */}
                  <div className="flex items-center gap-4 w-full xl:w-72 shrink-0">
                    <div className={`p-3.5 rounded-2xl ${status.bg} ${status.text} ring-4 ${status.ring} shrink-0`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wide">{esim.subscriberName}</h3>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{esim.deviceModel}</p>
                      <p className="text-[9px] font-mono text-slate-300 tracking-wider mt-0.5">{esim.iccid}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Plan */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3 h-3 text-blue-500" />
                        <span className="text-[11px] font-black text-[#0f172a]">{esim.planType}</span>
                      </div>
                    </div>
                    {/* Network */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Network</p>
                      <div className="flex items-center gap-1.5">
                        <Signal className="w-3 h-3 text-violet-500" />
                        <span className="text-[11px] font-black text-[#0f172a]">{esim.network}</span>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-teal-500" />
                        <span className="text-[11px] font-black text-[#0f172a]">{esim.phoneNumber}</span>
                      </div>
                    </div>
                    {/* Data Usage */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Usage</p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-emerald-500 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-[#0f172a]">{esim.dataUsedGB} GB</span>
                            <span className="text-[8px] font-bold text-slate-300">/ {esim.dataTotalGB} GB</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${usageColor} rounded-full transition-all duration-500`} style={{ width: `${usagePercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-col items-end gap-3 w-full xl:w-auto shrink-0">
                    {/* Status + Dates */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {esim.status}
                      </span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{esim.planSpeed}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToast(`Viewing details for ${esim.subscriberName}...`, "info")}
                        className="px-3.5 py-2 bg-slate-50 border border-[#dcdcdc] rounded-xl text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" /> Details
                      </button>
                      {esim.status === "Active" ? (
                        <button
                          onClick={() => addToast(`Suspending eSIM for ${esim.subscriberName}...`, "error" as const)}
                          className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[10px] font-black text-amber-600 uppercase tracking-widest hover:bg-amber-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <Power className="w-3 h-3" /> Suspend
                        </button>
                      ) : esim.status === "Pending" ? (
                        <button
                          onClick={() => addToast(`Activating eSIM for ${esim.subscriberName}!`, "success")}
                          className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <Zap className="w-3 h-3" /> Activate
                        </button>
                      ) : esim.status === "Suspended" ? (
                        <button
                          onClick={() => addToast(`Reactivating eSIM for ${esim.subscriberName}!`, "success")}
                          className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <Power className="w-3 h-3" /> Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => addToast(`Removing expired profile ${esim.id}...`, "error" as const)}
                          className="px-3.5 py-2 bg-rose-50 border border-rose-200 rounded-xl text-[10px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-3 pt-3 border-t border-[#dcdcdc]/50 flex items-center justify-between">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    Activated {esim.activationDate} · Expires {esim.expiryDate} · ID: {esim.id}
                  </p>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{esim.carrier}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Network Summary Footer */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Signal className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Coverage</p>
              <p className="text-sm font-black text-[#0f172a]">5G Ultra Wideband · 5G Sub-6 · LTE Advanced · LTE Cat-M1</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => addToast("Downloading eSIM audit report...", "info")}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl border border-[#dcdcdc] text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
