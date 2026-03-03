"use client";
import React, { useState } from "react";
import {
  Building2, MapPin, DollarSign, Truck,
  Users, Key, Shield, Globe,
  ArrowLeft, Save, Check,
  Warehouse, Tag, Package, Zap,
  Lock, Clock, AlertTriangle,
  Settings2, LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WholesalerSettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" }[]>([]);

  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const SECTIONS = [
    { id: "business", title: "Business Profile", desc: "Legal Entity, Tax IDs & Company Info", icon: Building2, bgColor: "bg-blue-50/50", textColor: "text-blue-600" },
    { id: "warehouse", title: "Warehouse & Locations", desc: "Physical Infrastructure & Capacity", icon: Warehouse, bgColor: "bg-orange-50/50", textColor: "text-orange-600" },
    { id: "pricing", title: "Pricing & Tiers", desc: "Wholesale Markups & Volume Discounts", icon: Tag, bgColor: "bg-emerald-50/50", textColor: "text-emerald-600" },
    { id: "logistics", title: "Logistics & Shipping", desc: "Carriers, Zones & Freight Rules", icon: Truck, bgColor: "bg-rose-50/50", textColor: "text-rose-600" },
    { id: "partners", title: "Partner Access", desc: "Network Onboarding & Tier Rules", icon: Users, bgColor: "bg-sky-50/50", textColor: "text-sky-600" },
    { id: "api", title: "API & Integrations", desc: "Developer Keys & Webhooks", icon: Key, bgColor: "bg-indigo-50/50", textColor: "text-indigo-600" },
    { id: "security", title: "Security & Compliance", desc: "2FA, Sessions & Export Controls", icon: Shield, bgColor: "bg-purple-50/50", textColor: "text-purple-600" },
    { id: "regional", title: "Regional & Currency", desc: "Market Defaults & Tax Regions", icon: Globe, bgColor: "bg-teal-50/50", textColor: "text-teal-600" },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast("Settings updated successfully!");
    }, 1200);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "business": return <BusinessProfileForm />;
      case "warehouse": return <WarehouseForm />;
      case "pricing": return <PricingTiersForm />;
      case "logistics": return <LogisticsForm />;
      case "partners": return <PartnerAccessForm />;
      case "api": return <ApiIntegrationsForm />;
      case "security": return <SecurityForm />;
      case "regional": return <RegionalForm />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-10 antialiased font-sans">
      {/* Toast System */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`px-5 py-4 rounded-2xl shadow-xl backdrop-blur-3xl border flex items-center gap-4 min-w-[300px] ${
                toast.type === "success" ? "bg-white/90 border-emerald-100 text-emerald-700" : "bg-white/90 border-rose-100 text-rose-700"
              }`}
            >
              <div className={`p-2 rounded-xl ${toast.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest">{toast.msg}</p>
                <p className="text-[9px] opacity-40 font-bold uppercase tracking-widest mt-0.5">Updated just now</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {!activeSection ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="mb-14">
              <div className="flex items-center gap-3 text-blue-500 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Settings2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-[10px] uppercase tracking-[0.25em]">Distribution Hub</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">
                Wholesale <span className="text-blue-500">Settings</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm max-w-2xl leading-relaxed uppercase tracking-wide">
                Configure your distribution infrastructure, pricing logic, and partner network from a centralized dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pb-20">
              {SECTIONS.map((section, idx) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setActiveSection(section.id)}
                  className="group relative flex flex-col items-start p-7 bg-white hover:bg-slate-50/50 rounded-3xl border border-[#dcdcdc] shadow-sm hover:shadow-lg transition-all duration-500 text-left cursor-pointer overflow-hidden"
                >
                  <div className={`p-3.5 ${section.bgColor} ${section.textColor} rounded-2xl group-hover:scale-110 transition-transform duration-500 mb-5`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0f172a] mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors">{section.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-2">{section.desc}</p>
                  
                  <div className="mt-6 flex items-center gap-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest">Configure</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>

                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full ${section.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-1000 blur-3xl`} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/90 backdrop-blur-3xl rounded-3xl border border-[#dcdcdc] shadow-xl overflow-hidden min-h-[80vh]"
          >
            <div className="px-8 md:px-12 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 border-b border-[#dcdcdc]">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveSection(null)}
                  className="p-4 bg-slate-50 hover:bg-[#0f172a] text-[#0f172a] hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-xl active:scale-90 cursor-pointer group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    {React.createElement(SECTIONS.find(s => s.id === activeSection)?.icon || Settings2, { className: "w-4 h-4" })}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Configuration Module</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight leading-none">
                    {SECTIONS.find(s => s.id === activeSection)?.title}
                  </h2>
                </div>
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-50 group shadow-lg cursor-pointer"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                <span>{isSaving ? "Synchronizing..." : "Save Changes"}</span>
              </button>
            </div>

            <div className="p-8 md:p-14 overflow-y-auto max-h-[calc(100vh-14rem)] scrollbar-hide">
              <div className="max-w-4xl mx-auto">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- REUSABLE FORM COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">{title}</h3>
      <div className="w-12 h-1 bg-blue-500 rounded-full mb-3" />
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-2xl">{subtitle}</p>
    </div>
  );
}

