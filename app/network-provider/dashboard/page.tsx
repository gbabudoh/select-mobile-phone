"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Cpu, Layers, Coins, TrendingDown, Plus, Zap, Percent, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Active eSIMs", value: "0", icon: Cpu, color: "from-cyan-600 to-blue-600", trend: "-" },
  { label: "Provisioned Plans", value: "0", icon: Layers, color: "from-purple-600 to-indigo-600", trend: "-" },
  { label: "Bounty Payout", value: "$0.00", icon: Coins, color: "from-emerald-600 to-teal-600", trend: "-" },
  { label: "Churn Rate", value: "-", icon: TrendingDown, color: "from-rose-600 to-pink-600", trend: "-" },
];

const ACTIONS = [
  { label: "Add Service Plan", desc: "Create a new wireless offering", icon: Plus, href: "/network-provider/dashboard/plans", color: "text-blue-600 bg-blue-50" },
  { label: "Bulk Provision", desc: "Activate a batch of eSIMs", icon: Zap, href: "/network-provider/dashboard/esim", color: "text-amber-600 bg-amber-50" },
  { label: "Update Bounties", desc: "Adjust referral incentives", icon: Percent, href: "/network-provider/dashboard/revenue", color: "text-emerald-600 bg-emerald-50" },
  { label: "Network Health", desc: "View real-time API status", icon: Activity, href: "/network-provider/dashboard/settings", color: "text-cyan-600 bg-cyan-50" },
];

export default function NetworkProviderDashboard() {
  return (
    <div className="space-y-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#04a1c6] transition-colors uppercase tracking-widest gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> go to homepage
      </Link>
      <OverviewContent 
        title="Provider Ops" 
        stats={STATS} 
        quickActions={ACTIONS}
        recentActivity={[]}
      />
    </div>
  );
}
