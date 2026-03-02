"use client";
import React from "react";
import { OverviewContent } from "@/components/dashboard/OverviewContent";
import { Building2, Truck, Users, Globe, PlusSquare, FileText, Send, ShieldCheck } from "lucide-react";

const STATS = [
  { label: "Total Units", value: "4,250", icon: Building2, color: "from-indigo-600 to-blue-600", trend: "Warehouse A: 85% cap" },
  { label: "Bulk Pending", value: "14", icon: Truck, color: "from-emerald-600 to-teal-600", trend: "+2 today" },
  { label: "Active Partners", value: "42", icon: Users, color: "from-amber-600 to-orange-600", trend: "3 onboarding" },
  { label: "Global Reach", value: "12", icon: Globe, color: "from-rose-600 to-pink-600", trend: "Countries" },
];

const ACTIONS = [
  { label: "Import Manifest", desc: "Upload bulk inventory CSV", icon: PlusSquare, href: "/wholesaler/dashboard/inventory", color: "text-indigo-600 bg-indigo-50" },
  { label: "Quote Request", desc: "Respond to bulk inquiries", icon: FileText, href: "/wholesaler/dashboard/bulk-orders", color: "text-blue-600 bg-blue-50" },
  { label: "Invite Partner", desc: "Expand retailer network", icon: Send, href: "/wholesaler/dashboard/partners", color: "text-amber-600 bg-amber-50" },
  { label: "Compliance", desc: "Verify tax documents", icon: ShieldCheck, href: "/wholesaler/dashboard/settings", color: "text-emerald-600 bg-emerald-50" },
];

export default function WholesalerDashboard() {
  return (
    <OverviewContent 
      title="Wholesale Portal" 
      stats={STATS} 
      quickActions={ACTIONS}
      recentActivity={[
        { text: "Bulk Order #WS-203 shipped — 50x iPhone 14", time: "1 hour ago", status: "In Transit", statusColor: "bg-blue-100 text-blue-700", icon: Truck },
        { text: "Partner Application: Apex Retailer NYC", time: "3 hours ago", status: "Pending", statusColor: "bg-amber-100 text-amber-700", icon: Users },
        { text: "Inventory Restock: Google Pixel 8 (100 units)", time: "Yesterday", status: "Restocked", statusColor: "bg-emerald-100 text-emerald-700", icon: Building2 },
      ]}
    />
  );
}
