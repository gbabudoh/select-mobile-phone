"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Smartphone, DollarSign, Star, ShieldCheck, Plus, Search, HelpCircle } from "lucide-react";

const STATS = [
  { label: "Phone for Sale", value: "1", icon: Smartphone, color: "from-blue-500 to-cyan-500", trend: "1/1 slot used" },
  { label: "Potential Sale", value: "$450", icon: DollarSign, color: "from-emerald-500 to-teal-500", trend: "Based on market" },
  { label: "My Rating", value: "New", icon: Star, color: "from-amber-500 to-orange-500", trend: "Pending activity" },
  { label: "Protection", value: "Active", icon: ShieldCheck, color: "from-purple-500 to-indigo-500", trend: "Escrow enabled" },
];

const ACTIONS = [
  { label: "List Your Phone", desc: "Start a single-item sale", icon: Plus, href: "/individual/dashboard/listings", color: "text-blue-600 bg-blue-50" },
  { label: "Price Estimator", desc: "Check current trade-in value", icon: Search, href: "/trade-in", color: "text-cyan-600 bg-cyan-50" },
  { label: "Seller Guide", desc: "How to ship safely", icon: HelpCircle, href: "/ai-guide", color: "text-purple-600 bg-purple-50" },
];

export default function IndividualDashboard() {
  return (
    <OverviewContent 
      title="Individual Seller" 
      subtitle="Sell your personal devices with confidence."
      stats={STATS} 
      quickActions={ACTIONS}
      recentActivity={[
        { text: "Identity verification initiated", time: "2 hours ago", status: "Pending", statusColor: "bg-amber-100 text-amber-700", icon: ShieldCheck },
        { text: "Welcome to Select Mobile!", time: "1 day ago", status: "New", statusColor: "bg-blue-100 text-blue-700", icon: Smartphone },
      ]}
    />
  );
}
