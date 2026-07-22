"use client";
import React, { useState } from "react";
import { 
  Shield, Store, Globe, ArrowLeft, 
  Camera, Check, Lock, MapPin, DollarSign, 
  Clock, Save, Building2, 
  CreditCard, Share2, Users, Plus, 
  Settings2, Calendar,
  Facebook, Instagram, Twitter, Trash2,
  ExternalLink, CheckCircle2, AlertCircle, RefreshCw, X, LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RetailerSettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" | "info" }[]>([]);

  // ── Global Store Settings State ──
  const [storeName, setStoreName] = useState("Select Mobile Retail");
  const [contactEmail, setContactEmail] = useState("hello@selectmobile.nyc");
  const [vanityHandle, setVanityHandle] = useState("manhattan-flagship");
  const [storeNarrative, setStoreNarrative] = useState("Providing intentional indulgence in mobile technology since 2024. Authorized flagship retailer for the NY Tri-state area.");

  // Business State
  const [entityName, setEntityName] = useState("SELECT MOBILE SOLUTIONS LLC");
  const [businessStructure, setBusinessStructure] = useState("LLC - Limited Liability Co.");
  const [ein, setEin] = useState("99-8887766");
  const [phone, setPhone] = useState("+1 212-555-0198");
  const [streetAddress, setStreetAddress] = useState("789 Avenue of the Americas, Suite 400");
  const [city, setCity] = useState("New York");
  const [stateCode, setStateCode] = useState("NY");
  const [zipCode, setZipCode] = useState("10001");

  // Stripe Payout State
  const [stripeConnected, setStripeConnected] = useState(true);
  const [stripeAccountId, setStripeAccountId] = useState("acct_1N9x82K918471");
  const [bankName, setBankName] = useState("CHASE BUSINESS CHECKING");
  const [bankLast4, setBankLast4] = useState("9904");
  const [settlementFreq, setSettlementFreq] = useState<"Instant" | "Daily" | "Weekly">("Daily");

  // Social State
  const [websiteUrl, setWebsiteUrl] = useState("https://selectmobile.io");
  const [instagram, setInstagram] = useState("@select_mobile");
  const [twitter, setTwitter] = useState("@selectmobile");
  const [facebook, setFacebook] = useState("selectmobile");

  // Regional State
  const [jurisdiction, setJurisdiction] = useState<"US" | "CA">("US");
  const [currency, setCurrency] = useState("USD - United States Dollar ($)");
  const [timezone, setTimezone] = useState("(GMT-05:00) EASTERN TIME (US & CA)");

  // Team State
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "John Doe", role: "Owner", email: "john@selectmobile.io", avatar: "JD", color: "bg-blue-50 text-blue-600" },
    { id: "2", name: "Marcus Chen", role: "Manager", email: "marcus@selectmobile.io", avatar: "MC", color: "bg-indigo-50 text-indigo-600" },
    { id: "3", name: "Sarah Miller", role: "Staff", email: "sarah@selectmobile.io", avatar: "SM", color: "bg-emerald-50 text-emerald-600" },
  ]);

  // Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Modals
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Staff");

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const SECTIONS = [
    { id: "store", title: "Store Identity", desc: "Logo, Brand Name & Public Info", icon: Store, bgColor: "bg-blue-50/50", textColor: "text-blue-600" },
    { id: "business", title: "Business & Tax", desc: "Legal Entity & Tax IDs (EIN)", icon: Building2, bgColor: "bg-orange-50/50", textColor: "text-orange-600" },
    { id: "payout", title: "Payout & Banking", desc: "Stripe Express Connect & Bank Routing", icon: CreditCard, bgColor: "bg-emerald-50/50", textColor: "text-emerald-600" },
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
      addToast("Store settings synchronized & saved!");
    }, 900);
  };

  const handleStripeConnectToggle = () => {
    if (stripeConnected) {
      setStripeConnected(false);
      addToast("Stripe Express Account Disconnected", "info");
    } else {
      setStripeConnected(true);
      addToast("Stripe Express Account Connected Successfully!", "success");
    }
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    const initials = newMemberName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const newMember = {
      id: Date.now().toString(),
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      avatar: initials || "TM",
      color: "bg-[#04a1c6]/10 text-[#04a1c6]",
    };

    setTeamMembers(prev => [...prev, newMember]);
    setIsTeamModalOpen(false);
    setNewMemberName("");
    setNewMemberEmail("");
    addToast(`Invited ${newMemberName} to Store Team!`, "success");
  };

  const handleRemoveTeamMember = (id: string, memberName: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    addToast(`Removed ${memberName} from team.`, "info");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast("Please enter your current and new password.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match.", "error");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    addToast("Admin Password Updated Successfully!", "success");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 antialiased font-sans relative">
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
                toast.type === "error" ? "bg-white/90 border-rose-100/50 text-rose-700" :
                toast.type === "info" ? "bg-white/90 border-blue-100/50 text-blue-700" :
                "bg-white/90 border-emerald-100/50 text-emerald-700"
              }`}
            >
              <div className={`p-2.5 rounded-xl ${
                toast.type === "error" ? "bg-rose-50 text-rose-500" :
                toast.type === "info" ? "bg-blue-50 text-blue-500" :
                "bg-emerald-50 text-emerald-500"
              }`}>
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
                Configure your retail environment, legal identity, Stripe Express payouts, and team operations from a centralized dashboard.
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
                className="flex items-center justify-center gap-4 px-12 py-6 bg-[#0f172a] text-white rounded-[1.75rem] font-bold text-sm uppercase tracking-widest hover:bg-blue-600 hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] active:scale-95 transition-all duration-300 disabled:opacity-50 group shadow-lg cursor-pointer"
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
                {activeSection === "store" && (
                  <div className="space-y-12">
                    <SectionHeader title="Corporate Branding" subtitle="Your brand assets will be used across customer touchpoints including digital receipts, checkout pages, and marketing emails." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputWrapper label="Official Store Name">
                        <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <InputWrapper label="Public Contact Email">
                        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <div className="md:col-span-2">
                        <InputWrapper label="Storefront Vanity Handle">
                          <div className="flex items-center">
                            <div className="px-7 py-6 bg-slate-100/50 text-slate-400 font-bold text-[13px] rounded-l-[1.75rem] border border-r-0 border-slate-100">selectmobile.io/r/</div>
                            <input type="text" value={vanityHandle} onChange={(e) => setVanityHandle(e.target.value)} className="flex-1 px-7 py-6 bg-slate-50/50 border border-slate-100 rounded-r-[1.75rem] focus:bg-white focus:border-blue-500/50 transition-all outline-none font-semibold text-[#0f172a]" />
                          </div>
                        </InputWrapper>
                      </div>
                      <div className="md:col-span-2">
                        <InputWrapper label="Store Narrative">
                          <textarea rows={4} value={storeNarrative} onChange={(e) => setStoreNarrative(e.target.value)} className={`${inputStyles} resize-none`} />
                        </InputWrapper>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "business" && (
                  <div className="space-y-12">
                    <SectionHeader title="Legal Compliance" subtitle="Verification of your business entity is required for tax reporting and regulatory compliance in your region." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputWrapper label="Registered Entity Name">
                        <input type="text" value={entityName} onChange={(e) => setEntityName(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <InputWrapper label="Business Structure">
                        <select value={businessStructure} onChange={(e) => setBusinessStructure(e.target.value)} className={inputStyles}>
                          <option>LLC - Limited Liability Co.</option>
                          <option>Corporation (C-Corp/S-Corp)</option>
                          <option>Partnership</option>
                          <option>Sole Proprietorship</option>
                        </select>
                      </InputWrapper>
                      <InputWrapper label="Tax ID (EIN)">
                        <input type="text" value={ein} onChange={(e) => setEin(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <InputWrapper label="Official Phone">
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <div className="md:col-span-2">
                        <InputWrapper label="Legal Business Address">
                          <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className={inputStyles} />
                        </InputWrapper>
                      </div>
                      <div className="grid grid-cols-3 md:col-span-2 gap-4">
                        <InputWrapper label="City">
                          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputStyles} />
                        </InputWrapper>
                        <InputWrapper label="State">
                          <input type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputStyles} />
                        </InputWrapper>
                        <InputWrapper label="Zip Code">
                          <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={inputStyles} />
                        </InputWrapper>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "payout" && (
                  <div className="space-y-12">
                    <SectionHeader title="Stripe Express &amp; Direct Deposit" subtitle="Stripe Express manages your payouts securely, routing funds directly to your verified business checking account." />
                    
                    {/* Stripe Card */}
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-2xl space-y-6 border border-white/10 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-white/10 text-white backdrop-blur-md">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 block">Payout Engine</span>
                            <h4 className="text-xl font-black">Stripe Express Connect</h4>
                          </div>
                        </div>

                        {stripeConnected ? (
                          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Connected &amp; Verified
                          </span>
                        ) : (
                          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                            Disconnected
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Connected Account ID</span>
                          <p className="text-sm font-mono font-bold text-white">{stripeAccountId}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payout Destination Bank</span>
                          <p className="text-sm font-bold text-white">{bankName} (•••• {bankLast4})</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsStripeModalOpen(true)}
                          className="px-6 py-3 rounded-xl bg-white text-slate-900 font-black text-xs uppercase tracking-wider hover:bg-slate-100 cursor-pointer flex items-center gap-2"
                        >
                          <Settings2 className="w-4 h-4 text-indigo-600" /> Manage Stripe Express
                        </button>

                        <button
                          type="button"
                          onClick={handleStripeConnectToggle}
                          className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 cursor-pointer border border-white/10"
                        >
                          {stripeConnected ? "Disconnect Stripe" : "Re-Connect Stripe Express"}
                        </button>
                      </div>
                    </div>

                    {/* Settlement Frequency */}
                    <div className="bg-slate-50 border border-slate-200/80 p-8 rounded-[2.5rem] space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Stripe Settlement Frequency</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(["Instant", "Daily", "Weekly"] as const).map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => {
                              setSettlementFreq(freq);
                              addToast(`Stripe settlement set to ${freq}`, "info");
                            }}
                            className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border ${
                              settlementFreq === freq
                                ? "bg-[#0f172a] text-white border-[#0f172a] shadow-lg shadow-slate-900/20 scale-[1.02]"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "hours" && <OperatingHoursForm />}

                {activeSection === "social" && (
                  <div className="space-y-12">
                    <SectionHeader title="Digital Footprint" subtitle="Sync your store across major platforms to increase brand recognition and trust." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputWrapper label="Official Website">
                        <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <InputWrapper label="Instagram">
                        <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <InputWrapper label="X (Twitter)">
                        <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                      <InputWrapper label="Facebook">
                        <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} className={inputStyles} />
                      </InputWrapper>
                    </div>
                  </div>
                )}

                {activeSection === "team" && (
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <SectionHeader title="Team Infrastructure" subtitle="Delegate store operations to your crew with granular access controls." />
                      <button
                        onClick={() => setIsTeamModalOpen(true)}
                        className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all cursor-pointer shrink-0 shadow-lg active:scale-95 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Invite Member
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="p-6 bg-white border border-slate-200/80 rounded-[2rem] flex items-center justify-between group hover:shadow-xl transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${member.color} flex items-center justify-center font-black text-base shadow-sm`}>
                              {member.avatar}
                            </div>
                            <div>
                              <h4 className="text-base font-black text-[#0f172a]">{member.name}</h4>
                              <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                              {member.role}
                            </span>
                            {member.role !== "Owner" && (
                              <button
                                onClick={() => handleRemoveTeamMember(member.id, member.name)}
                                className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                                title="Remove team member"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "security" && (
                  <div className="space-y-12">
                    <SectionHeader title="Account Credentials &amp; 2FA" subtitle="Ensure your store account remains safe by rotating your security credentials periodically." />
                    <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
                      <InputWrapper label="Current Password">
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputStyles} placeholder="••••••••••••" />
                      </InputWrapper>
                      <InputWrapper label="New Password">
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputStyles} placeholder="Enter new password" />
                      </InputWrapper>
                      <InputWrapper label="Confirm New Password">
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputStyles} placeholder="Confirm new password" />
                      </InputWrapper>
                      <button type="submit" className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all cursor-pointer">
                        Update Password
                      </button>
                    </form>

                    <div className="p-8 bg-purple-50/50 border border-purple-100 rounded-[2.5rem] flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-[#0f172a]">Two-Factor Authentication (2FA)</h4>
                        <p className="text-xs text-slate-500 font-medium">Require an authenticator app code on login.</p>
                      </div>
                      <button
                        onClick={() => {
                          setTwoFactorEnabled(!twoFactorEnabled);
                          addToast(`2FA ${!twoFactorEnabled ? "Enabled" : "Disabled"}`, "info");
                        }}
                        className={`w-14 h-8 rounded-full transition-colors cursor-pointer relative p-1 ${
                          twoFactorEnabled ? "bg-purple-600" : "bg-slate-300"
                        }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${twoFactorEnabled ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === "regional" && (
                  <div className="space-y-12">
                    <SectionHeader title="Jurisdiction &amp; Currency" subtitle="Select the primary jurisdiction for legal terms, taxes, and shipping logic." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputWrapper label="Economic Jurisdiction">
                        <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value as "US" | "CA")} className={inputStyles}>
                          <option value="US">🇺🇸 United States Market</option>
                          <option value="CA">🇨🇦 Canadian Market</option>
                        </select>
                      </InputWrapper>
                      <InputWrapper label="Functional Currency">
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputStyles}>
                          <option>USD - United States Dollar ($)</option>
                          <option>CAD - Canadian Dollar (C$)</option>
                        </select>
                      </InputWrapper>
                      <div className="md:col-span-2">
                        <InputWrapper label="Regional Timezone">
                          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputStyles}>
                            <option>(GMT-05:00) EASTERN TIME (US &amp; CA)</option>
                            <option>(GMT-06:00) CENTRAL TIME (US &amp; CA)</option>
                            <option>(GMT-07:00) MOUNTAIN TIME (US &amp; CA)</option>
                            <option>(GMT-08:00) PACIFIC TIME (US &amp; CA)</option>
                          </select>
                        </InputWrapper>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stripe Express Manage Modal ── */}
      <AnimatePresence>
        {isStripeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsStripeModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] max-w-lg w-full p-7 md:p-9 shadow-2xl relative border border-white/50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a]">Stripe Express Account</h3>
                    <p className="text-xs text-slate-500 font-medium">Payout Routing &amp; Bank Settings</p>
                  </div>
                </div>
                <button onClick={() => setIsStripeModalOpen(false)} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Stripe Connected Account</span>
                  <p className="text-sm font-mono font-bold text-slate-900">{stripeAccountId}</p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Destination Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Account Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={bankLast4}
                    onChange={(e) => setBankLast4(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsStripeModalOpen(false);
                      addToast("Stripe Express Payout Bank Updated!", "success");
                    }}
                    className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    Save Payout Destination
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Team Invite Modal ── */}
      <AnimatePresence>
        {isTeamModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setIsTeamModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] max-w-lg w-full p-7 md:p-9 shadow-2xl relative border border-white/50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a]">Invite Team Member</h3>
                    <p className="text-xs text-slate-500 font-medium">Add a crew member to your store</p>
                  </div>
                </div>
                <button onClick={() => setIsTeamModalOpen(false)} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTeamMember} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="alex@selectmobile.io"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Access Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Manager">Manager (Full Inventory &amp; Sales Access)</option>
                    <option value="Staff">Staff (Listings &amp; Orders Only)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 mt-4 cursor-pointer"
                >
                  Send Invitation
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- REFINED FORM COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-2">{title}</h3>
      <div className="w-16 h-1.5 bg-blue-500 rounded-full mb-3"></div>
      <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{subtitle}</p>
    </div>
  );
}

function InputWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1 leading-none">{label}</label>
      <div>{children}</div>
    </div>
  );
}

const inputStyles = "w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-bold text-xs text-[#0f172a]";

function OperatingHoursForm() {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <div className="space-y-12">
      <SectionHeader title="Operating Schedule" subtitle="Your store availability dictates when customers can place priority pre-orders for same-day processing." />
      
      <div className="grid grid-cols-1 gap-3">
        {DAYS.map((day) => (
          <div key={day} className="flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-base font-black text-[#0f172a]">{day}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="text" defaultValue="09:00 AM" className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold outline-none" />
                <span className="text-slate-400 font-bold text-xs uppercase">to</span>
                <input type="text" defaultValue="06:00 PM" className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-bold outline-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
