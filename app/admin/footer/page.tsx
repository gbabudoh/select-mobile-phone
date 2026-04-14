"use client";
import React, { useState } from "react";
import { Plus, Trash2, Save, GripVertical, ExternalLink, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FooterLink {
  id: string;
  label: string;
  href: string;
  isVisible: boolean;
}

interface FooterColumn {
  id: string;
  heading: string;
  isVisible: boolean;
  links: FooterLink[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    id: "1", heading: "Marketplace", isVisible: true,
    links: [
      { id: "l1", label: "Shop Phones", href: "/normal-order", isVisible: true },
      { id: "l2", label: "Preorder", href: "/preorder", isVisible: true },
      { id: "l3", label: "Compare & Save", href: "/tco-calculator", isVisible: true },
      { id: "l4", label: "Trade-In", href: "/trade-in", isVisible: true },
    ],
  },
  {
    id: "2", heading: "Company", isVisible: true,
    links: [
      { id: "l5", label: "About", href: "/about", isVisible: true },
      { id: "l6", label: "Careers", href: "/careers", isVisible: true },
      { id: "l7", label: "Press", href: "/press", isVisible: true },
      { id: "l8", label: "Contact", href: "/contact", isVisible: true },
    ],
  },
  {
    id: "3", heading: "Support", isVisible: true,
    links: [
      { id: "l9", label: "Help Center", href: "/help-center", isVisible: true },
      { id: "l10", label: "Escrow Policy", href: "/escrow-policy", isVisible: true },
      { id: "l11", label: "Shipping Info", href: "/shipping-info", isVisible: true },
      { id: "l12", label: "Returns", href: "/returns", isVisible: true },
    ],
  },
];

export default function AdminFooterPage() {
  const [columns, setColumns] = useState<FooterColumn[]>(DEFAULT_COLUMNS);
  const [editingCol, setEditingCol] = useState<string | null>(null);

  const addColumn = () => {
    setColumns([...columns, {
      id: Date.now().toString(),
      heading: "New Column",
      isVisible: true,
      links: [],
    }]);
  };

  const deleteColumn = (id: string) => {
    setColumns(columns.filter(c => c.id !== id));
  };

  const updateColumn = (id: string, updates: Partial<FooterColumn>) => {
    setColumns(columns.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addLink = (colId: string) => {
    setColumns(columns.map(c => {
      if (c.id !== colId) return c;
      return { ...c, links: [...c.links, { id: Date.now().toString(), label: "New Link", href: "/", isVisible: true }] };
    }));
  };

  const removeLink = (colId: string, linkId: string) => {
    setColumns(columns.map(c => {
      if (c.id !== colId) return c;
      return { ...c, links: c.links.filter(l => l.id !== linkId) };
    }));
  };

  const updateLink = (colId: string, linkId: string, updates: Partial<FooterLink>) => {
    setColumns(columns.map(c => {
      if (c.id !== colId) return c;
      return { ...c, links: c.links.map(l => l.id === linkId ? { ...l, ...updates } : l) };
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Footer Management</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage footer columns and navigation links</p>
        </div>
        <button onClick={addColumn} className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg shadow-[#0f172a]/20">
          <Plus className="w-4 h-4" /> Add Column
        </button>
      </div>

      {/* Footer Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white border rounded-3xl shadow-sm overflow-hidden transition-all ${
              col.isVisible ? "border-[#dcdcdc]" : "border-dashed border-slate-300 opacity-60"
            }`}
          >
            <div className="p-5 border-b border-[#dcdcdc] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                <input
                  type="text"
                  value={col.heading}
                  onChange={e => updateColumn(col.id, { heading: e.target.value })}
                  className="font-extrabold text-[#0f172a] bg-transparent border-none focus:outline-none text-sm uppercase"
                />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateColumn(col.id, { isVisible: !col.isVisible })} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-[#0f172a] transition-all cursor-pointer">
                  {col.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => deleteColumn(col.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-500 transition-all cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {col.links.map(link => (
                <div key={link.id} className="flex items-center gap-2 bg-slate-50/50 rounded-xl px-3 py-2 group border border-transparent hover:border-[#dcdcdc] transition-all">
                  <GripVertical className="w-3 h-3 text-slate-200 cursor-grab shrink-0" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={e => updateLink(col.id, link.id, { label: e.target.value })}
                      className="px-2 py-1 bg-transparent text-xs font-bold text-[#0f172a] focus:outline-none focus:bg-white focus:border-[#04a1c6]/20 rounded border border-transparent transition-all"
                    />
                    <div className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3 text-slate-300 shrink-0" />
                      <input
                        type="text"
                        value={link.href}
                        onChange={e => updateLink(col.id, link.id, { href: e.target.value })}
                        className="px-2 py-1 bg-transparent text-xs font-bold text-slate-400 focus:outline-none focus:bg-white focus:text-[#0f172a] rounded border border-transparent transition-all w-full"
                      />
                    </div>
                  </div>
                  <button onClick={() => removeLink(col.id, link.id)} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded text-slate-300 hover:text-rose-500 transition-all cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={() => addLink(col.id)} className="w-full py-2 border border-dashed border-[#dcdcdc] rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#04a1c6] hover:border-[#04a1c6]/30 transition-all cursor-pointer">
                + Add Link
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Preview */}
      <div className="bg-[#0f172a] rounded-3xl p-8 mt-8">
        <h3 className="text-[10px] font-black text-[#04a1c6] uppercase tracking-widest mb-6">Live Preview</h3>
        <div className="grid grid-cols-3 gap-8">
          {columns.filter(c => c.isVisible).map(col => (
            <div key={col.id}>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.filter(l => l.isVisible).map(link => (
                  <li key={link.id} className="text-sm text-white/50 hover:text-[#04a1c6] transition-colors cursor-pointer">{link.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg shadow-[#0f172a]/20">
          <Save className="w-3.5 h-3.5" /> Save Footer
        </button>
      </div>
    </div>
  );
}
