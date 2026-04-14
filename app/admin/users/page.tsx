"use client";
import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  ShieldAlert,
  ArrowUpDown,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data for UI Structure ---
const MOCK_USERS = [
  { id: "USR-001", name: "Marcus Chen", email: "marcus@techdistro.com", role: "WHOLESALER", status: "Active", verification: "Verified", country: "CA", joined: "Oct 12, 2025" },
  { id: "USR-002", name: "Sarah Jenkins", email: "sarah@mobilecity.ca", role: "RETAILER", status: "Active", verification: "Verified", country: "CA", joined: "Oct 15, 2025" },
  { id: "USR-003", name: "Ahmed Hassan", email: "ahmed@globalcomm.net", role: "NETWORK_PROVIDER", status: "Pending", verification: "Pending", country: "US", joined: "Oct 24, 2025" },
  { id: "USR-004", name: "Kevin O'Brien", email: "kevin@wirelesshub.com", role: "INDIVIDUAL_SELLER", status: "Active", verification: "Verified", country: "US", joined: "Nov 02, 2025" },
  { id: "USR-005", name: "Elena Rodriguez", email: "elena@cellpro.com", role: "RETAILER", status: "Suspended", verification: "Rejected", country: "US", joined: "Nov 10, 2025" },
];

const roleConfig: Record<string, { color: string; bg: string }> = {
  WHOLESALER: { color: "text-blue-700", bg: "bg-blue-50" },
  RETAILER: { color: "text-indigo-700", bg: "bg-indigo-50" },
  NETWORK_PROVIDER: { color: "text-cyan-700", bg: "bg-cyan-50" },
  INDIVIDUAL_SELLER: { color: "text-violet-700", bg: "bg-violet-50" },
  BUYER: { color: "text-slate-700", bg: "bg-slate-50" },
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">User Management</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit and regulate all accounts across the platform</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-[#dcdcdc] rounded-2xl p-3 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="relative w-full md:w-96 group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#04a1c6] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#dcdcdc] rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0f172a] hover:bg-slate-50 transition-all cursor-pointer">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#dcdcdc] rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0f172a] hover:bg-slate-50 transition-all cursor-pointer">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#dcdcdc] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#dcdcdc]">
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Account Type</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Region</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Verified</th>
                <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0f172a] font-black text-sm border border-white shadow-sm shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-[#0f172a] truncate">{user.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-300" />
                          <p className="text-[10px] font-bold text-slate-400 truncate tracking-wide uppercase">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${roleConfig[user.role]?.bg} ${roleConfig[user.role]?.color} border border-transparent`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                      <MapPin className="w-3 h-3 text-slate-300" /> {user.country}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                      user.status === "Active" ? "text-emerald-500" : user.status === "Pending" ? "text-amber-500" : "text-rose-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.status === "Active" ? "bg-emerald-500" : user.status === "Pending" ? "bg-amber-500" : "bg-rose-500"
                      }`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                      user.verification === "Verified" ? "text-blue-500" : "text-slate-300"
                    }`}>
                      <UserCheck className={`w-3.5 h-3.5 ${user.verification === "Verified" ? "text-blue-500" : "text-slate-300"}`} />
                      {user.verification}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0f172a] transition-all cursor-pointer group-hover:bg-slate-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenuId === user.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-6 top-full mt-2 w-48 bg-white border border-[#dcdcdc] rounded-2xl shadow-2xl z-40 py-2 overflow-hidden"
                          >
                            <UserActionItem icon={UserCheck} label="Verify Account" color="text-[#04a1c6]" />
                            <UserActionItem icon={ShieldAlert} label="Flag for Audit" color="text-amber-500" />
                            <div className="border-t border-slate-100 my-1" />
                            <UserActionItem icon={UserX} label="Suspend User" color="text-rose-500" />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination / Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-[#dcdcdc] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 5 of 3,284 users</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0f172a] disabled:opacity-50 transition-all cursor-pointer">Prev</button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${p === 1 ? "bg-[#0f172a] text-white" : "text-slate-400 hover:bg-slate-100"}`}>{p}</button>
              ))}
            </div>
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f172a] transition-all cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserActionItem({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer">
      <span className={`${color} shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0f172a]">{label}</span>
    </button>
  );
}
