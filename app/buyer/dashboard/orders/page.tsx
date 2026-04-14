"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PAYMENT_HELD: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  DISPUTED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const orders: Array<{ id: string; product: string; type: string; status: string; total: string; date: string }> = [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Orders</h1>
      <p className="text-[#0f172a]/60 mb-8">Track your normal orders and escrow status.</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-6 py-4 font-medium text-[#0f172a]/50">Order</th>
              <th className="px-6 py-4 font-medium text-[#0f172a]/50">Product</th>
              <th className="px-6 py-4 font-medium text-[#0f172a]/50">Type</th>
              <th className="px-6 py-4 font-medium text-[#0f172a]/50">Status</th>
              <th className="px-6 py-4 font-medium text-[#0f172a]/50">Total</th>
              <th className="px-6 py-4 font-medium text-[#0f172a]/50">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                <td className="px-6 py-4 font-medium text-[#0f172a]">{order.id}</td>
                <td className="px-6 py-4 text-[#0f172a]/70">{order.product}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-xs font-medium">{order.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-[#0f172a]">{order.total}</td>
                <td className="px-6 py-4 text-[#0f172a]/50">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-16 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-[#0f172a]/50">No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
