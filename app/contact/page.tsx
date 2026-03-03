"use client";
import React, { useState } from "react";
import {
  Mail, Phone, MapPin, Send,
  MessageSquare, Clock, Building2,
  Check, Globe, Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "../../components/Navigation";

const offices = [
  { city: "New York", address: "350 Fifth Avenue, Suite 4400, New York, NY 10118", type: "Headquarters", timezone: "ET" },
  { city: "Arlington", address: "200 Telecom Blvd, Suite 1200, Arlington, VA 22201", type: "Network Operations", timezone: "ET" },
  { city: "Toronto", address: "100 King Street West, Suite 5600, Toronto, ON M5X 1C7", type: "Canadian Office", timezone: "ET" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Contact Us</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Get In <span className="text-emerald-500">Touch</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Have a question, partnership inquiry, or press request? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 border-y border-[#dcdcdc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Mail, title: "Email", value: "hello@selectmobile.com", sub: "General Inquiries" },
              { icon: Phone, title: "Phone", value: "+1 (212) 555-0100", sub: "Mon-Fri 9AM-6PM ET" },
              { icon: Headphones, title: "Support", value: "support@selectmobile.com", sub: "24/7 Help Center" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white border border-[#dcdcdc] rounded-2xl text-center hover:shadow-lg transition-all"
              >
                <div className="p-3 bg-emerald-50 rounded-2xl w-fit mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide mb-1">{item.title}</h4>
                <p className="text-sm font-bold text-[#0f172a]">{item.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Offices */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Send a Message</span>
              <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mt-3 mb-8">We&apos;ll Get Back to You</h2>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 bg-emerald-50 border border-emerald-200 rounded-3xl text-center"
                  >
                    <div className="p-4 bg-emerald-100 rounded-full w-fit mx-auto mb-4">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0f172a] uppercase tracking-wide mb-2">Message Sent</h3>
                    <p className="text-sm text-emerald-600 font-medium">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Your Name"
                          className="w-full px-6 py-4 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-sm text-[#0f172a] placeholder:text-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="you@example.com"
                          className="w-full px-6 py-4 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-sm text-[#0f172a] placeholder:text-slate-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-6 py-4 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-sm text-[#0f172a] appearance-none cursor-pointer"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="press">Press & Media</option>
                        <option value="support">Technical Support</option>
                        <option value="careers">Careers</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell us how we can help..."
                        className="w-full px-6 py-4 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none font-bold text-sm text-[#0f172a] placeholder:text-slate-300 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Office Locations */}
            <div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Our Offices</span>
              <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mt-3 mb-8">Find Us</h2>
              <div className="space-y-4">
                {offices.map((office, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-50 rounded-2xl shrink-0">
                        <Building2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide">{office.city}</h4>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">{office.type}</p>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 shrink-0" /> {office.address}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Mon-Fri 9:00 AM - 6:00 PM {office.timezone}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 p-8 bg-slate-50 border border-[#dcdcdc] rounded-2xl text-center">
                <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">3 Offices Across North America</p>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">New York · Arlington · Toronto</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
