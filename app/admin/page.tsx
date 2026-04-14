"use client";
import { useState, useEffect } from "react";
import {
  Users, ShieldAlert, DollarSign, Activity, TrendingUp, ShoppingCart,
  Package, BadgeCheck, ArrowUpRight, ArrowDownRight, Zap, Clock,
  CheckCircle2, XCircle, BarChart2, Globe, Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Stats {
  activeSellers: number;
  pendingKyc: number;
  openDisputes: number;
  escrowHoldings: number;
}

const ACTIVITY = [
  { icon: BadgeCheck, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", label: "KYC Approved", sub: "Marcus Chen — Wholesaler", time: "2 min ago" },
  { icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Dispute Opened", sub: "Order #ORD-8821 — $1,200", time: "14 min ago" },
  { icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", label: "New Seller Registered", sub: "Elena Rodriguez — Retailer", time: "31 min ago" },
  { icon: DollarSign, color: "text-cyan-500", bg: "bg-cyan-50", border: "border-cyan-100", label: "Escrow Released", sub: "Order #ORD-8794 — $4,850", time: "1 hr ago" },
  { icon: XCircle, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", label: "KYC Rejected", sub: "Jason Park — Wholesaler", time: "2 hr ago" },
  { icon: ShoppingCart, color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100", label: "High-Value Order Placed", sub: "Order #ORD-8901 — $12,400", time: "3 hr ago" },
];

const CHART_BARS = [
  { label: "Mon", orders: 68, revenue: 42 },
  { label: "Tue", orders: 82, revenue: 65 },
  { label: "Wed", orders: 54, revenue: 38 },
  { label: "Thu", orders: 91, revenue: 78 },
  { label: "Fri", orders: 76, revenue: 60 },
  { label: "Sat", orders: 43, revenue: 29 },
  { label: "Sun", orders: 35, revenue: 22 },
];

const STATUS_ITEMS = [
  { icon: Globe, status: "live" as const, label: "Stripe Escrow Webhooks" },
  { icon: Shield, status: "live" as const, label: "NextAuth Authentication" },
  { icon: BarChart2, status: "live" as const, label: "Google Analytics Tracking" },
  { icon: Activity, status: "warning" as const, label: "KYC Queue — High Volume (USA)" },
  { icon: CheckCircle2, status: "live" as const, label: "Prisma Database Connection" },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const [stats, setStats] = useState<Stats>({
    activeSellers: 3284,
    pendingKyc: 142,
    openDisputes: 18,
    escrowHoldings: 1432500,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  const vitals = [
    {
      label: "Active Sellers", value: stats.activeSellers.toLocaleString(),
      icon: Users, accent: "from-blue-500 to-blue-600", light: "bg-blue-50", iconColor: "text-blue-500",
      trend: "+5.2%", up: true, href: "/admin/accounts",
    },
    {
      label: "Pending KYC", value: stats.pendingKyc.toLocaleString(),
      icon: Activity, accent: "from-amber-400 to-amber-500", light: "bg-amber-50", iconColor: "text-amber-500",
      trend: "+18", up: false, href: "/admin/accounts",
    },
    {
      label: "Open Disputes", value: stats.openDisputes.toLocaleString(),
      icon: ShieldAlert, accent: "from-rose-500 to-rose-600", light: "bg-rose-50", iconColor: "text-rose-500",
      trend: "-3", up: true, href: "/admin/disputes",
    },
    {
      label: "Escrow Holdings", value: `$${(stats.escrowHoldings / 1000000).toFixed(2)}M`,
      icon: DollarSign, accent: "from-emerald-500 to-emerald-600", light: "bg-emerald-50", iconColor: "text-emerald-500",
      trend: "+$84K", up: true, href: "/admin/payments",
    },
  ];

  const quickActions = [
    { label: "Accounts & KYC", desc: "Seller verification", icon: Users, href: "/admin/accounts", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Dispute Engine", desc: "Open disputes", icon: ShieldAlert, href: "/admin/disputes", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
    { label: "Banner CMS", desc: "Edit banners", icon: Package, href: "/admin/banners", color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-100" },
    { label: "Analytics", desc: "Performance", icon: TrendingUp, href: "/admin/analytics", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Payments", desc: "Revenue & escrow", icon: DollarSign, href: "/admin/payments", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "SEO", desc: "Meta & structure", icon: BadgeCheck, href: "/admin/seo", color: "text-cyan-500", bg: "bg-cyan-50", border: "border-cyan-100" },
    ...(isSuperAdmin
      ? [{ label: "Admin Team", desc: "Manage admins", icon: Users, href: "/admin/admins", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" }]
      : []),
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[#0d1526] p-8 shadow-xl"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#04a1c6]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-[#04a1c6]/20 border border-[#04a1c6]/30 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-[#04a1c6]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#04a1c6]">Mission Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {greeting}, Admin
            </h1>
            <p className="text-sm text-white/40 mt-1 font-medium">
              Platform is operating normally · {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Mini KPIs */}
          <div className="flex items-center gap-3 shrink-0">
            <MiniKPI label="Today's Orders" value="127" icon={ShoppingCart} />
            <MiniKPI label="New Users" value="34" icon={Users} />
            <MiniKPI label="Revenue" value="$18.4K" icon={DollarSign} highlight />
          </div>
        </div>
      </motion.div>

      {/* Vital Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {vitals.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              {/* Accent bar */}
              <div className={`h-1 w-full bg-linear-to-r ${stat.accent}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl ${stat.light} flex items-center justify-center`}>
                    <stat.icon className={`w-4.5 h-4.5 ${stat.iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-[#0d1526]">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-[10px] font-black ${stat.up ? "text-emerald-500" : "text-rose-500"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{stat.trend} this week</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Middle Row: Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest">Weekly Activity</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Orders vs Revenue — last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#04a1c6] inline-block" /> Orders</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> Revenue</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {CHART_BARS.map((bar, i) => (
              <motion.div
                key={bar.label}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full flex items-end gap-0.5 h-32">
                  <div
                    className="flex-1 bg-[#04a1c6]/80 rounded-t-md hover:bg-[#04a1c6] transition-colors"
                    style={{ height: `${bar.orders}%` }}
                  />
                  <div
                    className="flex-1 bg-emerald-400/70 rounded-t-md hover:bg-emerald-400 transition-colors"
                    style={{ height: `${bar.revenue}%` }}
                  />
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{bar.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest">Recent Activity</h2>
            <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <Clock className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="space-y-3 flex-1 overflow-hidden">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className={`w-7 h-7 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center shrink-0 mt-0.5`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black text-[#0d1526] uppercase tracking-widest truncate">{item.label}</p>
                  <p className="text-[9px] font-bold text-slate-400 truncate">{item.sub}</p>
                </div>
                <span className="text-[8px] font-bold text-slate-300 whitespace-nowrap shrink-0 mt-0.5">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Quick Actions + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest mb-5">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.04 }}
                  className={`p-4 border ${action.border} ${action.bg} rounded-2xl hover:shadow-md transition-all cursor-pointer group text-center`}
                >
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mx-auto mb-2.5 shadow-sm group-hover:scale-110 transition-transform">
                    <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${action.color}`}>{action.label}</p>
                  <p className="text-[8px] font-bold text-slate-400 mt-0.5">{action.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54 }}
          className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest">System Status</h2>
            <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[8px] font-black text-emerald-600 uppercase tracking-widest">
              4/5 Live
            </span>
          </div>
          <div className="space-y-2.5">
            {STATUS_ITEMS.map((item, i) => (
              <StatusRow key={i} icon={item.icon} status={item.status} label={item.label} />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function MiniKPI({ label, value, icon: Icon, highlight }: { label: string; value: string; icon: React.ElementType; highlight?: boolean }) {
  return (
    <div className={`px-4 py-3 rounded-2xl border text-center ${highlight ? "bg-[#04a1c6]/10 border-[#04a1c6]/20" : "bg-white/5 border-white/10"}`}>
      <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${highlight ? "text-[#04a1c6]" : "text-white/40"}`} />
      <p className={`text-base font-black ${highlight ? "text-[#04a1c6]" : "text-white"}`}>{value}</p>
      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

function StatusRow({ icon: Icon, status, label }: { icon: React.ElementType; status: "live" | "warning" | "error"; label: string }) {
  const cfg = {
    live: { dot: "bg-emerald-500", text: "text-slate-600", badge: "bg-emerald-50 text-emerald-600 border-emerald-100", badgeLabel: "Live", iconColor: "text-slate-400" },
    warning: { dot: "bg-amber-500 animate-pulse", text: "text-amber-700", badge: "bg-amber-50 text-amber-600 border-amber-100", badgeLabel: "Warning", iconColor: "text-amber-400" },
    error: { dot: "bg-rose-500 animate-pulse", text: "text-rose-700", badge: "bg-rose-50 text-rose-600 border-rose-100", badgeLabel: "Error", iconColor: "text-rose-400" },
  }[status];

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className={`w-3.5 h-3.5 shrink-0 ${cfg.iconColor}`} />
        <p className={`text-[10px] font-bold ${cfg.text} truncate`}>{label}</p>
      </div>
      <span className={`shrink-0 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${cfg.badge}`}>
        {cfg.badgeLabel}
      </span>
    </div>
  );
}
