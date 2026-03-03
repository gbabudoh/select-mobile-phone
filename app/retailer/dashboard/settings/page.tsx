"use client";
import React, { useState } from "react";
import { 
  Shield, Store, Globe, ArrowLeft, 
  Camera, Check, Lock, MapPin, DollarSign, 
  Clock, Save, Building2, 
  CreditCard, Share2, Users, Plus, 
  Settings2, Calendar,
  Facebook, Instagram, Twitter, Trash2,
  LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RetailerSettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" }[]>([]);

  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const SECTIONS = [
    { id: "store", title: "Store Identity", desc: "Logo, Brand Name & Public Info", icon: Store, bgColor: "bg-blue-50/50", textColor: "text-blue-600" },
    { id: "business", title: "Business & Tax", desc: "Legal Entity & Tax IDs (EIN)", icon: Building2, bgColor: "bg-orange-50/50", textColor: "text-orange-600" },
    { id: "payout", title: "Payout & Banking", desc: "Managed Payments & Bank History", icon: CreditCard, bgColor: "bg-emerald-50/50", textColor: "text-emerald-600" },
    { id: "hours", title: "Operating Hours", desc: "Weekly Schedule & Holiday Overrides", icon: Calendar, bgColor: "bg-rose-50/50", textColor: "text-rose-600" },
    { id: "social", title: "Social & Links", desc: "Connect Store Profiles & Web", icon: Share2, bgColor: "bg-sky-50/50", textColor: "text-sky-600" },
    { id: "team", title: "Team & Permissions", desc: "Manage Crew & Store Invites", icon: Users, bgColor: "bg-indigo-50/50", textColor: "text-indigo-600" },
    { id: "security", title: "Security & Access", desc: "Admin Passwords & 2FA Auth", icon: Shield, bgColor: "bg-purple-50/50", textColor: "text-purple-600" },
    { id: "regional", title: "Regional Settings", desc: "Market Default & System Currency", icon: Globe, bgColor: "bg-teal-50/50", textColor: "text-teal-600" },
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
      case "store": return <StoreInfoForm />;
      case "business": return <BusinessTaxForm />;
      case "payout": return <PayoutBankingForm />;
      case "hours": return <OperatingHoursForm />;
      case "social": return <SocialStorefrontForm />;
      case "team": return <TeamPermissionsForm />;
      case "security": return <SecurityForm />;
      case "regional": return <RegionalForm />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 antialiased font-sans">
      {/* Toast System */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`px-5 py-4 rounded-[1.25rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl border flex items-center gap-4 min-w-[340px] ${
                toast.type === "success" ? "bg-white/90 border-emerald-100/50 text-emerald-700" : "bg-white/90 border-rose-100/50 text-rose-700"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${toast.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">{toast.msg}</p>
                <p className="text-[10px] opacity-40 font-medium uppercase tracking-widest mt-0.5">Updated just now</p>
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
            <div className="mb-16">
              <div className="flex items-center gap-3 text-blue-500 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Settings2 className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs uppercase tracking-[0.25em]">Admin Portal</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#0f172a] tracking-tight mb-4">
                Store <span className="text-blue-500">Settings</span>
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                Configure your retail environment, legal identity, and team operations from a centralized dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
              {SECTIONS.map((section, idx) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setActiveSection(section.id)}
                  className="group relative flex flex-col items-start p-8 bg-white hover:bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 text-left cursor-pointer overflow-hidden"
                >
                  <div className={`p-4 ${section.bgColor} ${section.textColor} rounded-2xl group-hover:scale-110 transition-transform duration-500 mb-6`}>
                    <section.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{section.title}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">{section.desc}</p>
                  
                  <div className="mt-8 flex items-center gap-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-500">
                    <span className="text-[11px] font-bold uppercase tracking-widest">Update</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>

                  {/* Subtle background decoration */}
                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full ${section.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-1000 blur-3xl`} />
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
            className="bg-white/90 backdrop-blur-3xl rounded-[3.5rem] border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden min-h-[80vh]"
          >
            <div className="px-10 md:px-14 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/40 border-b border-slate-50">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setActiveSection(null)}
                  className="p-5 bg-slate-50 hover:bg-[#0f172a] text-[#0f172a] hover:text-white rounded-[1.75rem] transition-all shadow-sm hover:shadow-xl active:scale-90 cursor-pointer group"
                >
                  <ArrowLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    {React.createElement(SECTIONS.find(s => s.id === activeSection)?.icon || Store, { className: "w-5 h-5 font-bold" })}
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Management Module</span>
                  </div>
                  <h2 className="text-4xl font-extrabold text-[#0f172a] tracking-tight leading-none">
                    {SECTIONS.find(s => s.id === activeSection)?.title}
                  </h2>
                </div>
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-4 px-12 py-6 bg-[#0f172a] text-white rounded-[1.75rem] font-bold text-sm uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] active:scale-95 transition-all duration-300 disabled:opacity-50 group shadow-lg"
              >
                {isSaving ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                )}
                <span>{isSaving ? "Synchronizing..." : "Save Changes"}</span>
              </button>
            </div>

            <div className="p-10 md:p-16 overflow-y-auto max-h-[calc(100vh-14rem)] scrollbar-hide">
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

// --- REFINED FORM COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-14">
      <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-3">{title}</h3>
      <div className="w-16 h-1.5 bg-blue-500 rounded-full mb-4"></div>
      <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{subtitle}</p>
    </div>
  );
}

