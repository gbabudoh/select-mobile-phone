"use client";
import React from "react";
import {
  Newspaper, Calendar,
  ArrowUpRight, Download, Award
} from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../../components/Navigation";

const pressReleases = [
  {
    date: "Feb 28, 2026",
    title: "Select Mobile Launches AI-Powered Mobile Guide for Personalized Device Recommendations",
    excerpt: "The new AI Mobile Guide uses machine learning to analyze user preferences, usage patterns, and total cost of ownership to recommend the perfect device and plan combination.",
    tag: "Product Launch"
  },
  {
    date: "Jan 15, 2026",
    title: "Select Mobile Expands to Canadian Market with CRTC-Certified Pre-Owned Devices",
    excerpt: "Partnering with Canadian flanker brands, Select Mobile now offers certified pre-owned devices alongside new inventory in Ontario, British Columbia, and Alberta.",
    tag: "Expansion"
  },
  {
    date: "Nov 8, 2025",
    title: "Select Mobile Closes $18M Series A to Scale Preorder Engine and eSIM Infrastructure",
    excerpt: "The round was led by Frontier Ventures with participation from Telecom Capital Partners. Funds will accelerate the preorder system with trade-in price locking.",
    tag: "Funding"
  },
  {
    date: "Sep 20, 2025",
    title: "Select Mobile Partners with Three Major MVNOs for Embedded eSIM Provisioning",
    excerpt: "Select Mobile now supports instant eSIM activation at checkout, enabling buyers to leave with a fully connected device from day one.",
    tag: "Partnership"
  },
  {
    date: "Jul 5, 2025",
    title: "Platform Surpasses 50,000 Monthly Active Users Across Buyer and Seller Portals",
    excerpt: "Monthly gross merchandise value has exceeded $12M as the marketplace gains traction with retailers and wholesalers in the US mobile device market.",
    tag: "Milestone"
  },
  {
    date: "Mar 12, 2025",
    title: "Select Mobile Launches Escrow-Protected Transactions for All Wholesale Orders",
    excerpt: "Every B2B transaction on the platform is now protected by an integrated escrow system, ensuring funds are released only upon verified delivery and inspection.",
    tag: "Trust & Safety"
  },
];

const tagColors: Record<string, string> = {
  "Product Launch": "bg-blue-50 text-blue-600",
  "Expansion": "bg-emerald-50 text-emerald-600",
  "Funding": "bg-violet-50 text-violet-600",
  "Partnership": "bg-amber-50 text-amber-600",
  "Milestone": "bg-rose-50 text-rose-600",
  "Trust & Safety": "bg-teal-50 text-teal-600",
};

const mediaStats = [
  { value: "120+", label: "Media Mentions" },
  { value: "45", label: "Industry Awards" },
  { value: "18M", label: "Series A Raised" },
  { value: "6", label: "Press Releases" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full mb-6">
              <Newspaper className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">Press & Media</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              In The <span className="text-amber-500">News</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              The latest announcements, press releases, and media coverage from Select Mobile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-[#dcdcdc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {mediaStats.map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center">
                <p className="text-4xl font-black text-[#0f172a] mb-2">{stat.value}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Press Releases</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Latest Announcements</h2>
          </div>
          <div className="space-y-5">
            {pressReleases.map((pr, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="p-6 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg hover:border-amber-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" /> {pr.date}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${tagColors[pr.tag] || "bg-slate-50 text-slate-500"}`}>
                    {pr.tag}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide mb-2 group-hover:text-amber-600 transition-colors leading-snug">{pr.title}</h3>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{pr.excerpt}</p>
                <div className="mt-4 flex items-center gap-1.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest">Read More</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Media Kit & Brand Assets</h2>
          <p className="text-slate-500 font-medium mb-8">Download our logo, brand guidelines, and executive headshots for press coverage.</p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg active:scale-95 cursor-pointer">
            <Download className="w-4 h-4" /> Download Media Kit
          </button>
        </div>
      </section>

    </div>
  );
}
