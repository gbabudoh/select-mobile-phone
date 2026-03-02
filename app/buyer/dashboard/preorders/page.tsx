"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Loader2, Rocket, ArrowLeftRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface PreorderItem {
  id: string;
  queuePosition: number;
  status: string;
  depositPaid: number;
  createdAt: string;
  campaign: {
    id: string;
    title: string;
    maxSlots: number | null;
    slotsFilled: number;
    depositAmount: number;
    estimatedShipDate: string | null;
    product: { name: string };
  };
  tradeIn?: {
    id: string;
    quotedValue: number;
    status: string;
    deviceCondition: string;
  } | null;
}

const STATUS_COLORS: Record<string, string> = {
  QUEUE_OPEN: "bg-yellow-100 text-yellow-700",
  DEPOSIT_PAID: "bg-green-100 text-green-700",
  ALLOCATED: "bg-blue-100 text-blue-700",
  READY_TO_SHIP: "bg-purple-100 text-purple-700",
  CONVERTED_TO_ORDER: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function PreordersPage() {
  const [preorders, setPreorders] = useState<PreorderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPreorders() {
      try {
        const res = await fetch("/api/preorders?mode=my");
        if (!res.ok) throw new Error("Failed to load preorders");
        const data = await res.json();
        setPreorders(data.preorders || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPreorders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#04a1c6]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Preorders</h1>
          <p className="text-[#0f172a]/60 text-sm">
            Track your queue position and lock in trade-in values for upcoming launches.
          </p>
        </div>
        <Link href="/preorder">
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold cursor-pointer shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-colors">
            <Rocket className="w-4 h-4" /> Browse Preorders
          </span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 mb-6">
          {error}
        </div>
      )}

      {preorders.length === 0 && !error ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No preorders yet</h3>
          <p className="text-sm text-[#0f172a]/50 mb-6">
            Reserve upcoming flagships before launch day.
          </p>
          <Link href="/preorder">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-purple-500/20">
              <Rocket className="w-4 h-4" /> Explore Preorders
            </span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {preorders.map((po) => {
            const totalSlots = po.campaign.maxSlots || 1000;
            const pct = Math.round((po.queuePosition / totalSlots) * 100);
            const statusColor = STATUS_COLORS[po.status] || STATUS_COLORS.QUEUE_OPEN;
            const shipDate = po.campaign.estimatedShipDate
              ? new Date(po.campaign.estimatedShipDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "TBD";

            return (
              <motion.div
                key={po.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#0f172a] text-lg">
                      {po.campaign.product?.name || po.campaign.title}
                    </h3>
                    <p className="text-sm text-[#0f172a]/50">{po.campaign.title}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {po.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Queue progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#0f172a]/60 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Queue Position
                    </span>
                    <span className="font-semibold text-[#04a1c6]">
                      #{po.queuePosition} of {totalSlots.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#04a1c6] rounded-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-6">
                    <span className="text-[#0f172a]/50">
                      Deposit: <span className="font-medium text-[#0f172a]">${po.depositPaid}</span>
                    </span>
                    <span className="text-[#0f172a]/50">
                      Est. Ship: <span className="font-medium text-[#0f172a]">{shipDate}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {po.tradeIn && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                        <ArrowLeftRight className="w-3 h-3" />
                        Trade-in: ${po.tradeIn.quotedValue}
                      </span>
                    )}
                    {!po.tradeIn && (
                      <Link href="/trade-in">
                        <span className="flex items-center gap-1 text-[#04a1c6] font-medium hover:underline cursor-pointer text-xs">
                          <Zap className="w-3 h-3" /> Lock Trade-In
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
