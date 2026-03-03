"use client";
import React, { useState } from "react";
import { 
  Truck, Search, Filter, 
  PackageSearch, Clock, DollarSign, 
  CheckCircle2, MapPin, X,
  ShieldCheck,
  Download, MoreVertical, FileText,
  User, Navigation, FileDown, AlertTriangle, Info, Check,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// --- Mock Data ---
interface Order {
  id: string;
  buyer: {
    name: string;
    company: string;
    avatar: string;
    location: string;
  };
  items: { name: string; qty: number }[];
  status: "Pending" | "Processing" | "In Transit" | "Delivered";
  totalValue: string;
  paymentStatus: "ESCROW FUNDED" | "PENDING" | "CLEARED";
  date: string;
  progress: number;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-9A4B-2X",
    buyer: {
      name: "Marcus Chen",
      company: "TechDistro Inc.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      location: "Toronto, ON"
    },
    items: [
      { name: "iPhone 15 Pro M", qty: 250 },
      { name: "Galaxy S24 Ultra", qty: 100 }
    ],
    status: "Processing",
    totalValue: "$345,000",
    paymentStatus: "ESCROW FUNDED",
    date: "Oct 24, 2026",
    progress: 45
  },
  {
    id: "ORD-7K9P-1Y",
    buyer: {
      name: "Sarah Jenkins",
      company: "Mobile City Retail",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      location: "Vancouver, BC"
    },
    items: [
      { name: "iPhone 14 (Refurbished)", qty: 500 }
    ],
    status: "In Transit",
    totalValue: "$210,000",
    paymentStatus: "ESCROW FUNDED",
    date: "Oct 22, 2026",
    progress: 75
  },
  {
    id: "ORD-3M2N-8Z",
    buyer: {
      name: "Ahmed Hassan",
      company: "Global Comm Systems",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      location: "Montreal, QC"
    },
    items: [
      { name: "Google Pixel 8 Pro", qty: 150 },
      { name: "OnePlus 12", qty: 50 }
    ],
    status: "Pending",
    totalValue: "$185,500",
    paymentStatus: "PENDING",
    date: "Oct 25, 2026",
    progress: 10
  }
];

