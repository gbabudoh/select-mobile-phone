"use client";
import React, { useState } from "react";
import { DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight, Download, Filter, TrendingUp, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const STATUSES = ["ALL", "COMPLETED", "PAYMENT_HELD", "PROCESSING", "SHIPPED", "DISPUTED", "REFUNDED"] as const;

const statusConfig: Record<string, { color: string; bg: string }> = {
  COMPLETED: { color: "text-emerald-600", bg: "bg-emerald-50" },
  PAYMENT_HELD: { color: "text-amber-600", bg: "bg-amber-50" },
  PROCESSING: { color: "text-blue-600", bg: "bg-blue-50" },
  SHIPPED: { color: "text-cyan-600", bg: "bg-cyan-50" },
  DISPUTED: { color: "text-rose-600", bg: "bg-rose-50" },
  REFUNDED: { color: "text-slate-600", bg: "bg-slate-100" },
  DELIVERED: { color: "text-emerald-600", bg: "bg-emerald-50" },
  PENDING_PAYMENT: { color: "text-amber-600", bg: "bg-amber-50" },
};

interface Transaction {
  id: string;
  orderType: string;
  buyer: { name: string; email: string };
  seller: { name: string; email: string };
  totalAmount: number;
  status: string;
  createdAt: string;
  escrow?: { status: string; amount: number };
}

interface PaymentOverview {
  gmv: number;
  completedOrders: number;
  totalPlatformRevenue: number;
  escrowHoldings: number;
  escrowCount: number;
  commissionEarned: number;
  bountyFees: number;
  taxCollected: number;
}



const MOCK_OVERVIEW = {
  gmv: 4289750, completedOrders: 7621, escrowHoldings: 1432500, escrowCount: 284,
  commissionEarned: 214487, bountyFees: 42890, taxCollected: 187432, totalPlatformRevenue: 257377,
};

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [period, setPeriod] = useState("30");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [overview, setOverview] = useState<PaymentOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPayments = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      params.append("period", period);
      
      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const data = await res.json();
      if (data.transactions) setTransactions(data.transactions);
      if (data.overview) setOverview(data.overview);
    } catch (err) {
      console.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, period, loading, setLoading]);

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filtered = transactions;
  const stats = overview || MOCK_OVERVIEW;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Payment Monitoring</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transaction oversight, escrow management, and revenue tracking</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#dcdcdc] text-[#0f172a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Gross Merchandise Value", value: `$${(stats.gmv / 1000000).toFixed(2)}M`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50", trend: "+12.4%", up: true },
          { label: "Platform Revenue", value: `$${(stats.totalPlatformRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: "text-[#04a1c6]", bg: "bg-cyan-50", trend: "+8.7%", up: true },
          { label: "Escrow Holdings", value: `$${(stats.escrowHoldings / 1000000).toFixed(2)}M`, icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50", trend: `${stats.escrowCount} active`, up: true },
          { label: "Commission Earned", value: `$${(stats.commissionEarned / 1000).toFixed(1)}K`, icon: CreditCard, color: "text-violet-500", bg: "bg-violet-50", trend: "+15.2%", up: true },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 bg-white border border-[#dcdcdc] rounded-2xl shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <stat.icon className={`w-16 h-16 ${stat.color}`} />
            </div>
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center border border-white`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="mt-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-black text-[#0f172a]">{stat.value}</p>
                <span className={`flex items-center gap-0.5 text-[10px] font-black ${stat.up ? "text-emerald-500" : "text-rose-500"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-[#dcdcdc] rounded-2xl shadow-sm p-6">
          <h3 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest mb-5">Select Mobile Revenue Tracker</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Commission (5%)</span>
              </div>
              <span className="text-sm font-black text-[#0f172a]">${(stats.commissionEarned / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bounty Fees</span>
              </div>
              <span className="text-sm font-black text-[#0f172a]">${(stats.bountyFees / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tax Collected</span>
              </div>
              <span className="text-sm font-black text-[#0f172a]">${(stats.taxCollected / 1000).toFixed(1)}K</span>
            </div>
            <div className="border-t border-[#dcdcdc] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Net Revenue</span>
                <span className="text-xl font-black text-[#04a1c6]">${(stats.totalPlatformRevenue / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
          {/* Visual bar */}
          <div className="mt-5">
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
              <motion.div initial={{ width: 0 }} animate={{ width: "52%" }} transition={{ duration: 0.8 }} className="bg-emerald-500" title="Commission" />
              <motion.div initial={{ width: 0 }} animate={{ width: "11%" }} transition={{ duration: 0.8, delay: 0.1 }} className="bg-cyan-500" title="Bounty" />
              <motion.div initial={{ width: 0 }} animate={{ width: "37%" }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-slate-300" title="Tax" />
            </div>
          </div>
        </motion.div>

        {/* Escrow Overview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white border border-[#dcdcdc] rounded-2xl shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Escrow Status Distribution</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Holding", value: 284, total: "$1.4M", color: "bg-amber-500" },
              { label: "Released", value: 7621, total: "$3.8M", color: "bg-emerald-500" },
              { label: "Refunded", value: 486, total: "$245K", color: "bg-blue-500" },
              { label: "Disputed", value: 38, total: "$19K", color: "bg-rose-500" },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50/50 border border-[#dcdcdc] rounded-xl text-center">
                <div className={`w-3 h-3 rounded-full ${item.color} mx-auto mb-2`} />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-lg font-black text-[#0f172a] mt-1">{item.value.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-[#04a1c6]">{item.total}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transaction Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Recent Transactions</h3>
          <div className="flex items-center gap-1 bg-white border border-[#dcdcdc] rounded-xl p-1 shadow-sm overflow-x-auto">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest cursor-pointer whitespace-nowrap transition-all ${
                  statusFilter === s ? "bg-[#0f172a] text-white" : "text-slate-400 hover:text-[#0f172a]"
                }`}
              >
                {s === "ALL" ? "All" : s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#dcdcdc] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#dcdcdc]">
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Order</th>
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Buyer</th>
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Seller</th>
                <th className="text-right px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Escrow</th>
                <th className="text-right px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx: Transaction, i: number) => (
                <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-3 h-3 text-slate-300" />
                      <span className="text-xs font-extrabold text-[#0f172a]">{tx.id.slice(0, 8)}</span>
                      {tx.orderType === "PREORDER" && <span className="text-[7px] font-black text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded uppercase">Pre</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-bold text-slate-600">{tx.buyer?.name}</td>
                  <td className="px-5 py-3 text-xs font-bold text-slate-600">{tx.seller?.name}</td>
                  <td className="px-5 py-3 text-right text-sm font-black text-[#0f172a]">${tx.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${statusConfig[tx.status]?.bg} ${statusConfig[tx.status]?.color}`}>
                      {tx.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      tx.escrow?.status === "HOLDING" ? "bg-amber-50 text-amber-600" :
                      tx.escrow?.status === "RELEASED_TO_SELLER" ? "bg-emerald-50 text-emerald-600" :
                      tx.escrow?.status === "REFUNDED_TO_BUYER" ? "bg-blue-50 text-blue-600" :
                      "bg-rose-50 text-rose-600"
                    }`}>{tx.escrow?.status ? tx.escrow.status.replace(/_/g, " ") : "N/A"}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-[10px] font-bold text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-slate-50/50 border-t border-[#dcdcdc] text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {filtered.length} transactions
          </div>
        </div>
      </div>
    </div>
  );
}
