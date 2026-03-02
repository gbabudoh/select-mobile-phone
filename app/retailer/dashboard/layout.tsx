"use client";
import React from "react";
import { DashboardShell, NavItem } from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, ShoppingCart, Package, BarChart3, Settings } from "lucide-react";

const NAV_ITEMS: NavItem[] = [
  { href: "/retailer/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/retailer/dashboard/listings", label: "Inventory", icon: Package },
  { href: "/retailer/dashboard/orders", label: "Store Orders", icon: ShoppingCart },
  { href: "/retailer/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/retailer/dashboard/settings", label: "Settings", icon: Settings },
];

export default function RetailerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
