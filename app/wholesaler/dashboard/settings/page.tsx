"use client";
import React from "react";
import { User, Building, Globe, Zap } from "lucide-react";

export default function WholesalerSettingsPage() {
  const SECTIONS = [
    { title: "Business Profile", desc: "Manage your wholesale entity details and legal docs.", icon: Building },
    { title: "Contact Info", desc: "Update primary contact and warehouse locations.", icon: User },
    { title: "Network Access", desc: "Manage partner onboarding and API keys.", icon: Zap },
    { title: "Logistics", desc: "Configure shipping regions and carrier integrations.", icon: Globe },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Wholesale Settings</h1>
        <p className="text-[#0f172a]/60">Configure your distribution infrastructure and business logic.</p>
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
