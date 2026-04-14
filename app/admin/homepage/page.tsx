"use client";
import React, { useState } from "react";
import { Save, Eye, EyeOff, Plus, Trash2, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

interface SectionItem {
  icon?: string;
  title: string;
  description: string;
  value?: string;
  href?: string;
  cta?: string;
  step?: string;
}

interface HomepageSection {
  sectionKey: string;
  title: string;
  subtitle: string;
  content: SectionItem[];
  isVisible: boolean;
}

const DEFAULT_SECTIONS: HomepageSection[] = [
  {
    sectionKey: "stats_bar",
    title: "Platform Stats",
    subtitle: "Key performance metrics shown on the homepage",
    isVisible: true,
    content: [
      { title: "Devices Sold", value: "50K+", description: "" },
      { title: "Saved by Buyers", value: "$4.2M", description: "" },
      { title: "Escrow Success Rate", value: "98%", description: "" },
      { title: "Average Rating", value: "4.9★", description: "" },
    ],
  },
  {
    sectionKey: "features",
    title: "Built for smarter mobile buying",
    subtitle: "Every tool you need to buy, sell, and switch — without the guesswork.",
    isVisible: true,
    content: [
      { icon: "Calculator", title: "Compare & Save", description: "See the real cost of carrier contracts vs. buying unlocked.", href: "/tco-calculator", cta: "Run the numbers" },
      { icon: "ShieldCheck", title: "Verified Escrow Protection", description: "Every transaction is backed by a 50-point remote diagnostic check.", href: "/escrow-policy", cta: "How escrow works" },
      { icon: "Zap", title: "Instant eSIM Activation", description: "No waiting for a physical SIM in the mail.", href: "/normal-order", cta: "Shop unlocked phones" },
    ],
  },
  {
    sectionKey: "how_it_works",
    title: "How it works",
    subtitle: "From browsing to activated — in four simple steps.",
    isVisible: true,
    content: [
      { step: "01", icon: "Search", title: "Find your device", description: "Browse verified listings or use the AI Guide." },
      { step: "02", icon: "Calculator", title: "Compare real costs", description: "Run the cost calculator to see savings." },
      { step: "03", icon: "BadgeCheck", title: "Buy with escrow", description: "Your payment is held securely." },
      { step: "04", icon: "Zap", title: "Activate instantly", description: "Get your eSIM provisioned on the spot." },
    ],
  },
  {
    sectionKey: "trust_signals",
    title: "Why buyers choose Select Mobile",
    subtitle: "",
    isVisible: true,
    content: [
      { icon: "ShieldCheck", title: "50-Point Diagnostics", description: "Every device is remotely checked before funds are released." },
      { icon: "RefreshCw", title: "Hassle-Free Trade-In", description: "Get a fair quote, ship your old device, and receive credit instantly." },
      { icon: "Truck", title: "Fast Shipping", description: "Orders dispatched within 24 hours." },
      { icon: "Star", title: "4.9 Star Reviews", description: "Thousands of verified buyers trust us." },
    ],
  },
  {
    sectionKey: "cta",
    title: "Ready to pay less and get more?",
    subtitle: "Join thousands of buyers who have ditched overpriced contracts and switched to smarter mobile.",
    isVisible: true,
    content: [
      { title: "Get started free", href: "/register", description: "" },
      { title: "Calculate my savings", href: "/tco-calculator", description: "" },
    ],
  },
];

const TAB_LABELS: Record<string, string> = {
  stats_bar: "Stats Bar",
  features: "Features",
  how_it_works: "How It Works",
  trust_signals: "Trust Signals",
  cta: "CTA Banner",
};

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<HomepageSection[]>(DEFAULT_SECTIONS);
  const [activeTab, setActiveTab] = useState("stats_bar");

  const activeSection = sections.find(s => s.sectionKey === activeTab);

  const updateSection = (key: string, updates: Partial<HomepageSection>) => {
    setSections(sections.map(s => s.sectionKey === key ? { ...s, ...updates } : s));
  };

  const updateItem = (sectionKey: string, idx: number, updates: Partial<SectionItem>) => {
    setSections(sections.map(s => {
      if (s.sectionKey !== sectionKey) return s;
      const content = [...s.content];
      content[idx] = { ...content[idx], ...updates };
      return { ...s, content };
    }));
  };

  const addItem = (sectionKey: string) => {
    setSections(sections.map(s => {
      if (s.sectionKey !== sectionKey) return s;
      return { ...s, content: [...s.content, { title: "New Item", description: "", icon: "Star" }] };
    }));
  };

  const removeItem = (sectionKey: string, idx: number) => {
    setSections(sections.map(s => {
      if (s.sectionKey !== sectionKey) return s;
      return { ...s, content: s.content.filter((_, i) => i !== idx) };
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Homepage CMS</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage all homepage sections and their content</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-white border border-[#dcdcdc] rounded-2xl p-1.5 shadow-sm overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.sectionKey}
            onClick={() => setActiveTab(s.sectionKey)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
              activeTab === s.sectionKey
                ? "bg-[#0f172a] text-white shadow-lg"
                : "text-slate-400 hover:text-[#0f172a] hover:bg-slate-50"
            }`}
          >
            {!s.isVisible && <EyeOff className="w-3 h-3 opacity-50" />}
            {TAB_LABELS[s.sectionKey] || s.sectionKey}
          </button>
        ))}
      </div>

      {/* Section Editor */}
      {activeSection && (
        <motion.div
          key={activeSection.sectionKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#dcdcdc] rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Section Header */}
          <div className="p-6 border-b border-[#dcdcdc] flex items-center justify-between">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Section Title</label>
                <input
                  type="text"
                  value={activeSection.title}
                  onChange={e => updateSection(activeSection.sectionKey, { title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={activeSection.subtitle}
                  onChange={e => updateSection(activeSection.sectionKey, { subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <button
                onClick={() => updateSection(activeSection.sectionKey, { isVisible: !activeSection.isVisible })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                  activeSection.isVisible
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-50 text-slate-400 border-[#dcdcdc]"
                }`}
              >
                {activeSection.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {activeSection.isVisible ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>

          {/* Content Items */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Content Items ({activeSection.content.length})</h3>
              <button
                onClick={() => addItem(activeSection.sectionKey)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#04a1c6]/5 text-[#04a1c6] border border-[#04a1c6]/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#04a1c6]/10 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            {activeSection.content.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-slate-50/50 border border-[#dcdcdc] rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-slate-300 mt-3 cursor-grab shrink-0" />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.icon !== undefined && (
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Icon Name</label>
                        <input type="text" value={item.icon || ""} onChange={e => updateItem(activeSection.sectionKey, idx, { icon: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#dcdcdc] rounded-lg text-xs font-bold text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#04a1c6]/20 transition-all" />
                      </div>
                    )}
                    <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Title</label>
                      <input type="text" value={item.title} onChange={e => updateItem(activeSection.sectionKey, idx, { title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#dcdcdc] rounded-lg text-xs font-bold text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#04a1c6]/20 transition-all" />
                    </div>
                    {item.value !== undefined && (
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Value</label>
                        <input type="text" value={item.value || ""} onChange={e => updateItem(activeSection.sectionKey, idx, { value: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#dcdcdc] rounded-lg text-xs font-bold text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#04a1c6]/20 transition-all" />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
                      <textarea value={item.description} onChange={e => updateItem(activeSection.sectionKey, idx, { description: e.target.value })} rows={2}
                        className="w-full px-3 py-2 bg-white border border-[#dcdcdc] rounded-lg text-xs font-bold text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#04a1c6]/20 transition-all resize-none" />
                    </div>
                    {item.href !== undefined && (
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Link</label>
                        <input type="text" value={item.href || ""} onChange={e => updateItem(activeSection.sectionKey, idx, { href: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#dcdcdc] rounded-lg text-xs font-bold text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#04a1c6]/20 transition-all" />
                      </div>
                    )}
                    {item.cta !== undefined && (
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">CTA Label</label>
                        <input type="text" value={item.cta || ""} onChange={e => updateItem(activeSection.sectionKey, idx, { cta: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#dcdcdc] rounded-lg text-xs font-bold text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#04a1c6]/20 transition-all" />
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeItem(activeSection.sectionKey, idx)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-all cursor-pointer shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 border-t border-[#dcdcdc] flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg shadow-[#0f172a]/20">
              <Save className="w-3.5 h-3.5" /> Save Section
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
