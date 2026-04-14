"use client";
import React, { useState, useMemo } from "react";
import { 
  Plus, Search, 
  Download, CheckCircle2, 
  Package, TrendingUp,
  Trash2, RefreshCw,
  LayoutGrid, List, Check, X, AlertTriangle, Info,
  UploadCloud, FileSpreadsheet, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// --- Types ---
interface PriceTier {
  qty: string;
  price: string;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  stock: {
    available: number;
    reserved: number;
    incoming: number;
  };
  tiers: PriceTier[];
  status: "In Stock" | "Low Stock" | "Out of Stock";
  warehouse: string;
}



export default function WholesalerInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" | "info" }[]>([]);

  // Modal states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<"idle" | "uploading" | "success">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [managingItem, setManagingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // --- Logic ---
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || item.category.toLowerCase() === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [inventory, searchQuery, activeTab]);

  const addToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(i => i.id));
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
  };

  const executeDelete = () => {
    if (!itemToDelete) return;
    setInventory(prev => prev.filter(item => item.id !== itemToDelete));
    setSelectedItems(prev => prev.filter(i => i !== itemToDelete));
    addToast("Item removed from inventory", "info");
    setItemToDelete(null);
  };

  const handleBulkDelete = () => {
    setInventory(prev => prev.filter(item => !selectedItems.includes(item.id)));
    addToast(`${selectedItems.length} items removed`, "info");
    setSelectedItems([]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast("Inventory synchronized with warehouse");
    }, 1000);
  };

  const prepareExportData = () => {
    return filteredInventory.map(item => ({
      SKU: item.sku,
      Brand: item.brand,
      Name: item.name,
      Category: item.category,
      Status: item.status,
      Available: item.stock.available,
      Reserved: item.stock.reserved,
      Incoming: item.stock.incoming,
      Warehouse: item.warehouse,
      BasePrice: item.tiers.length > 0 ? item.tiers[item.tiers.length - 1].price : "$0",
    }));
  };

  const handleExportExcel = () => {
    setIsExportMenuOpen(false);
    addToast("Exporting to Excel...", "info");
    try {
      const data = prepareExportData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventory");
      XLSX.writeFile(wb, "Global_Distribution_Inventory.xlsx");
      addToast("Excel manifest exported successfully!", "success");
    } catch {
      addToast("Failed to export Excel file", "error");
    }
  };

  const handleExportPDF = () => {
    setIsExportMenuOpen(false);
    addToast("Generating PDF Manifest...", "info");
    try {
      const doc = new jsPDF("landscape");
      const data = prepareExportData();
      
      const tableColumn = ["SKU", "Brand", "Product Name", "Status", "Available", "Warehouse", "Base Price"];
      const tableRows = data.map(item => [
        item.SKU, item.Brand, item.Name, item.Status,
        item.Available.toString(), item.Warehouse, item.BasePrice
      ]);

      doc.setFontSize(18);
      doc.text("Global Distribution - Bulk Inventory Manifest", 14, 22);
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

      doc.save("Global_Distribution_Inventory.pdf");
      addToast("PDF manifest exported successfully!", "success");
    } catch {
      addToast("Failed to export PDF file", "error");
    }
  };

  const openImportModal = () => {
    setIsImportModalOpen(true);
    setImportStep("idle");
    setUploadProgress(0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStep("uploading");
    setUploadProgress(10);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "inventory-manifests");

      // We'll use a simple fetch here, as progress monitoring requires XHR or a specialized hook
      // For now, we simulate progress while waiting for the response
      const progressTimer = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 5 : prev));
      }, 300);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);
      
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadProgress(100);
      setImportStep("success");
      
      // Successfully uploaded to Minio at data.url
      // In a real app, we'd now trigger a background task to process the CSV
      setTimeout(() => {
        setIsImportModalOpen(false);
        addToast(`Batch ${file.name} uploaded to storage`, "success");
      }, 1500);

    } catch (error) {
      console.error("Upload error:", error);
      setImportStep("idle");
      addToast("Failed to upload manifest to storage", "error");
    }
  };

  const handleManageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingItem) return;
    setInventory(prev => prev.map(item => item.id === managingItem.id ? managingItem : item));
    setManagingItem(null);
    addToast(`${managingItem.name} updated successfully!`, "success");
  };

  const openManager = (item: InventoryItem) => {
    // Clone item to avoid direct state mutation during edits
    setManagingItem(JSON.parse(JSON.stringify(item)));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 antialiased font-sans pb-20">
      {/* Toast Notification System */}
      <div className="fixed top-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`px-6 py-4 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl border flex items-center gap-4 min-w-[320px] pointer-events-auto ${
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
              <p className="text-sm font-bold tracking-tight">{toast.msg}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 text-blue-500 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-[11px] uppercase tracking-[0.25em] leading-none">Global Distribution</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#0f172a] tracking-tight mb-4">
            Bulk <span className="text-blue-500">Inventory</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
            Manage high-volume institutional stock, regional allocations, and wholesale pricing tiers from a unified B2B command center.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-3 px-8 py-5 bg-white border border-slate-100 rounded-[1.75rem] font-extrabold text-[11px] uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all cursor-pointer group active:scale-95"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Export Manifest
            </button>

            <AnimatePresence>
              {isExportMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-2 left-0 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-[100]"
                >
                  <button onClick={handleExportExcel} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-slate-50 text-[11px] font-extrabold text-[#0f172a] uppercase tracking-widest transition-colors cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Excel (.xlsx)
                  </button>
                  <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-slate-50 border-t border-slate-50 text-[11px] font-extrabold text-[#0f172a] uppercase tracking-widest transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-rose-500" /> PDF Document
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={openImportModal}
            className="flex items-center gap-3 px-10 py-5 bg-[#0f172a] text-white rounded-[1.75rem] font-extrabold text-[11px] uppercase tracking-widest hover:bg-blue-600 shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer group active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            Import Batch
          </button>
        </motion.div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100">
          {['all', 'smartphones', 'tablets', 'wearables'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === tab ? "bg-white text-[#0f172a] shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 relative group w-full lg:w-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by SKU, Brand, or Warehouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-10 py-5 bg-white border border-slate-100 rounded-[1.75rem] focus:border-blue-500/30 focus:ring-[12px] focus:ring-blue-500/5 transition-all outline-none font-bold text-[#0f172a] placeholder:text-slate-300 placeholder:font-medium"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-500 transition-all group shadow-sm active:scale-90 cursor-pointer ${isRefreshing ? "animate-spin" : ""}`}
            title="Sync Inventory"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
          <div className="flex items-center p-1.5 bg-slate-100/50 rounded-2xl gap-1 border border-slate-100">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-xl transition-all cursor-pointer ${viewMode === "list" ? "bg-white text-blue-500 shadow-sm" : "text-slate-400"}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-xl transition-all cursor-pointer ${viewMode === "grid" ? "bg-white text-blue-500 shadow-sm" : "text-slate-400"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Batch Actions Banner */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl bg-[#0f172a] text-white p-7 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex items-center justify-between border border-white/10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20">
               <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
            </div>
            
            <div className="flex items-center gap-6 ml-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-blue-500/20">
                {selectedItems.length}
              </div>
              <div>
                <p className="text-base font-extrabold tracking-tight">Bulk Command Active</p>
                <p className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest mt-0.5">Global modifications pending</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => addToast(`Initializing transfer for ${selectedItems.length} items...`, "info")}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
              >
                Relocate
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Destroy
              </button>
              <button onClick={() => setSelectedItems([])} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all ml-2 group cursor-pointer">
                <X className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="p-8 pl-10 w-20">
                      <button 
                        onClick={toggleSelectAll}
                        className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center cursor-pointer ${
                          selectedItems.length === filteredInventory.length && filteredInventory.length > 0 ? "bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/20" : "border-slate-200 bg-white"
                        }`}
                      >
                        {selectedItems.length === filteredInventory.length && filteredInventory.length > 0 && <Check className="w-4 h-4 text-white" />}
                      </button>
                    </th>
                    <th className="p-8 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Product Line</th>
                    <th className="p-8 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Inventory Sync</th>
                    <th className="p-8 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Price Tiers</th>
                    <th className="p-8 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredInventory.map((item, idx) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className={`group hover:bg-slate-50/50 transition-all duration-300 ${selectedItems.includes(item.id) ? "bg-blue-50/20" : ""}`}
                    >
                      <td className="p-4 pl-6">
                        <button 
                          onClick={() => toggleSelect(item.id)}
                          className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center cursor-pointer ${
                            selectedItems.includes(item.id) ? "bg-blue-500 border-blue-500" : "border-slate-200 bg-white group-hover:border-blue-200"
                          }`}
                        >
                          {selectedItems.includes(item.id) && <Check className="w-4 h-4 text-white" />}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl border border-slate-100 bg-white overflow-hidden relative shadow-sm group-hover:scale-105 transition-transform duration-500 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 text-blue-500">
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.brand}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sku}</span>
                            </div>
                            <h3 className="text-xl font-extrabold text-[#0f172a] tracking-tight group-hover:text-blue-600 transition-colors uppercase">{item.name}</h3>
                            <p className="text-xs text-slate-400 font-bold tracking-wide mt-1 uppercase leading-none">{item.warehouse}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-8">
                          <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Available</p>
                            <p className="text-xl font-black text-[#0f172a] leading-none">{item.stock.available.toLocaleString()}</p>
                          </div>
                          <div className="h-10 w-[1px] bg-slate-100" />
                          <div className="space-y-4 flex-1 min-w-[120px]">
                             <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest leading-none">
                                <span className="text-indigo-400 font-bold">Res: {item.stock.reserved}</span>
                                <span className="text-emerald-400 font-bold">Inb: {item.stock.incoming}</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                                <div className="bg-blue-500 h-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" style={{ width: '60%' }} />
                                <div className="bg-indigo-300 h-full" style={{ width: '15%' }} />
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {item.tiers.map((tier, tIdx) => (
                            <div key={tIdx} className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-center group/tier hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all cursor-default">
                              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 leading-none">{tier.qty}</p>
                              <p className="text-sm font-black text-[#0f172a] leading-none">{tier.price}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openManager(item)}
                            className="py-3 px-5 bg-[#0f172a] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                          >
                            Manage Lot
                          </button>
                          <button 
                            onClick={() => addToast(`Fetching analytics for ${item.name}...`, "info")}
                            className="p-3 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-indigo-500 hover:border-indigo-100 shadow-sm transition-all active:scale-90 cursor-pointer" 
                            title="Stock Health"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(item.id)}
                            className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-400 hover:bg-rose-500 hover:text-white shadow-sm transition-all active:scale-90 cursor-pointer" 
                            title="Deactivate Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredInventory.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-32 text-center">
                           <div className="max-w-xs mx-auto space-y-4">
                              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100">
                                 <Search className="w-10 h-10 text-slate-300" />
                              </div>
                              <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">No inventory matches your filters</p>
                              <button onClick={() => {setSearchQuery(""); setActiveTab("all");}} className="px-8 py-3 bg-[#0f172a] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer">Clear All Filters</button>
                           </div>
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredInventory.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * idx }}
                className={`group bg-white rounded-[2.5rem] border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden ${
                  selectedItems.includes(item.id) ? "border-blue-500 ring-4 ring-blue-500/10" : "border-slate-100"
                }`}
              >
                <button 
                  onClick={() => toggleSelect(item.id)}
                  className={`absolute top-6 left-6 z-10 w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                    selectedItems.includes(item.id) ? "bg-blue-500 border-blue-500" : "border-white bg-slate-900/10 backdrop-blur-md opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {selectedItems.includes(item.id) && <Check className="w-5 h-5 text-white" />}
                </button>
                
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 border border-slate-50 group-hover:scale-105 transition-transform duration-700 shadow-sm">
                   <Image src={item.image} alt={item.name} fill className="object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.brand}</span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        item.status === "Low Stock" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>{item.status}</span>
                    </div>
                    <h4 className="text-2xl font-extrabold text-[#0f172a] uppercase tracking-tight line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase mt-1">{item.warehouse}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-50">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Net Value</p>
                       <p className="text-xl font-black text-[#0f172a]">{item.tiers[2].price}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-50">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Net Availability</p>
                       <p className="text-xl font-black text-[#0f172a]">{item.stock.available}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button 
                      onClick={() => openManager(item)}
                      className="flex-1 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                      Manage Lot
                    </button>
                    <button 
                      onClick={() => confirmDelete(item.id)}
                      className="p-4 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 border border-slate-50 rounded-2xl transition-all active:scale-90 cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warehouse Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-10 bg-[#0f172a] rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
            <TrendingUp className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h5 className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-6">Network Demand</h5>
            <p className="text-4xl font-black tracking-tight mb-2">+24.5%</p>
            <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase">Smartphones category trending high in NY/NJ area this week.</p>
          </div>
        </div>
        
        <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100 shadow-inner group-hover:rotate-12 transition-transform">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h5 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">Sync Status</h5>
          <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase text-[12px] tracking-tight">All 4 warehouses are synchronized. Real-time availability active for all partners.</p>
        </div>

        <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 shadow-inner group-hover:rotate-12 transition-transform">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h5 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-2">Inbound Flow</h5>
          <p className="text-sm font-medium text-slate-500 leading-relaxed uppercase text-[12px] tracking-tight">1,240 units in transit. fulfillment date for backorders: Mar 15.</p>
        </div>
      </div>

      {/* Import Batch Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => importStep !== "uploading" && setIsImportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white overflow-hidden p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">Import Batch</h3>
                  <p className="text-slate-500 font-medium text-sm">Upload a CSV or XLSX file to update inventory.</p>
                </div>
                <button 
                  onClick={() => importStep !== "uploading" && setIsImportModalOpen(false)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-[#0f172a] hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-50 cursor-pointer"
                  disabled={importStep === "uploading"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {importStep === "idle" && (
                <div className="relative">
                  <input
                    type="file"
                    id="manifest-upload"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="manifest-upload"
                    className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group"
                  >
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-100">
                      <UploadCloud className="w-10 h-10 text-blue-500" />
                    </div>
                    <h4 className="text-xl font-extrabold text-[#0f172a] mb-2">Click or drag file here</h4>
                    <p className="text-slate-500 font-medium text-sm mb-6">Supports .csv, .xlsx, .xls up to 50MB</p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      <FileSpreadsheet className="w-4 h-4" /> Download Template
                    </div>
                  </label>
                </div>
              )}

              {importStep === "uploading" && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="relative w-24 h-24 mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                      <motion.circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round"
                        initial={{ strokeDasharray: "0 300" }}
                        animate={{ strokeDasharray: `${uploadProgress * 2.8} 300` }}
                        transition={{ ease: "linear" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-[#0f172a]">{uploadProgress}%</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-extrabold text-[#0f172a] mb-2">Processing Data...</h4>
                  <p className="text-slate-500 font-medium text-sm">Validating SKUs and mapping columns.</p>
                </div>
              )}

              {importStep === "success" && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-emerald-100"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h4 className="text-2xl font-extrabold text-[#0f172a] mb-2">Import Complete!</h4>
                  <p className="text-slate-500 font-medium text-sm">Inventory has been updated successfully.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Lot Slide-out Panel */}
      <AnimatePresence>
        {managingItem && (
          <div className="fixed inset-0 z-[400] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setManagingItem(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%", transition: { ease: "anticipate", duration: 0.3 } }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-white/50"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight uppercase line-clamp-1">{managingItem.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black tracking-widest uppercase text-blue-500">{managingItem.brand}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">{managingItem.sku}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setManagingItem(null)}
                  className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-2xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManageSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Status Toggle */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Listing Status</label>
                  <select 
                    value={managingItem.status}
                    onChange={(e) => setManagingItem({...managingItem, status: (e.target.value as "In Stock" | "Low Stock" | "Out of Stock")})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-[#0f172a] outline-none focus:border-blue-500 transition-colors uppercase tracking-widest"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                {/* Stock Management */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Stock Availability</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl relative">
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-2">Available</p>
                      <input 
                        type="number" 
                        value={managingItem.stock.available}
                        onChange={(e) => setManagingItem({...managingItem, stock: {...managingItem.stock, available: parseInt(e.target.value) || 0}})}
                        className="w-full bg-white border border-emerald-200 rounded-xl p-3 font-black text-xl text-[#0f172a] outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Reserved</p>
                      <input 
                        type="number" 
                        value={managingItem.stock.reserved}
                        onChange={(e) => setManagingItem({...managingItem, stock: {...managingItem.stock, reserved: parseInt(e.target.value) || 0}})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 font-black text-xl text-[#0f172a] outline-none focus:ring-2 focus:ring-slate-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Tiers */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">Wholesale Price Tiers</label>
                  <div className="space-y-3">
                    {managingItem.tiers.map((tier, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={tier.qty}
                            onChange={(e) => {
                              const newTiers = [...managingItem.tiers];
                              newTiers[idx].qty = e.target.value;
                              setManagingItem({...managingItem, tiers: newTiers});
                            }}
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 text-center outline-none focus:border-blue-500 uppercase tracking-widest"
                            placeholder="Qty (e.g. 10-49)"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <input 
                            type="text" 
                            value={tier.price.replace('$', '')}
                            onChange={(e) => {
                              const newTiers = [...managingItem.tiers];
                              newTiers[idx].price = `$${e.target.value}`;
                              setManagingItem({...managingItem, tiers: newTiers});
                            }}
                            className="w-full pl-8 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg font-black text-[#0f172a] outline-none focus:border-blue-500"
                            placeholder="Price"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                <button 
                  onClick={() => setManagingItem(null)}
                  className="flex-1 py-5 bg-white border border-slate-200 text-slate-500 font-extrabold text-[11px] uppercase tracking-widest rounded-[1.5rem] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleManageSubmit}
                  className="flex-[2] py-5 bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-widest rounded-[1.5rem] hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-white overflow-hidden p-8 text-center"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-inner">
                <Trash2 className="w-10 h-10 text-rose-500" />
              </div>
              
              <h3 className="text-2xl font-extrabold text-[#0f172a] tracking-tight mb-2">Delete Lot?</h3>
              <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                Are you sure you want to permanently remove this stock lot? This action cannot be undone and will immediately sync to all connected warehouses.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold text-[11px] uppercase tracking-widest rounded-2xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
