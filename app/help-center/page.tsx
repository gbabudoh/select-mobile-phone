"use client";
import React, { useState } from "react";
import {
  HelpCircle, Search, MessageSquare,
  Shield, Truck, CreditCard, RefreshCw,
  ChevronDown, ChevronUp, ExternalLink,
  Phone, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";

const faqCategories = [
  {
    title: "Orders & Purchases",
    icon: CreditCard,
    faqs: [
      { q: "How do I place a Normal Order?", a: "Navigate to the Normal Order page, browse devices, select your preferred model, and add it to cart. Proceed to checkout with your preferred payment method. All transactions are escrow-protected." },
      { q: "How does the Preorder Engine work?", a: "The Preorder Engine lets you reserve upcoming devices at a locked-in price. You can also lock your trade-in value at the time of preorder, guaranteeing maximum value for your current device." },
      { q: "Can I cancel an order?", a: "Orders can be cancelled within 1 hour of placement if they haven't entered the fulfillment pipeline. After that, you may initiate a return once the device is received." },
    ]
  },
  {
    title: "Escrow & Payments",
    icon: Shield,
    faqs: [
      { q: "What is Select-Verified Escrow?", a: "Every transaction on Select Mobile is protected by escrow. Funds are held securely until the buyer confirms receipt and the device passes our 50-point diagnostic check." },
      { q: "When are funds released to sellers?", a: "Funds are released 48 hours after delivery confirmation, provided the buyer has not opened a dispute. This ensures both parties are protected." },
      { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, Apple Pay, Google Pay, and ACH bank transfers for B2B wholesale transactions." },
    ]
  },
  {
    title: "Shipping & Delivery",
    icon: Truck,
    faqs: [
      { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee. Wholesale orders may have custom shipping timelines." },
      { q: "Do you ship to Canada?", a: "Yes! We ship to all provinces in Canada. Canadian orders include CRTC-certified devices and comply with all import regulations." },
      { q: "Can I track my order?", a: "Yes, all orders include real-time tracking. You will receive a tracking number via email once your order ships." },
    ]
  },
  {
    title: "Returns & Refunds",
    icon: RefreshCw,
    faqs: [
      { q: "What is the return policy?", a: "We offer a 30-day return window for all devices in original condition. Devices must be factory reset and include all original accessories." },
      { q: "How do refunds work?", a: "Refunds are processed within 3-5 business days after the returned device passes inspection. Funds are returned to the original payment method." },
      { q: "What if I received a defective device?", a: "Contact support immediately. Defective devices are eligible for expedited replacement or full refund under our Select-Verified guarantee." },
    ]
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Help Center</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              How Can We <span className="text-blue-500">Help?</span>
            </h1>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mt-8 group">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-[#dcdcdc] rounded-2xl shadow-lg text-base font-bold text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 border-y border-[#dcdcdc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: "Call Us", desc: "+1 (212) 555-0100", sub: "Mon-Fri 9AM-6PM ET", href: "/contact" },
              { icon: Mail, title: "Email Support", desc: "support@selectmobilephone.com", sub: "24-hour response time", href: "/contact" },
              { icon: MessageSquare, title: "Live Chat", desc: "Chat with our team", sub: "Available 24/7", href: "/contact" },
            ].map((item, idx) => (
              <Link key={idx} href={item.href}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-6 bg-white border border-[#dcdcdc] rounded-2xl text-center hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer group">
                  <div className="p-3 bg-blue-50 rounded-2xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide mb-1">{item.title}</h4>
                  <p className="text-sm font-bold text-[#0f172a]">{item.desc}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.sub}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Frequently Asked Questions</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Common Questions</h2>
          </div>
          <div className="space-y-10">
            {faqCategories.map((cat, catIdx) => (
              <div key={catIdx}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-blue-50 rounded-xl"><cat.icon className="w-4 h-4 text-blue-500" /></div>
                  <h3 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide">{cat.title}</h3>
                </div>
                <div className="space-y-3">
                  {cat.faqs.filter(faq => !searchQuery || faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, faqIdx) => {
                    const id = `${catIdx}-${faqIdx}`;
                    const isOpen = openFaq === id;
                    return (
                      <div key={faqIdx} className="border border-[#dcdcdc] rounded-2xl overflow-hidden hover:border-blue-100 transition-colors">
                        <button onClick={() => setOpenFaq(isOpen ? null : id)} className="w-full flex items-center justify-between p-5 text-left cursor-pointer">
                          <span className="text-sm font-bold text-[#0f172a]">{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-blue-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="px-5 pb-5 text-sm text-slate-500 font-medium leading-relaxed border-t border-[#dcdcdc]/50 pt-4">{faq.a}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Links */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Escrow Policy", desc: "How buyer protection works", href: "/escrow-policy", icon: Shield },
              { title: "Shipping Info", desc: "Delivery times and methods", href: "/shipping-info", icon: Truck },
              { title: "Returns", desc: "Return and refund process", href: "/returns", icon: RefreshCw },
            ].map((link, idx) => (
              <Link key={idx} href={link.href}>
                <div className="p-5 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer flex items-center gap-4 group">
                  <div className="p-2.5 bg-blue-50 rounded-xl"><link.icon className="w-4 h-4 text-blue-500" /></div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide group-hover:text-blue-600 transition-colors">{link.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
