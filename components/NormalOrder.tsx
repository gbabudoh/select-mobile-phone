"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck, Truck, Search, SlidersHorizontal, X,
  Star, Smartphone, Headphones, Cpu, Package, LayoutGrid,
  Building2, Store, Radio, ChevronDown, ShoppingCart, Zap,
  BadgeCheck, User, ArrowRight, ChevronRight, Filter, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { Product, PRODUCTS } from "../lib/products";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 12;

const CATEGORIES = [
  { key: "ALL", label: "All Products", icon: Package },
  { key: "HANDSET", label: "Phones", icon: Smartphone },
  { key: "ACCESSORY", label: "Accessories", icon: Headphones },
  { key: "ESIM_PLAN", label: "eSIM Plans", icon: Cpu },
];

const BRANDS = ["All", "Apple", "Samsung", "Google", "OnePlus", "Nothing", "Otterbox", "Mint Mobile", "SelectMobile", "Visible", "Koodo", "Fido", "AT&T"];
const CONDITIONS = ["All", "New", "Certified Pre-Owned", "Refurbished", "Used — Like New"];
const COUNTRIES = ["All", "US", "CA"];
const SELLER_TYPES = ["All", "Wholesaler", "Retailer", "Individual", "Network Provider"];
const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
  { key: "rating", label: "Top Rated" },
  { key: "newest", label: "Newest" },
];

