"use client";
import React, { useState } from "react";
import {
  DollarSign, TrendingUp, Download, ArrowUpRight,
  ArrowDownRight, Users, CreditCard, Wallet,
  BarChart3, PieChart, Calendar, Clock,
  Check, Info, X, FileSpreadsheet,
  CircleDollarSign, Landmark, Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
interface RevenueEntry {
  id: string;
  source: string;
  type: "Activation" | "Subscription" | "Referral" | "Commission" | "Overage";
  amount: string;
  amountNum: number;
  date: string;
  status: "Completed" | "Pending" | "Processing";
  plan: string;
  subscriber: string;
}

// --- Mock Data ---
const MOCK_REVENUE: RevenueEntry[] = [
  { id: "TXN-001", source: "Plan Activation", type: "Activation", amount: "+$89.00", amountNum: 89, date: "Mar 2, 2026", status: "Completed", plan: "5G Unlimited Max", subscriber: "Marcus Chen" },
  { id: "TXN-002", source: "Monthly Subscription", type: "Subscription", amount: "+$65.00", amountNum: 65, date: "Mar 1, 2026", status: "Completed", plan: "5G Standard Plus", subscriber: "Sarah Jenkins" },
  { id: "TXN-003", source: "Referral Bonus", type: "Referral", amount: "+$25.00", amountNum: 25, date: "Mar 1, 2026", status: "Completed", plan: "Prepaid Value 20", subscriber: "Elena Rodriguez" },
  { id: "TXN-004", source: "Data Overage Fee", type: "Overage", amount: "+$12.50", amountNum: 12.5, date: "Feb 28, 2026", status: "Completed", plan: "Data-Only 50GB", subscriber: "David Park" },
  { id: "TXN-005", source: "Plan Activation", type: "Activation", amount: "+$120.00", amountNum: 120, date: "Feb 28, 2026", status: "Completed", plan: "Family Share Unlimited", subscriber: "Kevin O'Brien" },
  { id: "TXN-006", source: "Platform Commission", type: "Commission", amount: "+$340.00", amountNum: 340, date: "Feb 27, 2026", status: "Completed", plan: "Bulk Activation (x8)", subscriber: "TechDistro Inc." },
  { id: "TXN-007", source: "Monthly Subscription", type: "Subscription", amount: "+$45.00", amountNum: 45, date: "Feb 27, 2026", status: "Processing", plan: "Data-Only 50GB", subscriber: "Ahmed Hassan" },
  { id: "TXN-008", source: "Referral Bonus", type: "Referral", amount: "+$25.00", amountNum: 25, date: "Feb 26, 2026", status: "Pending", plan: "IoT Connect", subscriber: "Diana Morales" },
  { id: "TXN-009", source: "Plan Activation", type: "Activation", amount: "+$30.00", amountNum: 30, date: "Feb 25, 2026", status: "Completed", plan: "Prepaid Value 20", subscriber: "Lisa Thompson" },
  { id: "TXN-010", source: "Monthly Subscription", type: "Subscription", amount: "+$89.00", amountNum: 89, date: "Feb 25, 2026", status: "Completed", plan: "5G Unlimited Max", subscriber: "James Wilson" },
];

const MONTHLY_REVENUE = [
  { month: "Sep", amount: 42800 },
  { month: "Oct", amount: 51200 },
  { month: "Nov", amount: 48900 },
  { month: "Dec", amount: 62100 },
  { month: "Jan", amount: 58700 },
  { month: "Feb", amount: 67400 },
];

const typeConfig = {
  Activation: { bg: "bg-blue-50", text: "text-blue-600", icon: Wallet },
  Subscription: { bg: "bg-emerald-50", text: "text-emerald-600", icon: CreditCard },
  Referral: { bg: "bg-violet-50", text: "text-violet-600", icon: Users },
  Commission: { bg: "bg-amber-50", text: "text-amber-600", icon: CircleDollarSign },
  Overage: { bg: "bg-rose-50", text: "text-rose-600", icon: BarChart3 },
};

const statusConfig = {
  Completed: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600" },
  Processing: { dot: "bg-blue-400", bg: "bg-blue-50", text: "text-blue-600" },
  Pending: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-600" },
};

export default function NetworkProviderRevenuePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [toasts, setToasts] = useState<{id: number; msg: string; type: "success" | "error" | "info"}[]>([]);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const filteredRevenue = activeTab === "All"
    ? MOCK_REVENUE
    : MOCK_REVENUE.filter(r => r.type === activeTab);

  const totalRevenue = "$67,400";
  const monthlyGrowth = "+14.8%";
  const totalTransactions = MOCK_REVENUE.length;
  const pendingAmount = "$70.00";
  const maxMonthly = Math.max(...MONTHLY_REVENUE.map(m => m.amount));

  // --- Export Logic ---
  const prepareExportData = () => {
    return filteredRevenue.map(txn => ({
      "Transaction ID": txn.id,
      "Source": txn.source,
      "Type": txn.type,
      "Subscriber": txn.subscriber,
      "Plan": txn.plan,
      "Amount": txn.amount,
      "Status": txn.status,
      "Date": txn.date
    }));
  };

  const handleExportExcel = () => {
    addToast("Generating Excel report...", "info");
    try {
      const data = prepareExportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Revenue");
      XLSX.writeFile(wb, "Network_Provider_Revenue_Report.xlsx");
      addToast("Excel report exported successfully!", "success");
    } catch (error) {
      console.error("Excel Export Error:", error);
      addToast("Failed to export Excel file", "error");
    }
  };

  const handleExportPDF = () => {
    addToast("Generating revenue statement PDF...", "info");
    try {
      const doc = new jsPDF("landscape");
      const data = prepareExportData();

      const tableColumn = ["ID", "Source", "Type", "Subscriber", "Plan", "Amount", "Status", "Date"];
      const tableRows = data.map(item => [
        item["Transaction ID"], item.Source, item.Type, item.Subscriber,
        item.Plan, item.Amount, item.Status, item.Date
      ]);

      doc.setFontSize(18);
      doc.text("Network Provider — Revenue Statement", 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Period: February 2026 | Total Revenue: $67,400.00`, 14, 36);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 44,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [15, 23, 42] }
      });

      doc.save("Network_Provider_Revenue_Statement.pdf");
      addToast("Revenue statement exported successfully!", "success");
    } catch (error) {
      console.error("PDF Export Error:", error);
      addToast("Failed to export PDF statement", "error");
    }
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
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Revenue Analytics</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Track activations, subscriptions, referrals, and commissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-[#dcdcdc] rounded-xl font-bold text-[11px] text-[#0f172a] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" /> Statements
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-5 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Analytics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: totalRevenue, sub: "February 2026", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50", trend: monthlyGrowth, trendUp: true },
          { label: "Monthly Growth", value: monthlyGrowth, sub: "vs. January", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50", trend: "+$8,700", trendUp: true },
          { label: "Transactions", value: totalTransactions.toString(), sub: "This period", icon: Receipt, color: "text-violet-500", bg: "bg-violet-50", trend: "+12", trendUp: true },
          { label: "Pending Payouts", value: pendingAmount, sub: "2 transactions", icon: Clock, color: "text-amber-500", bg: "bg-amber-50", trend: "Processing", trendUp: false }
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
            <div className="flex items-center gap-1.5 mt-2">
              {stat.trendUp ? (
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-amber-500" />
              )}
              <span className={`text-[9px] font-bold uppercase tracking-widest ${stat.trendUp ? "text-emerald-500" : "text-amber-500"}`}>{stat.trend}</span>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-[#dcdcdc] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wide">Revenue Trend</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Last 6 months</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-[#dcdcdc]">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sep 2025 — Feb 2026</span>
            </div>
          </div>
        </div>
        
        {/* Bar Chart */}
        <div className="flex items-end gap-4 h-48 px-2">
          {MONTHLY_REVENUE.map((m, idx) => {
            const heightPercent = (m.amount / maxMonthly) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  ${(m.amount / 1000).toFixed(1)}K
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-xl group-hover:from-blue-600 group-hover:to-blue-500 transition-colors relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Breakdown + Transaction List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue Breakdown - Left Side */}
        <div className="bg-white border border-[#dcdcdc] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-4 h-4 text-blue-500" />
            <h3 className="text-[11px] font-black text-[#0f172a] uppercase tracking-widest">Revenue Breakdown</h3>
          </div>
          <div className="space-y-3">
            {[
              { type: "Subscriptions", amount: "$38,200", percent: "57%", color: "bg-emerald-500" },
              { type: "Activations", amount: "$15,400", percent: "23%", color: "bg-blue-500" },
              { type: "Commissions", amount: "$8,900", percent: "13%", color: "bg-amber-500" },
              { type: "Referrals", amount: "$3,200", percent: "5%", color: "bg-violet-500" },
              { type: "Overages", amount: "$1,700", percent: "2%", color: "bg-rose-500" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#0f172a]">{item.amount}</span>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{item.percent}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.percent }}
                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[#dcdcdc]/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</span>
              <span className="text-base font-black text-[#0f172a]">$67,400</span>
            </div>
          </div>
        </div>

        {/* Transaction List - Right Side */}
        <div className="xl:col-span-2 bg-white border border-[#dcdcdc] rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Bar */}
          <div className="px-5 pt-4 pb-2 border-b border-[#dcdcdc]/50 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {["All", "Activation", "Subscription", "Referral", "Commission", "Overage"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? "bg-[#0f172a] text-white shadow-md" : "text-slate-400 hover:text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Transaction Rows */}
          <div className="divide-y divide-[#dcdcdc]/50">
            {filteredRevenue.map((txn, idx) => {
              const typeStyle = typeConfig[txn.type];
              const statusStyle = statusConfig[txn.status];
              const TypeIcon = typeStyle.icon;

              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className={`p-2.5 rounded-xl ${typeStyle.bg} ${typeStyle.text} shrink-0`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[11px] font-black text-[#0f172a] uppercase tracking-wide truncate">{txn.source}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${typeStyle.bg} ${typeStyle.text}`}>{txn.type}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {txn.subscriber} · {txn.plan}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-emerald-600">{txn.amount}</p>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${statusStyle.text}`}>{txn.status}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest shrink-0 hidden sm:block">{txn.date}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payout Summary Footer */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Landmark className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Payout</p>
              <p className="text-sm font-black text-[#0f172a]">$67,400.00 · Scheduled Mar 15, 2026 · Chase Business ••4821</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Auto-Deposit Enabled</span>
          </div>
        </div>
      </div>

    </div>
  );
}
