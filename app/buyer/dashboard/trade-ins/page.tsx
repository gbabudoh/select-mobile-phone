"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight, Lock, CheckCircle, Plus, Clock,
  ChevronRight, ShieldCheck, Zap, X,
} from "lucide-react";
import Link from "next/link";

type TradeInStatus = "QUOTE_GIVEN" | "LOCKED_IN" | "APPROVED" | "COMPLETED" | "EXPIRED";

interface TradeInItem {
  id: string;
  device: string;
  condition: string;
  quotedValue: number;
  status: TradeInStatus;
  lockedUntil: string | null;
  linkedPreorder: string | null;
  createdAt: string;
}

const STATUS_MAP: Record<TradeInStatus, { label: string; color: string; icon: React.ReactNode }> = {
  QUOTE_GIVEN: { label: "Quote Given", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
  LOCKED_IN: { label: "Locked In", color: "bg-blue-100 text-blue-700", icon: <Lock className="w-3 h-3" /> },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
  COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle className="w-3 h-3" /> },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-500", icon: <Clock className="w-3 h-3" /> },
};

// Sample data — in production this would come from the API
const SAMPLE_TRADE_INS: TradeInItem[] = [
  {
    id: "TI-001",
    device: "iPhone 16 Pro 256GB",
    condition: "Like New",
    quotedValue: 380,
    status: "LOCKED_IN",
    lockedUntil: "Sep 15, 2026",
    linkedPreorder: "iPhone 18 Pro Max",
    createdAt: "Jun 17, 2026",
  },
  {
    id: "TI-002",
    device: "Galaxy S25 Ultra 512GB",
    condition: "Good",
    quotedValue: 280,
    status: "QUOTE_GIVEN",
    lockedUntil: null,
    linkedPreorder: null,
    createdAt: "Feb 28, 2026",
  },
];

const TRADE_DEVICES = [
  { name: "iPhone 17 Pro Max", base: 600 },
  { name: "iPhone 17 Pro", base: 520 },
  { name: "iPhone 16 Pro Max", base: 440 },
  { name: "iPhone 16 Pro", base: 380 },
  { name: "Galaxy S26 Ultra", base: 480 },
  { name: "Galaxy S25 Ultra", base: 350 },
  { name: "Pixel 10 Pro", base: 320 },
  { name: "Pixel 9 Pro", base: 220 },
];

const CONDITIONS = [
  { label: "Like New", multiplier: 1.0 },
  { label: "Good", multiplier: 0.8 },
  { label: "Fair", multiplier: 0.6 },
];

export default function TradeInsPage() {
  const [tradeIns] = useState<TradeInItem[]>(SAMPLE_TRADE_INS);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [condition, setCondition] = useState("");
  const [imei, setImei] = useState("");

  const device = TRADE_DEVICES.find((d) => d.name === selectedDevice);
  const cond = CONDITIONS.find((c) => c.label === condition);
  const baseValue = device && cond ? Math.round(device.base * cond.multiplier) : 0;

  const activeCount = tradeIns.filter((t) => t.status === "LOCKED_IN" || t.status === "APPROVED").length;
  const totalValue = tradeIns.reduce((sum, t) => sum + t.quotedValue, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Trade-Ins</h1>
          <p className="text-[#0f172a]/60 text-sm">
            Lock in your device&apos;s value months before a new launch.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/trade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#0f172a]/70 hover:bg-gray-50 cursor-pointer transition-colors">
              Public Page <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#04a1c6] text-white text-sm font-semibold cursor-pointer shadow-lg shadow-[#04a1c6]/20 hover:shadow-[#04a1c6]/40 transition-all"
          >
            <Plus className="w-4 h-4" /> New Trade-In
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-[#0f172a]/40 uppercase tracking-wider mb-1">Total Trade-Ins</p>
          <p className="text-2xl font-bold text-[#0f172a]">{tradeIns.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-[#0f172a]/40 uppercase tracking-wider mb-1">Active Locks</p>
          <p className="text-2xl font-bold text-[#04a1c6]">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-[#0f172a]/40 uppercase tracking-wider mb-1">Total Value</p>
          <p className="text-2xl font-bold text-emerald-600">${totalValue}</p>
        </div>
      </div>

      {/* New trade-in form */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#0f172a]">Get a Quote</h3>
                <button onClick={() => setShowNewForm(false)} className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer" aria-label="Close form">
                  <X className="w-4 h-4 text-[#0f172a]/40" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div>
                  <label htmlFor="dash-device" className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-1.5">Device</label>
                  <select
                    id="dash-device"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#0f172a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
                  >
                    <option value="">Select device...</option>
                    {TRADE_DEVICES.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-1.5">Condition</label>
                  <div className="flex gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c.label}
                        onClick={() => setCondition(c.label)}
                        aria-pressed={condition === c.label}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          condition === c.label
                            ? "bg-[#04a1c6] text-white"
                            : "bg-gray-50 border border-gray-200 text-[#0f172a]/60 hover:bg-gray-100"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="dash-imei" className="text-xs font-semibold uppercase tracking-wider text-[#0f172a]/40 block mb-1.5">IMEI (Optional)</label>
                  <input
                    id="dash-imei"
                    type="text"
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    placeholder="15-digit IMEI"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a] placeholder:text-[#0f172a]/30 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
                  />
                </div>
              </div>

              {baseValue > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#0f172a] text-white mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#04a1c6]/20 rounded-lg">
                      <Zap className="w-4 h-4 text-[#04a1c6]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">Estimated Value</p>
                      <p className="text-2xl font-black text-[#04a1c6]">${baseValue}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-[#04a1c6] text-white text-sm font-semibold cursor-pointer hover:bg-[#04a1c6]/90 transition-colors">
                      Lock In
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-white/20 text-white/70 text-sm font-medium cursor-pointer hover:bg-white/5 transition-colors">
                      Save Quote
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trade-in list */}
      <div className="space-y-4">
        {tradeIns.map((ti) => {
          const statusInfo = STATUS_MAP[ti.status];
          return (
            <div key={ti.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <ArrowLeftRight className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f172a]">{ti.device}</h3>
                    <p className="text-xs text-[#0f172a]/50">
                      {ti.condition} · Submitted {ti.createdAt}
                    </p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-gray-50">
                <div className="flex gap-6">
                  <span className="text-[#0f172a]/50">
                    Value: <span className="font-bold text-[#04a1c6] text-lg">${ti.quotedValue}</span>
                  </span>
                  {ti.lockedUntil && (
                    <span className="text-[#0f172a]/50">
                      Locked until: <span className="font-medium text-[#0f172a]">{ti.lockedUntil}</span>
                    </span>
                  )}
                </div>
                {ti.linkedPreorder && (
                  <span className="text-xs text-[#0f172a]/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Linked to preorder: {ti.linkedPreorder}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
