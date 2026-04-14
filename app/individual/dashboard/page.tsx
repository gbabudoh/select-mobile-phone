"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Smartphone, DollarSign, Star, ShieldCheck, Plus, Search, HelpCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Phone for Sale", value: "0", icon: Smartphone, color: "from-blue-500 to-cyan-500", trend: "-" },
  { label: "Potential Sale", value: "$0.00", icon: DollarSign, color: "from-emerald-500 to-teal-500", trend: "-" },
  { label: "My Rating", value: "-", icon: Star, color: "from-amber-500 to-orange-500", trend: "-" },
  { label: "Protection", value: "-", icon: ShieldCheck, color: "from-purple-500 to-indigo-500", trend: "-" },
];

const ACTIONS = [
  { label: "List Your Phone", desc: "Start a single-item sale", icon: Plus, href: "/individual/dashboard/listings", color: "text-blue-600 bg-blue-50" },
  { label: "Price Estimator", desc: "Check current trade-in value", icon: Search, href: "/trade-in", color: "text-cyan-600 bg-cyan-50" },
  { label: "Seller Guide", desc: "How to ship safely", icon: HelpCircle, href: "/ai-guide", color: "text-purple-600 bg-purple-50" },
];

export default function IndividualDashboard() {
  return (
    <div className="space-y-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#04a1c6] transition-colors uppercase tracking-widest gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> go to homepage
      </Link>
      <OverviewContent 
        title="Individual Seller" 
        subtitle="Sell your personal devices with confidence."
        stats={STATS} 
        quickActions={ACTIONS}
        recentActivity={[]}
      />
    </div>
  );
}
