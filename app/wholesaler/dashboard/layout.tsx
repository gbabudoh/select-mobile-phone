"use client";
import React from "react";
import { DashboardShell, NavItem } from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, Building2, Truck, Users, Settings } from "lucide-react";

const NAV_ITEMS: NavItem[] = [
  { href: "/wholesaler/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/wholesaler/dashboard/inventory", label: "Bulk Inventory", icon: Building2 },
  { href: "/wholesaler/dashboard/bulk-orders", label: "Bulk Orders", icon: Truck },
  { href: "/wholesaler/dashboard/partners", label: "Partner Network", icon: Users },
  { href: "/wholesaler/dashboard/settings", label: "Settings", icon: Settings },
];

export default function WholesalerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