export default function WholesalerBulkOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error" | "info"}[]>([]);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- Export Logic ---
  const prepareExportData = () => {
    return filteredOrders.map(order => ({
      "Order ID": order.id,
      "Buyer": order.buyer.name,
      "Company": order.buyer.company,
      "Location": order.buyer.location,
      "Manifest": order.items.map(i => `${i.name} (x${i.qty})`).join(", "),
      "Status": order.status,
      "Progress": `${order.progress}%`,
      "Total Value": order.totalValue,
      "Payment": order.paymentStatus,
      "Date": order.date
    }));
  };

  const handleExportExcel = () => {
    setIsExportMenuOpen(false);
    addToast("Generating Excel Manifest...", "info");
    try {
      const data = prepareExportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Bulk Orders");
      XLSX.writeFile(wb, "Wholesaler_Bulk_Orders_Report.xlsx");
      addToast("Excel manifest exported successfully!", "success");
    } catch (error) {
      console.error("Excel Export Error:", error);
      addToast("Failed to export Excel file", "error");
    }
  };

  const handleExportPDF = () => {
    setIsExportMenuOpen(false);
    addToast("Generating PDF Manifest...", "info");
    try {
      const doc = new jsPDF("landscape");
      const data = prepareExportData();
      
      const tableColumn = ["Order ID", "Company", "Buyer", "Manifest", "Status", "Value", "Date"];
      const tableRows = data.map(item => [
        item["Order ID"], item.Company, item.Buyer, item.Manifest,
        item.Status, item["Total Value"], item.Date
      ]);

      doc.setFontSize(18);
      doc.text("Wholesaler Platform - Bulk Orders Manifest", 14, 22);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [15, 23, 42] }
      });

      doc.save("Wholesaler_Bulk_Orders_Report.pdf");
      addToast("PDF manifest exported successfully!", "success");
    } catch (error) {
      console.error("PDF Export Error:", error);
      addToast("Failed to export PDF file", "error");
    }
  };

  const searchLower = searchQuery.toLowerCase();
  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchLower) || 
      order.buyer.company.toLowerCase().includes(searchLower) ||
      order.buyer.name.toLowerCase().includes(searchLower) ||
      order.items.some(item => item.name.toLowerCase().includes(searchLower));
      
    const matchesTab = activeTab === "All" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 antialiased font-sans pb-20 relative">
      
      {/* Toast Notification System */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`px-6 py-4 rounded-2xl shadow-xl backdrop-blur-3xl border flex items-center gap-4 min-w-[300px] pointer-events-auto ${
                toast.type === "error" ? "bg-white/90 border-rose-100 text-rose-700" : 
                toast.type === "info" ? "bg-white/90 border-blue-100 text-blue-700" :
                "bg-white/90 border-emerald-100 text-emerald-700"
              }`}
            >
              <div className={`p-2 rounded-xl ${
                toast.type === "error" ? "bg-rose-50 text-rose-500" : 
                toast.type === "info" ? "bg-blue-50 text-blue-500" :
                "bg-emerald-50 text-emerald-500"
              }`}>
                {toast.type === "error" ? <AlertTriangle className="w-5 h-5" /> : 
                 toast.type === "info" ? <Info className="w-5 h-5" /> :
                 <Check className="w-5 h-5" />}
              </div>
              <p className="text-[11px] font-black uppercase tracking-widest">{toast.msg}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Global Backdrop for Menu Closing */}
      {activeMenuId && (
        <div 
          className="fixed inset-0 z-[60] cursor-default"
          onClick={() => setActiveMenuId(null)}
        />
      )}
      
      {/* Header & High-Level KPIs */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a] tracking-tight uppercase">Bulk Order Logistics</h1>
          <p className="text-slate-400 font-bold mt-1 tracking-wide uppercase text-xs">Monitor high-volume B2B shipments and Escrow statuses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Active Orders", value: "1,248", icon: PackageSearch, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Pending Auth", value: "42", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Est. Revenue (30d)", value: "$4.2M", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Items Shipped", value: "84.5k", icon: Truck, color: "text-indigo-500", bg: "bg-indigo-50" }
          ].map((stat, idx) => (
            <div key={idx} className="p-4 bg-white border border-[#dcdcdc]/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
              </div>
              <div className="relative z-10 space-y-2">
                <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center border border-white`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{stat.label}</h3>
                  <p className="text-3xl font-black text-[#0f172a] tracking-tight mt-0.5">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Search & Filtering Control Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl p-2.5 shadow-sm sticky top-6 z-30">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1.5 lg:pb-0 scrollbar-hide">
            {["All", "Pending", "Processing", "In Transit", "Delivered"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20" : "text-slate-400 hover:text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64 group">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase tracking-widest"
              />
            </div>
            <button className="p-2.5 bg-white border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] hover:border-slate-300 shadow-sm transition-all cursor-pointer active:scale-95">
              <Filter className="w-4 h-4" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className={`px-5 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 ${
                  isExportMenuOpen ? "bg-blue-600 text-white shadow-blue-600/20" : "bg-[#0f172a] text-white hover:bg-blue-600 shadow-[#0f172a]/20"
                }`}
              >
                <Download className="w-4 h-4" /> Export
              </button>

              <AnimatePresence>
                {isExportMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsExportMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full mt-2 right-0 w-52 bg-white/95 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                    >
                      <button 
                        onClick={handleExportExcel}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors text-emerald-500">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Excel (.xlsx)</span>
                      </button>
                      <button 
                        onClick={handleExportPDF}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 border-t border-[#dcdcdc] transition-colors group cursor-pointer"
                      >
                        <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors text-rose-500">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">PDF Document</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List / Data Visualization */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#dcdcdc] p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#dcdcdc]">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] mb-2 uppercase tracking-wide">No Orders Found</h3>
            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Modify your search filters to see logistics data.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredOrders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-[#dcdcdc] rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
              >
                <div className="flex flex-col xl:flex-row gap-5 items-start xl:items-center">
                  
                  {/* Buyer & Order ID Identity */}
                  <div className="flex items-center gap-4 w-full xl:w-72 shrink-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#dcdcdc] shadow-sm bg-slate-50 shrink-0">
                      <Image src={order.buyer.avatar} alt={order.buyer.company} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-[#0f172a] font-black text-lg tracking-tight uppercase leading-tight line-clamp-1">{order.buyer.company}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{order.buyer.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">{order.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Contents */}
                  <div className="flex-1 w-full space-y-2 bg-slate-50/50 p-3 rounded-xl border border-dotted border-[#dcdcdc]">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Manifest</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-2 decoration-blue-500/20">{order.date}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="px-3 py-1.5 bg-white border border-[#dcdcdc] rounded-lg shadow-sm flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-wider">{item.name}</span>
                          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded-md">x{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logistics Status & Progress */}
                  <div className="w-full xl:w-48 shrink-0 space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${
                        order.status === "Pending" ? "bg-amber-100 text-amber-700" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        order.status === "In Transit" ? "bg-indigo-100 text-indigo-700" :
                        "bg-emerald-100 text-emerald-700"
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${order.progress}%` }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className={`h-full ${
                          order.status === "Delivered" ? "bg-emerald-500" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Financial & Actions */}
                  <div className="flex items-center gap-5 w-full xl:w-auto shrink-0 justify-between xl:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Value</p>
                      <p className="text-xl font-black text-[#0f172a] leading-none mb-2">{order.totalValue}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          order.paymentStatus === "ESCROW FUNDED" ? "text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1.5" : "text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1.5"
                        }`}>
                          {order.paymentStatus === "ESCROW FUNDED" && <CheckCircle2 className="w-3 h-3" />}
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-6 py-3.5 bg-[#0f172a] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap"
                      >
                        <FileText className="w-4 h-4" /> Review
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)}
                          className={`p-3 rounded-xl transition-all cursor-pointer border ${
                            activeMenuId === order.id 
                            ? "bg-[#0f172a] text-white border-[#0f172a] shadow-lg" 
                            : "bg-slate-50 border-[#dcdcdc] text-slate-400 hover:text-[#0f172a] hover:bg-slate-100"
                          }`}
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        <AnimatePresence>
                          {activeMenuId === order.id && (
                            <OrderActionDropdown 
                              order={order} 
                              onAction={(msg, type) => {
                                addToast(msg, type);
                                setActiveMenuId(null);
                              }} 
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Order Review Slide-out Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <ReviewPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const OrderActionDropdown = ({ order, onAction }: { order: Order; onAction: (msg: string, type: "success" | "info" | "error") => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl border border-[#dcdcdc] rounded-2xl shadow-2xl z-[70] py-2 overflow-hidden"
    >
      <button 
        onClick={() => onAction(`Opening Secure Messenger for ${order.buyer.company}...`, "info")}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group cursor-pointer"
      >
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <User className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Contact Buyer</span>
      </button>

      <button 
        onClick={() => onAction(`Fetching Cloud Logistics data for ${order.id}...`, "info")}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 border-t border-[#dcdcdc] transition-colors group cursor-pointer"
      >
        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
          <Navigation className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Track Shipment</span>
      </button>

      <button 
        onClick={() => onAction(`Generating Shipment Manifest for ${order.id}...`, "success")}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 border-t border-[#dcdcdc] transition-colors group cursor-pointer"
      >
        <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
          <FileDown className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Download Manifest</span>
      </button>

      <button 
        onClick={() => onAction(`Dispatching Priority Alert for ${order.id}...`, "error")}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 border-t border-[#dcdcdc] transition-colors group cursor-pointer"
      >
        <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <span className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest text-rose-500">Report Issue</span>
      </button>
    </motion.div>
  );
}

const ReviewPanel = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
      />

      {/* Panel */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 flex flex-col antialiased"
      >
        {/* Panel Header */}
        <div className="p-6 border-b border-[#dcdcdc] flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-[#0f172a] uppercase tracking-tight">Order Review</h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{order.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all cursor-pointer border border-transparent hover:border-rose-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-32">
          
          {/* Buyer Stats Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyer Identity</h3>
              <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Verified Partner
              </span>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-[#dcdcdc] flex items-center gap-5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white shadow-sm shrink-0 bg-white">
                <Image src={order.buyer.avatar} alt={order.buyer.company} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-black text-[#0f172a] uppercase leading-tight">{order.buyer.company}</h4>
                <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">{order.buyer.location}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{order.buyer.name}</p>
              </div>
            </div>
          </section>

          {/* Logistics Timeline Section */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Timeline</h3>
            <div className="space-y-0 relative ml-2">
              {/* Vertical Line */}
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-100" />
              
              {[
                { step: "Order Received", date: order.date, active: true, done: true },
                { step: "Escrow Verification", date: order.date, active: order.paymentStatus === "ESCROW FUNDED", done: order.paymentStatus === "ESCROW FUNDED" },
                { step: "Warehouse Allocation", date: "Processing", active: order.progress >= 40, done: order.progress >= 45 },
                { step: "In Transit Logistics", date: "TBD", active: order.progress >= 70, done: order.progress >= 75 },
                { step: "Final Delivery", date: "TBD", active: order.status === "Delivered", done: order.status === "Delivered" }
              ].map((milestone, mIdx) => (
                <div key={mIdx} className="relative flex items-start gap-6 pb-8 last:pb-0">
                  <div className={`mt-1.5 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-colors duration-500 ${
                    milestone.done ? "bg-emerald-500" : milestone.active ? "bg-blue-500 animate-pulse" : "bg-slate-200"
                  }`} />
                  <div className="pt-1">
                    <p className={`text-[11px] font-black uppercase tracking-wide leading-none ${milestone.active ? "text-[#0f172a]" : "text-slate-300"}`}>
                      {milestone.step}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Manifest Breakdown */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manifest Breakdown</h3>
            <div className="space-y-2">
              {order.items.map((item, iIdx) => (
                <div key={iIdx} className="p-3 bg-white border border-[#dcdcdc] rounded-xl flex items-center justify-between group hover:border-blue-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] font-black text-blue-500">
                      {iIdx + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-[#0f172a] uppercase tracking-wide">{item.name}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Device Type: Mobile Handset</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">x{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Financial Summary */}
          <section className="p-5 bg-[#0f172a] rounded-2xl text-white space-y-4 shadow-xl shadow-[#0f172a]/20">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Order Value</p>
              <p className="text-2xl font-black tracking-tight">{order.totalValue}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Status</p>
              <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                order.paymentStatus === "ESCROW FUNDED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {order.paymentStatus}
              </span>
            </div>
          </section>

        </div>

        {/* Sticky Footer Actions */}
        <div className="p-6 border-t border-[#dcdcdc] bg-white sticky bottom-0 z-10 grid grid-cols-2 gap-3">
          <button className="py-4 bg-slate-50 text-[#0f172a] rounded-xl font-bold text-[10px] uppercase tracking-widest border border-[#dcdcdc] hover:bg-slate-100 transition-all cursor-pointer">
            Message Buyer
          </button>
          <button 
            onClick={onClose}
            className="py-4 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
          >
            Confirm Logistics
          </button>
        </div>

      </motion.div>
    </>
  );
}