function InputWrapper({ label, children, icon: Icon }: { label: string; children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="space-y-4">
      <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1 leading-none">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />}
        <div className={Icon ? "pl-2" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
}

const inputStyles = "w-full pl-7 pr-7 py-6 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] focus:bg-white focus:border-blue-500/50 focus:ring-[12px] focus:ring-blue-500/5 transition-all outline-none font-semibold text-[#0f172a] placeholder:text-slate-300";
const iconInputStyles = "w-full pl-16 pr-7 py-6 bg-slate-50/50 border border-slate-100 rounded-[1.75rem] focus:bg-white focus:border-blue-500/50 focus:ring-[12px] focus:ring-blue-500/5 transition-all outline-none font-semibold text-[#0f172a] placeholder:text-slate-300";

function StoreInfoForm() { 
  return (
    <div className="space-y-20">
      <div className="flex flex-col md:flex-row items-center gap-14 p-12 bg-blue-50/30 rounded-[3rem] border border-blue-100/30">
        <div className="relative group">
          <div className="w-48 h-48 rounded-[2.5rem] bg-white border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden group-hover:border-blue-500/50 transition-all shadow-sm">
            <Store className="w-20 h-20 text-blue-500/20 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <button className="absolute -bottom-4 -right-4 p-5 bg-[#0f172a] text-white shadow-2xl rounded-[1.75rem] hover:scale-110 hover:bg-blue-600 transition-all cursor-pointer">
            <Camera className="w-7 h-7" />
          </button>
        </div>
        <div className="flex-1 space-y-5">
          <div className="inline-flex px-4 py-1.5 bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Brand Identity</div>
          <h4 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Corporate Branding</h4>
          <p className="text-slate-500 font-medium leading-relaxed">
            Your brand assets will be used across customer touchpoints including digital receipts, checkout pages, and marketing emails. 
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <InputWrapper label="Official Store Name">
          <input type="text" placeholder="Select Mobile Manhattan" className={inputStyles} defaultValue="Select Mobile Retail" />
        </InputWrapper>
        <InputWrapper label="Public Contact Email">
            <input type="email" placeholder="support@store.com" className={inputStyles} defaultValue="hello@selectmobile.nyc" />
        </InputWrapper>
        <div className="md:col-span-2">
            <InputWrapper label="Storefront Vanity URL">
                <div className="flex items-center">
                    <div className="px-7 py-6 bg-slate-100/50 text-slate-400 font-bold text-[13px] rounded-l-[1.75rem] border border-r-0 border-slate-100">selectmobile.io/r/</div>
                    <input type="text" placeholder="your-handle" className="flex-1 px-7 py-6 bg-slate-50/50 border border-slate-100 rounded-r-[1.75rem] focus:bg-white focus:border-blue-500/50 transition-all outline-none font-semibold text-[#0f172a]" defaultValue="manhattan-flagship" />
                </div>
            </InputWrapper>
        </div>
        <div className="md:col-span-2">
            <InputWrapper label="Store Narrative">
                <textarea rows={5} placeholder="Tell your story..." className={`${inputStyles} resize-none`} defaultValue="Providing intentional indulgence in mobile technology since 2024. Authorized flagship retailer for the NY Tri-state area." />
            </InputWrapper>
        </div>
      </div>
    </div>
  );
}

function BusinessTaxForm() {
    return (
        <div className="space-y-20">
            <div className="bg-orange-50/30 p-12 rounded-[3.5rem] border border-orange-100/30 flex items-start gap-10">
                <div className="p-5 bg-white rounded-2xl shadow-sm text-orange-600">
                    <Building2 className="w-10 h-10" />
                </div>
                <div>
                    <h4 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-2">Legal Compliance</h4>
                    <p className="text-slate-500 font-medium max-w-xl leading-relaxed">Verification of your business entity is required for tax reporting and regulatory compliance in your region.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InputWrapper label="Registered Entity Name">
                    <input type="text" className={inputStyles} defaultValue="SELECT MOBILE SOLUTIONS LLC" />
                </InputWrapper>
                <InputWrapper label="Business Structure">
                    <select className={`${inputStyles} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1.5rem_center] bg-no-repeat`}>
                        <option>LLC - Limited Liability Co.</option>
                        <option>Corporation (C-Corp/S-Corp)</option>
                        <option>Partnership</option>
                        <option>Sole Proprietorship</option>
                    </select>
                </InputWrapper>
                <InputWrapper label="Tax ID (EIN)">
                    <input type="password" placeholder="XX-XXXXXXX" className={inputStyles} value="99-8887766" readOnly />
                </InputWrapper>
                <InputWrapper label="Official Phone">
                    <input type="tel" className={inputStyles} defaultValue="+1 212-555-0198" />
                </InputWrapper>
                <div className="md:col-span-2">
                    <InputWrapper label="Legal Business Address">
                        <input type="text" placeholder="Street Address" className={inputStyles} defaultValue="789 Avenue of the Americas, Suite 400" />
                    </InputWrapper>
                </div>
                <div className="grid grid-cols-3 md:col-span-2 gap-6">
                    <InputWrapper label="City">
                        <input type="text" className={inputStyles} defaultValue="New York" />
                    </InputWrapper>
                    <InputWrapper label="State">
                        <input type="text" className={inputStyles} defaultValue="NY" />
                    </InputWrapper>
                    <InputWrapper label="Zip Code">
                        <input type="text" className={inputStyles} defaultValue="10001" />
                    </InputWrapper>
                </div>
            </div>
        </div>
    );
}

function PayoutBankingForm() {
    return (
        <div className="space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-[#0f172a] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10 opacity-60 uppercase tracking-widest font-bold text-[11px]">
                            <CreditCard className="w-5 h-5" />
                            Current Revenue Pool
                        </div>
                        <h4 className="text-6xl font-extrabold tracking-tighter mb-4">$12,840.<span className="opacity-30">50</span></h4>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <Check className="w-4 h-4" />
                            Verified & Ready for Payout
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3.5rem] flex flex-col justify-center">
                    <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">Settlement Frequency</h5>
                    <div className="space-y-4">
                        {['Instant', 'Daily', 'Weekly'].map((speed) => (
                            <button key={speed} className={`w-full py-5 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${speed === 'Weekly' ? 'bg-[#0f172a] text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-500/30 hover:text-blue-500'}`}>
                                {speed}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <SectionHeader title="Connected Institutions" subtitle="Payouts are automatically routed to your verified business accounts." />
                <div className="p-10 border border-slate-100 rounded-[3rem] bg-white flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-8">
                        <div className="p-6 bg-slate-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-50 transition-colors duration-500">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <div>
                            <h5 className="text-xl font-extrabold text-[#0f172a] tracking-tight">CHASE BUSINESS CHECKING</h5>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">BANKING ••• 9904 (VERIFIED)</p>
                        </div>
                    </div>
                    <button className="px-10 py-4 border-2 border-slate-100 text-[#0f172a] rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all cursor-pointer">Modify Account</button>
                </div>
            </div>
        </div>
    );
}

function OperatingHoursForm() {
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return (
        <div className="space-y-16">
            <SectionHeader title="Operating Schedule" subtitle="Your store availability dictates when customers can place priority pre-orders for same-day processing." />
            
            <div className="grid grid-cols-1 gap-4">
                {DAYS.map((day) => (
                    <div key={day} className="flex items-center justify-between p-7 bg-white border border-slate-100 rounded-[2.25rem] hover:ring-2 hover:ring-blue-500/5 hover:border-blue-500/20 transition-all duration-300 group">
                        <div className="flex items-center gap-8">
                           <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                               <Calendar className="w-6 h-6" />
                           </div>
                           <span className="text-lg font-bold text-[#0f172a] tracking-tight">{day}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <input type="text" defaultValue="09:00 AM" className="w-28 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-bold outline-none focus:bg-white focus:border-blue-500/30 transition-all" />
                                <span className="text-slate-300 font-extrabold text-xs uppercase tracking-widest">to</span>
                                <input type="text" defaultValue="06:00 PM" className="w-28 px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-bold outline-none focus:bg-white focus:border-blue-500/30 transition-all" />
                            </div>
                            <button className="relative w-14 h-7 bg-blue-500 rounded-full transition-colors cursor-pointer shadow-inner">
                                <div className="absolute right-1.5 top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow-md" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-12 bg-rose-50/50 rounded-[3.5rem] border border-rose-100/50 mt-20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 text-rose-500 mb-4">
                            <Clock className="w-6 h-6" />
                            <h5 className="text-lg font-extrabold uppercase tracking-tight">Holiday Sync</h5>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed">Schedule store closures and seasonal hours in advance to keep your customers informed and manage logistics.</p>
                    </div>
                    <button className="flex items-center gap-3 px-10 py-5 bg-white shadow-xl text-rose-500 border border-rose-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                        <Plus className="w-5 h-5" />
                        Add Override
                    </button>
                </div>
            </div>
        </div>
    );
}

function SocialStorefrontForm() {
    return (
        <div className="space-y-20">
            <SectionHeader title="Digital Footprint" subtitle="Sync your store across major platforms to increase brand recognition and trust." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InputWrapper label="Official Website" icon={Globe}>
                    <input type="url" placeholder="https://yourstore.com" className={iconInputStyles} defaultValue="https://selectmobile.io" />
                </InputWrapper>
                <InputWrapper label="Instagram" icon={Instagram}>
                    <input type="text" placeholder="@handle" className={iconInputStyles} defaultValue="@select_mobile" />
                </InputWrapper>
                <InputWrapper label="X (Twitter)" icon={Twitter}>
                    <input type="text" placeholder="@handle" className={iconInputStyles} defaultValue="@selectmobile" />
                </InputWrapper>
                <InputWrapper label="Facebook" icon={Facebook}>
                    <input type="text" placeholder="username" className={iconInputStyles} defaultValue="selectmobile" />
                </InputWrapper>
            </div>

            <div className="space-y-12">
                <SectionHeader title="Visual Environment" subtitle="Customize how your digital storefront looks to your customers." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-between group hover:shadow-xl transition-all">
                        <div>
                           <h6 className="font-extrabold text-[#0f172a] text-lg tracking-tight">Accent Palette</h6>
                           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">Primary Theme Color</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-500 shadow-xl border-4 border-white hover:scale-110 transition-transform cursor-pointer" />
                    </div>
                    <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-between group hover:shadow-xl transition-all">
                        <div>
                           <h6 className="font-extrabold text-[#0f172a] text-lg tracking-tight">Interface Mode</h6>
                           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">Forced System Dark Mode</p>
                        </div>
                        <button className="relative w-14 h-7 bg-slate-200 rounded-full transition-colors cursor-pointer shadow-inner">
                            <div className="absolute left-1.5 top-1.5 w-4 h-4 bg-white rounded-full shadow-md" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeamPermissionsForm() {
    const TEAM = [
        { name: 'John Doe', role: 'Owner', email: 'john@selectmobile.io', avatar: 'JD', color: 'bg-blue-50 text-blue-600' },
        { name: 'Marcus Chen', role: 'Manager', email: 'marcus@selectmobile.io', avatar: 'MC', color: 'bg-indigo-50 text-indigo-600' },
        { name: 'Sarah Miller', role: 'Staff', email: 'sarah@selectmobile.io', avatar: 'SM', color: 'bg-emerald-50 text-emerald-600' },
    ];

    return (
        <div className="space-y-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <SectionHeader title="Team Infrastructure" subtitle="Delegate store operations to your crew with granular access controls." />
                <button className="flex items-center gap-4 px-10 py-6 bg-[#0f172a] text-white rounded-[1.75rem] font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:shadow-2xl transition-all cursor-pointer shadow-lg active:scale-95">
                    <Plus className="w-6 h-6" />
                    Invite Member
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {TEAM.map((member) => (
                    <div key={member.email} className="p-8 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-between group hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center gap-10">
                            <div className={`w-16 h-16 rounded-[1.5rem] ${member.color} flex items-center justify-center font-extrabold text-lg transition-transform duration-500 group-hover:scale-105`}>
                                {member.avatar}
                            </div>
                            <div>
                                <h6 className="text-xl font-extrabold text-[#0f172a] tracking-tight">{member.name}</h6>
                                <p className="text-sm text-slate-400 font-medium leading-none mt-2">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-12">
                            <div className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest ${member.role === 'Owner' ? 'bg-[#0f172a] text-white shadow-lg' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                                {member.role}
                            </div>
                            <button className="p-4 text-slate-100 hover:text-rose-500 transition-colors duration-300 cursor-pointer group-hover:text-slate-200">
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecurityForm() { 
  return (
    <div className="space-y-24">
      <div className="bg-purple-50/30 border border-purple-100/30 p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-12">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-purple-600 shadow-[0_20px_40px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
          <Shield className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-2">Two-Factor Authentication</h4>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-4">
            <p className="text-slate-500 font-medium leading-relaxed max-w-xl">Enhance your store&apos;s security by requiring a verification code upon login from a trusted device.</p>
            <button className="relative w-16 h-8 bg-blue-500 rounded-full transition-colors cursor-pointer shadow-xl self-center lg:self-auto">
              <div className="absolute right-1.5 top-1.5 w-5 h-5 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        <SectionHeader title="Account Credentials" subtitle="Ensure your account remains safe by rotating your security credentials periodically." />
        <div className="grid grid-cols-1 gap-14">
          <InputWrapper label="Current Secure Password" icon={Lock}>
            <input type="password" placeholder="••••••••••••" className={iconInputStyles} />
          </InputWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            <InputWrapper label="New Dynamic Password" icon={Lock}>
              <input type="password" placeholder="New complexity level" className={iconInputStyles} />
            </InputWrapper>
            <InputWrapper label="Re-type New Password" icon={Lock}>
              <input type="password" placeholder="Confirm update" className={iconInputStyles} />
            </InputWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegionalForm() { 
  return (
    <div className="space-y-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="space-y-16">
          <SectionHeader title="Economic Market" subtitle="Select the primary jurisdiction for legal terms, taxes, and shipping logic." />
          <div className="flex p-2.5 bg-slate-50 rounded-[2.25rem] border border-slate-100 shadow-inner">
            <button className="flex-1 py-5 px-8 bg-white shadow-xl border border-slate-50 rounded-2xl font-extrabold text-[#0f172a] text-xs uppercase tracking-widest flex items-center justify-center gap-4">
              <MapPin className="w-5 h-5 text-blue-500" />
              United States
            </button>
            <button className="flex-1 py-5 px-8 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-[#0f172a] transition-all">
              Canada
            </button>
          </div>
          
          <InputWrapper label="Functional Currency">
            <div className="relative">
              <DollarSign className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
              <select className={`${iconInputStyles} appearance-none uppercase tracking-widest font-extrabold text-[13px] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_1.5rem_center] bg-no-repeat`}>
                <option>USD - United States Dollar ($)</option>
                <option>CAD - Canadian Dollar (C$)</option>
              </select>
            </div>
          </InputWrapper>
        </div>

        <div className="space-y-16">
          <SectionHeader title="Temporal Sync" subtitle="Synchronize your store operations with the regional time zone." />
          <InputWrapper label="Regional Timezone" icon={Clock}>
            <div className="relative">
              <select className={`${iconInputStyles} appearance-none uppercase tracking-widest font-extrabold text-[13px] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:24px_24px] bg-[right_1.5rem_center] bg-no-repeat`}>
                <option>(GMT-05:00) EASTERN TIME (US & CA)</option>
                <option>(GMT-06:00) CENTRAL TIME (US & CA)</option>
                <option>(GMT-07:00) MOUNTAIN TIME (US & CA)</option>
                <option>(GMT-08:00) PACIFIC TIME (US & CA)</option>
              </select>
            </div>
          </InputWrapper>

          <div className="p-12 bg-slate-900 rounded-[3.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Globe className="w-40 h-40 text-blue-500" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 text-blue-400 mb-6">
                    <Globe className="w-6 h-6" />
                    <h5 className="font-extrabold uppercase tracking-widest text-sm">Logistics Engine</h5>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed">
                    Automated customs handling is active. Cross-border shipping rates between US/CA are synchronized based on this market profile.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
