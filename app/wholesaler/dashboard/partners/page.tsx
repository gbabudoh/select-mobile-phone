"use client";
import React, { useState } from "react";
import {
  Users, UserPlus, Search, Filter,
  Star, MapPin, ShieldCheck, TrendingUp,
  DollarSign, Package,
  MessageCircle, Eye, Award, Clock,
  CheckCircle2, X, Info, Check,
  Handshake, Building2, Globe, Copy, Mail, Phone, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Types ---
interface Partner {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
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

// --- Pre-seeded Initial Data ---
const INITIAL_PARTNERS: Partner[] = [
  {
    id: "PTR-801",
    name: "Jonathan Vance",
    company: "Apex Wireless LLC",
    role: "VP Procurement",
    email: "j.vance@apexwireless.com",
    phone: "+1 (555) 321-9988",
    location: "New York, US",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    status: "Active",
    tier: "Gold",
    ordersCompleted: 142,
    totalRevenue: "$184.5K",
    rating: 4.9,
    joinDate: "2025-11-10",
    categories: ["Handsets", "5G Accessories", "Preorder Bulk"],
    lastActive: "10 mins ago"
  },
  {
    id: "PTR-802",
    name: "Sophia Martinez",
    company: "MobileHub Retail Canada",
    role: "Store Operations Dir.",
    email: "smartinez@mobilehub.ca",
    phone: "+1 (416) 555-0192",
    location: "Toronto, CA",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    status: "Active",
    tier: "Gold",
    ordersCompleted: 98,
    totalRevenue: "$122.8K",
    rating: 4.8,
    joinDate: "2026-01-15",
    categories: ["Refurbished iPhones", "Cross-Border eSIM"],
    lastActive: "1 hour ago"
  },
  {
    id: "PTR-803",
    name: "David Sterling",
    company: "NextGen Tech Solutions",
    role: "Managing Director",
    email: "dsterling@nextgentech.com",
    phone: "+1 (310) 555-8821",
    location: "California, US",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    status: "Pending",
    tier: "Silver",
    ordersCompleted: 14,
    totalRevenue: "$18.4K",
    rating: 4.5,
    joinDate: "2026-06-20",
    categories: ["Galaxy S-Series", "Wholesale Lot"],
    lastActive: "Yesterday"
  },
  {
    id: "PTR-804",
    name: "Amara Okezie",
    company: "Empire Communications",
    role: "Supply Chain Manager",
    email: "a.okezie@empirecomm.com",
    phone: "+1 (404) 555-9102",
    location: "Atlanta, US",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    status: "Active",
    tier: "Silver",
    ordersCompleted: 45,
    totalRevenue: "$56.2K",
    rating: 4.7,
    joinDate: "2026-03-01",
    categories: ["Pixel Devices", "OEM Chargers"],
    lastActive: "3 hours ago"
  },
  {
    id: "PTR-805",
    name: "Brandon Lee",
    company: "Metro Cellular Outlet",
    role: "Owner & Operator",
    email: "blee@metrocellular.com",
    phone: "+1 (713) 555-4019",
    location: "Texas, US",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    status: "Inactive",
    tier: "Bronze",
    ordersCompleted: 6,
    totalRevenue: "$5.8K",
    rating: 4.2,
    joinDate: "2026-02-14",
    categories: ["Budget Handsets"],
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
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error" | "info"}[]>([]);

  // Invite Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Purchasing Manager");
  const [location, setLocation] = useState("New York, US");
  const [tier, setTier] = useState<"Gold" | "Silver" | "Bronze">("Silver");
  const [categoriesText, setCategoriesText] = useState("Handsets, Accessories, eSIM");
  const [inviting, setInviting] = useState(false);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredPartners = partners.filter(partner => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchLower) ||
      partner.company.toLowerCase().includes(searchLower) ||
      partner.id.toLowerCase().includes(searchLower) ||
      partner.location.toLowerCase().includes(searchLower);
    const matchesTab = activeTab === "All" || partner.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const activeCount = partners.filter(p => p.status === "Active").length;
  const totalRevenueSum = "$387.7K";
  const avgRating = partners.length > 0 ? (partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1) : "0.0";

  const handleOpenInviteModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseInviteModal = () => {
    setIsModalOpen(false);
    setCompanyName("");
    setContactName("");
    setEmail("");
    setPhone("");
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email) {
      addToast("Please fill in company name, contact name, and email.", "error");
      return;
    }

    setInviting(true);
    await new Promise(r => setTimeout(r, 700));

    const generatedId = `PTR-${Math.floor(800 + Math.random() * 200)}`;
    const catList = categoriesText.split(",").map(c => c.trim()).filter(Boolean);

    const newPartner: Partner = {
      id: generatedId,
      name: contactName,
      company: companyName,
      role,
      email,
      phone: phone || "+1 (555) 000-1234",
      location,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      status: "Pending",
      tier,
      ordersCompleted: 0,
      totalRevenue: "$0.00",
      rating: 5.0,
      joinDate: new Date().toISOString().split("T")[0],
      categories: catList.length > 0 ? catList : ["Handsets", "Accessories"],
      lastActive: "Invited Just Now"
    };

    setPartners(prev => [newPartner, ...prev]);
    setInviting(false);
    handleCloseInviteModal();
    addToast(`B2B Partner Invitation sent to ${contactName} (${companyName})!`, "success");
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText("https://selectmobile.com/b2b-invite?ref=WHS-PARTNER-88");
    addToast("Partner B2B registration link copied to clipboard!", "success");
  };

  const handleToggleStatus = (id: string, currentStatus: Partner["status"], company: string) => {
    const nextStatus: Partner["status"] = currentStatus === "Active" ? "Inactive" : "Active";
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    addToast(`Partner ${company} set to ${nextStatus}.`, nextStatus === "Active" ? "success" : "info");
  };

  const handleDeletePartner = (id: string, company: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    addToast(`Removed ${company} from partner network.`, "error");
  };

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
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Partner Network Directory</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage B2B retailer relationships, distribution tiers, and invites</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyInviteLink}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Invite Link
          </button>
          <button 
            onClick={handleOpenInviteModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Invite Partner
          </button>
        </div>
      </div>

      {/* KPI Analytics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Partners", value: partners.length.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Partners", value: activeCount.toString(), icon: Handshake, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Revenue Generated", value: totalRevenueSum, icon: DollarSign, color: "text-violet-500", bg: "bg-violet-50" },
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
            <button 
              onClick={() => setSearchQuery("")}
              className="p-2.5 bg-white border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] hover:border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="space-y-4">
        {filteredPartners.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#dcdcdc] p-20 text-center shadow-sm space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-[#dcdcdc]">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] uppercase tracking-wide">No Partners Found</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Invite new retail partners to expand your distribution network</p>
            <button
              onClick={handleOpenInviteModal}
              className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 inline mr-2" /> Invite B2B Partner
            </button>
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
                transition={{ delay: idx * 0.05 }}
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
                        className="px-3 py-2 bg-slate-50 border border-[#dcdcdc] rounded-xl text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" /> Profile
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(partner.id, partner.status, partner.company)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center gap-1 border ${
                          partner.status === "Active" ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100" :
                          "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {partner.status === "Active" ? "Deactivate" : "Approve"}
                      </button>

                      <button
                        onClick={() => handleDeletePartner(partner.id, partner.company)}
                        className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Remove Partner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Joined date - subtle footer */}
                <div className="mt-3 pt-3 border-t border-[#dcdcdc]/50 flex items-center justify-between">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Partner since {partner.joinDate} · ID: {partner.id} · {partner.email}
                  </p>
                  <div className="flex items-center gap-1">
                    {partner.status === "Active" && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Verified Partner
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wholesale Distribution Network</p>
              <p className="text-sm font-black text-[#0f172a]">Active Distribution across US &amp; Canada Regional Channels</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl border border-[#dcdcdc]">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{partners.length} Total Partners</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl border border-[#dcdcdc]">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{partners.filter(p => p.tier === "Gold").length} Gold Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Invite B2B Partner Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={handleCloseInviteModal}
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
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">Invite B2B Retail Partner</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Grant access to wholesale pricing &amp; priority inventory</p>
                  </div>
                </div>
                <button onClick={handleCloseInviteModal} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Company / Business Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Wireless LLC"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Primary Contact Person</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Jonathan Vance"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Contact Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="j.vance@apexwireless.com"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Contact Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 321-9988"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Partner Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="VP Procurement">VP Procurement</option>
                      <option value="Purchasing Manager">Purchasing Manager</option>
                      <option value="Store Operations Dir.">Store Operations Dir.</option>
                      <option value="Managing Director">Managing Director</option>
                      <option value="Owner & Operator">Owner &amp; Operator</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Region / Location</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="New York, US">🇺🇸 New York, US</option>
                      <option value="California, US">🇺🇸 California, US</option>
                      <option value="Texas, US">🇺🇸 Texas, US</option>
                      <option value="Toronto, CA">🇨🇦 Toronto, CA</option>
                      <option value="Vancouver, CA">🇨🇦 Vancouver, CA</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Assigned Tier</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value as "Gold" | "Silver" | "Bronze")}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Gold">🏆 Gold Tier (Max Discount)</option>
                      <option value="Silver">🥈 Silver Tier (Standard)</option>
                      <option value="Bronze">🥉 Bronze Tier (Entry)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Sourcing Categories (Comma Separated)</label>
                  <input
                    type="text"
                    value={categoriesText}
                    onChange={(e) => setCategoriesText(e.target.value)}
                    placeholder="e.g. Handsets, 5G Accessories, Preorder Bulk"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Instant Link Option */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-[#0f172a]">Or Copy Direct Registration Link</p>
                    <p className="text-[10px] text-slate-400 font-bold">Share this single-use link directly with your client contact.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyInviteLink}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#04a1c6]" /> Copy Link
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full py-4 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 cursor-pointer active:scale-95 mt-4"
                >
                  {inviting ? "Sending Invitation Email..." : "Send B2B Partner Invite"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
