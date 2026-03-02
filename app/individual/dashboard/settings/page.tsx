"use client";
import React, { useState } from "react";
import { User, Shield, CreditCard, Bell, Save, Key, LogOut, Smartphone, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "profile" | "security" | "payouts" | "notifications";

export default function IndividualSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSaving, setIsSaving] = useState(false);

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "payouts", label: "Payouts", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Settings</h1>
        <p className="text-[#0f172a]/60">Manage your account preferences, security, and payout methods.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-8 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-[#04a1c6] shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group hover:border-[#04a1c6] hover:bg-[#04a1c6]/5 transition-all cursor-pointer">
                      <User className="w-8 h-8 group-hover:text-[#04a1c6]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0f172a]">Profile Photo</h3>
                      <p className="text-sm text-gray-500">Upload a professional headshot.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-blue-100 text-[#04a1c6] bg-blue-50/30 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all cursor-pointer">
                    Change Avatar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. David Smith"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DavidS_92"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bio</label>
                    <textarea
                      placeholder="Tell buyers a bit about yourself..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                    <input
                      type="text"
                      placeholder="City, Province/State"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#04a1c6] text-white rounded-xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-50 disabled:translate-y-0 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Save className="w-4 h-4" />
                        </motion.div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <Key className="w-5 h-5 text-[#04a1c6]" />
                  <h3 className="font-bold text-[#0f172a]">Change Password</h3>
                </div>
                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirm Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30"
                    />
                  </div>
                  <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all cursor-pointer">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#04a1c6]" />
                    <h3 className="font-bold text-[#0f172a]">Two-Factor Authentication</h3>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-all">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Add an extra layer of security to your account by requiring more than just a password to log in.
                </p>
              </div>
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#04a1c6]" />
                    <h3 className="font-bold text-[#0f172a]">Payout Methods</h3>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-bold text-[#04a1c6] hover:text-[#04a1c6]/80 transition-all cursor-pointer">
                    <Plus className="w-4 h-4" /> Add Method
                  </button>
                </div>
                
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between group hover:border-[#04a1c6]/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shadow-sm">
                      <Smartphone className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0f172a]">PayPal</p>
                      <p className="text-xs text-gray-500">user@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md">Primary</span>
                    <button className="p-2 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer">
                      <LogOut className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="font-bold text-[#0f172a] mb-6">Payout Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#0f172a]">Automatic Payouts</p>
                      <p className="text-xs text-gray-500">Every Friday at 12:00 PM EST</p>
                    </div>
                    <div className="w-12 h-6 bg-[#04a1c6] rounded-full relative cursor-pointer transition-all">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                    </div>
                  </div>
                  <hr className="border-gray-50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#0f172a]">Minimum Payout</p>
                      <p className="text-xs text-gray-500">Minimum threshold required to initiate payout</p>
                    </div>
                    <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white focus:outline-none">
                      <option>$10.00</option>
                      <option>$50.00</option>
                      <option>$100.00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <Bell className="w-5 h-5 text-[#04a1c6]" />
                <h3 className="font-bold text-[#0f172a]">Notification Preferences</h3>
              </div>
              <div className="space-y-8">
                {[
                  { title: "Personal Sales", desc: "Get notified when someone buys one of your devices." },
                  { title: "Price Alerts", desc: "Receive alerts for price drops on your watched items." },
                  { title: "Account Activity", desc: "Security alerts and sign-in notifications." },
                  { title: "Promotions", desc: "Exclusive deals and platform updates." },
                ].map((item, idx) => (
                  <div key={item.title} className="flex items-start justify-between">
                    <div className="max-w-md">
                      <p className="font-bold text-sm text-[#0f172a] mb-1">{item.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="flex gap-10">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                        <input type="checkbox" defaultChecked={idx < 2} className="w-5 h-5 rounded accent-[#04a1c6] cursor-pointer" />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Push</span>
                        <input type="checkbox" defaultChecked={idx === 0} className="w-5 h-5 rounded accent-[#04a1c6] cursor-pointer" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
