"use client";
import React from "react";
import { Bell, CheckCircle2 } from "lucide-react";

export default function IndividualNotificationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Notifications</h1>
          <p className="text-[#0f172a]/60">Stay updated on your listings, offers, and orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#04a1c6] hover:bg-[#04a1c6]/5 rounded-xl transition-all cursor-pointer">
          <CheckCircle2 className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-sky-50/50 border border-sky-100 p-6 rounded-2xl flex gap-4">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#0f172a] mb-1">Welcome to your Individual Dashboard!</h3>
            <p className="text-sm text-[#0f172a]/60 leading-relaxed">
              Start by listing your first device or checking out the latest market trends for your phone model.
            </p>
            <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mt-3">Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
}
