"use client";
import React, { useState } from "react";
import {
  Layers, Plus, Search,
  Wifi, Signal, Phone, MessageSquare,
  Users, TrendingUp, BarChart3,
  Eye, Settings2, Power,
  Check, Info, X, Zap,
  SlidersHorizontal, Crown, Shield, Trash2, CheckCircle2
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

// --- Pre-seeded Initial Data ---
const INITIAL_PLANS: ServicePlan[] = [];

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
  const [plans, setPlans] = useState<ServicePlan[]>(INITIAL_PLANS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [toasts, setToasts] = useState<{id: number; msg: string; type: "success" | "error" | "info"}[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ServicePlan | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [tier, setTier] = useState<"Premium" | "Standard" | "Budget">("Standard");
  const [network, setNetwork] = useState("5G Sub-6");
  const [dataGB, setDataGB] = useState("50 GB");
  const [speed, setSpeed] = useState("Up to 500 Mbps");
  const [voiceMinutes, setVoiceMinutes] = useState("Unlimited");
  const [textMessages, setTextMessages] = useState("Unlimited");
  const [hotspot, setHotspot] = useState("25 GB");
  const [price, setPrice] = useState("");
  const [featuresText, setFeaturesText] = useState("5G Access, HD Streaming, WiFi Calling");
  const [creating, setCreating] = useState(false);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredPlans = plans.filter(plan => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchLower) ||
      plan.id.toLowerCase().includes(searchLower) ||
      plan.network.toLowerCase().includes(searchLower);
    const matchesTab = activeTab === "All" || plan.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalSubscribers = plans.reduce((sum, p) => sum + p.subscriberCount, 0);
  const activePlans = plans.filter(p => p.status === "Active").length;
  const arpu = "$48.20";

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setName("");
    setPrice("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: ServicePlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setTier(plan.tier);
    setNetwork(plan.network);
    setDataGB(plan.dataGB);
    setSpeed(plan.speed);
    setVoiceMinutes(plan.voiceMinutes);
    setTextMessages(plan.textMessages);
    setHotspot(plan.hotspot);
    setPrice(plan.price.toString());
    setFeaturesText(plan.features.join(", "));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      addToast("Please provide a plan name and monthly price.", "error");
      return;
    }

    setCreating(true);
    await new Promise(r => setTimeout(r, 600));

    const featuresList = featuresText.split(",").map(f => f.trim()).filter(Boolean);

    if (editingPlan) {
      // Edit mode
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? {
        ...p,
        name,
        tier,
        network,
        dataGB,
        speed,
        voiceMinutes,
        textMessages,
        hotspot,
        price: Number(price),
        features: featuresList,
      } : p));
      addToast(`Updated service plan "${name}"!`, "success");
    } else {
      // Create mode
      const newPlanId = `PLN-00${plans.length + 1}`;
      const newPlan: ServicePlan = {
        id: newPlanId,
        name,
        tier,
        network,
        dataGB,
        speed,
        voiceMinutes,
        textMessages,
        hotspot,
        price: Number(price),
        subscriberCount: 0,
        revenue: "$0",
        status: "Active",
        features: featuresList.length > 0 ? featuresList : ["5G Access", "No Contract", "WiFi Calling"],
      };

      setPlans(prev => [newPlan, ...prev]);
      addToast(`Created service plan ${newPlanId} ("${name}")!`, "success");
    }

    setCreating(false);
    handleCloseModal();
  };

  const handleToggleStatus = (id: string, currentStatus: ServicePlan["status"], planName: string) => {
    const nextStatus: ServicePlan["status"] = currentStatus === "Active" ? "Archived" : "Active";
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    addToast(`${planName} set to ${nextStatus}.`, nextStatus === "Active" ? "success" : "info");
  };

  const handleDeletePlan = (id: string, planName: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    addToast(`Deleted plan "${planName}".`, "error");
  };

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
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Service Plans Engine</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure data, voice, and text packages for the marketplace</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Plans", value: plans.length.toString(), icon: Layers, color: "text-blue-500", bg: "bg-blue-50" },
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
            <button 
              onClick={() => setSearchQuery("")}
              className="p-2.5 bg-white border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] hover:border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPlans.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-[#dcdcdc] p-20 text-center shadow-sm space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-[#dcdcdc]">
              <Layers className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] uppercase tracking-wide">No Plans Found</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adjust your filters or create a new service plan</p>
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 inline mr-2" /> Create Service Plan
            </button>
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
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-[#dcdcdc] rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group flex flex-col justify-between"
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
                      onClick={() => handleOpenEditModal(plan)}
                      className="flex-1 px-3 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Settings2 className="w-3 h-3" /> Edit
                    </button>
                    
                    <button
                      onClick={() => handleToggleStatus(plan.id, plan.status, plan.name)}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                        plan.status === "Active"
                          ? "bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      <Power className="w-3 h-3" /> {plan.status === "Active" ? "Archive" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Create / Edit Plan Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7 md:p-9 shadow-2xl relative border border-white/50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">
                      {editingPlan ? "Edit Service Plan" : "Create New Service Plan"}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {editingPlan ? `Update settings for ${editingPlan.id}` : "Configure data & pricing options for eSIM subscribers"}
                    </p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePlan} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 5G Cross-Border Unlimited Pro"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Tier Level</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as "Premium" | "Standard" | "Budget")}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Premium">👑 Premium</option>
                      <option value="Standard">🛡️ Standard</option>
                      <option value="Budget">⚡ Budget</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Network Tech</label>
                    <select
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["5G Ultra Wideband", "5G Sub-6", "5G / LTE", "LTE Advanced", "LTE Cat-M1"].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Coverage Region</label>
                    <select
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="US/CA">🇺🇸🇨🇦 US &amp; CA</option>
                      <option value="US">🇺🇸 US Only</option>
                      <option value="CA">🇨🇦 CA Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Monthly Price ($)</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 79"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Data Allowance</label>
                    <select
                      value={dataGB}
                      onChange={(e) => setDataGB(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["Unlimited", "100 GB", "75 GB", "50 GB", "20 GB", "5 GB"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Max Speed</label>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["Up to 1 Gbps", "Up to 500 Mbps", "Up to 300 Mbps", "Up to 100 Mbps"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Voice Minutes</label>
                    <select
                      value={voiceMinutes}
                      onChange={(e) => setVoiceMinutes(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Unlimited">Unlimited</option>
                      <option value="1,000 Mins">1,000 Mins</option>
                      <option value="500 Mins">500 Mins</option>
                      <option value="—">— (Data Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Text Messages</label>
                    <select
                      value={textMessages}
                      onChange={(e) => setTextMessages(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Unlimited">Unlimited</option>
                      <option value="1,000 SMS">1,000 SMS</option>
                      <option value="500 SMS">500 SMS</option>
                      <option value="—">— (Data Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Hotspot Data</label>
                    <select
                      value={hotspot}
                      onChange={(e) => setHotspot(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="50 GB">50 GB</option>
                      <option value="30 GB">30 GB</option>
                      <option value="15 GB">15 GB</option>
                      <option value="5 GB">5 GB</option>
                      <option value="—">— None</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Feature Badges (Comma Separated)</label>
                  <input
                    type="text"
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="e.g. 5G UW, HD Streaming, 50GB Hotspot, International Text"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-4 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 cursor-pointer active:scale-95 mt-4"
                >
                  {creating ? "Saving Plan..." : editingPlan ? "Update Plan Settings" : "Publish Service Plan"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
