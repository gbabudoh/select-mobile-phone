"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import {
  Package, ShoppingCart,
  ArrowLeftRight, DollarSign,
  Search, Zap, Shield
} from "lucide-react";

const STATS = [
  { label: "Active Orders", value: "3", icon: ShoppingCart, color: "from-cyan-500 to-blue-500", trend: "+1 this week" },
  { label: "Preorders", value: "1", icon: Package, color: "from-purple-500 to-indigo-500", trend: "Position #12" },
  { label: "Trade-In Credits", value: "$350", icon: ArrowLeftRight, color: "from-emerald-500 to-teal-500", trend: "Locked" },
  { label: "Total Saved", value: "$680", icon: DollarSign, color: "from-orange-500 to-rose-500", trend: "+$40 saving" },
];

const ACTIONS = [
  { label: "Browse Marketplace", desc: "Find your next flagship", icon: Search, href: "/normal-order", color: "text-cyan-600 bg-cyan-50" },
  { label: "Start Trade-In", desc: "Get instant credit", icon: Zap, href: "/trade-in", color: "text-amber-600 bg-amber-50" },
  { label: "View Preorders", desc: "Track your queue", icon: Package, href: "/buyer/dashboard/preorders", color: "text-purple-600 bg-purple-50" },
  { label: "Escrow Status", desc: "Your funds are safe", icon: Shield, href: "/buyer/dashboard/orders", color: "text-emerald-600 bg-emerald-50" },
];

const RECENT_ACTIVITY = [
  { text: "Order #SM-4821 shipped — iPhone 18 Pro", time: "2 hours ago", status: "Shipped", statusColor: "bg-emerald-100 text-emerald-700", icon: ShoppingCart },
  { text: "Preorder queue position updated — #12 of 500", time: "5 hours ago", status: "Updated", statusColor: "bg-cyan-100 text-cyan-700", icon: Package },
  { text: "Trade-in quote locked — $350 for iPhone 16 Pro", time: "1 day ago", status: "Locked", statusColor: "bg-purple-100 text-purple-700", icon: ArrowLeftRight },
];

export default function DashboardOverview() {
  return (
    <OverviewContent 
      title="Dashboard" 
      stats={STATS} 
      quickActions={ACTIONS}
      recentActivity={RECENT_ACTIVITY}
    />
  );
}
