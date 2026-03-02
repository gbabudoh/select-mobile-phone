"use client";
import React from "react";
import { DashboardShell, NavItem } from "@/components/dashboard/DashboardShell";
import { LayoutDashboard, Smartphone, DollarSign, Bell, Settings } from "lucide-react";

const NAV_ITEMS: NavItem[] = [
  { href: "/individual/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/individual/dashboard/listings", label: "My Device", icon: Smartphone },
  { href: "/individual/dashboard/sales", label: "Sales", icon: DollarSign },
  { href: "/individual/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/individual/dashboard/settings", label: "Settings", icon: Settings },
];

export default function IndividualLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
