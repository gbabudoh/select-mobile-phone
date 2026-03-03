"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Loader2,
  User, LucideIcon, X, AlertTriangle
} from "lucide-react";
import Image from "next/image";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardShell({ children, navItems }: DashboardShellProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-8 h-8 animate-spin text-[#04a1c6]" />
      </div>
    );
  }

  const userRole = session?.user?.role?.replace(/_/g, " ") || "Member";

  return (
    <div className="min-h-screen flex bg-[#f8fafc] selection:bg-cyan-100 selection:text-cyan-900">
      <div className="animated-bg" />
      
      {/* Sidebar */}
      <aside className="w-72 fixed left-0 top-0 bottom-0 z-50 flex flex-col shrink-0 p-4 h-screen">
        <div className="flex flex-col h-full glass-panel rounded-[2.5rem] shadow-xl overflow-hidden border-white/40">
          <div className="p-8 pb-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.png" 
                alt="Select Mobile" 
                width={160} 
                height={40} 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto chat-scroll" aria-label="Dashboard navigation">
            <div className="px-4 py-2">
              <span className="text-[10px] font-black text-[#0f172a]/40 uppercase tracking-[0.2em]">Dashboard Menu</span>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#0f172a] text-white shadow-lg shadow-[#0f172a]/20"
                      : "text-[#0f172a]/70 hover:text-[#0f172a] hover:bg-black/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/40" : "bg-white border border-gray-100 text-gray-400 group-hover:text-[#04a1c6] group-hover:border-cyan-100 group-hover:shadow-sm"}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 mt-auto">
            <div className="p-4 rounded-[2rem] bg-gray-50/50 border border-gray-100">
              {session?.user && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden">
                    {session.user.image ? (
                      <Image src={session.user.image} alt="" fill className="object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#0f172a] truncate">
                      {session.user.name || "Guest User"}
                    </p>
                    <p className="text-[10px] font-black text-[#0f172a]/50 uppercase tracking-widest">
                      {userRole}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowSignOutModal(true)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest transition-all border border-gray-100 hover:border-rose-100 cursor-pointer shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-72 relative z-10 overflow-hidden flex flex-col min-h-screen">
        <div className="flex-1 overflow-auto chat-scroll p-8 pt-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>

      {/* High-Fidelity Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignOutModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                
                <h3 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-4">Confirm Sign Out</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                  Are you sure you want to end your session as a <span className="text-[#0f172a] font-bold uppercase tracking-tight text-[10px] bg-slate-100 px-2 py-1 rounded-lg ml-1">{userRole}</span>? You will need to re-authenticate to access your dashboard.
                </p>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full py-5 bg-[#0f172a] text-white rounded-[1.5rem] font-bold text-sm uppercase tracking-widest hover:bg-rose-600 shadow-xl hover:shadow-rose-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Yes, Sign Me Out
                  </button>
                  <button
                    onClick={() => setShowSignOutModal(false)}
                    className="w-full py-5 bg-slate-50 text-slate-500 hover:text-[#0f172a] rounded-[1.5rem] font-bold text-sm uppercase tracking-widest border border-slate-100 transition-all hover:bg-slate-100"
                  >
                    Stay Authenticated
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => setShowSignOutModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
