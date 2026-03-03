"use client";
import React from "react";
import {
  Target, Globe, Shield,
  Heart, Building2,
  ArrowRight, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";

const values = [
  { icon: Target, title: "Intentional Indulgence", desc: "Every feature is designed to make mobile device acquisition a deliberate, informed, and premium experience." },
  { icon: Shield, title: "Trust & Transparency", desc: "Select-Verified devices, escrow payments, and full device history reports ensure every transaction is secure." },
  { icon: Globe, title: "Market Intelligence", desc: "AI-powered TCO calculations, price tracking, and predictive analytics help buyers make smarter decisions." },
  { icon: Heart, title: "Community First", desc: "We build for retailers, wholesalers, and network providers equally — creating a true multi-sided marketplace." },
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "$12M+", label: "Monthly GMV" },
  { value: "99.9%", label: "Platform Uptime" },
  { value: "4.9★", label: "User Rating" },
];

const milestones = [
  { year: "2024", title: "Founded", desc: "Select Mobile launched as an aggregator marketplace for the US mobile market." },
  { year: "2024", title: "Marketplace Launch", desc: "Expanded to a full marketplace with buyer, seller, and network provider portals." },
  { year: "2025", title: "Canadian Expansion", desc: "Extended to Canada with CRTC-certified pre-owned devices and flanker brand partnerships." },
  { year: "2025", title: "Preorder Engine", desc: "Launched the preorder system with trade-in price locking and automated bulk-buy discounts." },
  { year: "2026", title: "AI Mobile Guide", desc: "Released the AI-powered Mobile Guide for personalized device and plan recommendations." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">About Select Mobile</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              The Intelligent<br />Mobile <span className="text-blue-500">Marketplace</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              We are building the most disruptive mobile phone marketplace for the USA and Canada — connecting buyers, retailers, wholesalers, and network providers on a single, trust-first platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 border-y border-[#dcdcdc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-black text-[#0f172a] mb-2">{stat.value}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Our Mission</span>
              <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3 mb-6">
                Disrupting How The World Buys Mobile Devices
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                The mobile device market is fragmented, opaque, and full of friction. Buyers overpay, sellers struggle with trust, and network providers lack direct reach. Select Mobile solves all three.
              </p>
              <ul className="space-y-3">
                {["Total Cost of Ownership transparency", "AI-powered Mobile Guide for personalized recommendations", "Escrow-protected transactions for every purchase", "Embedded eSIM provisioning at checkout"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-[#0f172a]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl p-12 border border-[#dcdcdc]">
              <div className="grid grid-cols-2 gap-6">
                {values.map((v, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="p-3 bg-white rounded-2xl shadow-sm w-fit">
                      <v.icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{v.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Our Journey</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Building The Future</h2>
          </div>
          <div className="space-y-6">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 shrink-0 text-right">
                  <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest">{m.year}</span>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5 shrink-0 ring-4 ring-blue-100" />
                <div className="pb-6 flex-1">
                  <h4 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide mb-1">{m.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mb-6">Ready to Experience the Difference?</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-xl mx-auto">Join thousands of buyers, retailers, and network providers on the platform built for intentional indulgence.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
