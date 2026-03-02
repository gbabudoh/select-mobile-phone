"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, LucideIcon
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export interface DashboardStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend: string;
}

export interface QuickAction {
  label: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

interface OverviewContentProps {
  title: string;
  subtitle?: string;
  stats: DashboardStat[];
  quickActions: QuickAction[];
  recentActivity?: Array<{
    text: string;
    time: string;
    status: string;
    statusColor: string;
    icon: LucideIcon;
  }>;
}

export function OverviewContent({ 
  title, 
  subtitle, 
  stats, 
  quickActions,
  recentActivity = []
}: OverviewContentProps) {
  const { data: session } = useSession();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight">{title}</h1>
          <p className="text-[#0f172a]/50 font-medium">
            {subtitle || `Welcome back, ${session?.user?.name || "Godwin"}. Here's your pulse today.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live System</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10 rounded-[2rem]" style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` }} />
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:border-cyan-200 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} p-3 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-[#0f172a]/40 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-[#0f172a]">{stat.value}</p>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">{stat.trend}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Recent Activity</h2>
            <button className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors uppercase tracking-widest px-4 py-2 rounded-xl bg-cyan-50">View All</button>
          </div>
          <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden">
            <div className="space-y-8">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <activity.icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-[#0f172a]">{activity.text}</span>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${activity.statusColor}`}>
                          {activity.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 font-medium">
                  No recent activity to show.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-[#0f172a] tracking-tight px-2">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <Link 
                  href={action.href}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-cyan-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-cyan-100"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#0f172a]">{action.label}</p>
                    <p className="text-xs text-gray-400 font-medium">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform group-hover:text-cyan-500" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
