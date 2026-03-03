"use client";
import React from "react";
import {
  Shield, Lock, CheckCircle2,
  DollarSign, AlertTriangle, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";

const steps = [
  { step: "1", title: "Buyer Places Order", desc: "Payment is captured and held in our secure escrow vault. Seller is notified to ship.", icon: DollarSign },
  { step: "2", title: "Seller Ships Device", desc: "Tracking is provided. The device undergoes a 50-point Select-Verified diagnostic upon arrival.", icon: Shield },
  { step: "3", title: "Buyer Confirms Receipt", desc: "Buyer has 48 hours to inspect the device and confirm it matches the listing description.", icon: CheckCircle2 },
  { step: "4", title: "Funds Released", desc: "After confirmation (or 48-hour auto-release), funds are deposited to the seller&apos;s account.", icon: Lock },
];

const protections = [
  { title: "50-Point Diagnostic", desc: "Every device is remotely verified for IMEI authenticity, activation lock status, battery health, and hardware integrity." },
  { title: "IMEI Blacklist Check", desc: "Devices are cross-referenced against global IMEI blacklists to ensure they are not reported lost or stolen." },
  { title: "48-Hour Inspection Window", desc: "Buyers have 48 hours after delivery to inspect the device and file a dispute if it doesn&apos;t match the listing." },
  { title: "Full Refund Guarantee", desc: "If a dispute is ruled in the buyer&apos;s favor, a full refund is issued from escrow within 3-5 business days." },
  { title: "Seller Protection", desc: "Sellers are protected against fraudulent chargebacks. Escrow ensures payment is verified before shipping." },
  { title: "B2B Wholesale Escrow", desc: "Bulk wholesale orders over $5,000 include enhanced escrow with multi-point delivery confirmation." },
];

export default function EscrowPolicyPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Buyer &amp; Seller Protection</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Escrow <span className="text-emerald-500">Policy</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Every transaction on Select Mobile is protected by our escrow system. Funds are held securely until both parties are satisfied.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How Escrow Works */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">4-Step Escrow Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="relative p-6 bg-white border border-[#dcdcdc] rounded-2xl text-center hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-black mx-auto mb-4">{s.step}</div>
                <div className="p-3 bg-emerald-50 rounded-2xl w-fit mx-auto mb-3"><s.icon className="w-5 h-5 text-emerald-500" /></div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide mb-2">{s.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protections */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">What&apos;s Protected</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Your Safeguards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {protections.map((p, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className="p-6 bg-white border border-[#dcdcdc] rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{p.title}</h4>
                </div>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dispute CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Need to File a Dispute?</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-xl mx-auto">If your device doesn&apos;t match the listing or arrives damaged, our disputes team will resolve it within 72 hours.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
