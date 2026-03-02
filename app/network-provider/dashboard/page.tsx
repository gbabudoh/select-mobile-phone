"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Cpu, Layers, Coins, TrendingDown, Plus, Zap, Percent, Activity } from "lucide-react";

const STATS = [
  { label: "Active eSIMs", value: "1,842", icon: Cpu, color: "from-cyan-600 to-blue-600", trend: "+34 today" },
  { label: "Provisioned Plans", value: "8", icon: Layers, color: "from-purple-600 to-indigo-600", trend: "Latest: 5G Unlimited" },
  { label: "Bounty Payout", value: "$4,120", icon: Coins, color: "from-emerald-600 to-teal-600", trend: "Next: Mar 15" },
  { label: "Churn Rate", value: "2.1%", icon: TrendingDown, color: "from-rose-600 to-pink-600", trend: "-0.5% this month" },
];

const ACTIONS = [
  { label: "Add Service Plan", desc: "Create a new wireless offering", icon: Plus, href: "/network-provider/dashboard/plans", color: "text-blue-600 bg-blue-50" },
  { label: "Bulk Provision", desc: "Activate a batch of eSIMs", icon: Zap, href: "/network-provider/dashboard/esim", color: "text-amber-600 bg-amber-50" },
  { label: "Update Bounties", desc: "Adjust referral incentives", icon: Percent, href: "/network-provider/dashboard/revenue", color: "text-emerald-600 bg-emerald-50" },
  { label: "Network Health", desc: "View real-time API status", icon: Activity, href: "/network-provider/dashboard/settings", color: "text-cyan-600 bg-cyan-50" },
];

export default function NetworkProviderDashboard() {
  return (
    <OverviewContent 
      title="Provider Ops" 
      stats={STATS} 
      quickActions={ACTIONS}
      recentActivity={[
        { text: "eSIM Activation successful — +$15 Bounty", time: "5 mins ago", status: "Active", statusColor: "bg-emerald-100 text-emerald-700", icon: Cpu },
        { text: "New 5G Plan 'Flanker Pro' published", time: "2 hours ago", status: "Published", statusColor: "bg-blue-100 text-blue-700", icon: Layers },
        { text: "API Health Check: Latency 42ms", time: "1 hour ago", status: "Healthy", statusColor: "bg-cyan-100 text-cyan-700", icon: Activity },
      ]}
    />
  );
}
