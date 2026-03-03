"use client";
import React, { useState } from "react";
import {
  Layers, Plus, Search,
  Wifi, Signal, Phone, MessageSquare,
  Users, TrendingUp, BarChart3,
  Eye, Settings2, Power,
  Check, Info, X, Zap,
  SlidersHorizontal, Crown, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface ServicePlan {
  id: string;
  name: string;
  tier: "Premium" | "Standard" | "Budget";
  network: string;
  dataGB: string;
  speed: string;
  voiceMinutes: string;
  textMessages: string;
  hotspot: string;
  price: number;
  subscriberCount: number;
  revenue: string;
  status: "Active" | "Draft" | "Archived";
  features: string[];
}

// --- Mock Data ---
const MOCK_PLANS: ServicePlan[] = [
  {
    id: "PLN-001",
    name: "5G Unlimited Max",
    tier: "Premium",
    network: "5G Ultra Wideband",
    dataGB: "Unlimited",
    speed: "Up to 1 Gbps",
    voiceMinutes: "Unlimited",
    textMessages: "Unlimited",
    hotspot: "50 GB",
    price: 89,
    subscriberCount: 4280,
    revenue: "$380.9K",
    status: "Active",
    features: ["5G UW", "HD Streaming", "50GB Hotspot", "International Text"]
  },
  {
    id: "PLN-002",
    name: "5G Standard Plus",
    tier: "Standard",
    network: "5G Sub-6",
    dataGB: "75 GB",
    speed: "Up to 300 Mbps",
    voiceMinutes: "Unlimited",
    textMessages: "Unlimited",
    hotspot: "25 GB",
    price: 65,
    subscriberCount: 6150,
    revenue: "$399.8K",
    status: "Active",
    features: ["5G Access", "SD Streaming", "25GB Hotspot", "WiFi Calling"]
  },
  {
    id: "PLN-003",
    name: "Data-Only 50GB",
    tier: "Standard",
    network: "5G / LTE",
    dataGB: "50 GB",
    speed: "Up to 500 Mbps",
    voiceMinutes: "—",
    textMessages: "—",
    hotspot: "50 GB (All Data)",
    price: 45,
    subscriberCount: 2340,
    revenue: "$105.3K",
    status: "Active",
    features: ["Tablet/Laptop", "Full Hotspot", "No Voice", "Multi-Device"]
  },
  {
    id: "PLN-004",
    name: "Prepaid Value 20",
    tier: "Budget",
    network: "LTE Advanced",
    dataGB: "20 GB",
    speed: "Up to 200 Mbps",
    voiceMinutes: "Unlimited",
    textMessages: "Unlimited",
    hotspot: "5 GB",
    price: 30,
    subscriberCount: 8920,
    revenue: "$267.6K",
    status: "Active",
    features: ["No Contract", "LTE Only", "5GB Hotspot", "Auto-Renew"]
  },
  {
    id: "PLN-005",
    name: "IoT Connect",
    tier: "Budget",
    network: "LTE Cat-M1",
    dataGB: "5 GB",
    speed: "Up to 10 Mbps",
    voiceMinutes: "—",
    textMessages: "500",
    hotspot: "—",
    price: 12,
    subscriberCount: 1580,
    revenue: "$19.0K",
    status: "Active",
    features: ["IoT Devices", "Low Power", "M2M SMS", "API Access"]
  },
  {
    id: "PLN-006",
    name: "Family Share Unlimited",
    tier: "Premium",
    network: "5G Sub-6",
    dataGB: "Unlimited (Shared)",
    speed: "Up to 500 Mbps",
    voiceMinutes: "Unlimited",
    textMessages: "Unlimited",
    hotspot: "30 GB",
    price: 120,
    subscriberCount: 0,
    revenue: "$0",
    status: "Draft",
    features: ["Up to 5 Lines", "Parental Controls", "Shared Data", "Family Locator"]
  }
];

const tierConfig = {
  Premium: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", icon: Crown },
  Standard: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: Shield },
  Budget: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: Zap }
};

