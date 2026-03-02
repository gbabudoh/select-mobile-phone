"use client";
import React from "react";
import { User, Shield, Store, Globe } from "lucide-react";

export default function RetailerSettingsPage() {
  const SECTIONS = [
    { title: "Store Info", desc: "Manage your store name, logo, and public description.", icon: Store },
    { title: "Profile Management", desc: "Update personal details and admin preferences.", icon: User },
    { title: "Security & Access", desc: "Manage passwords, 2FA, and team permissions.", icon: Shield },
    { title: "Regional Settings", desc: "Choose your primary market (US/CA) and currency.", icon: Globe },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Store Settings</h1>
        <p className="text-[#0f172a]/60">Customize your retail environment and operational preferences.</p>
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
