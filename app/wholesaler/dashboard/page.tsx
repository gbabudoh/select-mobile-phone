"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Building2, Truck, Users, Globe, PlusSquare, FileText, Send, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Total Units", value: "0", icon: Building2, color: "from-indigo-600 to-blue-600", trend: "-" },
  { label: "Bulk Pending", value: "0", icon: Truck, color: "from-emerald-600 to-teal-600", trend: "-" },
  { label: "Active Partners", value: "0", icon: Users, color: "from-amber-600 to-orange-600", trend: "-" },
  { label: "Global Reach", value: "0", icon: Globe, color: "from-rose-600 to-pink-600", trend: "-" },
];

const ACTIONS = [
  { label: "Import Manifest", desc: "Upload bulk inventory CSV", icon: PlusSquare, href: "/wholesaler/dashboard/inventory", color: "text-indigo-600 bg-indigo-50" },
  { label: "Quote Request", desc: "Respond to bulk inquiries", icon: FileText, href: "/wholesaler/dashboard/bulk-orders", color: "text-blue-600 bg-blue-50" },
  { label: "Invite Partner", desc: "Expand retailer network", icon: Send, href: "/wholesaler/dashboard/partners", color: "text-amber-600 bg-amber-50" },
  { label: "Compliance", desc: "Verify tax documents", icon: ShieldCheck, href: "/wholesaler/dashboard/settings", color: "text-emerald-600 bg-emerald-50" },
];

export default function WholesalerDashboard() {
  return (
    <div className="space-y-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#04a1c6] transition-colors uppercase tracking-widest gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> go to homepage
      </Link>
      <OverviewContent 
        title="Wholesale Portal" 
        stats={STATS} 
        quickActions={ACTIONS}
        recentActivity={[]}
      />
    </div>
  );
}
