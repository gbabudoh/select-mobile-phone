"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Package, ShoppingCart, TrendingUp, Star, Search, Plus, BarChart3, ShieldCheck } from "lucide-react";

const STATS = [
  { label: "Active Listings", value: "156", icon: Package, color: "from-blue-500 to-cyan-500", trend: "+12 this week" },
  { label: "Sales This Month", value: "89", icon: ShoppingCart, color: "from-emerald-500 to-teal-500", trend: "+18% vs last month" },
  { label: "Revenue", value: "$34,200", icon: TrendingUp, color: "from-purple-500 to-indigo-500", trend: "On track" },
  { label: "Avg Rating", value: "4.8", icon: Star, color: "from-orange-500 to-rose-500", trend: "0.2 improvement" },
];

const ACTIONS = [
  { label: "Create New Listing", desc: "Add product to your store", icon: Plus, href: "/retailer/dashboard/listings/new", color: "text-blue-600 bg-blue-50" },
  { label: "Market Research", desc: "Check trending prices", icon: Search, href: "/normal-order", color: "text-cyan-600 bg-cyan-50" },
  { label: "Sales Report", desc: "Detailed performance audit", icon: BarChart3, href: "/retailer/dashboard/analytics", color: "text-purple-600 bg-purple-50" },
  { label: "Verified Status", desc: "Update your credentials", icon: ShieldCheck, href: "/retailer/dashboard/settings", color: "text-emerald-600 bg-emerald-50" },
];

export default function RetailerDashboard() {
  return (
    <OverviewContent 
      title="Retailer Hub" 
      stats={STATS} 
      quickActions={ACTIONS}
      recentActivity={[
        { text: "Order #RET-9102 fulfilled — iPhone 15", time: "10 mins ago", status: "Completed", statusColor: "bg-emerald-100 text-emerald-700", icon: ShoppingCart },
        { text: "Low stock alert: Samsung Galaxy S24", time: "4 hours ago", status: "Alert", statusColor: "bg-amber-100 text-amber-700", icon: Package },
        { text: "New 5-star review received", time: "1 day ago", status: "Review", statusColor: "bg-blue-100 text-blue-700", icon: Star },
      ]}
    />
  );
}
