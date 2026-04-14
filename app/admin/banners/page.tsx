"use client";
import React, { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, GripVertical, Eye, EyeOff, Save, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  desktopImg: string;
  mobileImg: string;
  gradient: string;
  sortOrder: number;
  isActive: boolean;
}

const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: "1", title: "iPhone 18 Pro Preorder", subtitle: "Lock in your trade-in value today. Be first in line.",
    ctaText: "Join the Queue", ctaLink: "/preorder",
    desktopImg: "https://images.unsplash.com/photo-1652887640398-4cdef235bc0c?q=80&w=2560&auto=format&fit=crop",
    mobileImg: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1080&auto=format&fit=crop",
    gradient: "from-black/80 to-transparent", sortOrder: 0, isActive: true,
  },
  {
    id: "2", title: "Your Carrier. Your Rules.", subtitle: "Skip the contract. Keep your phone. Save up to $800 over 24 months.",
    ctaText: "Calculate My Savings", ctaLink: "/tco-calculator",
    desktopImg: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2560&auto=format&fit=crop",
    mobileImg: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=1080&auto=format&fit=crop",
    gradient: "from-[#04a1c6]/80 to-black/40", sortOrder: 1, isActive: true,
  },
  {
    id: "3", title: "Premium Accessories", subtitle: "Tested, certified, and ready to ship. Gear that's built to last.",
    ctaText: "Shop Accessories", ctaLink: "/normal-order",
    desktopImg: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2560&auto=format&fit=crop",
    mobileImg: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1080&auto=format&fit=crop",
    gradient: "from-black/90 to-transparent", sortOrder: 2, isActive: true,
  },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerSlide[]>(DEFAULT_BANNERS);
  const [editing, setEditing] = useState<BannerSlide | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openNew = () => {
    setEditing({
      id: "", title: "", subtitle: "", ctaText: "", ctaLink: "",
      desktopImg: "", mobileImg: "", gradient: "from-black/80 to-transparent",
      sortOrder: banners.length, isActive: true,
    });
    setShowModal(true);
  };

  const openEdit = (banner: BannerSlide) => {
    setEditing({ ...banner });
    setShowModal(true);
  };

  const saveBanner = () => {
    if (!editing) return;
    if (editing.id) {
      setBanners(banners.map(b => b.id === editing.id ? editing : b));
    } else {
      setBanners([...banners, { ...editing, id: Date.now().toString() }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const deleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  const toggleActive = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Banner Management</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage hero carousel slides on the homepage</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg shadow-[#0f172a]/20"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((banner, i) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
              banner.isActive ? "border-[#dcdcdc]" : "border-dashed border-slate-300 opacity-60"
            }`}
          >
            <div className="flex items-stretch">
              {/* Thumbnail */}
              <div
                className="w-48 h-32 bg-cover bg-center shrink-0 relative"
                style={{ backgroundImage: `url(${banner.desktopImg})` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
                <div className="absolute bottom-2 left-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                    banner.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                  }`}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                  <div>
                    <h3 className="font-extrabold text-[#0f172a] mb-1">{banner.title}</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{banner.subtitle}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-[#04a1c6] bg-[#04a1c6]/5 px-2 py-0.5 rounded uppercase tracking-widest">{banner.ctaText}</span>
                      <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {banner.ctaLink}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(banner.id)} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-[#0f172a] transition-all cursor-pointer border border-transparent hover:border-[#dcdcdc]">
                    {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(banner)} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-[#04a1c6] transition-all cursor-pointer border border-transparent hover:border-[#dcdcdc]">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteBanner(banner.id)} className="p-2.5 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all cursor-pointer border border-transparent hover:border-rose-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {showModal && editing && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-[#dcdcdc]">
                <div className="p-6 border-b border-[#dcdcdc]">
                  <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-tight">{editing.id ? "Edit Banner" : "New Banner Slide"}</h2>
                </div>
                <div className="p-6 space-y-5">
                  <Field label="Title" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
                  <Field label="Subtitle" value={editing.subtitle} onChange={v => setEditing({ ...editing, subtitle: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="CTA Text" value={editing.ctaText} onChange={v => setEditing({ ...editing, ctaText: v })} />
                    <Field label="CTA Link" value={editing.ctaLink} onChange={v => setEditing({ ...editing, ctaLink: v })} />
                  </div>
                  <Field label="Desktop Image URL" value={editing.desktopImg} onChange={v => setEditing({ ...editing, desktopImg: v })} />
                  <Field label="Mobile Image URL" value={editing.mobileImg} onChange={v => setEditing({ ...editing, mobileImg: v })} />
                  <Field label="Gradient CSS" value={editing.gradient} onChange={v => setEditing({ ...editing, gradient: v })} />

                  {editing.desktopImg && (
                    <div className="rounded-2xl overflow-hidden border border-[#dcdcdc] h-40 relative">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${editing.desktopImg})` }} />
                      <div className={`absolute inset-0 bg-gradient-to-r ${editing.gradient}`} />
                      <div className="absolute bottom-3 left-4 text-white">
                        <p className="font-black text-lg">{editing.title || "Preview"}</p>
                        <p className="text-sm text-white/70">{editing.subtitle}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-[#dcdcdc] flex justify-end gap-3">
                  <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0f172a] transition-all cursor-pointer">Cancel</button>
                  <button onClick={saveBanner} className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg">
                    <Save className="w-3.5 h-3.5" /> Save Banner
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
      />
    </div>
  );
}
