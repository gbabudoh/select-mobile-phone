"use client";
import React, { useState, useMemo, useRef } from "react";
import { 
  Package, Plus, Search, MoreVertical, 
  AlertCircle, DollarSign, CheckCircle2,
  Trash2, Edit3, ExternalLink, X, ChevronDown,
  Eye, Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, Product } from "@/lib/products";
import Image from "next/image";

export default function RetailerInventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuDirection, setMenuDirection] = useState<"down" | "up">("down");
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  
  const toggleMenu = (e: React.MouseEvent, id: string) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const openUp = windowHeight - rect.bottom < 250;
      setMenuDirection(openUp ? "up" : "down");
      setMenuPos({
        top: openUp ? rect.top : rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
      setOpenMenuId(id);
    }
  };

  const [newColors, setNewColors] = useState<{ name: string; hex: string }[]>([]);
  const [newSpecs, setNewSpecs] = useState<{ key: string; value: string }[]>([]);
  
  // Ref for generating unique IDs without triggering impurity lint errors
  const idCounter = useRef(0);
  const getNextId = () => {
    idCounter.current += 1;
    return idCounter.current;
  };

  // Notification Toast state
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);

  // Convert to local state to allow mutations (like Delete)
  const [localProducts, setLocalProducts] = useState<Product[]>(() => 
    PRODUCTS.filter(p => p.sellerType === "Retailer")
  );

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = getNextId();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleAction = (action: string, product: Product) => {
    setOpenMenuId(null);
    switch (action) {
      case "Edit Product":
        addToast(`Opening editor for ${product.name}...`);
        break;
      case "View Details":
        addToast(`Viewing details for ${product.name}...`);
        break;
      case "Duplicate":
        const duplicatedId = `copy-${getNextId()}`;
        const duplicated = { ...product, id: duplicatedId, name: `${product.name} (Copy)` };
        setLocalProducts([duplicated, ...localProducts]);
        addToast(`Duplicated ${product.name} successfully!`);
        break;
      case "Delete":
        setLocalProducts(localProducts.filter(p => p.id !== product.id));
        addToast(`${product.name} deleted successfully.`, "error");
        break;
    }
  };

  const handleBulkDelete = () => {
    setLocalProducts(localProducts.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    addToast(`${selectedIds.length} items deleted successfully.`, "error");
  };

  const handlePublish = () => {
    // Basic mock: just add a placeholder handset
    const newId = `new-${getNextId()}`;
    const newProduct: Product = {
      id: newId,
      name: "New Product Listing",
      brand: "Brand Name",
      price: 999,
      image: localProducts[0]?.image || "",
      category: "HANDSET",
      seller: "MobileHub Retail",
      sellerType: "Retailer",
      condition: "New",
      rating: 5,
      reviews: 0,
      isSelectVerified: false,
      shipping: "Standard",
      inStock: true,
      country: "US",
    };
    setLocalProducts([newProduct, ...localProducts]);
    setIsAddModalOpen(false);
    addToast("Product published successfully!", "success");
  };

  const addColor = () => setNewColors([...newColors, { name: "", hex: "#000000" }]);
  const removeColor = (idx: number) => setNewColors(newColors.filter((_, i) => i !== idx));
  const updateColor = (idx: number, field: "name" | "hex", value: string) => {
    const updated = [...newColors];
    updated[idx][field] = value;
    setNewColors(updated);
  };

  const addSpec = () => setNewSpecs([...newSpecs, { key: "", value: "" }]);
  const removeSpec = (idx: number) => setNewSpecs(newSpecs.filter((_, i) => i !== idx));
  const updateSpec = (idx: number, field: "key" | "value", value: string) => {
    const updated = [...newSpecs];
    updated[idx][field] = value;
    setNewSpecs(updated);
  };

  const filteredProducts = useMemo(() => {
    return localProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [localProducts, searchTerm, categoryFilter]);

  // Analytics Calculations
  const stats = useMemo(() => [
    { label: "Total Products", value: localProducts.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Listings", value: filteredProducts.length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Low Stock", value: 2, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Inv. Value", value: `$${localProducts.reduce((acc, p) => acc + p.price, 0).toLocaleString()}`, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50" },
  ], [localProducts, filteredProducts]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Store Inventory</h1>
          <p className="text-[#0f172a]/60">Manage your product catalog, pricing, and stock levels.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#04a1c6] text-white rounded-xl font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all cursor-pointer shadow-cyan-100/50"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className={`p-2.5 w-fit rounded-xl mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-[#0f172a]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Inventory Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Controls Header */}
        <div className="p-6 border-b border-gray-50 bg-white sticky top-0 z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 bg-gray-50/30 font-medium"
                />
              </div>
              <div className="relative">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 text-sm font-bold text-[#0f172a]/70 bg-gray-50/30 focus:outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <option>All</option>
                  <option value="HANDSET">Handsets</option>
                  <option value="ACCESSORY">Accessories</option>
                  <option value="ESIM_PLAN">eSIM Plans</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-1.5 bg-gray-900 rounded-xl"
                >
                  <span className="text-xs font-bold text-white pl-3 pr-2 border-r border-white/10">{selectedIds.length} Selected</span>
                  <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-4 pl-6 border-b border-gray-100">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-[#04a1c6] cursor-pointer" 
                  />
                </th>
                <th className="p-4 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="p-4 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="p-4 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="p-4 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
                <th className="p-4 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-4 pr-6 border-b border-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => (
                  <motion.tr 
                    layout
                    key={p.id} 
                    className={`group hover:bg-sky-50/30 transition-colors ${selectedIds.includes(p.id) ? 'bg-sky-50/50' : ''}`}
                  >
                    <td className="p-4 pl-6 border-b border-gray-50">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 rounded accent-[#04a1c6] cursor-pointer" 
                      />
                    </td>
                    <td className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border border-gray-100 relative overflow-hidden bg-gray-50 shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0f172a]">{p.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-50">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                        {p.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-50">
                      <p className="text-sm font-black text-[#0f172a]">${p.price.toLocaleString()}</p>
                    </td>
                    <td className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${p.id === '15' ? 'w-1/4 bg-amber-500' : 'w-full bg-[#04a1c6]'}`} 
                          />
                        </div>
                        <span className={`text-xs font-bold ${p.id === '15' ? 'text-amber-600' : 'text-[#0f172a]'}`}>
                          {p.id === '15' ? '4 left' : 'In Stock'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 border-b border-gray-50 text-right relative">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleMenu(e, p.id)}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          openMenuId === p.id ? 'bg-[#04a1c6] text-white shadow-lg shadow-cyan-200/50' : 'text-gray-400 hover:text-[#04a1c6] hover:bg-[#04a1c6]/5'
                        }`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.button>

                      <AnimatePresence>
                        {openMenuId === p.id && (
                          <>
                            {/* Backdrop to close menu */}
                            <div 
                              className="fixed inset-0 z-20" 
                              onClick={() => setOpenMenuId(null)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98, y: menuDirection === 'up' ? 8 : -8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98, y: menuDirection === 'up' ? 8 : -8 }}
                              style={{
                                position: 'fixed',
                                right: menuPos.right,
                                ...(menuDirection === 'up' ? { bottom: window.innerHeight - menuPos.top + 4 } : { top: menuPos.top }),
                              }}
                              className="w-44 bg-[#f8fafc] rounded-xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)] border border-[#dcdcdc] z-50 overflow-hidden text-left"
                            >
                              {/* Header Section (Fixed Size) */}
                              <div className="h-[46px] px-2.5 py-2 flex items-center gap-2 border-b border-[#dcdcdc]">
                                <div className="w-7 h-7 rounded-full bg-white border border-[#dcdcdc] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                  <Image src={p.image} alt={p.name} width={28} height={28} className="object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] font-black text-[#0f172a] truncate leading-tight uppercase tracking-tight">{p.name}</p>
                                  <button onClick={() => handleAction("View Details", p)} className="text-[9px] font-bold text-[#6366f1] hover:underline cursor-pointer opacity-80 mt-0.5">
                                    View details
                                  </button>
                                </div>
                              </div>

                              {/* Actions List (Consistent Spacing) */}
                              <div className="py-1 px-0.5">
                                {[
                                  { label: "Edit product info", icon: Edit3, action: "Edit Product" },
                                  { label: "View on storefront", icon: Eye, action: "View Details" },
                                  { label: "Duplicate listing", icon: Copy, action: "Duplicate" },
                                ].map((item) => (
                                  <motion.button
                                    key={item.label}
                                    whileHover={{ x: 2, backgroundColor: "#ffffff" }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-bold text-[#0f172a]/70 hover:shadow-sm rounded-lg transition-all cursor-pointer group"
                                    onClick={() => handleAction(item.action, p)}
                                  >
                                    <div className="group-hover:scale-110 transition-transform">
                                      <item.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#04a1c6] transition-colors" />
                                    </div>
                                    <span className="truncate">{item.label}</span>
                                  </motion.button>
                                ))}
                              </div>

                              {/* Separated Delete Action */}
                              <div className="border-t border-[#dcdcdc] p-0.5 bg-slate-50/50">
                                <motion.button
                                  whileHover={{ x: 2, backgroundColor: "#fff1f2" }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-bold text-rose-500 transition-all cursor-pointer group rounded-lg"
                                  onClick={() => handleAction("Delete", p)}
                                >
                                  <div className="group-hover:scale-110 transition-transform">
                                    <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-600 transition-colors" />
                                  </div>
                                  <span className="truncate">Delete listing</span>
                                </motion.button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#0f172a]">No products found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md ${
                toast.type === "success" 
                ? "bg-white/90 border-emerald-100 text-[#0f172a]" 
                : "bg-rose-50/90 border-rose-100 text-rose-700"
              }`}
            >
              {toast.type === "success" ? (
                <div className="p-1 bg-emerald-500 rounded-full text-white">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              ) : (
                <div className="p-1 bg-rose-500 rounded-full text-white">
                  <AlertCircle className="w-3 h-3" />
                </div>
              )}
              <p className="text-xs font-bold">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Product Modal Mock */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#04a1c6]/5 rounded-xl text-[#04a1c6]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0f172a]">Add New Inventory</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto chat-scroll">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                      <input type="text" placeholder="e.g. Galaxy S26 Ultra" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#04a1c6]/20 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing ($)</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Regular" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#04a1c6]/20 outline-none" />
                        <input type="number" placeholder="Discount (Opt)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#04a1c6]/20 outline-none" />
                      </div>
                    </div>

                    {/* Color Options */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Color Options</label>
                        <button onClick={addColor} className="text-[10px] font-black uppercase text-[#04a1c6] hover:underline cursor-pointer">
                          + Add Color
                        </button>
                      </div>
                      <div className="space-y-3">
                        {newColors.map((color, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              placeholder="Name (e.g. Phantom Blue)" 
                              value={color.name}
                              onChange={(e) => updateColor(idx, "name", e.target.value)}
                              className="flex-3 px-3 py-2 rounded-lg border border-gray-100 text-xs outline-none focus:border-[#04a1c6]/40" 
                            />
                            <div className="flex-1 relative flex items-center">
                              <input 
                                type="color" 
                                value={color.hex}
                                onChange={(e) => updateColor(idx, "hex", e.target.value)}
                                className="w-full h-8 rounded border-none cursor-pointer" 
                              />
                            </div>
                            <button onClick={() => removeColor(idx)} className="p-2 text-gray-300 hover:text-rose-500 cursor-pointer">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {newColors.length === 0 && (
                          <p className="text-[10px] text-gray-400 italic">No color variants added.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Units</label>
                      <input type="number" placeholder="Quantity in warehouse" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#04a1c6]/20 outline-none" />
                    </div>
                    <div className="space-y-2 text-center">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rich Media</label>
                      <div className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center bg-gray-50 group hover:border-[#04a1c6]/40 hover:bg-[#04a1c6]/5 transition-all cursor-pointer">
                        <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-[#04a1c6]" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Upload Product Image</p>
                      </div>
                    </div>

                    {/* Variation Options (Specs) */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Specification Options</label>
                        <button onClick={addSpec} className="text-[10px] font-black uppercase text-[#04a1c6] hover:underline cursor-pointer">
                          + Add Variation
                        </button>
                      </div>
                      <div className="space-y-3">
                        {newSpecs.map((spec, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              placeholder="Key (e.g. RAM)" 
                              value={spec.key}
                              onChange={(e) => updateSpec(idx, "key", e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-100 text-xs outline-none focus:border-[#04a1c6]/40" 
                            />
                            <input 
                              type="text" 
                              placeholder="Value (e.g. 12GB)" 
                              value={spec.value}
                              onChange={(e) => updateSpec(idx, "value", e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-100 text-xs outline-none focus:border-[#04a1c6]/40" 
                            />
                            <button onClick={() => removeSpec(idx)} className="p-2 text-gray-300 hover:text-rose-500 cursor-pointer">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {newSpecs.length === 0 && (
                          <p className="text-[10px] text-gray-400 italic">No specifications added.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-sm text-[#0f172a]/60 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={handlePublish}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-sm bg-[#0f172a] text-white hover:translate-y-[-2px] hover:shadow-xl transition-all shadow-lg shadow-blue-950/20 cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md ${
                toast.type === "success" 
                ? "bg-white/90 border-emerald-100 text-[#0f172a]" 
                : "bg-rose-50/90 border-rose-100 text-rose-700"
              }`}
            >
              {toast.type === "success" ? (
                <div className="p-1 bg-emerald-500 rounded-full text-white">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              ) : (
                <div className="p-1 bg-rose-500 rounded-full text-white">
                  <AlertCircle className="w-3 h-3" />
                </div>
              )}
              <p className="text-xs font-bold">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
