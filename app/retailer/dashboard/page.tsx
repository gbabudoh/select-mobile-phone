"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Package, ShoppingCart, TrendingUp, Star, Search, Plus, BarChart3, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Active Listings", value: "0", icon: Package, color: "from-blue-500 to-cyan-500", trend: "-" },
  { label: "Sales This Month", value: "0", icon: ShoppingCart, color: "from-emerald-500 to-teal-500", trend: "-" },
  { label: "Revenue", value: "$0.00", icon: TrendingUp, color: "from-purple-500 to-indigo-500", trend: "-" },
  { label: "Avg Rating", value: "-", icon: Star, color: "from-orange-500 to-rose-500", trend: "-" },
];

const ACTIONS = [
  { label: "Create New Listing", desc: "Add product to your store", icon: Plus, href: "/retailer/dashboard/listings/new", color: "text-blue-600 bg-blue-50" },
  { label: "Market Research", desc: "Check trending prices", icon: Search, href: "/normal-order", color: "text-cyan-600 bg-cyan-50" },
  { label: "Sales Report", desc: "Detailed performance audit", icon: BarChart3, href: "/retailer/dashboard/analytics", color: "text-purple-600 bg-purple-50" },
  { label: "Verified Status", desc: "Update your credentials", icon: ShieldCheck, href: "/retailer/dashboard/settings", color: "text-emerald-600 bg-emerald-50" },
];

export default function RetailerDashboard() {
  return (
    <div className="space-y-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#04a1c6] transition-colors uppercase tracking-widest gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> go to homepage
      </Link>
      <OverviewContent 
        title="Retailer Hub" 
        stats={STATS} 
        quickActions={ACTIONS}
        recentActivity={[]}
      />
    </div>
  );
}
