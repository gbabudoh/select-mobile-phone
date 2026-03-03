"use client";
import React from "react";
import {
  RefreshCw, CheckCircle2, Clock, Package,
  AlertTriangle, ArrowRight, XCircle, Shield
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";

const returnSteps = [
  { step: "1", title: "Initiate Return", desc: "Log in to your account, go to Orders, and select the item you want to return. Choose your reason." },
  { step: "2", title: "Ship the Device", desc: "We&apos;ll email you a prepaid shipping label. Pack the device in its original box with all accessories." },
  { step: "3", title: "Device Inspection", desc: "Our team inspects the returned device for condition, accessories, and factory reset status." },
  { step: "4", title: "Refund Issued", desc: "Refund is processed within 3-5 business days to your original payment method after approval." },
];

const eligibility = [
  { eligible: true, text: "Device returned within 30 days of delivery" },
  { eligible: true, text: "Device in original condition with no physical damage" },
  { eligible: true, text: "All original accessories and packaging included" },
  { eligible: true, text: "Device has been factory reset" },
  { eligible: false, text: "Devices with physical damage (cracked screen, water damage)" },
  { eligible: false, text: "Devices returned after 30-day window" },
  { eligible: false, text: "Devices missing original accessories or packaging" },
  { eligible: false, text: "Activated eSIM profiles (must be deactivated first)" },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full mb-6">
              <RefreshCw className="w-4 h-4 text-rose-500" />
              <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Returns &amp; Refunds</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Easy <span className="text-rose-500">Returns</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              30-day hassle-free returns with prepaid shipping labels and fast refunds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">4-Step Return Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((s, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-6 bg-white border border-[#dcdcdc] rounded-2xl text-center hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-black mx-auto mb-4">{s.step}</div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide mb-2">{s.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Requirements</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Return Eligibility</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibility.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: item.eligible ? -10 : 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className={`p-5 rounded-2xl border flex items-start gap-3 ${item.eligible ? "bg-white border-[#dcdcdc]" : "bg-rose-50/30 border-rose-100"}`}>
                {item.eligible ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                <span className={`text-sm font-bold ${item.eligible ? "text-[#0f172a]" : "text-rose-600"}`}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Policies */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Clock, title: "30-Day Window", desc: "Return any device within 30 days of delivery for a full refund." },
              { icon: Package, title: "Prepaid Labels", desc: "We provide free return shipping labels for all eligible returns." },
              { icon: Shield, title: "Refund Guarantee", desc: "Refunds processed within 3-5 business days after device inspection." },
            ].map((p, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#dcdcdc] rounded-2xl text-center">
                <div className="p-3 bg-rose-50 rounded-2xl w-fit mx-auto mb-3"><p.icon className="w-5 h-5 text-rose-500" /></div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide mb-2">{p.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Need Help With a Return?</h2>
          <p className="text-slate-500 font-medium mb-8">Our support team is available to walk you through the process.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg active:scale-95">
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
