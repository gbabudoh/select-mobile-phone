"use client";
import React from "react";
import {
  Truck, Package,
  Globe, Shield, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../../components/Navigation";

const shippingMethods = [
  { method: "Standard Shipping", time: "3-5 Business Days", price: "$4.99", desc: "USPS Priority Mail or Canada Post Expedited. Includes tracking." },
  { method: "Express Shipping", time: "1-2 Business Days", price: "$14.99", desc: "FedEx Express or UPS Next Day Air. Signature required on delivery." },
  { method: "Wholesale Freight", time: "5-10 Business Days", price: "Calculated at checkout", desc: "Palletized shipping for bulk orders. Includes insurance and multi-point delivery confirmation." },
  { method: "Free Shipping", time: "3-5 Business Days", price: "Free", desc: "Available on all consumer orders over $299 and wholesale orders over $5,000." },
];

const coverageZones = [
  { region: "Continental US", states: "48 States", time: "1-5 days", available: true },
  { region: "Alaska & Hawaii", states: "2 States", time: "5-10 days", available: true },
  { region: "Canada (Ontario, BC, Alberta)", states: "3 Provinces", time: "3-7 days", available: true },
  { region: "All Other Canadian Provinces", states: "10 Provinces", time: "5-10 days", available: true },
  { region: "US Territories", states: "PR, GU, USVI", time: "7-14 days", available: false },
];

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-6">
              <Truck className="w-4 h-4 text-violet-500" />
              <span className="text-[11px] font-black text-violet-600 uppercase tracking-widest">Shipping &amp; Delivery</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Shipping <span className="text-violet-500">Info</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Fast, reliable delivery across the United States and Canada with full tracking and insurance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Delivery Options</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Shipping Methods</h2>
          </div>
          <div className="space-y-4">
            {shippingMethods.map((s, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="p-6 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-50 rounded-xl shrink-0"><Truck className="w-5 h-5 text-violet-500" /></div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{s.method}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">{s.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivery</p>
                      <p className="text-sm font-extrabold text-[#0f172a]">{s.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cost</p>
                      <p className="text-sm font-extrabold text-violet-600">{s.price}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Zones */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Coverage</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Where We Ship</h2>
          </div>
          <div className="space-y-3">
            {coverageZones.map((zone, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className="p-5 bg-white border border-[#dcdcdc] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-violet-50 rounded-xl"><Globe className="w-4 h-4 text-violet-500" /></div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{zone.region}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{zone.states} · {zone.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${zone.available ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                  {zone.available ? "Available" : "Coming Soon"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: "Insured Shipments", desc: "Every package is fully insured against loss, theft, and damage during transit." },
              { icon: Zap, title: "Real-Time Tracking", desc: "Track your package from warehouse to doorstep with live updates and notifications." },
              { icon: Package, title: "Signature Required", desc: "Express and wholesale orders require a signature to ensure secure delivery." },
            ].map((g, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#dcdcdc] rounded-2xl text-center">
                <div className="p-3 bg-violet-50 rounded-2xl w-fit mx-auto mb-3"><g.icon className="w-5 h-5 text-violet-500" /></div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide mb-2">{g.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
