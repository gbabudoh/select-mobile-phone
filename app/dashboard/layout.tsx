"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare,
  ArrowLeftRight, Bell, Settings, Store, LogOut, Loader2,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "Listings", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/preorders", label: "Preorders", icon: Store },
  { href: "/dashboard/trade-ins", label: "Trade-Ins", icon: ArrowLeftRight },
  { href: "/dashboard/chat", label: "AI Guide", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 animate-spin text-[#04a1c6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-xl font-bold text-[#04a1c6]">
            Select Mobile
          </Link>
          <p className="text-xs text-white/50 mt-1">Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#04a1c6]/20 text-[#04a1c6]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        {session?.user && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#04a1c6]/20 flex items-center justify-center text-[#04a1c6] text-sm font-bold">
                {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-xs text-white/40 capitalize">
                  {session.user.role?.toLowerCase().replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
