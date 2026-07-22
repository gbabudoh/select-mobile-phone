"use client";
import React, { useState } from "react";
import { User, Shield, CreditCard, Bell, Save, Key, LogOut, Smartphone, Plus, CheckCircle2, X, ExternalLink, Settings2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "profile" | "security" | "payouts" | "notifications";

export default function IndividualSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile State
  const [fullName, setFullName] = useState("David Smith");
  const [displayName, setDisplayName] = useState("DavidS_92");
  const [bio, setBio] = useState("Individual seller listing certified pre-owned smartphones.");
  const [location, setLocation] = useState("New York, NY");

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Stripe Payout State
  const [stripeConnected, setStripeConnected] = useState(true);
  const [stripeAccountId, setStripeAccountId] = useState("acct_1N9x82K49182");
  const [bankName, setBankName] = useState("Chase Bank");
  const [bankLast4, setBankLast4] = useState("4821");
  const [autoPayouts, setAutoPayouts] = useState(true);
  const [minPayout, setMinPayout] = useState("$10.00");

  // Stripe Modal
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  const TABS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "payouts", label: "Payouts", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile changes saved successfully!");
    }, 800);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast("Please fill in current and new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password updated successfully!");
  };

  const handleStripeToggle = () => {
    if (stripeConnected) {
      setStripeConnected(false);
      showToast("Stripe Express Account Disconnected.");
    } else {
      setStripeConnected(true);
      showToast("Stripe Express Account Connected!");
    }
  };

  return (
    <div className="max-w-4xl relative pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-[#0f172a] text-white shadow-2xl border border-white/20 flex items-center gap-3 text-xs font-bold pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 text-[#04a1c6]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Settings</h1>
        <p className="text-[#0f172a]/60 text-sm">Manage your account preferences, security, and Stripe Connect payout methods.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-8 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-[#04a1c6] shadow-sm font-bold"
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
          {/* ── PROFILE TAB ── */}
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
                      <p className="text-sm text-gray-500">Upload a personal photo for your seller profile.</p>
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
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#04a1c6] text-white rounded-xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <Key className="w-5 h-5 text-[#04a1c6]" />
                  <h3 className="font-bold text-[#0f172a]">Change Password</h3>
                </div>
                <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                    />
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all cursor-pointer">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#04a1c6]" />
                    <h3 className="font-bold text-[#0f172a]">Two-Factor Authentication</h3>
                  </div>
                  <button
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(`2FA ${!twoFactorEnabled ? "Enabled" : "Disabled"}`);
                    }}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors p-0.5 ${
                      twoFactorEnabled ? "bg-[#04a1c6]" : "bg-gray-200"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      twoFactorEnabled ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Add an extra layer of security to your seller account by requiring a code upon login.
                </p>
              </div>
            </div>
          )}

          {/* ── PAYOUTS TAB (STRIPE CONNECT) ── */}
          {activeTab === "payouts" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#04a1c6]" />
                    <div>
                      <h3 className="font-bold text-[#0f172a]">Stripe Express Payout Methods</h3>
                      <p className="text-xs text-gray-500 font-medium">Platform payouts are powered by Stripe Express Direct Deposit</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsStripeModalOpen(true)}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white bg-[#04a1c6] px-4 py-2.5 rounded-xl hover:bg-[#0390b0] transition-all cursor-pointer shadow-md shadow-[#04a1c6]/20"
                  >
                    <Plus className="w-4 h-4" /> Manage Stripe Express
                  </button>
                </div>

                {/* Connected Stripe Express Account Card */}
                <div className="p-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-blue-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-indigo-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-[#0f172a] text-base">Stripe Express Account</p>
                        {stripeConnected ? (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Connected
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200">
                            Disconnected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Direct Deposit to {bankName} ···· {bankLast4} (Account ID: <span className="font-mono text-slate-700 font-bold">{stripeAccountId}</span>)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => setIsStripeModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Settings2 className="w-3.5 h-3.5" /> Configure
                    </button>
                    <button
                      onClick={handleStripeToggle}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title={stripeConnected ? "Disconnect Stripe Account" : "Re-connect Stripe"}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Payout Settings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="font-bold text-[#0f172a] mb-6">Automated Payout Rules</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#0f172a]">Automatic Payouts</p>
                      <p className="text-xs text-gray-500">Every Friday at 12:00 PM EST via Stripe Direct Deposit</p>
                    </div>
                    <button
                      onClick={() => {
                        setAutoPayouts(!autoPayouts);
                        showToast(`Automatic payouts ${!autoPayouts ? "Enabled" : "Disabled"}`);
                      }}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors p-0.5 ${
                        autoPayouts ? "bg-[#04a1c6]" : "bg-gray-200"
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        autoPayouts ? "translate-x-6" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#0f172a]">Minimum Payout Threshold</p>
                      <p className="text-xs text-gray-500">Minimum balance required to trigger a Stripe deposit</p>
                    </div>
                    <select
                      value={minPayout}
                      onChange={(e) => {
                        setMinPayout(e.target.value);
                        showToast(`Minimum payout set to ${e.target.value}`);
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold bg-white focus:outline-none text-[#0f172a]"
                    >
                      <option value="$10.00">$10.00</option>
                      <option value="$50.00">$50.00</option>
                      <option value="$100.00">$100.00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <Bell className="w-5 h-5 text-[#04a1c6]" />
                <h3 className="font-bold text-[#0f172a]">Notification Preferences</h3>
              </div>
              <div className="space-y-8">
                {[
                  { title: "Personal Sales & Escrow Updates", desc: "Get notified when a buyer orders your listed device." },
                  { title: "Price Alerts & Watching", desc: "Receive alerts for market price updates." },
                  { title: "Account & Payout Security", desc: "Security alerts and Stripe payout deposits." },
                  { title: "Platform Announcements", desc: "Exclusive seller tips and feature updates." },
                ].map((item, idx) => (
                  <div key={item.title} className="flex items-start justify-between">
                    <div className="max-w-md">
                      <p className="font-bold text-sm text-[#0f172a] mb-1">{item.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="flex gap-10">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                        <input type="checkbox" defaultChecked={idx < 3} className="w-5 h-5 rounded accent-[#04a1c6] cursor-pointer" />
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
              className="bg-white rounded-[2.5rem] max-w-md w-full p-7 md:p-8 shadow-2xl relative border border-white/50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a]">Stripe Express Account</h3>
                    <p className="text-xs text-slate-500 font-medium">Direct Deposit Payout Configuration</p>
                  </div>
                </div>
                <button onClick={() => setIsStripeModalOpen(false)} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Stripe Account ID</span>
                  <p className="text-sm font-mono font-bold text-slate-900">{stripeAccountId}</p>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Payout Bank Name</label>
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

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsStripeModalOpen(false);
                      showToast("Stripe Express Payout Details Saved!");
                    }}
                    className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    Save Payout Destination
                  </button>
                  <button
                    onClick={handleStripeToggle}
                    className="w-full py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {stripeConnected ? "Disconnect Stripe Account" : "Re-Connect Stripe Express"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