const statusConfig = {
  Active: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600" },
  Draft: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-600" },
  Archived: { dot: "bg-slate-300", bg: "bg-slate-50", text: "text-slate-500" }
};

export default function NetworkProviderPlansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [toasts, setToasts] = useState<{id: number; msg: string; type: "success" | "error" | "info"}[]>([]);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredPlans = MOCK_PLANS.filter(plan => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchLower) ||
      plan.id.toLowerCase().includes(searchLower) ||
      plan.network.toLowerCase().includes(searchLower);
    const matchesTab = activeTab === "All" || plan.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalSubscribers = MOCK_PLANS.reduce((sum, p) => sum + p.subscriberCount, 0);
  const activePlans = MOCK_PLANS.filter(p => p.status === "Active").length;
  const arpu = "$48.20";

  return (
    <div className="max-w-7xl mx-auto space-y-6 antialiased font-sans pb-20 relative">

      {/* Toast System */}
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
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Service Plans</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure data, voice, and text packages for the marketplace</p>
        </div>
        <button
          onClick={() => addToast("Plan creation wizard launched...", "info")}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Plans", value: MOCK_PLANS.length.toString(), icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Subscribers", value: totalSubscribers.toLocaleString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Avg. Revenue/User", value: arpu, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Active Plans", value: activePlans.toString(), icon: BarChart3, color: "text-amber-500", bg: "bg-amber-50" }
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
            {["All", "Active", "Draft", "Archived"].map(tab => (
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
            <div className="relative flex-1 lg:w-64 group">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search plans..."
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

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-[#dcdcdc] p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#dcdcdc]">
              <Layers className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] mb-2 uppercase tracking-wide">No Plans Found</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adjust your filters or create a new service plan</p>
          </div>
        ) : (
          filteredPlans.map((plan, idx) => {
            const tier = tierConfig[plan.tier];
            const status = statusConfig[plan.status];
            const TierIcon = tier.icon;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white border border-[#dcdcdc] rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group flex flex-col"
              >
                {/* Card Header */}
                <div className="p-5 pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${tier.bg} ${tier.text} border ${tier.border} flex items-center gap-1`}>
                        <TierIcon className="w-3 h-3" /> {plan.tier}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {plan.status}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{plan.id}</span>
                  </div>

                  <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-tight mb-1">{plan.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{plan.network} · {plan.speed}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-black text-[#0f172a]">${plan.price}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/month</span>
                  </div>
                </div>

                {/* Features */}
                <div className="px-5 pb-4 flex-1">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <Wifi className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Data: {plan.dataGB}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Voice: {plan.voiceMinutes}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <MessageSquare className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                      <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Text: {plan.textMessages}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <Signal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Hotspot: {plan.hotspot}</span>
                    </div>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-4">
                    {plan.features.map((feat, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-[#dcdcdc] rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-wider shadow-sm">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Subscribers + Revenue */}
                <div className="px-5 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Subscribers</p>
                      <p className="text-sm font-black text-[#0f172a]">{plan.subscriberCount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                      <p className="text-sm font-black text-[#0f172a]">{plan.revenue}</p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-5 pb-5 pt-2 border-t border-[#dcdcdc]/50 mt-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToast(`Opening editor for ${plan.name}...`, "info")}
                      className="flex-1 px-3 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Settings2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => addToast(`Viewing ${plan.subscriberCount.toLocaleString()} subscribers...`, "info")}
                      className="flex-1 px-3 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3 h-3" /> Subs
                    </button>
                    <button
                      onClick={() => {
                        if (plan.status === "Active") {
                          addToast(`${plan.name} archived.`, "error");
                        } else {
                          addToast(`${plan.name} activated!`, "success");
                        }
                      }}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                        plan.status === "Active"
                          ? "bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      <Power className="w-3 h-3" /> {plan.status === "Active" ? "Archive" : "Activate"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
