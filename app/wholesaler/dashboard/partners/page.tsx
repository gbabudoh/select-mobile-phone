"use client";
import React, { useState } from "react";
import {
  Users, UserPlus, Search, Filter,
  Star, MapPin, ShieldCheck, TrendingUp,
  DollarSign, Package,
  MessageCircle, Eye, Award, Clock,
  CheckCircle2, X, Info, Check,
  Handshake, Building2, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Types ---
interface Partner {
  id: string;
  name: string;
  company: string;
  role: string;
  location: string;
  avatar: string;
  status: "Active" | "Pending" | "Inactive";
  tier: "Gold" | "Silver" | "Bronze";
  ordersCompleted: number;
  totalRevenue: string;
  rating: number;
  joinDate: string;
  categories: string[];
  lastActive: string;
}

// --- Mock Data ---
const MOCK_PARTNERS: Partner[] = [
  {
    id: "PTR-001",
    name: "Sarah Jenkins",
    company: "Mobile City Retail",
    role: "Regional Distributor",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    status: "Active",
    tier: "Gold",
    ordersCompleted: 842,
    totalRevenue: "$1.2M",
    rating: 4.9,
    joinDate: "Jan 2024",
    categories: ["iPhones", "Galaxy", "Accessories"],
    lastActive: "2 hours ago"
  },
  {
    id: "PTR-002",
    name: "Marcus Chen",
    company: "TechDistro Inc.",
    role: "Enterprise Partner",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    status: "Active",
    tier: "Gold",
    ordersCompleted: 1247,
    totalRevenue: "$2.8M",
    rating: 4.8,
    joinDate: "Mar 2023",
    categories: ["Bulk Smartphones", "Tablets", "Wearables"],
    lastActive: "5 min ago"
  },
  {
    id: "PTR-003",
    name: "Ahmed Hassan",
    company: "Global Comm Systems",
    role: "International Distributor",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    status: "Pending",
    tier: "Silver",
    ordersCompleted: 156,
    totalRevenue: "$340K",
    rating: 4.5,
    joinDate: "Sep 2025",
    categories: ["Pixel", "OnePlus", "Refurbished"],
    lastActive: "1 day ago"
  },
  {
    id: "PTR-004",
    name: "Diana Morales",
    company: "CellPro Wholesale",
    role: "Retail Chain Partner",
    location: "Miami, FL",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    status: "Active",
    tier: "Silver",
    ordersCompleted: 623,
    totalRevenue: "$890K",
    rating: 4.7,
    joinDate: "Jun 2024",
    categories: ["Budget Phones", "Accessories", "Cases"],
    lastActive: "3 hours ago"
  },
  {
    id: "PTR-005",
    name: "Kevin O'Brien",
    company: "Wireless Network Hub",
    role: "MVNO Partner",
    location: "Chicago, IL",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    status: "Inactive",
    tier: "Bronze",
    ordersCompleted: 89,
    totalRevenue: "$120K",
    rating: 4.2,
    joinDate: "Nov 2025",
    categories: ["eSIM Devices", "5G Phones"],
    lastActive: "2 weeks ago"
  }
];

const tierConfig = {
  Gold: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "🏆" },
  Silver: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: "🥈" },
  Bronze: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", icon: "🥉" }
};

const statusConfig = {
  Active: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600" },
  Pending: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-600" },
  Inactive: { dot: "bg-slate-300", bg: "bg-slate-50", text: "text-slate-500" }
};

