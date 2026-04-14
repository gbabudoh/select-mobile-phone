"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import {
  Package, ShoppingCart, ArrowLeftRight, DollarSign,
  Search, Zap, Shield, ArrowLeft, LucideIcon
} from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Active Orders", value: "0", icon: ShoppingCart, color: "from-cyan-500 to-blue-500", trend: "-" },
  { label: "Preorders", value: "0", icon: Package, color: "from-purple-500 to-indigo-500", trend: "-" },
  { label: "Trade-In Credits", value: "$0.00", icon: ArrowLeftRight, color: "from-emerald-500 to-teal-500", trend: "-" },
  { label: "Total Saved", value: "$0.00", icon: DollarSign, color: "from-orange-500 to-rose-500", trend: "-" },
];

const ACTIONS = [
  { label: "Browse Marketplace", desc: "Find your next flagship", icon: Search, href: "/normal-order", color: "text-cyan-600 bg-cyan-50" },
  { label: "Start Trade-In", desc: "Get instant credit", icon: Zap, href: "/trade-in", color: "text-amber-600 bg-amber-50" },
  { label: "View Preorders", desc: "Track your queue", icon: Package, href: "/buyer/dashboard/preorders", color: "text-purple-600 bg-purple-50" },
  { label: "Escrow Status", desc: "Your funds are safe", icon: Shield, href: "/buyer/dashboard/orders", color: "text-emerald-600 bg-emerald-50" },
];

const RECENT_ACTIVITY: Array<{ text: string; time: string; status: string; statusColor: string; icon: LucideIcon }> = [];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#04a1c6] transition-colors uppercase tracking-widest gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> go to homepage
      </Link>
      <OverviewContent 
        title="Dashboard" 
        stats={STATS} 
        quickActions={ACTIONS}
        recentActivity={RECENT_ACTIVITY}
      />
    </div>
  );
}
