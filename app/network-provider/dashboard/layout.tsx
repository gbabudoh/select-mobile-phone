"use client";
import React from "react";
import { DashboardShell, NavItem } from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, Cpu, Coins, Settings, Layers } from "lucide-react";

const NAV_ITEMS: NavItem[] = [
  { href: "/network-provider/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/network-provider/dashboard/esim", label: "eSIM Management", icon: Cpu },
  { href: "/network-provider/dashboard/plans", label: "Service Plans", icon: Layers },
  { href: "/network-provider/dashboard/revenue", label: "Bounty Revenue", icon: Coins },
  { href: "/network-provider/dashboard/settings", label: "Settings", icon: Settings },
];

export default function NetworkProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
