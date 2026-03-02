"use client";
import React from "react";
import { DashboardShell, NavItem } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard, ShoppingCart,
  ArrowLeftRight, Bell, Settings, Store
} from "lucide-react";

const NAV_ITEMS: NavItem[] = [
  { href: "/buyer/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/buyer/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/buyer/dashboard/preorders", label: "Preorders", icon: Store },
  { href: "/buyer/dashboard/trade-ins", label: "Trade-Ins", icon: ArrowLeftRight },
  { href: "/buyer/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/buyer/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