export default function WholesalerPartnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error" | "info"}[]>([]);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredPartners = MOCK_PARTNERS.filter(partner => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchLower) ||
      partner.company.toLowerCase().includes(searchLower) ||
      partner.id.toLowerCase().includes(searchLower);
    const matchesTab = activeTab === "All" || partner.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const activeCount = MOCK_PARTNERS.filter(p => p.status === "Active").length;
  const totalRevenue = "$5.35M";
  const avgRating = (MOCK_PARTNERS.reduce((sum, p) => sum + p.rating, 0) / MOCK_PARTNERS.length).toFixed(1);

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
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Partner Network</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage retailer relationships and distribution chains</p>
        </div>
        <button 
          onClick={() => addToast("Partner invitation link copied to clipboard!", "success")}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Invite Partner
        </button>
      </div>

      {/* KPI Analytics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Partners", value: MOCK_PARTNERS.length.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Partners", value: activeCount.toString(), icon: Handshake, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Revenue Generated", value: totalRevenue, icon: DollarSign, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Avg. Rating", value: avgRating, icon: Star, color: "text-amber-500", bg: "bg-amber-50" }
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
            {["All", "Active", "Pending", "Inactive"].map(tab => (
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
                placeholder="Search partner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase tracking-widest"
              />
            </div>
            <button className="p-2.5 bg-white border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] hover:border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="space-y-4">
        {filteredPartners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#dcdcdc] p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#dcdcdc]">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] mb-2 uppercase tracking-wide">No Partners Found</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adjust your filters or invite new partners to your network</p>
          </div>
        ) : (
          filteredPartners.map((partner, idx) => {
            const tier = tierConfig[partner.tier];
            const status = statusConfig[partner.status];

            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white border border-[#dcdcdc] rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
              >
                <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center">

                  {/* Avatar + Identity */}
                  <div className="flex items-center gap-4 w-full xl:w-80 shrink-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-50 shrink-0 ring-2 ring-slate-100">
                      <Image src={partner.avatar} alt={partner.name} fill className="object-cover" />
                      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${status.dot} rounded-full border-2 border-white`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wide">{partner.company}</h3>
                        {partner.tier === "Gold" && <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{partner.name} · {partner.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{partner.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Orders */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3 h-3 text-blue-500" />
                        <span className="text-sm font-black text-[#0f172a]">{partner.ordersCompleted.toLocaleString()}</span>
                      </div>
                    </div>
                    {/* Revenue */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-sm font-black text-[#0f172a]">{partner.totalRevenue}</span>
                      </div>
                    </div>
                    {/* Rating */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-black text-[#0f172a]">{partner.rating}</span>
                        <span className="text-[8px] font-bold text-slate-300">/5</span>
                      </div>
                    </div>
                    {/* Last Active */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Active</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span className="text-[11px] font-black text-[#0f172a]">{partner.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags + Actions */}
                  <div className="flex flex-col items-end gap-3 w-full xl:w-auto shrink-0">
                    {/* Tier + Status Badges */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${tier.bg} ${tier.text} border ${tier.border}`}>
                        {tier.icon} {partner.tier}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {partner.status}
                      </span>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {partner.categories.slice(0, 3).map((cat, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-[#dcdcdc] rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-wider shadow-sm">
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToast(`Opening profile for ${partner.company}...`, "info")}
                        className="px-4 py-2 bg-slate-50 border border-[#dcdcdc] rounded-xl text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" /> Profile
                      </button>
                      <button
                        onClick={() => addToast(`Opening messenger for ${partner.name}...`, "info")}
                        className="px-4 py-2 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all cursor-pointer active:scale-95 shadow-md flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3 h-3" /> Message
                      </button>
                    </div>
                  </div>
                </div>

                {/* Joined date - subtle footer */}
                <div className="mt-3 pt-3 border-t border-[#dcdcdc]/50 flex items-center justify-between">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    Partner since {partner.joinDate} · ID: {partner.id}
                  </p>
                  <div className="flex items-center gap-1">
                    {partner.status === "Active" && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
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
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribution Coverage</p>
              <p className="text-sm font-black text-[#0f172a]">5 States · 3 Regions · 2 Tiers Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl border border-[#dcdcdc]">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{MOCK_PARTNERS.length} Partners</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl border border-[#dcdcdc]">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{MOCK_PARTNERS.filter(p => p.tier === "Gold").length} Gold Tier</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