function InputWrapper({ label, children, icon: Icon }: { label: string; children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />}
        <div className={Icon ? "pl-1" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
}

const inputStyles = "w-full px-6 py-4 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-sm text-[#0f172a] placeholder:text-slate-300";
const iconInputStyles = "w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-sm text-[#0f172a] placeholder:text-slate-300";
const selectStyles = "w-full px-6 py-4 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-sm text-[#0f172a] appearance-none cursor-pointer";

function ToggleSwitch({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl">
      <span className="text-[11px] font-black text-[#0f172a] uppercase tracking-widest">{label}</span>
      <button onClick={() => setChecked(!checked)} className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${checked ? "bg-blue-500" : "bg-slate-200"}`}>
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

// --- FORM MODULES ---

function BusinessProfileForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Legal Entity Information" subtitle="Your registered business identity used for contracts, invoices, and regulatory compliance." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Official Company Name" icon={Building2}>
          <input type="text" className={iconInputStyles} defaultValue="Global Distribution Holdings LLC" />
        </InputWrapper>
        <InputWrapper label="DBA / Trading As">
          <input type="text" className={inputStyles} defaultValue="Select Mobile Wholesale" />
        </InputWrapper>
        <InputWrapper label="Employer Identification Number (EIN)">
          <input type="text" className={inputStyles} defaultValue="87-1234567" placeholder="XX-XXXXXXX" />
        </InputWrapper>
        <InputWrapper label="Legal Entity Type">
          <select className={selectStyles} defaultValue="llc">
            <option value="llc">Limited Liability Company (LLC)</option>
            <option value="corp">C-Corporation</option>
            <option value="scorp">S-Corporation</option>
            <option value="sole">Sole Proprietorship</option>
            <option value="partner">Partnership</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Primary Contact Email" icon={Zap}>
          <input type="email" className={iconInputStyles} defaultValue="ops@selectmobilewholesale.com" />
        </InputWrapper>
        <InputWrapper label="Primary Phone">
          <input type="tel" className={inputStyles} defaultValue="+1 (212) 555-0142" />
        </InputWrapper>
        <div className="md:col-span-2">
          <InputWrapper label="Registered Business Address" icon={MapPin}>
            <input type="text" className={iconInputStyles} defaultValue="100 Commerce Blvd, Suite 400, Jersey City, NJ 07302" />
          </InputWrapper>
        </div>
      </div>
    </div>
  );
}

function WarehouseForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Warehouse Infrastructure" subtitle="Manage your physical distribution centers, capacity limits, and operating zones." />

      {[
        { name: "Primary Hub — Jersey City, NJ", address: "100 Commerce Blvd, Jersey City, NJ 07302", capacity: "50,000 units", utilization: "78%", status: "Active" },
        { name: "Secondary Hub — Dallas, TX", address: "2200 Logistics Pkwy, Dallas, TX 75201", capacity: "35,000 units", utilization: "62%", status: "Active" },
        { name: "West Coast Depot — Portland, OR", address: "800 Distribution Way, Portland, OR 97201", capacity: "20,000 units", utilization: "41%", status: "Active" }
      ].map((wh, idx) => (
        <div key={idx} className="p-6 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500"><Warehouse className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{wh.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{wh.address}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{wh.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#dcdcdc]/50 rounded-xl">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
              <p className="text-sm font-black text-[#0f172a]">{wh.capacity}</p>
            </div>
            <div className="p-4 bg-white border border-[#dcdcdc]/50 rounded-xl">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Utilization</p>
              <p className="text-sm font-black text-[#0f172a]">{wh.utilization}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Default Return Address" icon={MapPin}>
          <input type="text" className={iconInputStyles} defaultValue="100 Commerce Blvd, Jersey City, NJ 07302" />
        </InputWrapper>
        <InputWrapper label="Operating Hours">
          <input type="text" className={inputStyles} defaultValue="Mon-Fri 6:00 AM - 10:00 PM EST" />
        </InputWrapper>
      </div>
    </div>
  );
}

function PricingTiersForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Wholesale Pricing Rules" subtitle="Configure default markups, volume discount thresholds, and partner tier pricing." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Default Markup (%)" icon={DollarSign}>
          <input type="number" className={iconInputStyles} defaultValue="15" />
        </InputWrapper>
        <InputWrapper label="Minimum Order Quantity">
          <input type="number" className={inputStyles} defaultValue="10" />
        </InputWrapper>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Partner Tier Discounts</h4>
        {[
          { tier: "Gold Partners", discount: "12%", minOrders: "500+", color: "text-amber-600", bg: "bg-amber-50" },
          { tier: "Silver Partners", discount: "8%", minOrders: "200+", color: "text-slate-600", bg: "bg-slate-50" },
          { tier: "Bronze Partners", discount: "5%", minOrders: "50+", color: "text-orange-600", bg: "bg-orange-50" }
        ].map((t, idx) => (
          <div key={idx} className="p-5 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${t.bg} rounded-xl ${t.color}`}><Tag className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{t.tier}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Min {t.minOrders} lifetime orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input type="text" defaultValue={t.discount} className="w-20 px-4 py-3 bg-white border border-[#dcdcdc] rounded-xl text-center font-black text-sm text-[#0f172a] focus:border-blue-500 outline-none transition-all" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Discount</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Bulk Order Threshold (Auto-Discount)">
          <input type="number" className={inputStyles} defaultValue="100" />
        </InputWrapper>
        <InputWrapper label="Bulk Discount Rate (%)">
          <input type="number" className={inputStyles} defaultValue="3" />
        </InputWrapper>
      </div>
    </div>
  );
}

function LogisticsForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Shipping & Freight Configuration" subtitle="Manage preferred carriers, shipping zones, and freight cost rules." />

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Preferred Carriers</h4>
        {[
          { name: "FedEx Freight", type: "LTL/FTL", status: "Active" },
          { name: "UPS Supply Chain", type: "Ground/Express", status: "Active" },
          { name: "USPS Priority", type: "Small Parcel", status: "Disabled" }
        ].map((carrier, idx) => (
          <div key={idx} className="p-5 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500"><Truck className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{carrier.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{carrier.type}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${carrier.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
              {carrier.status}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Free Shipping Threshold ($)" icon={DollarSign}>
          <input type="number" className={iconInputStyles} defaultValue="10000" />
        </InputWrapper>
        <InputWrapper label="Default Shipping Zone">
          <select className={selectStyles} defaultValue="continental">
            <option value="continental">Continental US (48 States)</option>
            <option value="all_us">All US (Including AK/HI)</option>
            <option value="north_america">North America (US + CA)</option>
            <option value="global">Global</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Estimated Handling Time">
          <select className={selectStyles} defaultValue="1-2">
            <option value="same">Same Business Day</option>
            <option value="1-2">1-2 Business Days</option>
            <option value="3-5">3-5 Business Days</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Insurance Default">
          <select className={selectStyles} defaultValue="full">
            <option value="full">Full Value Coverage</option>
            <option value="partial">Partial Coverage (80%)</option>
            <option value="none">No Insurance</option>
          </select>
        </InputWrapper>
      </div>
    </div>
  );
}

function PartnerAccessForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Partner Network Rules" subtitle="Configure how new partners join your network and what permissions they receive." />

      <div className="space-y-4">
        <ToggleSwitch label="Auto-Approve New Partners" defaultChecked={false} />
        <ToggleSwitch label="Require Business Verification" defaultChecked={true} />
        <ToggleSwitch label="Allow Direct Messaging" defaultChecked={true} />
        <ToggleSwitch label="Share Inventory Levels with Partners" defaultChecked={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Minimum Partner Rating (1-5)">
          <input type="number" className={inputStyles} defaultValue="4.0" step="0.1" min="1" max="5" />
        </InputWrapper>
        <InputWrapper label="Partner Inactivity Timeout (Days)">
          <input type="number" className={inputStyles} defaultValue="90" />
        </InputWrapper>
        <InputWrapper label="Default Partner Tier">
          <select className={selectStyles} defaultValue="bronze">
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Max Active Partners">
          <input type="number" className={inputStyles} defaultValue="50" />
        </InputWrapper>
      </div>

      <div className="p-5 bg-blue-50/30 border border-blue-100/50 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-500 shrink-0"><Package className="w-4 h-4" /></div>
        <div>
          <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">Partner Onboarding</p>
          <p className="text-[10px] font-bold text-blue-500/70 uppercase tracking-widest">New partners will receive an onboarding email with your catalog, pricing tiers, and ordering instructions.</p>
        </div>
      </div>
    </div>
  );
}

function ApiIntegrationsForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Developer Access & Webhooks" subtitle="Manage API keys, webhook endpoints, and rate limits for your integrations." />

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">API Keys</h4>
        {[
          { name: "Production Key", key: "sk_live_••••••••••••••••4a2f", status: "Active", created: "Jan 15, 2025" },
          { name: "Staging Key", key: "sk_test_••••••••••••••••8b1c", status: "Active", created: "Mar 3, 2025" }
        ].map((apiKey, idx) => (
          <div key={idx} className="p-5 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500"><Key className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{apiKey.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 tracking-wider mt-0.5">{apiKey.key}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{apiKey.created}</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{apiKey.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <InputWrapper label="Webhook URL" icon={Zap}>
            <input type="url" className={iconInputStyles} defaultValue="https://api.selectmobilewholesale.com/webhooks/orders" />
          </InputWrapper>
        </div>
        <InputWrapper label="Rate Limit (Requests/Min)">
          <input type="number" className={inputStyles} defaultValue="1000" />
        </InputWrapper>
        <InputWrapper label="Webhook Secret">
          <input type="password" className={inputStyles} defaultValue="whsec_xxxxxxxxxxxx" />
        </InputWrapper>
      </div>

      <div className="p-5 bg-amber-50/30 border border-amber-100/50 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0"><AlertTriangle className="w-4 h-4" /></div>
        <div>
          <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-1">Security Notice</p>
          <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest">API keys grant full access to your account. Never share them publicly or commit them to version control.</p>
        </div>
      </div>
    </div>
  );
}

function SecurityForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Account Security & Compliance" subtitle="Protect your distribution account with advanced security controls." />

      <div className="space-y-4">
        <ToggleSwitch label="Two-Factor Authentication (2FA)" defaultChecked={true} />
        <ToggleSwitch label="Login Notifications via Email" defaultChecked={true} />
        <ToggleSwitch label="Require 2FA for All Team Members" defaultChecked={false} />
        <ToggleSwitch label="Export Compliance Screening (OFAC)" defaultChecked={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Current Password" icon={Lock}>
          <input type="password" className={iconInputStyles} placeholder="Enter current password" />
        </InputWrapper>
        <InputWrapper label="New Password" icon={Lock}>
          <input type="password" className={iconInputStyles} placeholder="Enter new password" />
        </InputWrapper>
        <InputWrapper label="Session Timeout (Minutes)" icon={Clock}>
          <input type="number" className={iconInputStyles} defaultValue="30" />
        </InputWrapper>
        <InputWrapper label="Max Concurrent Sessions">
          <input type="number" className={inputStyles} defaultValue="3" />
        </InputWrapper>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Recent Sessions</h4>
        {[
          { device: "Chrome on Windows", ip: "192.168.1.105", location: "Jersey City, NJ", time: "Active now" },
          { device: "Safari on macOS", ip: "10.0.0.42", location: "Dallas, TX", time: "2 hours ago" }
        ].map((session, idx) => (
          <div key={idx} className="p-5 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-500"><Shield className="w-4 h-4" /></div>
              <div>
                <h4 className="text-[11px] font-extrabold text-[#0f172a] uppercase tracking-wide">{session.device}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{session.ip} · {session.location}</p>
              </div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${session.time === "Active now" ? "text-emerald-500" : "text-slate-400"}`}>{session.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Market & Regional Defaults" subtitle="Configure the default currency, timezone, and tax region for your wholesale operations." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Default Currency" icon={DollarSign}>
          <select className={selectStyles} defaultValue="usd">
            <option value="usd">USD — US Dollar ($)</option>
            <option value="cad">CAD — Canadian Dollar (C$)</option>
            <option value="eur">EUR — Euro (€)</option>
            <option value="gbp">GBP — British Pound (£)</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Timezone" icon={Clock}>
          <select className={selectStyles} defaultValue="est">
            <option value="est">Eastern Time (ET)</option>
            <option value="cst">Central Time (CT)</option>
            <option value="mst">Mountain Time (MT)</option>
            <option value="pst">Pacific Time (PT)</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Primary Tax Region" icon={Globe}>
          <select className={selectStyles} defaultValue="us_nj">
            <option value="us_nj">United States — New Jersey</option>
            <option value="us_tx">United States — Texas</option>
            <option value="us_ca">United States — California</option>
            <option value="us_ny">United States — New York</option>
            <option value="ca_on">Canada — Ontario</option>
          </select>
        </InputWrapper>
        <InputWrapper label="System Language">
          <select className={selectStyles} defaultValue="en">
            <option value="en">English (US)</option>
            <option value="es">Spanish</option>
            <option value="fr">French (CA)</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Date Format">
          <select className={selectStyles} defaultValue="mdy">
            <option value="mdy">MM/DD/YYYY</option>
            <option value="dmy">DD/MM/YYYY</option>
            <option value="ymd">YYYY-MM-DD</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Weight Unit">
          <select className={selectStyles} defaultValue="lbs">
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </InputWrapper>
      </div>
    </div>
  );
}
