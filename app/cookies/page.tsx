"use client";
import React from "react";
import {
  Cookie, Shield, BarChart3, Megaphone,
  Mail, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "../../components/Navigation";

const cookieTypes = [
  {
    icon: Shield,
    title: "Strictly Necessary",
    required: true,
    desc: "Essential for the website to function. These cannot be disabled.",
    cookies: [
      { name: "session_id", purpose: "Maintains your login session", duration: "Session" },
      { name: "csrf_token", purpose: "Prevents cross-site request forgery", duration: "Session" },
      { name: "cart_data", purpose: "Stores your shopping cart contents", duration: "7 days" },
      { name: "cookie_consent", purpose: "Remembers your cookie preferences", duration: "1 year" },
    ]
  },
  {
    icon: BarChart3,
    title: "Analytics & Performance",
    required: false,
    desc: "Help us understand how visitors interact with the platform to improve the experience.",
    cookies: [
      { name: "_ga", purpose: "Google Analytics visitor tracking", duration: "2 years" },
      { name: "_gid", purpose: "Distinguishes unique users", duration: "24 hours" },
      { name: "perf_metrics", purpose: "Measures page load performance", duration: "30 days" },
    ]
  },
  {
    icon: Megaphone,
    title: "Marketing & Personalization",
    required: false,
    desc: "Used to deliver relevant promotions and personalize content with your consent.",
    cookies: [
      { name: "_fbp", purpose: "Facebook ad attribution", duration: "90 days" },
      { name: "promo_seen", purpose: "Tracks which promotions you have viewed", duration: "30 days" },
      { name: "ref_source", purpose: "Identifies your referral source", duration: "30 days" },
    ]
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full mb-6">
              <Cookie className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest">Cookie Policy</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Cookie <span className="text-amber-500">Policy</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              We use cookies to make Select Mobile faster, safer, and more personalized. Here&apos;s exactly what we use and why.
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Last Updated: March 1, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 border-y border-[#dcdcdc]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { value: "3", label: "Cookie Categories" },
              { value: "10", label: "Total Cookies Used" },
              { value: "100%", label: "Transparency" },
            ].map((stat, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <p className="text-4xl font-black text-[#0f172a] mb-1">{stat.value}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Categories */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          {cookieTypes.map((cat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="p-8 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 rounded-xl"><cat.icon className="w-5 h-5 text-amber-500" /></div>
                  <h3 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide">{cat.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cat.required ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                  {cat.required ? "Always Active" : "Optional"}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-6">{cat.desc}</p>

              {/* Cookie Table */}
              <div className="overflow-hidden rounded-xl border border-[#dcdcdc]">
                <div className="grid grid-cols-3 gap-0 bg-slate-50 border-b border-[#dcdcdc]">
                  <div className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Cookie Name</div>
                  <div className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Purpose</div>
                  <div className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</div>
                </div>
                {cat.cookies.map((cookie, ci) => (
                  <div key={ci} className={`grid grid-cols-3 gap-0 ${ci < cat.cookies.length - 1 ? "border-b border-[#dcdcdc]/50" : ""}`}>
                    <div className="px-4 py-3 text-xs font-mono font-bold text-[#0f172a]">{cookie.name}</div>
                    <div className="px-4 py-3 text-xs text-slate-500 font-medium">{cookie.purpose}</div>
                    <div className="px-4 py-3 text-xs font-bold text-slate-400">{cookie.duration}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Your Choices</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3">Managing Your Cookies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: "Browser Settings", desc: "Most browsers let you block or delete cookies in their privacy settings. Note that blocking essential cookies may break core functionality." },
              { title: "Cookie Banner", desc: "Use our on-site cookie banner to opt in or out of analytics and marketing cookies at any time." },
              { title: "Do Not Track", desc: "We respect the Do Not Track (DNT) browser signal. When enabled, we disable non-essential tracking." },
              { title: "Canadian Users (PIPEDA)", desc: "Under PIPEDA, you have the right to access, correct, or delete cookie-related data. Contact us to exercise these rights." },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#dcdcdc] rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{item.title}</h4>
                </div>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Mail className="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Cookie Questions?</h2>
          <p className="text-slate-500 font-medium mb-2">Contact our Privacy team</p>
          <p className="text-sm font-bold text-amber-600">privacy@selectmobilephone.com</p>
        </div>
      </section>
    </div>
  );
}
