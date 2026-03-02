"use client";
import React from "react";
import { Bell, Package, ArrowLeftRight, Wifi, MessageSquare } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  order_update: <Package className="w-4 h-4" />,
  preorder_ready: <Package className="w-4 h-4" />,
  trade_in_approved: <ArrowLeftRight className="w-4 h-4" />,
  esim_activated: <Wifi className="w-4 h-4" />,
  chat_reply: <MessageSquare className="w-4 h-4" />,
};

export default function NotificationsPage() {
  const notifications = [
    { id: "1", type: "order_update", title: "Order Shipped", body: "Your iPhone 18 Pro is on its way. Tracking: 1Z999AA10123456784", time: "2 hours ago", isRead: false },
    { id: "2", type: "preorder_ready", title: "Preorder Queue Updated", body: "You moved to position #12 in the iPhone 18 Pro Max queue.", time: "5 hours ago", isRead: false },
    { id: "3", type: "trade_in_approved", title: "Trade-In Value Locked", body: "Your iPhone 16 Pro trade-in value of $350 is locked until Sep 15, 2026.", time: "1 day ago", isRead: true },
    { id: "4", type: "esim_activated", title: "eSIM Activated", body: "Your Cross-Border plan eSIM is now active. Enjoy seamless US-Canada coverage.", time: "3 days ago", isRead: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Notifications</h1>
      <p className="text-[#0f172a]/60 mb-8">Stay updated on orders, preorders, and trade-ins.</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {notifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 p-5 ${!n.isRead ? "bg-blue-50/30" : ""} hover:bg-gray-50/50 cursor-pointer`}>
            <div className={`p-2 rounded-xl ${!n.isRead ? "bg-[#04a1c6]/10 text-[#04a1c6]" : "bg-gray-100 text-gray-400"}`}>
              {ICON_MAP[n.type] || <Bell className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-semibold ${!n.isRead ? "text-[#0f172a]" : "text-[#0f172a]/70"}`}>{n.title}</h3>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#04a1c6]" />}
              </div>
              <p className="text-sm text-[#0f172a]/50 mt-1 truncate">{n.body}</p>
            </div>
            <span className="text-xs text-[#0f172a]/40 whitespace-nowrap">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
