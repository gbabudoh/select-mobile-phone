"use client";
import React from "react";
import {
  Package, ShoppingCart, TrendingUp, Users,
  ArrowLeftRight, Wifi, Star, DollarSign
} from "lucide-react";

// Overview dashboard — adapts based on user role
// In production, fetch real data from /api/dashboard/[role]

const MOCK_STATS = {
  WHOLESALER: [
    { label: "Active Inventory", value: "2,340", icon: Package, color: "bg-blue-500" },
    { label: "Orders This Month", value: "187", icon: ShoppingCart, color: "bg-green-500" },
    { label: "Revenue", value: "$124,500", icon: DollarSign, color: "bg-purple-500" },
    { label: "Retail Partners", value: "45", icon: Users, color: "bg-orange-500" },
  ],
  RETAILER: [
    { label: "Active Listings", value: "156", icon: Package, color: "bg-blue-500" },
    { label: "Sales This Month", value: "89", icon: ShoppingCart, color: "bg-green-500" },
    { label: "Revenue", value: "$34,200", icon: TrendingUp, color: "bg-purple-500" },
    { label: "Avg Rating", value: "4.8", icon: Star, color: "bg-yellow-500" },
  ],
  NETWORK_PROVIDER: [
    { label: "Active Plans", value: "12", icon: Wifi, color: "bg-blue-500" },
    { label: "eSIM Activations", value: "1,230", icon: TrendingUp, color: "bg-green-500" },
    { label: "Bounty Revenue", value: "$8,400", icon: DollarSign, color: "bg-purple-500" },
    { label: "Churn Rate", value: "2.1%", icon: Users, color: "bg-red-500" },
  ],
  BUYER: [
    { label: "Active Orders", value: "3", icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Preorders", value: "1", icon: Package, color: "bg-green-500" },
    { label: "Trade-In Credits", value: "$350", icon: ArrowLeftRight, color: "bg-purple-500" },
    { label: "Saved", value: "$680", icon: DollarSign, color: "bg-orange-500" },
  ],
  INDIVIDUAL_SELLER: [
    { label: "Active Listings", value: "8", icon: Package, color: "bg-blue-500" },
    { label: "Total Sales", value: "23", icon: ShoppingCart, color: "bg-green-500" },
    { label: "Earnings", value: "$4,120", icon: DollarSign, color: "bg-purple-500" },
    { label: "Rating", value: "4.9", icon: Star, color: "bg-yellow-500" },
  ],
};

export default function DashboardOverview() {
  // In production, get role from session/auth
  const role = "BUYER";
  const stats = MOCK_STATS[role] || MOCK_STATS.BUYER;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Dashboard</h1>
      <p className="text-[#0f172a]/60 mb-8">Welcome back. Here&apos;s your overview.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4"
          >
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[#0f172a]/50 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-[#0f172a]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { text: "Order #SM-4821 shipped — iPhone 18 Pro", time: "2 hours ago", color: "bg-green-100 text-green-700" },
            { text: "Preorder queue position updated — #12 of 500", time: "5 hours ago", color: "bg-blue-100 text-blue-700" },
            { text: "Trade-in quote locked — $350 for iPhone 16 Pro", time: "1 day ago", color: "bg-purple-100 text-purple-700" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm text-[#0f172a]">{activity.text}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${activity.color}`}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
