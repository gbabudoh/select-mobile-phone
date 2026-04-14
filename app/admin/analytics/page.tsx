"use client";
import { useState } from "react";
import {
  Users, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight,
  ArrowDownRight, ShieldAlert, BadgeCheck, Trophy,
  Layers, CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const PERIODS = [
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "90D", value: "90" },
  { label: "1Y", value: "365" },
];

const MOCK_ANALYTICS = {
  overview: {
    totalUsers: 12847, newUsers: 342, totalOrders: 8429, recentOrders: 1256,
    totalListings: 4218, gmv: 4289750, avgOrderValue: 509, completedOrders: 7621,
    escrowHoldings: 1432500, escrowCount: 284,
  },
  usersByRole: [
    { role: "BUYER", count: 8934, color: "bg-slate-400", light: "bg-slate-50", text: "text-slate-600" },
    { role: "INDIVIDUAL SELLER", count: 1842, color: "bg-violet-500", light: "bg-violet-50", text: "text-violet-700" },
    { role: "RETAILER", count: 1295, color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700" },
    { role: "WHOLESALER", count: 546, color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700" },
    { role: "NETWORK PROVIDER", count: 230, color: "bg-cyan-500", light: "bg-cyan-50", text: "text-cyan-700" },
  ],
  topSellers: [
    { name: "Marcus Chen", role: "WHOLESALER", orders: 847, revenue: 425890, roleColor: "text-blue-600", roleBg: "bg-blue-50" },
    { name: "Sarah Jenkins", role: "RETAILER", orders: 632, revenue: 318400, roleColor: "text-indigo-600", roleBg: "bg-indigo-50" },
    { name: "Ling Zhao", role: "NETWORK PROVIDER", orders: 421, revenue: 89250, roleColor: "text-cyan-600", roleBg: "bg-cyan-50" },
    { name: "Kevin O'Brien", role: "INDIVIDUAL SELLER", orders: 156, revenue: 78500, roleColor: "text-violet-600", roleBg: "bg-violet-50" },
    { name: "Ahmed Hassan", role: "NETWORK PROVIDER", orders: 98, revenue: 42100, roleColor: "text-cyan-600", roleBg: "bg-cyan-50" },
  ],
  commission: { totalCommission: 214487, totalBountyFees: 42890 },
  funnel: [
    { label: "Orders Placed", value: 8429, pct: 100, color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
    { label: "Completed", value: 7621, pct: 90, color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-600" },
    { label: "In Escrow", value: 284, pct: 34, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
    { label: "Disputed", value: 18, pct: 2, color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-600" },
  ],
};

// Chart data per period
const CHART_DATA: Record<string, { label: string; gmv: number; orders: number }[]> = {
  "7": [
    { label: "Mon", gmv: 52, orders: 48 },
    { label: "Tue", gmv: 78, orders: 65 },
    { label: "Wed", gmv: 44, orders: 38 },
    { label: "Thu", gmv: 91, orders: 82 },
    { label: "Fri", gmv: 67, orders: 60 },
    { label: "Sat", gmv: 35, orders: 29 },
    { label: "Sun", gmv: 28, orders: 22 },
  ],
  "30": [
    { label: "W1", gmv: 64, orders: 55 },
    { label: "W2", gmv: 80, orders: 70 },
    { label: "W3", gmv: 59, orders: 48 },
    { label: "W4", gmv: 88, orders: 79 },
  ],
  "90": [
    { label: "Jan", gmv: 55, orders: 50 },
    { label: "Feb", gmv: 72, orders: 63 },
    { label: "Mar", gmv: 88, orders: 80 },
  ],
  "365": [
    { label: "Q1", gmv: 62, orders: 55 },
    { label: "Q2", gmv: 75, orders: 68 },
    { label: "Q3", gmv: 84, orders: 77 },
    { label: "Q4", gmv: 91, orders: 83 },
  ],
};

const RANK_STYLE = [
  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "🥇" },
  { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", icon: "🥈" },
  { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-200", icon: "🥉" },
  { bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-100", icon: "" },
  { bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-100", icon: "" },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30");
  const data = MOCK_ANALYTICS;
  const chartBars = CHART_DATA[period];
  const maxRevenue = Math.max(...data.topSellers.map((s) => s.revenue));

  const kpis = [
    {
      label: "Gross Merchandise Value", value: `$${(data.overview.gmv / 1000).toFixed(0)}K`,
      icon: DollarSign, accent: "from-emerald-500 to-emerald-600", light: "bg-emerald-50", iconColor: "text-emerald-500",
      trend: "+12.4%", up: true, sub: "vs. last period",
    },
    {
      label: "Total Orders", value: data.overview.totalOrders.toLocaleString(),
      icon: ShoppingCart, accent: "from-blue-500 to-blue-600", light: "bg-blue-50", iconColor: "text-blue-500",
      trend: "+8.2%", up: true, sub: "vs. last period",
    },
    {
      label: "Total Users", value: data.overview.totalUsers.toLocaleString(),
      icon: Users, accent: "from-violet-500 to-violet-600", light: "bg-violet-50", iconColor: "text-violet-500",
      trend: "+15.1%", up: true, sub: "vs. last period",
    },
    {
      label: "Avg. Order Value", value: `$${data.overview.avgOrderValue}`,
      icon: TrendingUp, accent: "from-amber-400 to-amber-500", light: "bg-amber-50", iconColor: "text-amber-500",
      trend: "-2.1%", up: false, sub: "vs. last period",
    },
  ];

  const totalRevenue = data.commission.totalCommission + data.commission.totalBountyFees;
  const revenueSegments = [
    { label: "Commission", value: data.commission.totalCommission, color: "bg-emerald-500", text: "text-emerald-600" },
    { label: "Bounty Fees", value: data.commission.totalBountyFees, color: "bg-cyan-500", text: "text-cyan-600" },
    { label: "Escrow Holdings", value: data.overview.escrowHoldings, color: "bg-amber-500", text: "text-amber-600" },
  ];
  const revenueTotal = revenueSegments.reduce((s, r) => s + r.value, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1526] uppercase tracking-tight">Platform Analytics</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Performance metrics · User growth · Revenue insights
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                period === p.value
                  ? "bg-[#0d1526] text-white shadow-sm"
                  : "text-slate-400 hover:text-[#0d1526] hover:bg-slate-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`h-1 w-full bg-linear-to-r ${kpi.accent}`} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl ${kpi.light} flex items-center justify-center`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-1 rounded-lg ${
                  kpi.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                }`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </span>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-[#0d1526]">{kpi.value}</p>
              <p className="text-[9px] font-bold text-slate-300 mt-1">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* GMV Trend Chart */}
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest">GMV & Orders Trend</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gross merchandise value vs order volume</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#04a1c6] inline-block" /> GMV
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-violet-400 inline-block" /> Orders
              </span>
            </div>
          </div>

          {/* Y-axis labels + bars */}
          <div className="flex gap-3">
            {/* Y labels */}
            <div className="flex flex-col justify-between h-44 text-right pr-2 shrink-0">
              {["100%", "75%", "50%", "25%", "0%"].map((l) => (
                <span key={l} className="text-[8px] font-bold text-slate-300">{l}</span>
              ))}
            </div>
            {/* Chart area */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full border-t border-slate-100" />
                ))}
              </div>
              {/* Bars */}
              <div className="relative flex items-end gap-2 h-44 z-10">
                {chartBars.map((bar, i) => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5 h-40">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                        style={{ height: `${bar.gmv}%`, transformOrigin: "bottom" }}
                        className="flex-1 bg-[#04a1c6] rounded-t-md hover:bg-[#0389aa] transition-colors cursor-pointer group/bar relative"
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0d1526] text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 whitespace-nowrap transition-opacity">
                          {bar.gmv}%
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                        style={{ height: `${bar.orders}%`, transformOrigin: "bottom" }}
                        className="flex-1 bg-violet-400 rounded-t-md hover:bg-violet-500 transition-colors cursor-pointer"
                      />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <h3 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest mb-1">Order Pipeline</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">Conversion through lifecycle stages</p>
          <div className="space-y-4">
            {data.funnel.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-[10px] font-black text-[#0d1526] uppercase tracking-widest">{stage.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#0d1526]">{stage.value.toLocaleString()}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${stage.light} ${stage.text}`}>{stage.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.42 + i * 0.08 }}
                    className={`h-full ${stage.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Completion rate callout */}
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Completion Rate</span>
            </div>
            <p className="text-2xl font-black text-emerald-600">90.4%</p>
            <p className="text-[9px] font-bold text-emerald-500/70 mt-0.5">Orders reaching completion</p>
          </div>
        </motion.div>
      </div>

      {/* Revenue + Users by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest">Revenue Breakdown</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Platform income streams</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-lg font-black text-[#0d1526]">${(totalRevenue / 1000).toFixed(1)}K</p>
            </div>
          </div>

          {/* Stacked bar */}
          <div className="h-4 w-full flex rounded-xl overflow-hidden mb-6 gap-0.5">
            {revenueSegments.map((seg) => (
              <motion.div
                key={seg.label}
                initial={{ flex: 0 }}
                animate={{ flex: seg.value / revenueTotal }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.45 }}
                className={`${seg.color} first:rounded-l-xl last:rounded-r-xl`}
              />
            ))}
          </div>

          <div className="space-y-3">
            {revenueSegments.map((seg) => {
              const pct = ((seg.value / revenueTotal) * 100).toFixed(1);
              return (
                <div key={seg.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-sm ${seg.color}`} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{seg.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg bg-slate-50 ${seg.text}`}>{pct}%</span>
                    <span className="text-sm font-black text-[#0d1526] w-16 text-right">${(seg.value / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-[#0d1526] uppercase tracking-widest">Platform Revenue (excl. escrow)</span>
            <span className="text-xl font-black text-[#04a1c6]">${(totalRevenue / 1000).toFixed(1)}K</span>
          </div>
        </motion.div>

        {/* Users by Role */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest">Users by Role</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Registered account distribution</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-lg font-black text-[#0d1526]">{data.overview.totalUsers.toLocaleString()}</p>
            </div>
          </div>

          {/* Role stacked bar */}
          <div className="h-4 w-full flex rounded-xl overflow-hidden mb-6 gap-0.5">
            {data.usersByRole.map((role) => (
              <motion.div
                key={role.role}
                initial={{ flex: 0 }}
                animate={{ flex: role.count / data.overview.totalUsers }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.48 }}
                className={`${role.color} first:rounded-l-xl last:rounded-r-xl`}
              />
            ))}
          </div>

          <div className="space-y-3">
            {data.usersByRole.map((item) => {
              const pct = ((item.count / data.overview.totalUsers) * 100).toFixed(1);
              return (
                <div key={item.role}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${item.light} ${item.text}`}>
                        {item.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold text-slate-400">{pct}%</span>
                      <span className="text-sm font-black text-[#0d1526] w-14 text-right">{item.count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Sellers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[11px] font-black text-[#0d1526] uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Top Sellers
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ranked by total revenue generated</p>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-300">
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> Orders</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Revenue</span>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {data.topSellers.map((seller, i) => {
            const revPct = (seller.revenue / maxRevenue) * 100;
            const rank = RANK_STYLE[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="px-6 py-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border text-sm font-black shrink-0 ${rank.bg} ${rank.text} ${rank.border}`}>
                    {rank.icon || <span className="text-[10px]">{i + 1}</span>}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-[#0d1526] flex items-center justify-center font-black text-white text-sm shrink-0">
                    {seller.name.charAt(0)}
                  </div>

                  {/* Name + role */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-sm text-[#0d1526] truncate">{seller.name}</p>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${seller.roleBg} ${seller.roleColor} shrink-0`}>
                        {seller.role}
                      </span>
                    </div>
                    {/* Revenue bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${revPct}%` }}
                          transition={{ duration: 0.9, delay: 0.6 + i * 0.07 }}
                          className={`h-full rounded-full ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-orange-400" : "bg-slate-300"}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Orders</p>
                      <p className="text-sm font-black text-[#0d1526]">{seller.orders.toLocaleString()}</p>
                    </div>
                    <div className="text-right min-w-20">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                      <p className="text-sm font-black text-[#04a1c6]">${seller.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer summary */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <BadgeCheck className="w-3.5 h-3.5 text-[#04a1c6]" />
            Top 5 sellers account for{" "}
            <span className="text-[#0d1526]">
              {((data.topSellers.reduce((s, x) => s + x.revenue, 0) / data.overview.gmv) * 100).toFixed(1)}%
            </span>{" "}
            of total GMV
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-[#04a1c6] uppercase tracking-widest">
            <ShieldAlert className="w-3 h-3" />
            {data.topSellers.reduce((s, x) => s + x.orders, 0).toLocaleString()} combined orders
          </div>
        </div>
      </motion.div>

    </div>
  );
}
