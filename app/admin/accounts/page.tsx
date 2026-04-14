"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, MoreVertical, UserCheck, UserX, ShieldAlert, Mail, MapPin,
  FileText, CheckCircle, XCircle, Eye, Trash2, BadgeCheck, ChevronLeft,
  ChevronRight, AlertCircle, RefreshCw, Users, TrendingUp, Activity, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Constants ──────────────────────────────────────────────────────────────────

const ROLES = ["ALL", "INDIVIDUAL_SELLER", "RETAILER", "WHOLESALER", "NETWORK_PROVIDER"] as const;
const TAB_LABELS: Record<string, string> = {
  ALL: "All",
  INDIVIDUAL_SELLER: "Individual",
  RETAILER: "Retailer",
  WHOLESALER: "Wholesaler",
  NETWORK_PROVIDER: "Network",
};

const DOC_TYPE_LABELS: Record<string, string> = {
  PASSPORT: "Passport",
  SSN: "Social Security",
  BUSINESS_INCORPORATION: "Business Inc.",
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING_VERIFICATION", label: "Pending" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "BANNED", label: "Banned" },
];

const KYC_OPTIONS = [
  { value: "", label: "All KYC" },
  { value: "VERIFIED", label: "Verified" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
  { value: "UNVERIFIED", label: "Unverified" },
];

// ── Types ───────────────────────────────────────────────────────────────────────

interface KycDocument {
  id: string;
  type: string;
  status: string;
  uploadedAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  country: string;
  status: string;
  createdAt: string;
  verification?: string;
  kycDocuments?: KycDocument[];
  sellerProfile?: { verification: string };
  retailerProfile?: { verification: string };
  wholesalerProfile?: { verification: string };
  networkProviderProfile?: { verification: string };
  _count?: { ordersAsSeller: number; ordersAsBuyer: number; listings: number };
}

interface PlatformStats {
  activeSellers: number;
  pendingKyc: number;
  openDisputes: number;
  escrowHoldings: number;
}

// ── Style Config ───────────────────────────────────────────────────────────────

const roleConfig: Record<string, { text: string; badge: string; grad: string }> = {
  WHOLESALER:        { text: "text-blue-600",   badge: "bg-blue-50 border border-blue-100",     grad: "from-blue-500 to-blue-600" },
  RETAILER:          { text: "text-indigo-600",  badge: "bg-indigo-50 border border-indigo-100", grad: "from-indigo-500 to-indigo-600" },
  NETWORK_PROVIDER:  { text: "text-cyan-600",    badge: "bg-cyan-50 border border-cyan-100",     grad: "from-cyan-500 to-cyan-600" },
  INDIVIDUAL_SELLER: { text: "text-violet-600",  badge: "bg-violet-50 border border-violet-100", grad: "from-violet-500 to-violet-600" },
};

const statusConfig: Record<string, { text: string; badge: string; dot: string; label: string }> = {
  ACTIVE:               { text: "text-emerald-600", badge: "bg-emerald-50 border border-emerald-100", dot: "bg-emerald-500", label: "Active" },
  PENDING_VERIFICATION: { text: "text-amber-600",   badge: "bg-amber-50 border border-amber-100",    dot: "bg-amber-500",   label: "Pending" },
  SUSPENDED:            { text: "text-rose-600",    badge: "bg-rose-50 border border-rose-100",      dot: "bg-rose-500",    label: "Suspended" },
  BANNED:               { text: "text-red-600",     badge: "bg-red-50 border border-red-100",        dot: "bg-red-500",     label: "Banned" },
};

const kycConfig: Record<string, { text: string; badge: string }> = {
  VERIFIED:   { text: "text-emerald-600", badge: "bg-emerald-50 border border-emerald-100" },
  PENDING:    { text: "text-amber-600",   badge: "bg-amber-50 border border-amber-100" },
  REJECTED:   { text: "text-rose-600",    badge: "bg-rose-50 border border-rose-100" },
  UNVERIFIED: { text: "text-slate-600",    badge: "bg-slate-50 border border-slate-200" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getVerification(user: AdminUser): string {
  const p = user.sellerProfile || user.retailerProfile || user.wholesalerProfile || user.networkProviderProfile;
  return p?.verification || "UNVERIFIED";
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FilterDropdown({
  value, options, onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
      >
        <span>{current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-52 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-xl z-40 py-2 overflow-hidden"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                    value === opt.value
                      ? "text-[#04a1c6] bg-[#04a1c6]/5"
                      : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {value === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#04a1c6] shrink-0" />
                  )}
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function GlassMenuItem({
  icon: Icon, label, color, onClick,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left cursor-pointer group"
    >
      <span className={`${color} shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`}>
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminAccountsPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [verificationFilter, setVerificationFilter] = useState<string>("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [activeTab, debouncedSearch, statusFilter, verificationFilter]);

  const fetchUsers = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (activeTab !== "ALL") p.append("role", activeTab);
      if (debouncedSearch) p.append("search", debouncedSearch);
      if (statusFilter) p.append("status", statusFilter);
      if (verificationFilter) p.append("verification", verificationFilter);
      p.append("page", String(page));
      p.append("limit", "15");
      const res = await fetch(`/api/admin/accounts?${p}`, { signal: abortRef.current.signal });
      const data = await res.json();
      if (data.users) {
        setUsers(data.users.map((u: AdminUser) => ({ ...u, verification: getVerification(u) })));
        setTotal(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.totalPages ?? 1);
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== "AbortError") console.error(e);
    } finally { setLoading(false); }
  }, [activeTab, debouncedSearch, statusFilter, verificationFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  async function handleAction(userId: string, payload: Record<string, string>) {
    setActionLoading(true); setActionError(null);
    try {
      const res = await fetch(`/api/admin/accounts/${userId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) { setActionError((await res.json()).error || "Action failed"); return false; }
      await fetchUsers(); setSelectedUser(null); return true;
    } catch { setActionError("Network error"); return false; }
    finally { setActionLoading(false); }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Permanently delete this account? This cannot be undone.")) return;
    setActionLoading(true); setActionError(null);
    try {
      const res = await fetch(`/api/admin/accounts/${userId}`, { method: "DELETE" });
      if (!res.ok) { setActionError((await res.json()).error || "Delete failed"); return; }
      await fetchUsers(); setSelectedUser(null);
    } catch { setActionError("Network error"); }
    finally { setActionLoading(false); }
  }

  async function handleKyc(userId: string, kycDocumentId: string, action: "APPROVE" | "REJECT") {
    setActionLoading(true); setActionError(null);
    try {
      const res = await fetch(`/api/admin/accounts/${userId}/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kycDocumentId, action }),
      });
      if (!res.ok) { setActionError((await res.json()).error || "KYC action failed"); return; }
      await fetchUsers();
      const refreshed = await fetch(`/api/admin/accounts/${userId}`).then((r) => r.json());
      if (refreshed?.id) setSelectedUser({ ...refreshed, verification: getVerification(refreshed) });
    } catch { setActionError("Network error"); }
    finally { setActionLoading(false); }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="relative -m-8 min-h-[calc(100vh-64px)] bg-[#f0f4f8]">
      {/* Ambient orbs */}
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="absolute top-[-120px] right-[-80px] w-[700px] h-[700px] bg-[#04a1c6]/[0.05] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[600px] h-[600px] bg-violet-600/[0.04] rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 p-8 space-y-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3.5 mb-2">
              <div
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#04a1c6] to-[#0270a0] flex items-center justify-center shrink-0 shadow-lg shadow-[#04a1c6]/20"
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-[28px] font-black text-slate-900 uppercase tracking-tight leading-none">
                Account Management
              </h1>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-[58px]">
              Seller accounts · KYC verification · Access control
            </p>
          </div>

          <AnimatePresence>
            {actionError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                className="flex items-center gap-3 px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 shadow-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{actionError}</span>
                <button onClick={() => setActionError(null)} className="ml-1 opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Stats Row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Users, label: "Total Sellers", value: total || "—",
              grad: "from-[#04a1c6] to-[#026e90]", glow: "rgba(4,161,198,0.2)",
            },
            {
              icon: Activity, label: "Active Accounts", value: stats?.activeSellers ?? "—",
              grad: "from-emerald-500 to-emerald-600", glow: "rgba(16,185,129,0.2)",
            },
            {
              icon: ShieldAlert, label: "Pending KYC", value: stats?.pendingKyc ?? "—",
              grad: "from-amber-500 to-amber-600", glow: "rgba(245,158,11,0.2)",
            },
            {
              icon: TrendingUp, label: "Open Disputes", value: stats?.openDisputes ?? "—",
              grad: "from-rose-500 to-rose-600", glow: "rgba(239,68,68,0.2)",
            },
          ].map(({ icon: Icon, label, value, grad, glow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden group hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2.5">{label}</p>
                  <p className="text-[32px] font-black text-slate-900 leading-none">{value}</p>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-lg`}
                  style={{ boxShadow: `0 4px 12px ${glow}` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Role Tabs ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => { setActiveTab(role); setSelectedUser(null); setPage(1); }}
              className={`relative px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === role ? "text-white" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {activeTab === role && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#04a1c6] to-[#0270a0]"
                  style={{ boxShadow: "0 4px 12px rgba(4,161,198,0.3)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{TAB_LABELS[role]}</span>
            </button>
          ))}
        </div>

        {/* ── Toolbar ───────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64 max-w-sm group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#04a1c6] transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#04a1c6]/50 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <FilterDropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(v) => { setStatusFilter(v); setPage(1); }} />
          <FilterDropdown value={verificationFilter} options={KYC_OPTIONS} onChange={(v) => { setVerificationFilter(v); setPage(1); }} />
          <button
            onClick={() => fetchUsers()}
            disabled={loading}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-30 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* ── Main Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6 items-start">

          {/* Table card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {["Seller", "Type", "Region", "Status", "KYC", ""].map((h) => (
                      <th
                        key={h}
                        className={`px-5 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500 ${h === "" ? "text-right" : "text-left"} ${h === "Seller" ? "pl-6" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i} className="border-b border-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                            <div className="space-y-2 flex-1">
                              <div className="h-3 bg-slate-100 rounded animate-pulse w-32" />
                              <div className="h-2 bg-slate-50 rounded animate-pulse w-24" />
                            </div>
                          </div>
                        </td>
                        {[0, 1, 2, 3, 4].map((j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-3 bg-slate-50 rounded animate-pulse w-14" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-20 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                          <Users className="w-7 h-7 text-slate-200" />
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                          No sellers found
                        </p>
                        <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest">
                          Adjust your filters or search query
                        </p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => {
                      const rc = roleConfig[user.role];
                      const sc = statusConfig[user.status];
                      const kc = kycConfig[user.verification || "UNVERIFIED"];
                      const isSelected = selectedUser?.id === user.id;

                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.025 }}
                          onClick={() => setSelectedUser(user)}
                          className={`border-b border-slate-50 cursor-pointer transition-all duration-150 group ${
                            isSelected
                              ? "bg-[#04a1c6]/5"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="pl-6 pr-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rc?.grad ?? "from-slate-600 to-slate-900"} flex items-center justify-center text-white font-black text-sm shrink-0`}
                              >
                                {user.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-[13px] text-slate-900 truncate">{user.name}</p>
                                <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-wide flex items-center gap-1 mt-0.5">
                                  <Mail className="w-2.5 h-2.5 shrink-0" />
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${rc?.badge} ${rc?.text}`}>
                              {user.role.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <MapPin className="w-3 h-3 text-[#04a1c6]" />
                              {user.country}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${sc?.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc?.dot} shrink-0`} />
                              {sc?.label ?? user.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${kc?.text}`}>
                              <BadgeCheck className="w-3 h-3" />
                              {user.verification || "UNVERIFIED"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === user.id ? null : user.id); }}
                              className="p-2 rounded-lg text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                              {activeMenuId === user.id && (
                                <>
                                  <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                                  <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-5 top-full mt-2 w-52 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-xl z-40 py-2"
                                  >
                                    {user.status === "PENDING_VERIFICATION" && (
                                      <GlassMenuItem icon={UserCheck} label="Verify & Activate" color="text-[#04a1c6]"
                                        onClick={() => { setActiveMenuId(null); handleAction(user.id, { status: "ACTIVE", verification: "VERIFIED" }); }} />
                                    )}
                                    {user.status === "ACTIVE" && (
                                      <GlassMenuItem icon={ShieldAlert} label="Suspend" color="text-amber-400"
                                        onClick={() => { setActiveMenuId(null); handleAction(user.id, { status: "SUSPENDED" }); }} />
                                    )}
                                    {user.status === "SUSPENDED" && (
                                      <GlassMenuItem icon={UserCheck} label="Reinstate" color="text-emerald-400"
                                        onClick={() => { setActiveMenuId(null); handleAction(user.id, { status: "ACTIVE" }); }} />
                                    )}
                                    {user.status !== "BANNED" && (
                                      <GlassMenuItem icon={UserX} label="Ban Account" color="text-rose-400"
                                        onClick={() => { setActiveMenuId(null); handleAction(user.id, { status: "BANNED" }); }} />
                                    )}
                                    <div className="mx-4 my-1.5 border-t border-slate-100" />
                                    <GlassMenuItem icon={Trash2} label="Delete Account" color="text-rose-500"
                                      onClick={() => { setActiveMenuId(null); handleDelete(user.id); }} />
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {loading ? "Loading…" : `${users.length} of ${total} sellers`}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div>
            <AnimatePresence mode="wait">
              {selectedUser ? (
                <motion.div
                  key={selectedUser.id}
                  initial={{ opacity: 0, x: 24, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 24, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="sticky top-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl"
                >
                  {/* Panel hero */}
                  <div className="relative p-6 overflow-hidden border-b border-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#04a1c6]/10 via-violet-500/5 to-transparent" />
                    <div className="absolute -top-8 -right-8 w-48 h-48 bg-[#04a1c6]/5 rounded-full blur-3xl pointer-events-none" />
                    {/* Subtle grid lines */}
                    <div
                      className="absolute inset-0 opacity-[0.05] pointer-events-none"
                      style={{
                        backgroundImage: "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <div className="relative z-10">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleConfig[selectedUser.role]?.grad ?? "from-slate-600 to-slate-900"} flex items-center justify-center font-black text-3xl text-white mb-4`}
                        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)" }}
                      >
                        {selectedUser.name.charAt(0)}
                      </div>
                      <h3 className="font-black text-[18px] text-slate-900 uppercase tracking-tight leading-tight">
                        {selectedUser.name}
                      </h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#04a1c6]" /> {selectedUser.email}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${roleConfig[selectedUser.role]?.badge} ${roleConfig[selectedUser.role]?.text}`}>
                          {selectedUser.role.replace(/_/g, " ")}
                        </span>
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${statusConfig[selectedUser.status]?.badge} ${statusConfig[selectedUser.status]?.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[selectedUser.status]?.dot}`} />
                          {statusConfig[selectedUser.status]?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Panel body */}
                  <div className="p-5 border-t border-slate-100 space-y-5">

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: "User ID", value: selectedUser.id },
                        { label: "Country", value: selectedUser.country },
                        {
                          label: "Joined",
                          value: new Date(selectedUser.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric", month: "short", day: "numeric",
                          }),
                        },
                        { label: "KYC Status", value: selectedUser.verification || "UNVERIFIED" },
                        ...(selectedUser._count
                          ? [
                              { label: "Listings", value: String(selectedUser._count.listings) },
                              { label: "Sales", value: String(selectedUser._count.ordersAsSeller) },
                            ]
                          : []),
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-3 shadow-sm">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                          <p className="text-[11px] font-extrabold text-slate-900 uppercase truncate">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* KYC Documents */}
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#04a1c6]" /> KYC Documents
                      </p>
                      <div className="space-y-2">
                        {selectedUser.kycDocuments && selectedUser.kycDocuments.length > 0 ? (
                          selectedUser.kycDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
                            >
                              <div>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                  {DOC_TYPE_LABELS[doc.type] || doc.type}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                                  {doc.uploadedAt
                                    ? new Date(doc.uploadedAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })
                                    : "N/A"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${kycConfig[doc.status]?.badge} ${kycConfig[doc.status]?.text}`}>
                                  {doc.status}
                                </span>
                                {doc.status === "PENDING" && (
                                  <div className="flex gap-1">
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleKyc(selectedUser.id, doc.id, "APPROVE")}
                                      className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-40"
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                    </button>
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleKyc(selectedUser.id, doc.id, "REJECT")}
                                      className="p-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-100 transition-all cursor-pointer disabled:opacity-40"
                                    >
                                      <XCircle className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center">
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                              No documents submitted
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Accepted docs */}
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-[8px] font-black text-[#04a1c6] uppercase tracking-widest mb-1.5">
                          Accepted — US & CA
                        </p>
                        <ul className="space-y-0.5 text-[9px] font-bold text-slate-500">
                          <li>· Social Security Number (SSN)</li>
                          <li>· Passport</li>
                          <li>· Business Incorporation (optional)</li>
                        </ul>
                      </div>
                    </div>

                    {/* Unverified warning */}
                    {selectedUser.verification !== "VERIFIED" && (
                      <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5 shadow-sm">
                        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] font-bold text-amber-600/80 leading-relaxed">
                          Cannot list products or trade until verification is complete.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Panel actions */}
                  <div className="p-5 border-t border-slate-100 grid grid-cols-2 gap-2 bg-slate-50/50">
                    {selectedUser.status === "PENDING_VERIFICATION" && (
                      <button
                        disabled={actionLoading}
                        onClick={() => handleAction(selectedUser.id, { status: "ACTIVE", verification: "VERIFIED" })}
                        className="col-span-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all cursor-pointer disabled:opacity-40 bg-gradient-to-r from-[#04a1c6] to-[#0270a0] hover:opacity-90"
                        style={{ boxShadow: "0 4px 20px rgba(4,161,198,0.35)" }}
                      >
                        <UserCheck className="w-3.5 h-3.5 inline mr-1.5" /> Verify & Activate
                      </button>
                    )}
                    {selectedUser.status === "ACTIVE" && (
                      <button disabled={actionLoading} onClick={() => handleAction(selectedUser.id, { status: "SUSPENDED" })}
                        className="py-2.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all cursor-pointer disabled:opacity-40">
                        Suspend
                      </button>
                    )}
                    {selectedUser.status === "SUSPENDED" && (
                      <button disabled={actionLoading} onClick={() => handleAction(selectedUser.id, { status: "ACTIVE" })}
                        className="py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all cursor-pointer disabled:opacity-40">
                        Reinstate
                      </button>
                    )}
                    {selectedUser.status !== "BANNED" && selectedUser.status !== "PENDING_VERIFICATION" && selectedUser.status !== "ACTIVE" && selectedUser.status !== "SUSPENDED" && (
                      <button disabled={actionLoading} onClick={() => handleAction(selectedUser.id, { status: "BANNED" })}
                          className="py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all cursor-pointer disabled:opacity-40">
                        Ban
                      </button>
                    )}
                    <button
                      disabled={actionLoading}
                      onClick={() => handleDelete(selectedUser.id)}
                      className="py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all cursor-pointer disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="sticky top-8 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-14 min-h-[480px] shadow-sm"
                >
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
                    <Eye className="w-9 h-9 text-slate-200" />
                  </div>
                  <h3 className="font-black text-slate-600 text-[11px] uppercase tracking-widest mb-2.5">
                    Select a seller
                  </h3>
                  <p className="text-[9px] font-bold text-slate-500 max-w-[180px] uppercase tracking-widest leading-relaxed">
                    Click any row to inspect account details, KYC docs, and controls
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
