"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Image,
  PanelTop,
  Columns3,
  BarChart3,
  Activity,
  Search,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  UserCog,
  Zap,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
      { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/accounts", icon: Users, label: "Accounts & KYC" },
      { href: "/admin/disputes", icon: ShieldAlert, label: "Disputes" },
      { href: "/admin/payments", icon: DollarSign, label: "Payments" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/banners", icon: Image, label: "Banners" },
      { href: "/admin/homepage", icon: PanelTop, label: "Homepage CMS" },
      { href: "/admin/footer", icon: Columns3, label: "Footer" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/tracking", icon: Activity, label: "Tracking" },
      { href: "/admin/seo", icon: Search, label: "SEO" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
      { href: "/admin/admins", icon: UserCog, label: "Admin Team" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Find current page label for breadcrumb
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const currentItem = allItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex font-sans antialiased">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-18" : "w-64"
        } bg-[#0d1526] text-white flex flex-col fixed h-screen z-30 transition-all duration-300 shadow-2xl`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/5 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 bg-linear-to-br from-[#04a1c6] to-[#0284a8] rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg shadow-[#04a1c6]/30 shrink-0">
            S
          </div>
          {!collapsed && (
            <div>
              <span className="font-black text-sm tracking-tight uppercase text-white">Select Admin</span>
              <p className="text-[9px] uppercase tracking-widest text-[#04a1c6]/80 font-bold">Platform Control</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5 scrollbar-hide">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[9px] font-black uppercase tracking-widest text-white/20 px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                        isActive
                          ? "bg-linear-to-r from-[#04a1c6]/20 to-[#04a1c6]/5 text-white border border-[#04a1c6]/20"
                          : "text-white/40 hover:text-white/80 hover:bg-white/5"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#04a1c6] rounded-r-full" />
                      )}
                      <item.icon
                        className={`w-4 h-4 shrink-0 ${isActive ? "text-[#04a1c6]" : ""}`}
                      />
                      {!collapsed && (
                        <span className="text-[11px] font-bold uppercase tracking-widest truncate">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? "rotate-0" : "rotate-180"}`} />
            {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">Collapse</span>}
          </button>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">Exit Platform</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          collapsed ? "ml-18" : "ml-64"
        }`}
      >
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="text-slate-400 hover:text-[#0d1526] transition-colors font-bold text-[11px] uppercase tracking-widest">
              Admin
            </Link>
            {currentItem && pathname !== "/admin" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[#0d1526] font-black text-[11px] uppercase tracking-widest">
                  {currentItem.label}
                </span>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* System pulse */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">All Systems Live</span>
            </div>

            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0d1526] hover:bg-slate-100 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#04a1c6] rounded-full border-2 border-white" />
            </button>

            {/* Admin avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-[#0d1526] uppercase tracking-widest">Super Admin</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Full Access</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#04a1c6]/20 to-[#04a1c6]/5 border border-[#04a1c6]/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#04a1c6]" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
