"use client";
import React, { useState } from "react";
import { Search as SearchIcon, Plus, Save, Trash2, Eye, Globe, Code, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SeoConfig {
  id: string;
  pagePath: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robotsDirective: string;
}

const DEFAULT_SEO: SeoConfig[] = [
  { id: "1", pagePath: "/", title: "Select Mobile Phone — Buy, Sell & Trade Unlocked Phones", description: "The smartest marketplace for buying and selling unlocked mobile phones in the US and Canada.", ogTitle: "Select Mobile Phone", ogDescription: "Buy, sell, and trade unlocked phones with escrow protection", ogImage: "/og-home.jpg", canonicalUrl: "https://selectmobilephone.com", robotsDirective: "index,follow" },
  { id: "2", pagePath: "/preorder", title: "Preorder the Latest Phones — Select Mobile", description: "Be first in line for the newest smartphones. Lock in your trade-in value today.", ogTitle: "Preorder Phones", ogDescription: "Preorder the latest flagship phones and lock in trade-in value", ogImage: "/og-preorder.jpg", canonicalUrl: "https://selectmobilephone.com/preorder", robotsDirective: "index,follow" },
  { id: "3", pagePath: "/tco-calculator", title: "Total Cost Calculator — Compare Carrier vs Unlocked", description: "Calculate your true mobile phone cost over 24 months. See how much you save buying unlocked.", ogTitle: "Phone Cost Calculator", ogDescription: "Compare carrier contract vs unlocked phone costs", ogImage: "/og-tco.jpg", canonicalUrl: "https://selectmobilephone.com/tco-calculator", robotsDirective: "index,follow" },
  { id: "4", pagePath: "/about", title: "About Select Mobile — Our Mission", description: "Learn about Select Mobile's mission to make mobile phone buying transparent and fair.", ogTitle: "About Us", ogDescription: "Our mission for transparent mobile commerce", ogImage: "/og-about.jpg", canonicalUrl: "https://selectmobilephone.com/about", robotsDirective: "index,follow" },
  { id: "5", pagePath: "/normal-order", title: "Shop Unlocked Phones — Select Mobile", description: "Browse verified, unlocked phones from trusted sellers. Escrow-protected transactions.", ogTitle: "Shop Phones", ogDescription: "Browse verified unlocked phones", ogImage: "/og-shop.jpg", canonicalUrl: "https://selectmobilephone.com/normal-order", robotsDirective: "index,follow" },
];

export default function AdminSeoPage() {
  const [seoConfigs, setSeoConfigs] = useState<SeoConfig[]>(DEFAULT_SEO);
  const [editing, setEditing] = useState<SeoConfig | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const openEditor = (config: SeoConfig) => {
    setEditing({ ...config });
    setShowEditor(true);
  };

  const openNew = () => {
    setEditing({ id: "", pagePath: "/", title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", canonicalUrl: "", robotsDirective: "index,follow" });
    setShowEditor(true);
  };

  const saveSeo = () => {
    if (!editing) return;
    if (editing.id) {
      setSeoConfigs(seoConfigs.map(s => s.id === editing.id ? editing : s));
    } else {
      setSeoConfigs([...seoConfigs, { ...editing, id: Date.now().toString() }]);
    }
    setShowEditor(false);
    setEditing(null);
  };

  const deleteSeo = (id: string) => {
    setSeoConfigs(seoConfigs.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">SEO Management</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage meta tags, Open Graph data, and search engine directives</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg shadow-[#0f172a]/20">
          <Plus className="w-4 h-4" /> Add Page
        </button>
      </div>

      {/* SEO Table */}
      <div className="bg-white border border-[#dcdcdc] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-[#dcdcdc]">
              <th className="text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Page Path</th>
              <th className="text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Title Tag</th>
              <th className="text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Robots</th>
              <th className="text-right px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {seoConfigs.map((config, i) => (
              <motion.tr
                key={config.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#04a1c6]" />
                    <span className="font-extrabold text-sm text-[#0f172a]">{config.pagePath}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-600 truncate max-w-sm">{config.title}</p>
                  <p className="text-[9px] text-slate-400 truncate max-w-sm mt-0.5">{config.description}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    config.robotsDirective === "index,follow" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  }`}>{config.robotsDirective}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditor(config)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#04a1c6] transition-all cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteSeo(config.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setShowEditor(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-[#dcdcdc]">
                <div className="p-6 border-b border-[#dcdcdc]">
                  <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-tight">{editing.id ? "Edit SEO Config" : "New SEO Page"}</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <SeoField label="Page Path" value={editing.pagePath} onChange={v => setEditing({ ...editing, pagePath: v })} placeholder="/" />
                    <SeoField label="Robots Directive" value={editing.robotsDirective} onChange={v => setEditing({ ...editing, robotsDirective: v })} placeholder="index,follow" />
                  </div>
                  <SeoField label="Title Tag" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} placeholder="Page Title — Brand Name" />
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Meta Description</label>
                    <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all resize-none"
                      placeholder="Compelling description for search results..."
                    />
                    <p className={`text-[9px] font-bold mt-1 ${editing.description.length > 160 ? "text-rose-500" : "text-slate-400"}`}>{editing.description.length}/160 characters</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <SeoField label="OG Title" value={editing.ogTitle} onChange={v => setEditing({ ...editing, ogTitle: v })} placeholder="Open Graph Title" />
                    <SeoField label="OG Image URL" value={editing.ogImage} onChange={v => setEditing({ ...editing, ogImage: v })} placeholder="/og-image.jpg" />
                  </div>
                  <SeoField label="Canonical URL" value={editing.canonicalUrl} onChange={v => setEditing({ ...editing, canonicalUrl: v })} placeholder="https://selectmobilephone.com/page" />

                  {/* Google Search Preview */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <SearchIcon className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Search Results Preview</span>
                    </div>
                    <div className="p-4 bg-white border border-[#dcdcdc] rounded-xl">
                      <p className="text-sm text-[#1a0dab] font-normal leading-snug">{editing.title || "Page Title"}</p>
                      <p className="text-xs text-emerald-700 mt-0.5">{editing.canonicalUrl || "https://selectmobilephone.com"}</p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{editing.description || "Meta description will appear here..."}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-[#dcdcdc] flex justify-end gap-3">
                  <button onClick={() => setShowEditor(false)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0f172a] transition-all cursor-pointer">Cancel</button>
                  <button onClick={saveSeo} className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg">
                    <Save className="w-3.5 h-3.5" /> Save SEO
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SeoField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
      />
    </div>
  );
}
