"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck, Truck, Search, SlidersHorizontal, X,
  Star, Smartphone, Headphones, Cpu, Package, LayoutGrid,
  Building2, Store, Radio, ChevronDown, ShoppingCart, Zap,
  BadgeCheck, User, ArrowRight, ChevronRight
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

// ─── Main Component ─────────────────────────────────────────────────────────

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

  // Helper to update filters and reset pagination
  const updateFilter = <T,>(setter: (val: T) => void, value: T) => {
    setter(value);
    setPage(1);
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

  const activeFilterCount = [brand, condition, country, sellerType].filter((f) => f !== "All").length
    + (minPrice !== "" ? 1 : 0)
    + (maxPrice !== "" ? 1 : 0);

  function clearAllFilters() {
    setBrand("All");
    setCondition("All");
    setCountry("All");
    setSellerType("All");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  return (
    <section id="normal-order" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04a1c6]/10 text-[#04a1c6] text-sm font-semibold mb-4">
            <Truck className="w-4 h-4" /> In-Stock — 2-Day Shipping across US &amp; Canada
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">
            Shop Phones
          </h2>
          <p className="text-lg text-[#0f172a]/60 max-w-2xl mx-auto">
            Select-Verified handsets, accessories, and eSIM plans. Every device passes a 50-point diagnostic. Escrow-protected checkout.
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {[
            { icon: <ShieldCheck className="w-4 h-4" />, text: "50-Point Verified" },
            { icon: <Truck className="w-4 h-4" />, text: "2-Day Shipping" },
            { icon: <Zap className="w-4 h-4" />, text: "Instant eSIM" },
            { icon: <BadgeCheck className="w-4 h-4" />, text: "Escrow Protected" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm text-[#0f172a]/70 shadow-sm">
              <span className="text-[#04a1c6]">{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </motion.div>

        {/* ── Browse Filters ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 space-y-5"
        >
          {/* Category row */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f172a]/30 mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => updateFilter(setCategory, cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                    category === cat.key
                      ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-md shadow-[#04a1c6]/20"
                      : "bg-gray-50 text-[#0f172a]/60 border-gray-200 hover:border-[#04a1c6]/40 hover:text-[#04a1c6]"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Seller Type row */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f172a]/30 mb-3">Seller Type</p>
            <div className="flex flex-wrap gap-2">
              {SELLER_TYPES.map((st) => {
                const count = st === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.sellerType === st).length;
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
                    onClick={() => updateFilter(setSellerType, st)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      sellerType === st
                        ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-md shadow-[#04a1c6]/20"
                        : "bg-gray-50 text-[#0f172a]/60 border-gray-200 hover:border-[#04a1c6]/40 hover:text-[#04a1c6]"
                    }`}
                  >
                    {icons[st]}
                    {st}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      sellerType === st ? "bg-white/20 text-white" : "bg-gray-200 text-[#0f172a]/40"
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Search + Sort + Filter toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateFilter(setSearch, e.target.value)}
              placeholder="Search phones, accessories, plans..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 focus:border-[#04a1c6]/30 shadow-sm"
            />
            {search && (
              <button onClick={() => updateFilter(setSearch, "")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
              showFilters || activeFilterCount > 0
                ? "bg-[#04a1c6] text-white border-[#04a1c6]"
                : "bg-white text-[#0f172a]/60 border-gray-200 hover:border-[#04a1c6]/30"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-bold">{activeFilterCount}</span>
            )}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => updateFilter(setSort, e.target.value)}
              className="appearance-none px-5 py-3.5 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a]/70 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 shadow-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Expandable Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                {/* Price Range */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#0f172a]/40 mb-3 block">Price Range</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => updateFilter(setMinPrice, e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 focus:border-[#04a1c6]/30"
                      />
                    </div>
                    <span className="text-gray-300 font-bold">—</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => updateFilter(setMaxPrice, e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 focus:border-[#04a1c6]/30"
                      />
                    </div>
                    {(minPrice !== "" || maxPrice !== "") && (
                      <button
                        onClick={() => { setMinPrice(""); setMaxPrice(""); setPage(1); }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Other filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <FilterSelect label="Brand" value={brand} onChange={(v) => updateFilter(setBrand, v)} options={BRANDS} />
                  <FilterSelect label="Condition" value={condition} onChange={(v) => updateFilter(setCondition, v)} options={CONDITIONS} />
                  <FilterSelect label="Region" value={country} onChange={(v) => updateFilter(setCountry, v)} options={COUNTRIES} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#0f172a]/50">
            Showing <span className="font-semibold text-[#0f172a]">{Math.min(paginated.length, filtered.length)}</span> of{" "}
            <span className="font-semibold text-[#0f172a]">{filtered.length}</span> products
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#04a1c6] font-medium hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
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
            className="text-center py-20"
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No products found</h3>
            <p className="text-sm text-[#0f172a]/50 mb-6">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { clearAllFilters(); setSearch(""); setCategory("ALL"); setSellerType("All"); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#04a1c6] text-white text-sm font-bold cursor-pointer hover:bg-[#0390b0] transition-colors shadow-md"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          </motion.div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#04a1c6] text-[#04a1c6] font-bold hover:bg-[#04a1c6] hover:text-white transition-all cursor-pointer"
            >
              Load more
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-normal opacity-70">
                ({filtered.length - paginated.length} remaining)
              </span>
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

// ─── Quick View Modal ───────────────────────────────────────────────────────

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#04a1c6]/5 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#04a1c6]/5 rounded-full blur-[100px] -ml-32 -mb-32" />

        <div className="flex flex-col md:flex-row relative z-10">
          {/* Image Section */}
          <div className="md:w-[45%] relative aspect-square md:aspect-auto bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden group">
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.isSelectVerified && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#04a1c6] text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-[#04a1c6]/20"
                >
                  <ShieldCheck className="w-4 h-4" /> Select-Verified
                </motion.div>
              )}
              <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-black text-[#0f172a] shadow-sm flex items-center gap-1.5 w-fit">
                {product.country === "US/CA" ? "🇺🇸🇨🇦 CROSS-BORDER" : product.country === "US" ? "🇺🇸 UNITED STATES" : "🇨🇦 CANADA"}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-[55%] p-8 md:p-12 flex flex-col relative bg-white/40 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#04a1c6] mb-3 block">{product.brand}</span>
                <h2 className="text-4xl font-black text-[#0f172a] leading-tight tracking-tight mb-4">{product.name}</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/10 text-amber-600 border border-amber-400/20">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black">{product.rating}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{product.reviews} VERIFIED REVIEWS</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer ring-offset-2 hover:ring-2 hover:ring-slate-100"
                aria-label="Close quick view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-px w-full bg-slate-100 mb-8" />

            {/* Price section */}
            <div className="flex items-end gap-4 mb-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-[#0f172a] tracking-tighter">${product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-slate-300 line-through font-bold">${product.originalPrice.toLocaleString()}</span>
                  )}
                  {product.category === "ESIM_PLAN" && <span className="text-lg text-slate-400 font-bold uppercase">/MO</span>}
                </div>
              </div>
              {product.originalPrice && (
                <div className="mb-2 px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest">
                  Save ${(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Specs Grid */}
            {product.specs && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 group hover:border-[#04a1c6]/30 transition-all hover:bg-[#04a1c6]/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 group-hover:text-[#04a1c6] transition-colors">{key}</span>
                    <span className="text-sm font-black text-[#0f172a]">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Diagnostic Score */}
            {product.diagnosticScore && (
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-10 shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                      <span className="text-3xl font-black">{product.diagnosticScore}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-emerald-100" />
                        <span className="text-lg font-black tracking-tight uppercase">Select Diagnostic</span>
                      </div>
                      <p className="text-emerald-50/80 text-sm font-bold tracking-wide">Device passed all 50 verification points</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100 block mb-2">Grade A+</span>
                    <div className="h-2 w-32 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(product.diagnosticScore / 50) * 100}%` }}
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seller-Type Info */}
            {product.bulkAvailable && (
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">🏭</span>
                  <span className="text-sm font-black text-indigo-700 uppercase tracking-widest">Wholesaler — Bulk Pricing</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/80 text-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">Min Order</span>
                    <span className="text-lg font-black text-indigo-700">{product.minOrderQty} units</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 text-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">Bulk Discount</span>
                    <span className="text-lg font-black text-indigo-700">5-15%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 text-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">Inventory</span>
                    <span className="text-lg font-black text-emerald-600">In Stock</span>
                  </div>
                </div>
                <p className="text-xs text-indigo-500 mt-3 font-semibold">Tiered discounts auto-apply at checkout. Real-time inventory sync for retailers.</p>
              </div>
            )}

            {product.planDetails && (
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">📡</span>
                  <span className="text-sm font-black text-cyan-700 uppercase tracking-widest">Network Provider — Plan Details</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/80 text-center">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase block">Data</span>
                    <span className="text-sm font-black text-cyan-700">{product.planDetails.data}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 text-center">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase block">Talk</span>
                    <span className="text-sm font-black text-cyan-700">{product.planDetails.talk}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 text-center">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase block">Text</span>
                    <span className="text-sm font-black text-cyan-700">{product.planDetails.text}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 text-center">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase block">Contract</span>
                    <span className="text-sm font-black text-emerald-600">{product.planDetails.contract}</span>
                  </div>
                </div>
                <p className="text-xs text-cyan-500 mt-3 font-semibold">Instant eSIM activation at checkout. No physical SIM needed.</p>
              </div>
            )}

            {product.sellerType === "Individual" && (
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-black text-amber-700 uppercase tracking-widest">Individual Seller</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">Device Diagnosed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">Escrow Secured</span>
                  </div>
                </div>
                <p className="text-xs text-amber-500 mt-3 font-semibold">Funds held in escrow until you confirm IMEI match and SIM activation.</p>
              </div>
            )}

            {product.sellerType === "Retailer" && !product.bulkAvailable && !product.planDetails && (
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">🏪</span>
                  <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Authorized Retailer</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">Verified Business</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">2-Day Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">Return Policy</span>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[#04a1c6]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Seller</span>
                    <span className="text-sm font-black text-[#0f172a]">{product.seller}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-emerald-500">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Shipping</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-emerald-600">{product.shipping}</span>
                      {product.shipping === "Instant eSIM" && <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[#04a1c6]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Region</span>
                    <span className="text-sm font-black text-[#0f172a]">
                      {product.country === "US/CA" ? "US & Canada Cross-Border" : product.country === "US" ? "United States Marketplace" : "Canada Marketplace"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[#04a1c6]">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Buyer Protection</span>
                    <span className="text-sm font-black text-[#0f172a]">Escrow Protected Checkout</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-[2] py-6 px-6 rounded-[2rem] bg-[#0f172a] text-white font-black text-xs uppercase tracking-wide hover:bg-[#04a1c6] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl shadow-[#04a1c6]/30 whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4 shrink-0" /> Add to Secure Cart
              </motion.button>
              <Link
                href={`/product/${product.id}`}
                onClick={onClose}
                className="flex-[1.5] py-6 px-6 rounded-[2rem] border-2 border-[#0f172a] text-[#0f172a] font-black text-xs uppercase tracking-wide hover:bg-[#0f172a] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl group whitespace-nowrap"
              >
                View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Filter Select ──────────────────────────────────────────────────────────

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-[#0f172a]/40 mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              value === opt
                ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-sm"
                : "bg-gray-50 border-gray-200 text-[#0f172a]/50 hover:border-[#04a1c6]/30 hover:text-[#04a1c6]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
