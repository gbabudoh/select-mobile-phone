"use client";
import React, { useState } from "react";
import {
  Cpu, Plus, Search,
  Smartphone, Signal, Wifi, Globe,
  TrendingUp, Activity, Clock, Zap,
  Eye, Power, Trash2,
  Check, Info, X,
  SlidersHorizontal, Download, QrCode, ShieldCheck, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface ESIMProfile {
  id: string;
  iccid: string;
  imei: string;
  phoneNumber: string;
  subscriberName: string;
  deviceModel: string;
  planType: string;
  planSpeed: string;
  status: "Active" | "Suspended" | "Pending" | "Expired";
  dataUsedGB: number;
  dataTotalGB: number;
  activationDate: string;
  expiryDate: string;
  carrier: string;
  network: string;
  qrCodeUrl?: string;
  lpaString?: string;
}

// --- Pre-seeded Initial Data ---
const INITIAL_ESIMS: ESIMProfile[] = [
  {
    id: "ESIM-9012",
    iccid: "89014103289104820194",
    imei: "358920194820194",
    phoneNumber: "+1 (555) 234-8901",
    subscriberName: "Sarah Jenkins",
    deviceModel: "iPhone 18 Pro Max",
    planType: "Cross-Border Unlimited 5G",
    planSpeed: "Ultra Wideband",
    status: "Active",
    dataUsedGB: 18.4,
    dataTotalGB: 50,
    activationDate: "2026-07-01",
    expiryDate: "2027-07-01",
    carrier: "SelectMobile Network",
    network: "5G Sub-6 / mmWave",
    lpaString: "LPA:1$smdp.selectmobile.com$SM-9012-PROV",
  },
  {
    id: "ESIM-9013",
    iccid: "89014103289104820195",
    imei: "354029104820195",
    phoneNumber: "+1 (555) 892-4102",
    subscriberName: "Marcus Vance",
    deviceModel: "Galaxy S26 Ultra",
    planType: "Mint Unlimited 40GB",
    planSpeed: "5G High Speed",
    status: "Active",
    dataUsedGB: 32.1,
    dataTotalGB: 40,
    activationDate: "2026-07-05",
    expiryDate: "2026-10-05",
    carrier: "Mint Mobile Partner",
    network: "5G Sub-6",
    lpaString: "LPA:1$smdp.mintmobile.com$MM-9013-PROV",
  },
  {
    id: "ESIM-9014",
    iccid: "89014103289104820196",
    imei: "359102840192847",
    phoneNumber: "+1 (555) 310-9948",
    subscriberName: "David Miller",
    deviceModel: "Pixel 10 Pro XL",
    planType: "AT&T Prepaid 15GB",
    planSpeed: "5G LTE",
    status: "Pending",
    dataUsedGB: 0.0,
    dataTotalGB: 15,
    activationDate: "2026-07-20",
    expiryDate: "2026-08-20",
    carrier: "AT&T Prepaid",
    network: "5G Sub-6",
    lpaString: "LPA:1$smdp.att.com$ATT-9014-PROV",
  },
  {
    id: "ESIM-9015",
    iccid: "89014103289104820197",
    imei: "352910482019482",
    phoneNumber: "+1 (555) 712-4019",
    subscriberName: "Elena Rostova",
    deviceModel: "iPhone 17 Pro",
    planType: "Koodo 20GB Canada",
    planSpeed: "5G LTE",
    status: "Suspended",
    dataUsedGB: 19.8,
    dataTotalGB: 20,
    activationDate: "2026-06-12",
    expiryDate: "2026-07-12",
    carrier: "Koodo Flanker",
    network: "Telus 5G",
    lpaString: "LPA:1$smdp.koodomobile.com$KD-9015-PROV",
  },
];

const statusConfig = {
  Active: { dot: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  Suspended: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
  Pending: { dot: "bg-blue-400", bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  Expired: { dot: "bg-slate-300", bg: "bg-slate-50", text: "text-slate-500", ring: "ring-slate-100" }
};

export default function NetworkProviderESIMPage() {
  const [esims, setEsims] = useState<ESIMProfile[]>(INITIAL_ESIMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [toasts, setToasts] = useState<{id: number; msg: string; type: "success" | "error" | "info"}[]>([]);
  
  // Provisioning Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ESIMProfile | null>(null);
  
  // Form State
  const [subscriberName, setSubscriberName] = useState("");
  const [deviceModel, setDeviceModel] = useState("iPhone 18 Pro Max");
  const [carrier, setCarrier] = useState("SelectMobile Network");
  const [planType, setPlanType] = useState("Cross-Border Unlimited 5G");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imei, setImei] = useState("");
  const [dataTotalGB, setDataTotalGB] = useState("50");
  const [provisioning, setProvisioning] = useState(false);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredESIMs = esims.filter(esim => {
    const matchesSearch =
      esim.iccid.toLowerCase().includes(searchLower) ||
      esim.phoneNumber.toLowerCase().includes(searchLower) ||
      esim.subscriberName.toLowerCase().includes(searchLower) ||
      esim.deviceModel.toLowerCase().includes(searchLower) ||
      esim.id.toLowerCase().includes(searchLower);
    const matchesTab = activeTab === "All" || esim.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const activeCount = esims.filter(e => e.status === "Active").length;
  const pendingCount = esims.filter(e => e.status === "Pending").length;
  const totalDataUsed = esims.reduce((sum, e) => sum + e.dataUsedGB, 0).toFixed(1);

  const handleOpenProvisionModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseProvisionModal = () => {
    setIsModalOpen(false);
    setSubscriberName("");
    setPhoneNumber("");
    setImei("");
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberName) {
      addToast("Please enter subscriber full name.", "error");
      return;
    }

    setProvisioning(true);
    await new Promise(r => setTimeout(r, 1000));

    const generatedId = `ESIM-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedICCID = `890141032${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const generatedPhone = phoneNumber || `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProfile: ESIMProfile = {
      id: generatedId,
      iccid: generatedICCID,
      imei: imei || "358920194820199",
      phoneNumber: generatedPhone,
      subscriberName,
      deviceModel,
      planType,
      planSpeed: "Ultra Wideband 5G",
      status: "Active",
      dataUsedGB: 0.0,
      dataTotalGB: Number(dataTotalGB),
      activationDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      carrier,
      network: "5G Sub-6 / mmWave",
      lpaString: `LPA:1$smdp.selectmobile.com$${generatedId}-PROV`,
    };

    setEsims(prev => [newProfile, ...prev]);
    setProvisioning(false);
    handleCloseProvisionModal();
    addToast(`eSIM Profile ${generatedId} provisioned for ${subscriberName}!`, "success");
  };

  const handleToggleStatus = (id: string, currentStatus: ESIMProfile["status"], subscriber: string) => {
    let nextStatus: ESIMProfile["status"] = "Active";
    let actionName = "Activated";

    if (currentStatus === "Active") {
      nextStatus = "Suspended";
      actionName = "Suspended";
    } else if (currentStatus === "Pending") {
      nextStatus = "Active";
      actionName = "Activated";
    } else if (currentStatus === "Suspended") {
      nextStatus = "Active";
      actionName = "Reactivated";
    }

    setEsims(prev => prev.map(e => e.id === id ? { ...e, status: nextStatus } : e));
    addToast(`Profile ${id} (${subscriber}) ${actionName}!`, nextStatus === "Active" ? "success" : "info");
  };

  const handleRemoveProfile = (id: string, subscriber: string) => {
    setEsims(prev => prev.filter(e => e.id !== id));
    addToast(`Removed profile ${id} for ${subscriber}.`, "error");
  };

  const handleExportAudit = () => {
    const csvHeader = "ID,ICCID,Subscriber,Device,Phone,Plan,Status,DataUsedGB,DataTotalGB\n";
    const csvRows = esims.map(e => `${e.id},${e.iccid},"${e.subscriberName}","${e.deviceModel}",${e.phoneNumber},"${e.planType}",${e.status},${e.dataUsedGB},${e.dataTotalGB}`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `esim_audit_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    addToast("Exported eSIM Audit Report CSV!", "success");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 antialiased font-sans pb-20 relative">

      {/* Toast Notification System */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`px-6 py-4 rounded-2xl shadow-xl backdrop-blur-3xl border flex items-center gap-4 min-w-[300px] pointer-events-auto ${
                toast.type === "error" ? "bg-white/90 border-rose-100 text-rose-700" :
                toast.type === "info" ? "bg-white/90 border-blue-100 text-blue-700" :
                "bg-white/90 border-emerald-100 text-emerald-700"
              }`}
            >
              <div className={`p-1.5 rounded-full ${
                toast.type === "error" ? "bg-rose-100" : toast.type === "info" ? "bg-blue-100" : "bg-emerald-100"
              }`}>
                {toast.type === "error" ? <X className="w-3 h-3" /> : toast.type === "info" ? <Info className="w-3 h-3" /> : <Check className="w-3 h-3" />}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest">{toast.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">eSIM Management Engine</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Provision MVNO profiles, issue QR activation codes, and manage live subscribers</p>
        </div>
        <button
          onClick={handleOpenProvisionModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Provision New
        </button>
      </div>

      {/* KPI Analytics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Profiles", value: esims.length.toString(), icon: Cpu, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active eSIMs", value: activeCount.toString(), icon: Signal, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Data Consumed", value: `${totalDataUsed} GB`, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Pending Activation", value: pendingCount.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" }
        ].map((stat, idx) => (
          <div key={idx} className="p-4 bg-white border border-[#dcdcdc]/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <stat.icon className={`w-12 h-12 ${stat.color}`} />
            </div>
            <div className={`inline-flex p-2 ${stat.bg} rounded-xl mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-black text-[#0f172a]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl p-2.5 shadow-sm sticky top-6 z-30">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1.5 lg:pb-0 scrollbar-hide">
            {["All", "Active", "Suspended", "Pending", "Expired"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20" : "text-slate-400 hover:text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72 group">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search ICCID, phone, subscriber..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button 
              onClick={() => setSearchQuery("")}
              className="p-2.5 bg-white border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] hover:border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* eSIM Profile Cards */}
      <div className="space-y-4">
        {filteredESIMs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#dcdcdc] p-20 text-center shadow-sm space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-[#dcdcdc]">
              <Cpu className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] uppercase tracking-wide">No eSIM Profiles Found</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Provision your first eSIM profile to begin carrier distribution</p>
            <button
              onClick={handleOpenProvisionModal}
              className="px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 inline mr-2" /> Provision New eSIM
            </button>
          </div>
        ) : (
          filteredESIMs.map((esim, idx) => {
            const status = statusConfig[esim.status];
            const usagePercent = esim.dataTotalGB > 0 ? Math.round((esim.dataUsedGB / esim.dataTotalGB) * 100) : 0;
            const usageColor = usagePercent > 80 ? "bg-rose-500" : usagePercent > 50 ? "bg-amber-500" : "bg-emerald-500";

            return (
              <motion.div
                key={esim.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-[#dcdcdc] rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
              >
                <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center">

                  {/* Profile Identity */}
                  <div className="flex items-center gap-4 w-full xl:w-72 shrink-0">
                    <div className={`p-3.5 rounded-2xl ${status.bg} ${status.text} ring-4 ${status.ring} shrink-0`}>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wide">{esim.subscriberName}</h3>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{esim.deviceModel}</p>
                      <p className="text-[9px] font-mono text-slate-400 tracking-wider mt-0.5">{esim.iccid}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Plan */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3 h-3 text-blue-500" />
                        <span className="text-[11px] font-black text-[#0f172a]">{esim.planType}</span>
                      </div>
                    </div>
                    {/* Network */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Network</p>
                      <div className="flex items-center gap-1.5">
                        <Signal className="w-3 h-3 text-violet-500" />
                        <span className="text-[11px] font-black text-[#0f172a]">{esim.network}</span>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-teal-500" />
                        <span className="text-[11px] font-black text-[#0f172a]">{esim.phoneNumber}</span>
                      </div>
                    </div>
                    {/* Data Usage */}
                    <div className="p-3 bg-slate-50/60 rounded-xl border border-[#dcdcdc]/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Usage</p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-emerald-500 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-[#0f172a]">{esim.dataUsedGB} GB</span>
                            <span className="text-[8px] font-bold text-slate-400">/ {esim.dataTotalGB} GB</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${usageColor} rounded-full transition-all duration-500`} style={{ width: `${usagePercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-col items-end gap-3 w-full xl:w-auto shrink-0">
                    {/* Status + Dates */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {esim.status}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{esim.planSpeed}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDetail(esim)}
                        className="px-3.5 py-2 bg-slate-50 border border-[#dcdcdc] rounded-xl text-[10px] font-black text-[#0f172a] uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" /> Details
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(esim.id, esim.status, esim.subscriberName)}
                        className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 border ${
                          esim.status === "Active" ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100" :
                          "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {esim.status === "Active" ? "Suspend" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleRemoveProfile(esim.id, esim.subscriberName)}
                        className="px-2.5 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                        title="Remove Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-3 pt-3 border-t border-[#dcdcdc]/50 flex items-center justify-between">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Activated {esim.activationDate} · Expires {esim.expiryDate} · ID: {esim.id}
                  </p>
                  <span className="text-[9px] font-black text-[#04a1c6] uppercase tracking-widest">{esim.carrier}</span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Network Summary Footer */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Signal className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier Network Infrastructure</p>
              <p className="text-sm font-black text-[#0f172a]">5G Ultra Wideband · 5G Sub-6 · eSIM SM-DP+ Server Online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAudit}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl border border-[#dcdcdc] text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit CSV
            </button>
          </div>
        </div>
      </div>

      {/* ── Provision New eSIM Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={handleCloseProvisionModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7 md:p-9 shadow-2xl relative border border-white/50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">Provision New eSIM Profile</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Issue SM-DP+ activation code &amp; assign carrier plan</p>
                  </div>
                </div>
                <button onClick={handleCloseProvisionModal} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleProvisionSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Subscriber Full Name</label>
                  <input
                    type="text"
                    required
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Device Model</label>
                    <select
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["iPhone 18 Pro Max", "iPhone 17 Pro", "Galaxy S26 Ultra", "Galaxy Z Fold 6", "Pixel 10 Pro XL", "BYOD Device"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Target Carrier Network</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["SelectMobile Network", "Mint Mobile Partner", "Visible+ Partner", "AT&T Prepaid", "Koodo Flanker"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">eSIM Plan Tier</label>
                    <select
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["Cross-Border Unlimited 5G", "5G High Speed 50GB", "Mint Unlimited 40GB", "AT&T Prepaid 15GB", "Koodo 20GB Canada"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Target Coverage Region</label>
                    <select
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="US/CA">🇺🇸🇨🇦 Cross-Border US &amp; CA</option>
                      <option value="US">🇺🇸 United States Domestic</option>
                      <option value="CA">🇨🇦 Canada Domestic</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Monthly Data (GB)</label>
                    <input
                      type="number"
                      min={5}
                      max={200}
                      value={dataTotalGB}
                      onChange={(e) => setDataTotalGB(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">MSISDN / Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Target Device IMEI (Optional)</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={imei}
                      onChange={(e) => setImei(e.target.value.replace(/\D/g, ""))}
                      placeholder="15-digit IMEI"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Simulated SM-DP+ Server Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-[#0f172a]">
                    <ShieldCheck className="w-4 h-4 text-[#04a1c6]" /> SM-DP+ Server Status: ONLINE
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">An encrypted GSMA eSIM activation QR code will be generated upon provisioning.</p>
                </div>

                <button
                  type="submit"
                  disabled={provisioning}
                  className="w-full py-4 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 cursor-pointer active:scale-95 mt-4"
                >
                  {provisioning ? "Provisioning Profile..." : "Provision & Issue eSIM"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── eSIM Details Modal ── */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] max-w-lg w-full p-7 shadow-2xl relative border border-white/50 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0f172a] uppercase">{selectedDetail.subscriberName}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">eSIM Profile #{selectedDetail.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDetail(null)} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Activation Preview */}
              <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-3">
                <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>
                <div className="text-[10px] font-mono font-bold text-cyan-400 break-all px-2">
                  {selectedDetail.lpaString || `LPA:1$smdp.selectmobile.com$${selectedDetail.id}`}
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Scan in iOS or Android Cellular Settings to Activate</p>
              </div>

              <div className="space-y-2 text-xs font-bold">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 uppercase text-[10px]">ICCID</span>
                  <span className="text-slate-900 font-mono text-[11px]">{selectedDetail.iccid}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 uppercase text-[10px]">Device IMEI</span>
                  <span className="text-slate-900 font-mono text-[11px]">{selectedDetail.imei}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 uppercase text-[10px]">Phone Number</span>
                  <span className="text-[#04a1c6] font-mono text-[11px]">{selectedDetail.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 uppercase text-[10px]">Carrier &amp; Network</span>
                  <span className="text-slate-900 text-[11px]">{selectedDetail.carrier} ({selectedDetail.network})</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedDetail(null)}
                className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                Close Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
