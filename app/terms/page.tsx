"use client";
import React from "react";
import {
  FileText, Shield, Users, DollarSign,
  AlertTriangle, Scale, Gavel, Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../../components/Navigation";

const sections = [
  {
    icon: Users,
    title: "1. Account Registration & Eligibility",
    content: [
      "You must be at least 18 years old to create an account on Select Mobile.",
      "You are responsible for maintaining the confidentiality of your login credentials and all activity under your account.",
      "Business accounts (Retailer, Wholesaler, Network Provider) require valid business registration and may be subject to additional verification.",
      "We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.",
    ]
  },
  {
    icon: DollarSign,
    title: "2. Orders, Payments & Escrow",
    content: [
      "All transactions on Select Mobile are protected by our escrow system. Funds are held until delivery is confirmed.",
      "Buyers must confirm receipt within 48 hours of delivery. If no dispute is filed, funds are automatically released to the seller.",
      "Preorders lock the quoted price and trade-in value at the time of submission. Cancellations are subject to our preorder policy.",
      "Payment processing is handled by PCI DSS-compliant third-party processors. Select Mobile does not store raw payment card data.",
      "Wholesale orders over $5,000 are subject to enhanced escrow with multi-point delivery confirmation.",
    ]
  },
  {
    icon: Shield,
    title: "3. Select-Verified Devices",
    content: [
      "Devices listed as \"Select-Verified\" have passed our 50-point remote diagnostic check, including IMEI authentication, activation lock status, battery health, and hardware integrity.",
      "Select-Verified status does not constitute a warranty. Devices are sold as described in their listing condition (New, Certified Pre-Owned, Refurbished).",
      "Sellers who misrepresent device condition are subject to account suspension, escrow fund reversal, and potential legal action.",
    ]
  },
  {
    icon: Scale,
    title: "4. Fees & Commissions",
    content: [
      "Buyer accounts are free. Sellers (Retailers, Wholesalers) may be subject to platform commission fees as outlined in their seller agreement.",
      "Network Providers are subject to revenue-sharing agreements as defined in their partner contracts.",
      "Commission rates, referral bonuses, and payout schedules are configurable in the dashboard Settings module.",
      "Select Mobile reserves the right to adjust fee structures with 30 days advance notice.",
    ]
  },
  {
    icon: AlertTriangle,
    title: "5. Prohibited Activities",
    content: [
      "Listing stolen, counterfeit, or blacklisted devices.",
      "Creating multiple accounts to circumvent suspension or manipulate reviews.",
      "Using bots, scrapers, or automated tools to interact with the platform without authorization.",
      "Circumventing the escrow system or conducting off-platform transactions for listings found on Select Mobile.",
      "Harassment, threats, or abusive communication toward other users or Select Mobile staff.",
    ]
  },
  {
    icon: Gavel,
    title: "6. Dispute Resolution",
    content: [
      "Disputes between buyers and sellers are first handled through our internal resolution team within 72 hours.",
      "If internal resolution is unsatisfactory, disputes may be escalated to binding arbitration under the rules of the American Arbitration Association (AAA).",
      "Class action waivers apply. Users agree to resolve disputes individually, not as part of a class or representative action.",
      "Canadian users: disputes are subject to the arbitration rules of the ADR Institute of Canada where applicable.",
    ]
  },
  {
    icon: FileText,
    title: "7. Intellectual Property",
    content: [
      "All content, branding, logos, and software on Select Mobile are the intellectual property of Select Mobile Inc.",
      "Seller-uploaded product listings and images remain the property of the seller, but grant Select Mobile a license to display them on the platform.",
      "Unauthorized reproduction, distribution, or modification of platform content is prohibited.",
    ]
  },
  {
    icon: Shield,
    title: "8. Limitation of Liability",
    content: [
      "Select Mobile acts as a marketplace facilitator and is not a party to transactions between buyers and sellers.",
      "We are not responsible for the condition, quality, or authenticity of devices beyond what is verified through our Select-Verified process.",
      "Our total liability for any claim shall not exceed the amount paid by you to Select Mobile in the 12 months preceding the claim.",
      "We are not liable for indirect, incidental, or consequential damages arising from use of the platform.",
    ]
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-6">
              <FileText className="w-4 h-4 text-violet-500" />
              <span className="text-[11px] font-black text-violet-600 uppercase tracking-widest">Legal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Terms of <span className="text-violet-500">Service</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              By using Select Mobile, you agree to these terms. Please read them carefully before creating an account or placing an order.
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Last Updated: March 1, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {sections.map((section, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="p-8 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-violet-50 rounded-xl"><section.icon className="w-5 h-5 text-violet-500" /></div>
                <h3 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 shrink-0" />
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
          <Mail className="w-8 h-8 text-violet-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Questions About These Terms?</h2>
          <p className="text-slate-500 font-medium mb-2">Contact our Legal team</p>
          <p className="text-sm font-bold text-violet-600">legal@selectmobilephone.com</p>
        </div>
      </section>
    </div>
  );
}
