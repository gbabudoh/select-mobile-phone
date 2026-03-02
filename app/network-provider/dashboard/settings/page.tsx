"use client";
import React from "react";
import { Shield, Radio, Bell, Signal } from "lucide-react";

export default function NetworkProviderSettingsPage() {
  const SECTIONS = [
    { title: "Carrier Profile", desc: "Manage carrier branding, MVNO status, and certificates.", icon: Radio },
    { title: "Technical Config", desc: "Update API endpoints, webhook URLs, and eSIM servers.", icon: Signal },
    { title: "Security & Admin", desc: "Manage secure keys, passwords, and team roles.", icon: Shield },
    { title: "System Alerts", desc: "Choose alert triggers for outages and high volume.", icon: Bell },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Provider Settings</h1>
        <p className="text-[#0f172a]/60">Manage your network infrastructure and operational security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS.map((section) => (
          <button
            key={section.title}
            className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#04a1c6]/20 transition-all text-left group cursor-pointer"
          >
            <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-[#04a1c6]/5 group-hover:text-[#04a1c6] transition-colors">
              <section.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] mb-1">{section.title}</h3>
              <p className="text-sm text-[#0f172a]/50 leading-relaxed">{section.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