export function NormalOrder() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [brand, setBrand] = useState("All");
  const [condition, setCondition] = useState("All");
  const [country, setCountry] = useState("All");
  const [sellerType, setSellerType] = useState("All");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  // Helper to update filters
  const updateFilter = <T,>(setter: (val: T) => void, value: T) => {
    setter(value);
    setPage(1);
  };

  // Smart Category Selection & Auto-Sync
  const handleCategorySelect = (catKey: string) => {
    setCategory(catKey);
    setPage(1);
    // Smart sync seller channel if selected seller channel has 0 items in this category
    if (sellerType !== "All") {
      const matchCount = PRODUCTS.filter(
        (p) => p.sellerType === sellerType && (catKey === "ALL" || p.category === catKey)
      ).length;
      if (matchCount === 0) {
        if (catKey === "ESIM_PLAN") setSellerType("Network Provider");
        else setSellerType("All");
      }
    }
  };

  // Smart Seller Type Selection & Auto-Sync
  const handleSellerSelect = (stKey: string) => {
    setSellerType(stKey);
    setPage(1);
    // Smart sync category if selected channel specializes in specific products
    if (stKey === "Network Provider") {
      if (category !== "ESIM_PLAN") setCategory("ESIM_PLAN");
    } else if (stKey === "Wholesaler" || stKey === "Individual") {
      if (category === "ESIM_PLAN") setCategory("HANDSET");
    } else if (category !== "ALL") {
      const matchCount = PRODUCTS.filter(
        (p) => p.sellerType === stKey && p.category === category
      ).length;
      if (matchCount === 0) {
        setCategory("ALL");
      }
    }
  };

  // Compute dynamic counts based on currently linked active criteria
  const getCategoryDynamicCount = (catKey: string) => {
    return PRODUCTS.filter((p) => {
      if (catKey !== "ALL" && p.category !== catKey) return false;
      if (sellerType !== "All" && p.sellerType !== sellerType) return false;
      if (brand !== "All" && p.brand !== brand) return false;
      if (condition !== "All" && p.condition !== condition) return false;
      if (country !== "All" && !p.country.includes(country)) return false;
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q);
      }
      return true;
    }).length;
  };

  const getSellerDynamicCount = (stKey: string) => {
    return PRODUCTS.filter((p) => {
      if (stKey !== "All" && p.sellerType !== stKey) return false;
      if (category !== "ALL" && p.category !== category) return false;
      if (brand !== "All" && p.brand !== brand) return false;
      if (condition !== "All" && p.condition !== condition) return false;
      if (country !== "All" && !p.country.includes(country)) return false;
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q);
      }
      return true;
    }).length;
  };

  const filtered = useMemo(() => {
    const result = [...PRODUCTS].filter((p) => {
      if (category !== "ALL" && p.category !== category) return false;
      if (brand !== "All" && p.brand !== brand) return false;
      if (condition !== "All" && p.condition !== condition) return false;
      if (country !== "All" && !p.country.includes(country)) return false;
      if (sellerType !== "All" && p.sellerType !== sellerType) return false;
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => b.id.localeCompare(a.id)); break;
    }

    return result;
  }, [search, category, brand, condition, country, sellerType, sort, minPrice, maxPrice]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const activeFilterCount = [brand, condition, country].filter((f) => f !== "All").length
    + (minPrice !== "" ? 1 : 0)
    + (maxPrice !== "" ? 1 : 0);

  function clearAllFilters() {
    setBrand("All");
    setCondition("All");
    setCountry("All");
    setSellerType("All");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setCategory("ALL");
    setPage(1);
  }

  // Dynamic Summary Text
  const summaryText = useMemo(() => {
    const catLabel = CATEGORIES.find(c => c.key === category)?.label || "Products";
    const sellerLabel = sellerType === "All" ? "All Channels" : `${sellerType}s`;
    return `Showing ${filtered.length} ${catLabel} from ${sellerLabel}`;
  }, [category, sellerType, filtered.length]);

  return (
    <section id="normal-order" className="py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[3rem] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#04a1c6]/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-[#04a1c6]">
              <Truck className="w-4 h-4 text-[#04a1c6]" />
              <span>Verified Direct Marketplace</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Discover Verified Mobile Devices &amp; Plans
            </h1>

            <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
              50-Point diagnostic verified handsets, wholesale inventories, and instant eSIM plans with escrow-protected checkout.
            </p>

            {/* Quick Hero Search Input */}
            <div className="pt-2">
              <div className="relative max-w-xl">
                <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => updateFilter(setSearch, e.target.value)}
                  placeholder="Search by model, brand, seller, tag..."
                  className="w-full pl-13 pr-12 py-4.5 rounded-2xl bg-white/95 text-[#0f172a] text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#04a1c6]/40 shadow-xl"
                />
                {search && (
                  <button 
                    onClick={() => updateFilter(setSearch, "")} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Trust Features Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {[
                { icon: <ShieldCheck className="w-4 h-4 text-[#04a1c6]" />, text: "50-Point Verified" },
                { icon: <Truck className="w-4 h-4 text-emerald-400" />, text: "Free 2-Day Shipping" },
                { icon: <Zap className="w-4 h-4 text-amber-400" />, text: "Instant eSIM" },
                { icon: <BadgeCheck className="w-4 h-4 text-purple-400" />, text: "Escrow Protected" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200">
                  {badge.icon}
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Structured Smart-Linked Category & Seller Navigation Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 rounded-[2.5rem] bg-white/90 border border-slate-200/60 shadow-xl backdrop-blur-xl space-y-6"
        >
          {/* Category Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Category</span>
              <span className="text-xs font-black text-[#04a1c6] px-3 py-1 rounded-full bg-[#04a1c6]/10 border border-[#04a1c6]/20">
                {summaryText}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                const dynamicCount = getCategoryDynamicCount(cat.key);
                return (
                  <button
                    key={cat.key}
                    onClick={() => handleCategorySelect(cat.key)}
                    className={`flex items-center justify-between py-3.5 px-4 rounded-2xl text-sm font-black transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-lg shadow-[#04a1c6]/30 scale-[1.02]"
                        : dynamicCount === 0
                        ? "bg-slate-50/60 text-slate-400 border-slate-100 opacity-60 hover:opacity-100"
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-[#04a1c6]/40 hover:text-[#04a1c6]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <cat.icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {dynamicCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Seller Channel Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Seller Channel</span>
              {sellerType !== "All" && (
                <button 
                  onClick={() => handleSellerSelect("All")} 
                  className="text-[11px] font-bold text-slate-400 hover:text-[#04a1c6] transition-colors cursor-pointer"
                >
                  Show All Channels
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {SELLER_TYPES.map((st) => {
                const isSelected = sellerType === st;
                const dynamicCount = getSellerDynamicCount(st);
                const icons: Record<string, React.ReactNode> = {
                  "All": <LayoutGrid className="w-3.5 h-3.5" />,
                  "Wholesaler": <Building2 className="w-3.5 h-3.5" />,
                  "Retailer": <Store className="w-3.5 h-3.5" />,
                  "Individual": <User className="w-3.5 h-3.5" />,
                  "Network Provider": <Radio className="w-3.5 h-3.5" />,
                };
                return (
                  <button
                    key={st}
                    onClick={() => handleSellerSelect(st)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#0f172a] text-white border-[#0f172a] shadow-md shadow-slate-900/20 scale-[1.02]"
                        : dynamicCount === 0
                        ? "bg-slate-50/60 text-slate-400 border-slate-100 opacity-50"
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {icons[st]}
                    <span>{st}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {dynamicCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Filter Controls & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer border shadow-sm ${
                showFilters || activeFilterCount > 0
                  ? "bg-[#04a1c6] text-white border-[#04a1c6]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#04a1c6]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Detailed Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#04a1c6] text-[10px] flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {(activeFilterCount > 0 || search || category !== "ALL" || sellerType !== "All") && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-xs text-[#04a1c6] font-black hover:underline cursor-pointer px-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sort}
              onChange={(e) => updateFilter(setSort, e.target.value)}
              className="w-full sm:w-auto appearance-none px-5 py-3 pr-10 rounded-2xl border border-slate-200 bg-white text-xs font-black text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 shadow-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-6">
                {/* Price Range */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">Price Range ($)</label>
                  <div className="flex items-center gap-4 max-w-md">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => updateFilter(setMinPrice, e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]"
                      />
                    </div>
                    <span className="text-slate-300 font-bold">—</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => updateFilter(setMaxPrice, e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Dropdown Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <FilterSelect label="Brand" value={brand} onChange={(v) => updateFilter(setBrand, v)} options={BRANDS} />
                  <FilterSelect label="Condition" value={condition} onChange={(v) => updateFilter(setCondition, v)} options={CONDITIONS} />
                  <FilterSelect label="Region" value={country} onChange={(v) => updateFilter(setCountry, v)} options={COUNTRIES} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filter Chips Bar */}
        {(activeFilterCount > 0 || search || category !== "ALL" || sellerType !== "All") && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400 mr-1">Filtered by:</span>
            {category !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#04a1c6]/10 text-[#04a1c6] text-xs font-black border border-[#04a1c6]/20">
                Category: {CATEGORIES.find(c => c.key === category)?.label}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => updateFilter(setCategory, "ALL")} />
              </span>
            )}
            {sellerType !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-black border border-slate-900">
                Channel: {sellerType}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => updateFilter(setSellerType, "All")} />
              </span>
            )}
            {brand !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                Brand: {brand}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => updateFilter(setBrand, "All")} />
              </span>
            )}
            {condition !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                Condition: {condition}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => updateFilter(setCondition, "All")} />
              </span>
            )}
            {country !== "All" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                Region: {country}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => updateFilter(setCountry, "All")} />
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                Search: &quot;{search}&quot;
                <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => updateFilter(setSearch, "")} />
              </span>
            )}
          </div>
        )}

        {/* Product Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {paginated.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => setQuickView(product)}
                onTagClick={(tag) => setSearch(tag)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 glass-panel rounded-[2.5rem]"
          >
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#0f172a] mb-2">No matching products found</h3>
            <p className="text-sm text-slate-500 mb-6">Try clearing some of your search filters to see more results.</p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#04a1c6] text-white text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-[#0390b0] transition-colors shadow-lg shadow-[#04a1c6]/30"
            >
              <RefreshCw className="w-4 h-4" /> Reset All Filters
            </button>
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0f172a] text-white font-black text-xs uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-xl"
            >
              <span>Load More Products</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Quick View Modal */}
        <AnimatePresence>
          {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Filter Select Component ───────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04a1c6]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Quick View Modal ───────────────────────────────────────────────────────

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden border border-white/50"
      >
        <div className="flex flex-col md:flex-row relative z-10">
          {/* Image */}
          <div className="md:w-1/2 relative aspect-square bg-slate-100 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-5 left-5">
              {product.isSelectVerified && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#04a1c6] text-white text-xs font-black uppercase tracking-wider shadow-lg">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#04a1c6]">{product.brand}</span>
                  <h3 className="text-2xl font-black text-[#0f172a] leading-tight mt-1">{product.name}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-black border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs font-bold text-slate-400">({product.reviews} reviews)</span>
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price</span>
                <span className="text-3xl font-black text-[#0f172a]">${product.price.toLocaleString()}</span>
              </div>

              {product.specs && (
                <div className="space-y-2 mb-6">
                  {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs py-1.5 border-b border-slate-100">
                      <span className="font-bold text-slate-400 uppercase">{k}</span>
                      <span className="font-black text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/product/${product.id}`}
              onClick={onClose}
              className="w-full py-4 rounded-xl bg-[#04a1c6] text-white text-xs font-black uppercase tracking-wider text-center hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>View Full Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
