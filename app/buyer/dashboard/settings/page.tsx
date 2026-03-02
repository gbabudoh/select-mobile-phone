"use client";
import React from "react";
import { User, Shield, CreditCard, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Settings</h1>
      <p className="text-[#0f172a]/60 mb-8">Manage your account, verification, and preferences.</p>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-[#04a1c6]" />
            <h2 className="text-lg font-semibold text-[#0f172a]">Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#0f172a]/50 uppercase tracking-wider">Name</label>
              <input type="text" defaultValue="John Doe" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#0f172a]/50 uppercase tracking-wider">Email</label>
              <input type="email" defaultValue="john@example.com" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#0f172a]/50 uppercase tracking-wider">Phone</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#0f172a]/50 uppercase tracking-wider">Country</label>
              <select className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-white">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[#04a1c6]" />
            <h2 className="text-lg font-semibold text-[#0f172a]">Verification</h2>
          </div>
          <p className="text-sm text-[#0f172a]/50 mb-4">
            Verified accounts get the Select-Verified badge, building trust with buyers.
          </p>
          <button className="px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-medium text-sm hover:bg-[#04a1c6]/90 cursor-pointer">
            Start Verification
          </button>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-[#04a1c6]" />
            <h2 className="text-lg font-semibold text-[#0f172a]">Payment Methods</h2>
          </div>
          <p className="text-sm text-[#0f172a]/50">No payment methods added yet.</p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#04a1c6]" />
            <h2 className="text-lg font-semibold text-[#0f172a]">Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {["Order updates", "Preorder queue changes", "Trade-in status", "New deals & promotions"].map((pref) => (
              <label key={pref} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-[#0f172a]/70">{pref}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[#04a1c6]" />
              </label>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-[#04a1c6]" />
            <h2 className="text-lg font-semibold text-[#0f172a]">Region & Currency</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#0f172a]/50 uppercase tracking-wider">Region</label>
              <select className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white">
                <option>United States</option>
                <option>Canada</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#0f172a]/50 uppercase tracking-wider">Currency</label>
              <select className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white">
                <option>USD</option>
                <option>CAD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
