"use client";
import React, { useState } from "react";
import {
  Radio, Signal, Shield, Bell,
  ArrowLeft, Save, Check,
  Building2, MapPin, Key, Zap,
  Lock, Clock, Globe, Wifi,
  Server, AlertTriangle, Smartphone,
  Settings2, LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NetworkProviderSettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" }[]>([]);

  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const SECTIONS = [
    { id: "carrier", title: "Carrier Profile", desc: "MVNO Identity, Branding & Licenses", icon: Radio, bgColor: "bg-blue-50/50", textColor: "text-blue-600" },
    { id: "network", title: "Network Config", desc: "Coverage Bands, APN & Roaming Rules", icon: Signal, bgColor: "bg-violet-50/50", textColor: "text-violet-600" },
    { id: "esim", title: "eSIM Infrastructure", desc: "SM-DP+ Servers & Profile Management", icon: Smartphone, bgColor: "bg-orange-50/50", textColor: "text-orange-600" },
    { id: "api", title: "API & Webhooks", desc: "Endpoints, Keys & Rate Limits", icon: Key, bgColor: "bg-indigo-50/50", textColor: "text-indigo-600" },
    { id: "billing", title: "Billing & Payouts", desc: "Revenue Splits & Bank Details", icon: Building2, bgColor: "bg-emerald-50/50", textColor: "text-emerald-600" },
    { id: "alerts", title: "System Alerts", desc: "Outage Triggers & Notifications", icon: Bell, bgColor: "bg-rose-50/50", textColor: "text-rose-600" },
    { id: "security", title: "Security & Access", desc: "2FA, Sessions & Team Roles", icon: Shield, bgColor: "bg-purple-50/50", textColor: "text-purple-600" },
    { id: "regional", title: "Regional & Compliance", desc: "FCC, CRTC & Market Regulations", icon: Globe, bgColor: "bg-teal-50/50", textColor: "text-teal-600" },
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
      case "carrier": return <CarrierProfileForm />;
      case "network": return <NetworkConfigForm />;
      case "esim": return <ESimInfraForm />;
      case "api": return <ApiWebhooksForm />;
      case "billing": return <BillingPayoutsForm />;
      case "alerts": return <SystemAlertsForm />;
      case "security": return <SecurityForm />;
      case "regional": return <RegionalComplianceForm />;
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
                <span className="font-bold text-[10px] uppercase tracking-[0.25em]">Network Operations</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">
                Provider <span className="text-blue-500">Settings</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm max-w-2xl leading-relaxed uppercase tracking-wide">
                Configure your network infrastructure, eSIM provisioning, billing logic, and compliance from a centralized dashboard.
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

function CarrierProfileForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="MVNO Identity & Licensing" subtitle="Your registered carrier identity used for regulatory filings, subscriber agreements, and marketplace branding." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Carrier Brand Name" icon={Radio}>
          <input type="text" className={iconInputStyles} defaultValue="Select Mobile MVNO" />
        </InputWrapper>
        <InputWrapper label="Legal Entity Name" icon={Building2}>
          <input type="text" className={iconInputStyles} defaultValue="Select Mobile Networks LLC" />
        </InputWrapper>
        <InputWrapper label="FCC Registration Number (FRN)">
          <input type="text" className={inputStyles} defaultValue="0029345678" placeholder="10-digit FRN" />
        </InputWrapper>
        <InputWrapper label="MVNO License Type">
          <select className={selectStyles} defaultValue="full">
            <option value="full">Full MVNO (Own Core)</option>
            <option value="light">Light MVNO (Reseller)</option>
            <option value="thick">Thick MVNO (Own HLR/HSS)</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Host MNO (Upstream Carrier)">
          <select className={selectStyles} defaultValue="tmo">
            <option value="tmo">T-Mobile US</option>
            <option value="att">AT&T</option>
            <option value="verizon">Verizon Wireless</option>
            <option value="dish">DISH Network</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Primary Contact Email" icon={Zap}>
          <input type="email" className={iconInputStyles} defaultValue="noc@selectmobilenetworks.com" />
        </InputWrapper>
        <div className="md:col-span-2">
          <InputWrapper label="Headquarters Address" icon={MapPin}>
            <input type="text" className={iconInputStyles} defaultValue="200 Telecom Blvd, Suite 1200, Arlington, VA 22201" />
          </InputWrapper>
        </div>
      </div>
    </div>
  );
}

function NetworkConfigForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Coverage Bands & APN Configuration" subtitle="Configure your network access parameters, supported frequency bands, and roaming agreements." />

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Supported Frequency Bands</h4>
        {[
          { band: "n71 (600 MHz)", type: "5G Low-Band", status: "Enabled" },
          { band: "n41 (2.5 GHz)", type: "5G Mid-Band", status: "Enabled" },
          { band: "n260 (39 GHz)", type: "5G mmWave", status: "Enabled" },
          { band: "Band 66 (AWS-3)", type: "LTE", status: "Enabled" },
          { band: "Band 71 (600 MHz)", type: "LTE Extended", status: "Disabled" }
        ].map((band, idx) => (
          <div key={idx} className="p-5 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-50 rounded-xl text-violet-500"><Signal className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{band.band}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{band.type}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${band.status === "Enabled" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
              {band.status}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Default APN" icon={Wifi}>
          <input type="text" className={iconInputStyles} defaultValue="selectmobile.mvno" />
        </InputWrapper>
        <InputWrapper label="APN Protocol">
          <select className={selectStyles} defaultValue="ipv4v6">
            <option value="ipv4">IPv4 Only</option>
            <option value="ipv6">IPv6 Only</option>
            <option value="ipv4v6">IPv4/IPv6 Dual Stack</option>
          </select>
        </InputWrapper>
        <InputWrapper label="MCC (Mobile Country Code)">
          <input type="text" className={inputStyles} defaultValue="310" />
        </InputWrapper>
        <InputWrapper label="MNC (Mobile Network Code)">
          <input type="text" className={inputStyles} defaultValue="999" />
        </InputWrapper>
      </div>

      <div className="space-y-4">
        <ToggleSwitch label="Enable Domestic Roaming" defaultChecked={true} />
        <ToggleSwitch label="Enable International Roaming" defaultChecked={false} />
        <ToggleSwitch label="VoLTE (Voice over LTE)" defaultChecked={true} />
        <ToggleSwitch label="VoNR (Voice over New Radio / 5G)" defaultChecked={false} />
      </div>
    </div>
  );
}

function ESimInfraForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="eSIM Provisioning Infrastructure" subtitle="Manage your SM-DP+ server connections, profile templates, and provisioning rules." />

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SM-DP+ Servers</h4>
        {[
          { name: "Primary SM-DP+", url: "smdp.selectmobile.com", provider: "Thales", status: "Connected" },
          { name: "Failover SM-DP+", url: "smdp-backup.selectmobile.com", provider: "G+D", status: "Standby" }
        ].map((srv, idx) => (
          <div key={idx} className="p-5 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500"><Server className="w-4 h-4" /></div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide">{srv.name}</h4>
                <p className="text-[9px] font-mono text-slate-400 tracking-wider">{srv.url} · {srv.provider}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${srv.status === "Connected" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
              {srv.status}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Default Profile Template">
          <select className={selectStyles} defaultValue="consumer">
            <option value="consumer">Consumer (Voice + Data)</option>
            <option value="data_only">Data-Only</option>
            <option value="iot">IoT / M2M</option>
            <option value="enterprise">Enterprise Multi-Line</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Max Profiles per Device">
          <input type="number" className={inputStyles} defaultValue="5" />
        </InputWrapper>
        <InputWrapper label="Profile Activation Timeout (Sec)">
          <input type="number" className={inputStyles} defaultValue="120" />
        </InputWrapper>
        <InputWrapper label="Auto-Delete Expired Profiles (Days)">
          <input type="number" className={inputStyles} defaultValue="30" />
        </InputWrapper>
      </div>

      <div className="space-y-4">
        <ToggleSwitch label="Enable Remote Profile Management (RPM)" defaultChecked={true} />
        <ToggleSwitch label="Enable OTA Profile Updates" defaultChecked={true} />
        <ToggleSwitch label="Auto-Provision on Device Confirmation" defaultChecked={false} />
      </div>
    </div>
  );
}

function ApiWebhooksForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Developer Access & Webhooks" subtitle="Manage API credentials, webhook endpoints, and integration rate limits." />

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">API Keys</h4>
        {[
          { name: "Production Key", key: "np_live_••••••••••••••4x9f", status: "Active", created: "Jan 10, 2025" },
          { name: "Sandbox Key", key: "np_test_••••••••••••••2b7c", status: "Active", created: "Feb 5, 2025" }
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
            <input type="url" className={iconInputStyles} defaultValue="https://api.selectmobilenetworks.com/webhooks/events" />
          </InputWrapper>
        </div>
        <InputWrapper label="Rate Limit (Requests/Min)">
          <input type="number" className={inputStyles} defaultValue="2000" />
        </InputWrapper>
        <InputWrapper label="Webhook Secret">
          <input type="password" className={inputStyles} defaultValue="whsec_np_xxxxxxxxxxxx" />
        </InputWrapper>
      </div>

      <div className="p-5 bg-amber-50/30 border border-amber-100/50 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0"><AlertTriangle className="w-4 h-4" /></div>
        <div>
          <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-1">Security Notice</p>
          <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest">API keys grant access to subscriber data and network controls. Rotate keys regularly and never expose them in client-side code.</p>
        </div>
      </div>
    </div>
  );
}

function BillingPayoutsForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Revenue Splits & Bank Details" subtitle="Configure how platform fees, commissions, and revenue shares are calculated and where payouts are deposited." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Platform Commission Rate (%)">
          <input type="number" className={inputStyles} defaultValue="8.5" step="0.1" />
        </InputWrapper>
        <InputWrapper label="Referral Bonus per Activation ($)">
          <input type="number" className={inputStyles} defaultValue="25" />
        </InputWrapper>
        <InputWrapper label="Payout Frequency">
          <select className={selectStyles} defaultValue="monthly">
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Minimum Payout Threshold ($)">
          <input type="number" className={inputStyles} defaultValue="500" />
        </InputWrapper>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Bank Account</h4>
        <div className="p-6 bg-slate-50/50 border border-[#dcdcdc] rounded-2xl space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper label="Bank Name">
              <input type="text" className={inputStyles} defaultValue="JPMorgan Chase" />
            </InputWrapper>
            <InputWrapper label="Account Type">
              <select className={selectStyles} defaultValue="business">
                <option value="business">Business Checking</option>
                <option value="savings">Business Savings</option>
              </select>
            </InputWrapper>
            <InputWrapper label="Routing Number">
              <input type="text" className={inputStyles} defaultValue="021000021" />
            </InputWrapper>
            <InputWrapper label="Account Number (Last 4)">
              <input type="text" className={inputStyles} defaultValue="••••4821" readOnly />
            </InputWrapper>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ToggleSwitch label="Enable Auto-Deposit" defaultChecked={true} />
        <ToggleSwitch label="Send Payout Notifications" defaultChecked={true} />
      </div>
    </div>
  );
}

function SystemAlertsForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Outage Triggers & Notification Rules" subtitle="Configure when and how your team is notified about network events, subscriber issues, and system health." />

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Alert Triggers</h4>
        <ToggleSwitch label="Network Outage Detection" defaultChecked={true} />
        <ToggleSwitch label="High Activation Volume (>100/hour)" defaultChecked={true} />
        <ToggleSwitch label="SM-DP+ Connection Failure" defaultChecked={true} />
        <ToggleSwitch label="Subscriber Churn Rate Spike" defaultChecked={false} />
        <ToggleSwitch label="API Rate Limit Approaching (>80%)" defaultChecked={true} />
        <ToggleSwitch label="Revenue Anomaly Detection" defaultChecked={false} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Alert Email Distribution" icon={Bell}>
          <input type="email" className={iconInputStyles} defaultValue="noc-alerts@selectmobilenetworks.com" />
        </InputWrapper>
        <InputWrapper label="Escalation Timeout (Minutes)">
          <input type="number" className={inputStyles} defaultValue="15" />
        </InputWrapper>
        <InputWrapper label="Alert Priority Default">
          <select className={selectStyles} defaultValue="high">
            <option value="critical">Critical (Immediate Page)</option>
            <option value="high">High (Email + SMS)</option>
            <option value="medium">Medium (Email Only)</option>
            <option value="low">Low (Dashboard Only)</option>
          </select>
        </InputWrapper>
        <InputWrapper label="SMS Alert Number">
          <input type="tel" className={inputStyles} defaultValue="+1 (703) 555-0199" />
        </InputWrapper>
      </div>
    </div>
  );
}

function SecurityForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Account Security & Team Access" subtitle="Protect your network operations with advanced security controls and role-based team management." />

      <div className="space-y-4">
        <ToggleSwitch label="Two-Factor Authentication (2FA)" defaultChecked={true} />
        <ToggleSwitch label="Login Notifications via Email" defaultChecked={true} />
        <ToggleSwitch label="Require 2FA for All NOC Staff" defaultChecked={true} />
        <ToggleSwitch label="IP Whitelisting for API Access" defaultChecked={false} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Current Password" icon={Lock}>
          <input type="password" className={iconInputStyles} placeholder="Enter current password" />
        </InputWrapper>
        <InputWrapper label="New Password" icon={Lock}>
          <input type="password" className={iconInputStyles} placeholder="Enter new password" />
        </InputWrapper>
        <InputWrapper label="Session Timeout (Minutes)" icon={Clock}>
          <input type="number" className={iconInputStyles} defaultValue="20" />
        </InputWrapper>
        <InputWrapper label="Max Concurrent Sessions">
          <input type="number" className={inputStyles} defaultValue="5" />
        </InputWrapper>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Sessions</h4>
        {[
          { device: "Chrome on Windows", ip: "10.10.1.205", location: "Arlington, VA (NOC)", time: "Active now" },
          { device: "Safari on macOS", ip: "10.10.2.118", location: "New York, NY (Remote)", time: "45 min ago" }
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

function RegionalComplianceForm() {
  return (
    <div className="space-y-16">
      <SectionHeader title="Regulatory Compliance & Market Defaults" subtitle="Configure your compliance settings for FCC (US) and CRTC (Canada), and set regional market defaults." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputWrapper label="Primary Regulatory Body">
          <select className={selectStyles} defaultValue="fcc">
            <option value="fcc">FCC (United States)</option>
            <option value="crtc">CRTC (Canada)</option>
            <option value="both">FCC + CRTC (Dual Market)</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Numbering Plan">
          <select className={selectStyles} defaultValue="nanp">
            <option value="nanp">NANP (North American Numbering Plan)</option>
            <option value="custom">Custom Numbering</option>
          </select>
        </InputWrapper>
        <InputWrapper label="Default Currency" icon={Building2}>
          <select className={selectStyles} defaultValue="usd">
            <option value="usd">USD — US Dollar ($)</option>
            <option value="cad">CAD — Canadian Dollar (C$)</option>
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
        <InputWrapper label="CALEA Compliance">
          <select className={selectStyles} defaultValue="enabled">
            <option value="enabled">Enabled (Lawful Intercept Ready)</option>
            <option value="pending">Pending Implementation</option>
          </select>
        </InputWrapper>
        <InputWrapper label="E911 Service Provider">
          <select className={selectStyles} defaultValue="intrado">
            <option value="intrado">Intrado (West Safety)</option>
            <option value="bandwidth">Bandwidth Inc.</option>
            <option value="zetron">Zetron Communications</option>
          </select>
        </InputWrapper>
      </div>

      <div className="space-y-4">
        <ToggleSwitch label="STIR/SHAKEN Call Authentication" defaultChecked={true} />
        <ToggleSwitch label="TCPA Consent Management" defaultChecked={true} />
        <ToggleSwitch label="Number Portability (LNP) Support" defaultChecked={true} />
        <ToggleSwitch label="Wireless Emergency Alerts (WEA)" defaultChecked={true} />
      </div>
    </div>
  );
}
