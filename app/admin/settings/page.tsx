"use client";
import React, { useState } from "react";
import { Settings, Trash2, UserX, ShieldCheck, TriangleAlert, CircleCheck, CircleX, Clock, Globe, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeletionRequest {
  id: string;
  status: string;
  reason: string;
  createdAt: string;
  activeOrders: number;
  escrowBalance: number;
  user: {
    name: string;
    email: string;
    role: string;
    country: string;
  };
}

interface PlatformSetting {
  key: string;
  label: string;
  value: string;
  type: string;
}

const PLATFORM_SETTINGS: PlatformSetting[] = [
  { key: "SITE_NAME", label: "Marketplace Name", value: "Select Mobile Phone", type: "text" },
  { key: "MAINTENANCE_MODE", label: "Maintenance Mode", value: "false", type: "toggle" },
  { key: "COMMISSION_RATE", label: "Sales Commission (%)", value: "5.0", type: "number" },
  { key: "BOUNTY_FEE", label: "Listing Bounty ($)", value: "5.00", type: "number" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "deletion" | "danger">("general");
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [settings, setSettings] = useState<PlatformSetting[]>(PLATFORM_SETTINGS);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.requests) setRequests(data.requests);
    } catch (err) {
      console.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map((s: PlatformSetting) => s.key === key ? { ...s, value } : s));
  };

  const processRequest = async (requestId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action, adminNotes: "Processed via dashboard" }),
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error("Failed to process request");
    }
  };

  const approveDeletion = (id: string) => processRequest(id, "APPROVE");
  const denyDeletion = (id: string) => processRequest(id, "REJECT");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Platform Settings</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">System configuration, account deletion requests, and danger zone</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-[#dcdcdc] rounded-2xl p-1.5 shadow-sm">
        {[
          { key: "general" as const, label: "General Config", icon: Settings },
          { key: "deletion" as const, label: "Deletion Queue", icon: Trash2 },
          { key: "danger" as const, label: "Danger Zone", icon: TriangleAlert },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === tab.key ? "bg-[#0f172a] text-white shadow-lg" : "text-slate-400 hover:text-[#0f172a] hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* General Config */}
      {activeTab === "general" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#dcdcdc] rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#dcdcdc]">
            <h3 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Platform Configuration</h3>
          </div>
          <div className="p-6 space-y-5">
            {settings.map((setting: PlatformSetting) => (
              <div key={setting.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-extrabold text-[#0f172a]">{setting.label}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{setting.key}</p>
                </div>
                {setting.type === "toggle" ? (
                  <button
                    onClick={() => updateSetting(setting.key, setting.value === "true" ? "false" : "true")}
                    className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
                      setting.value === "true" ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    <motion.div
                      layout
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      style={{ left: setting.value === "true" ? "26px" : "2px" }}
                    />
                  </button>
                ) : (
                  <input
                    type={setting.type}
                    value={setting.value}
                    onChange={e => updateSetting(setting.key, e.target.value)}
                    className="w-48 px-4 py-2 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] text-right focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-[#dcdcdc] flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg shadow-[#0f172a]/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Save Settings
            </button>
          </div>
        </motion.div>
      )}

      {/* Deletion Queue */}
      {activeTab === "deletion" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
            <TriangleAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Account Deletion / Cancellation Queue</p>
              <p className="text-xs text-amber-500/70">Sellers can request account cancellation or deletion from their dashboard Settings. Review each request and ensure all obligations (active orders, escrow funds) are resolved before approving.</p>
            </div>
          </div>

          {requests.map((req: DeletionRequest, i: number) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-[#dcdcdc] rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-5 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 font-black text-lg border border-rose-100">
                    {req.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0f172a] mb-0.5">{req.user?.name || "Unknown User"}</h4>
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {req.user?.email}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {req.user?.country}</span>
                      <span>{req.user?.role?.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${
                  req.status === "PENDING" ? "bg-amber-50 text-amber-600" :
                  req.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" :
                  "bg-rose-50 text-rose-600"
                }`}>{req.status}</span>
              </div>

              <div className="px-5 pb-4 grid grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reason</p>
                  <p className="text-xs font-bold text-[#0f172a] mt-1">{req.reason}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Requested</p>
                  <p className="text-xs font-bold text-[#0f172a] mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`p-3 rounded-xl ${req.activeOrders > 0 ? "bg-rose-50 border border-rose-100" : "bg-emerald-50"}`}>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Orders</p>
                  <p className={`text-xs font-black mt-1 ${req.activeOrders > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {req.activeOrders} {req.activeOrders > 0 && "⚠️"}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${req.escrowBalance > 0 ? "bg-rose-50 border border-rose-100" : "bg-emerald-50"}`}>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Escrow Balance</p>
                  <p className={`text-xs font-black mt-1 ${req.escrowBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    ${req.escrowBalance.toFixed(2)} {req.escrowBalance > 0 && "⚠️"}
                  </p>
                </div>
              </div>

              {req.status === "PENDING" && (
                <div className="px-5 pb-5 flex items-center gap-2">
                  {req.activeOrders > 0 || req.escrowBalance > 0 ? (
                    <div className="flex-1 py-2.5 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl text-center text-[9px] font-black uppercase tracking-widest">
                      <TriangleAlert className="w-3 h-3 inline mr-1" /> Cannot delete — resolve obligations first
                    </div>
                  ) : (
                    <>
                      <button onClick={() => denyDeletion(req.id)} className="flex-1 py-2.5 bg-white border border-[#dcdcdc] text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2">
                        <CircleX className="w-3 h-3" /> Deny
                      </button>
                      <button onClick={() => approveDeletion(req.id)} className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20">
                        <CircleCheck className="w-3 h-3" /> Approve Deletion
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Danger Zone */}
      {activeTab === "danger" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white border-2 border-rose-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 bg-rose-50 border-b border-rose-100">
              <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2"><TriangleAlert className="w-4 h-4" /> Danger Zone</h3>
              <p className="text-xs text-rose-500/70 mt-1">These actions are irreversible. Proceed with extreme caution.</p>
            </div>
            <div className="p-6 space-y-4">
              <DangerAction
                title="Purge Expired Listings"
                description="Remove all listings with EXPIRED status older than 90 days. This action cannot be undone."
                buttonLabel="Purge Listings"
              />
              <DangerAction
                title="Reset Platform Analytics Cache"
                description="Clear all cached analytics data from DashboardStats. Data will be recomputed on next access."
                buttonLabel="Reset Cache"
              />
              <DangerAction
                title="Force Release All Escrow > 30 Days"
                description="Auto-release all escrow funds held for more than 30 days to their respective sellers."
                buttonLabel="Force Release"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DangerAction({ title, description, buttonLabel }: { title: string; description: string; buttonLabel: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-rose-50 last:border-0">
      <div className="flex-1 mr-6">
        <p className="font-extrabold text-sm text-[#0f172a]">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all cursor-pointer shadow-sm shrink-0">
        {buttonLabel}
      </button>
    </div>
  );
}
