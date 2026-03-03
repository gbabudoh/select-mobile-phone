"use client";
import React from "react";
import {
  Shield, Eye, Lock, Database,
  Cookie, Globe, Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../../components/Navigation";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Account information: name, email address, phone number, and shipping address provided during registration.",
      "Transaction data: order history, payment method details (tokenized), escrow records, and trade-in submissions.",
      "Device data: IMEI numbers, device diagnostics, eSIM profile identifiers submitted for Select-Verified checks.",
      "Usage data: pages visited, features used, search queries, and interaction patterns collected via analytics.",
      "Communication data: support tickets, chat transcripts, and email correspondence with our team.",
    ]
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "Process and fulfill orders, manage escrow transactions, and facilitate trade-in evaluations.",
      "Verify device authenticity through our 50-point diagnostic and IMEI blacklist checks.",
      "Provision eSIM profiles and manage subscriber activations with network provider partners.",
      "Personalize your experience, including AI Mobile Guide recommendations and TCO calculations.",
      "Communicate order updates, security alerts, and promotional offers (with your consent).",
      "Detect and prevent fraud, unauthorized access, and abuse of the platform.",
    ]
  },
  {
    icon: Globe,
    title: "Information Sharing",
    content: [
      "Network Providers: subscriber data required for eSIM provisioning and plan activation.",
      "Payment Processors: tokenized payment data for transaction processing and escrow management.",
      "Shipping Partners: name and address for order fulfillment and delivery tracking.",
      "Verification Services: IMEI and device data for authenticity and blacklist verification.",
      "We never sell your personal information to third parties for marketing purposes.",
    ]
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "All data is encrypted in transit (TLS 1.3) and at rest (AES-256) across our infrastructure.",
      "Payment information is tokenized and processed through PCI DSS Level 1 compliant partners.",
      "Access controls enforce role-based permissions with mandatory two-factor authentication for staff.",
      "Regular security audits, penetration testing, and SOC 2 Type II compliance monitoring.",
    ]
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      "Essential cookies: required for login sessions, cart functionality, and security features.",
      "Analytics cookies: help us understand usage patterns and improve the platform experience.",
      "Marketing cookies: used only with explicit consent for personalized promotions.",
      "You can manage cookie preferences at any time through your browser settings or our cookie banner.",
    ]
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: [
      "Access: request a copy of all personal data we hold about you.",
      "Correction: update or correct inaccurate personal information.",
      "Deletion: request deletion of your account and associated data (subject to legal retention requirements).",
      "Portability: receive your data in a machine-readable format.",
      "Opt-out: unsubscribe from marketing communications at any time.",
      "California residents have additional rights under the CCPA. Canadian users are protected under PIPEDA.",
    ]
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Legal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Privacy <span className="text-blue-500">Policy</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Your privacy matters. This policy explains how Select Mobile collects, uses, and protects your personal information.
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Last Updated: March 1, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {sections.map((section, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="p-8 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 rounded-xl"><section.icon className="w-5 h-5 text-blue-500" /></div>
                <h3 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Mail className="w-8 h-8 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Privacy Questions?</h2>
          <p className="text-slate-500 font-medium mb-2">Contact our Data Protection Officer</p>
          <p className="text-sm font-bold text-blue-600">privacy@selectmobilephone.com</p>
        </div>
      </section>
    </div>
  );
}
