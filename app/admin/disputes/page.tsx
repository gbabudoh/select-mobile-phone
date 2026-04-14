"use client";
import React, { useState } from "react";
import { ShieldAlert, MessageSquare, DollarSign, Clock, AlertCircle, CheckCircle, XCircle, Send, ArrowRight, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = ["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED_REFUND", "RESOLVED_RELEASE", "CLOSED"] as const;

const statusConfig: Record<string, { color: string; bg: string }> = {
  OPEN: { color: "text-rose-600", bg: "bg-rose-50" },
  UNDER_REVIEW: { color: "text-amber-600", bg: "bg-amber-50" },
  RESOLVED_REFUND: { color: "text-blue-600", bg: "bg-blue-50" },
  RESOLVED_RELEASE: { color: "text-emerald-600", bg: "bg-emerald-50" },
  CLOSED: { color: "text-slate-500", bg: "bg-slate-50" },
};

interface DisputeMessage {
  id: string;
  senderId: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

interface AdminDispute {
  id: string;
  orderId: string;
  raisedById: string;
  defendingId: string;
  status: string;
  reason: string;
  description: string;
  createdAt: string;
  raisedBy: { name: string; email: string };
  defending: { name: string; email: string };
  order: { orderNumber: string; totalAmount: number };
  messages: DisputeMessage[];
  _count: { messages: number };
}

const MOCK_DISPUTES: AdminDispute[] = []; // Cleanup: Previous mock data was incompatible with new interface structure

export default function AdminDisputesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const fetchDisputes = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      
      const res = await fetch(`/api/admin/disputes?${params.toString()}`);
      const data = await res.json();
      if (data.disputes) setDisputes(data.disputes);
    } catch (err) {
      console.error("Failed to fetch disputes");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, loading]);

  React.useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const filtered = disputes;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Dispute Management</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review, mediate, and resolve buyer–seller disputes</p>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-1 overflow-x-auto bg-white border border-[#dcdcdc] rounded-2xl p-1.5 shadow-sm">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === s ? "bg-[#0f172a] text-white shadow-lg" : "text-slate-400 hover:text-[#0f172a] hover:bg-slate-50"
            }`}
          >
            {s === "ALL" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Dispute List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((dispute: AdminDispute) => (
              <motion.div
                key={dispute.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedDispute(dispute)}
                className={`p-4 bg-white border rounded-2xl cursor-pointer transition-all ${
                  selectedDispute?.id === dispute.id
                    ? "border-[#04a1c6] shadow-lg shadow-[#04a1c6]/5"
                    : "border-[#dcdcdc] hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${statusConfig[dispute.status]?.bg} ${statusConfig[dispute.status]?.color}`}>
                    {dispute.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(dispute.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-extrabold text-sm text-[#0f172a] mb-1">{dispute.raisedBy?.name} vs {dispute.defending?.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span>Order {dispute.order?.orderNumber || dispute.orderId.slice(0, 8)}</span>
                  <span className="text-[#04a1c6] font-black">${dispute.order?.totalAmount?.toFixed(2) || "0.00"}</span>
                </p>
                <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                  <MessageSquare className="w-3 h-3" /> {dispute._count?.messages || 0} messages
                </p>
              </motion.div>
            ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center">
              <ShieldAlert className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No disputes found</p>
            </div>
          )}
        </div>

        {/* Dispute Detail */}
        <div className="lg:col-span-3">
          {selectedDispute ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#dcdcdc] rounded-3xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-[#dcdcdc]">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${statusConfig[selectedDispute.status]?.bg} ${statusConfig[selectedDispute.status]?.color}`}>
                    {selectedDispute.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{selectedDispute.id}</span>
                </div>
                <h3 className="font-black text-lg text-[#0f172a] uppercase tracking-tight">{selectedDispute.raisedBy?.name} vs {selectedDispute.defending?.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order {selectedDispute.order?.orderNumber || selectedDispute.orderId.slice(0, 8)}</span>
                  <span className="text-[10px] font-black text-[#04a1c6] uppercase tracking-widest flex items-center gap-1"><DollarSign className="w-3 h-3" /> {selectedDispute.order?.totalAmount?.toFixed(2) || "0.00"} at stake</span>
                </div>
              </div>

              {/* Reason & Description */}
              <div className="p-6 border-b border-[#dcdcdc]">
                <div className="flex items-start gap-3 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">{selectedDispute.reason.replace(/_/g, " ")}</p>
                    <p className="text-sm text-rose-600/70">{selectedDispute.description}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 border-b border-[#dcdcdc] max-h-80 overflow-y-auto space-y-4">
                {selectedDispute.messages?.map((msg: { id: string; isAdmin: boolean; content: string; senderId: string; createdAt: string }) => (
                  <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.isAdmin ? "bg-[#0f172a] text-white" : "bg-slate-50 border border-[#dcdcdc]"
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${msg.isAdmin ? "text-[#04a1c6]" : "text-[#0f172a]"}`}>
                          {msg.isAdmin ? "Admin" : (msg.senderId === selectedDispute.raisedById ? selectedDispute.raisedBy?.name : selectedDispute.defending?.name)}
                        </span>
                        <span className={`text-[8px] font-bold ${msg.isAdmin ? "text-white/40" : "text-slate-400"}`}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className={`text-sm ${msg.isAdmin ? "text-white/80" : "text-slate-600"}`}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Message Input */}
              <div className="p-4 border-b border-[#dcdcdc]">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Write admin response..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 transition-all"
                  />
                  <button className="p-2.5 bg-[#0f172a] text-white rounded-xl hover:bg-[#04a1c6] transition-all cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Resolution Actions */}
              {(selectedDispute.status === "OPEN" || selectedDispute.status === "UNDER_REVIEW") && (
                <div className="p-6 bg-slate-50/50 flex items-center gap-3">
                  <button className="flex-1 py-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Under Review
                  </button>
                  <button className="flex-1 py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5" /> Refund Buyer
                  </button>
                  <button className="flex-1 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all cursor-pointer flex items-center justify-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" /> Release to Seller
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="border border-dashed border-[#dcdcdc] rounded-3xl flex flex-col items-center justify-center text-center p-12 h-full min-h-[500px]">
              <ShieldAlert className="w-14 h-14 text-slate-200 mb-4" />
              <h3 className="font-extrabold text-[#0f172a] mb-2 uppercase tracking-wide">Select a dispute</h3>
              <p className="text-[10px] font-bold text-slate-400 max-w-xs uppercase tracking-widest">Choose a dispute from the list to view details, messages, and take resolution actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
