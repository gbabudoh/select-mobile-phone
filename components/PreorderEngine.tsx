"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Clock, ShieldCheck, ArrowLeftRight, Users,
  ChevronRight, X, Zap, Lock, Bell, BarChart3, Truck,
  Search, SlidersHorizontal, BadgeCheck, Package,
  Building2, Store, Radio, LayoutGrid, Globe, MapPin, RefreshCw
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { safeFetchJson } from "@/lib/safe-fetch";

// ─── Types ──────────────────────────────────────────────────────────────────

type SellerType = "Wholesaler" | "Retailer" | "Network Provider";

interface Seller {
  name: string;
  type: SellerType;
  verified: boolean;
  rating: number;
  totalSales: number;
  country: "US" | "CA" | "US/CA";
}

interface NetworkPartner {
  name: string;
  type: "MNO" | "MVNO" | "Flanker";
  logo: string;
  planName: string;
  monthlyPrice: number;
  data: string;
  country: "US" | "CA" | "US/CA";
  esimReady: boolean;
}

interface PreorderCampaign {
  id: string;
  product: string;
  brand: string;
  image: string;
  subtitle: string;
  releaseDate: string;
  deposit: number;
  fullPrice: number;
  maxSlots: number;
  slotsFilled: number;
  features: string[];
  specs: Record<string, string>;
  colors: { name: string; hex: string }[];
  tradeInBonus: number;
  country: "US" | "CA" | "US/CA";
  tier: "flagship" | "mid" | "limited";
  seller: Seller;
  networkPartners: NetworkPartner[];
  wholesalerDemand: number;
  retailerInterest: number;
}

// ─── Network Partners Pool ──────────────────────────────────────────────────

const NETWORK_PARTNERS: NetworkPartner[] = [
  { name: "SelectMobile", type: "MVNO", logo: "📱", planName: "Cross-Border Unlimited", monthlyPrice: 35, data: "Unlimited", country: "US/CA", esimReady: true },
  { name: "Mint Mobile", type: "MVNO", logo: "🌿", planName: "Unlimited Plan", monthlyPrice: 30, data: "Unlimited (40GB Premium)", country: "US", esimReady: true },
  { name: "Visible+", type: "MVNO", logo: "👁️", planName: "Visible+ Unlimited", monthlyPrice: 45, data: "Unlimited (50GB Premium)", country: "US", esimReady: true },
  { name: "Koodo", type: "Flanker", logo: "🟢", planName: "20GB Canada Plan", monthlyPrice: 40, data: "20GB", country: "CA", esimReady: true },
  { name: "Fido", type: "Flanker", logo: "🐕", planName: "30GB + US Roaming", monthlyPrice: 55, data: "30GB", country: "US/CA", esimReady: true },
  { name: "AT&T Prepaid", type: "MNO", logo: "🔵", planName: "15GB Prepaid eSIM", monthlyPrice: 40, data: "15GB", country: "US", esimReady: true },
  { name: "T-Mobile BYOP", type: "MNO", logo: "🟣", planName: "Essentials BYOP", monthlyPrice: 50, data: "Unlimited", country: "US", esimReady: true },
  { name: "Virgin Plus", type: "Flanker", logo: "🔴", planName: "25GB Canada", monthlyPrice: 45, data: "25GB", country: "CA", esimReady: true },
];

// ─── Campaign Data ──────────────────────────────────────────────────────────

const CAMPAIGNS: PreorderCampaign[] = [];

// ─── Constants ───────────────────────────────────────────────────────────────

const SELLER_TYPES: SellerType[] = ["Wholesaler", "Retailer", "Network Provider"];
const BRANDS = ["Apple", "Samsung", "Google"];
const ALL_NETWORK_NAMES = [...new Set(NETWORK_PARTNERS.map((n) => n.name))];

const SELLER_META: Record<SellerType, { emoji: string; color: string; bgColor: string; borderColor: string; desc: string }> = {
  "Wholesaler":       { emoji: "🏭", color: "text-indigo-700", bgColor: "bg-indigo-50",  borderColor: "border-indigo-200",  desc: "Bulk inventory, B2B pricing, demand forecasting" },
  "Retailer":         { emoji: "🏪", color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", desc: "Verified store, 2-day shipping, return policy" },
  "Network Provider": { emoji: "📡", color: "text-cyan-700",    bgColor: "bg-cyan-50",    borderColor: "border-cyan-200",    desc: "eSIM bundles, instant activation, no contract" },
};

const SELLER_CARD_BADGE: Record<SellerType, { label: string; className: string }> = {
  "Wholesaler":       { label: "🏭 B2B Pricing",    className: "bg-indigo-100 text-indigo-700" },
  "Retailer":         { label: "🏪 Retail",          className: "bg-emerald-100 text-emerald-700" },
  "Network Provider": { label: "⚡ Bundle Deal",     className: "bg-cyan-100 text-cyan-700" },
};

function TabBtn({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
        active
          ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-md shadow-[#04a1c6]/20"
          : "bg-gray-50 text-[#0f172a]/60 border-gray-200 hover:border-[#04a1c6]/40 hover:text-[#04a1c6]"
      }`}
    >
      {children}
    </button>
  );
}

function FilterChipBtn({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
        active
          ? "bg-[#04a1c6] text-white border-[#04a1c6] shadow-sm"
          : "bg-gray-50 border-gray-200 text-[#0f172a]/50 hover:border-[#04a1c6]/30 hover:text-[#04a1c6]"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function PreorderEngine() {
  const [selectedCampaign, setSelectedCampaign] = useState<PreorderCampaign | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [showTradeIn, setShowTradeIn] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [sellerFilter, setSellerFilter] = useState<SellerType | "All">("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [networkFilter, setNetworkFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return CAMPAIGNS.filter((c) => {
      if (sellerFilter !== "All" && c.seller.type !== sellerFilter) return false;
      if (brandFilter !== "All" && c.brand !== brandFilter) return false;
      if (regionFilter !== "All") {
        if (regionFilter === "US/CA" && c.country !== "US/CA") return false;
        if (regionFilter === "US" && !c.country.includes("US")) return false;
        if (regionFilter === "CA" && !c.country.includes("CA")) return false;
      }
      if (networkFilter !== "All" && !c.networkPartners.some((n) => n.name === networkFilter)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.product.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.seller.name.toLowerCase().includes(q) ||
          c.networkPartners.some((n) => n.name.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, sellerFilter, brandFilter, regionFilter, networkFilter]);

  const activeFilterCount = [sellerFilter, brandFilter, regionFilter, networkFilter].filter((f) => f !== "All").length;

  const clearFilters = () => {
    setSellerFilter("All"); setBrandFilter("All"); setRegionFilter("All");
    setNetworkFilter("All"); setSearch("");
  };

  const totalSlotsLeft = CAMPAIGNS.reduce((acc, c) => acc + (c.maxSlots - c.slotsFilled), 0);

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[3rem] p-8 md:p-12 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#04a1c6]/20 blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-[#04a1c6]">
              <Rocket className="w-4 h-4 text-[#04a1c6]" />
              <span>Deposit-Based Queue — Lock Launch Priority</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Preorder Flagships &amp; Cross-Border Bundles
            </h1>

            <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
              Reserve next-gen devices from verified Wholesalers, Retailers, and Network Providers across the US &amp; Canada with guaranteed trade-in values.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-300 text-xs font-black">
                <Users className="w-4 h-4" />
                <span>{totalSlotsLeft.toLocaleString()} spots remaining across {CAMPAIGNS.length} campaigns</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-black">
                <Globe className="w-4 h-4" />
                <span>Escrow-Protected US &amp; CA Shipping</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Modern Region Selector Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 rounded-[2.5rem] bg-white/90 border border-slate-200/60 shadow-xl backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4.5 h-4.5 text-[#04a1c6]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Target Shipping &amp; Activation Region</span>
            </div>
            <span className="text-xs font-black text-[#04a1c6] px-3 py-1 rounded-full bg-[#04a1c6]/10 border border-[#04a1c6]/20">
              {regionFilter === "All" ? "Showing All Regional Campaigns" : `${regionFilter} Delivery Active`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "All", label: "All Regions", flag: "🌐", desc: "US & Canada" },
              { key: "US/CA", label: "Cross-Border", flag: "🇺🇸🇨🇦", desc: "Dual US/CA" },
              { key: "US", label: "United States", flag: "🇺🇸", desc: "US Direct" },
              { key: "CA", label: "Canada", flag: "🇨🇦", desc: "Canada Direct" },
            ].map((r) => {
              const isSelected = regionFilter === r.key;
              const count = CAMPAIGNS.filter((c) => {
                if (r.key === "All") return true;
                if (r.key === "US/CA") return c.country === "US/CA";
                return c.country.includes(r.key);
              }).length;

              return (
                <button
                  key={r.key}
                  onClick={() => setRegionFilter(r.key)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white border-[#0f172a] shadow-lg shadow-slate-900/20 scale-[1.02]"
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-[#04a1c6]/40 hover:text-[#04a1c6]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-xl">{r.flag}</span>
                    <div>
                      <div className="leading-tight">{r.label}</div>
                      <div className={`text-[9px] font-bold ${isSelected ? "text-slate-300" : "text-slate-400"}`}>{r.desc}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Seller Channel Filter Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seller Channel</span>
            {sellerFilter !== "All" && (
              <button onClick={() => setSellerFilter("All")} className="text-[11px] font-bold text-slate-400 hover:text-[#04a1c6] cursor-pointer">
                Show All Sellers
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <TabBtn active={sellerFilter === "All"} onClick={() => setSellerFilter("All")}>
              <LayoutGrid className="w-4 h-4" /> All Sellers
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${sellerFilter === "All" ? "bg-white/20" : "bg-gray-200 text-[#0f172a]/40"}`}>
                {CAMPAIGNS.length}
              </span>
            </TabBtn>
            {SELLER_TYPES.map((st) => {
              const count = CAMPAIGNS.filter((c) => c.seller.type === st).length;
              const meta = SELLER_META[st];
              return (
                <TabBtn key={st} active={sellerFilter === st} onClick={() => setSellerFilter(st)}>
                  <span>{meta.emoji}</span> {st}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${sellerFilter === st ? "bg-white/20" : "bg-gray-200 text-[#0f172a]/40"}`}>
                    {count}
                  </span>
                </TabBtn>
              );
            })}
          </div>
        </motion.div>

        {/* ── Search + More Filters Bar ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search devices, sellers, networks..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer border shadow-sm ${
              showFilters || activeFilterCount > 0
                ? "bg-[#04a1c6] text-white border-[#04a1c6]"
                : "bg-white text-slate-700 border-slate-200 hover:border-[#04a1c6]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> More Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-black">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* ── Expandable Filters Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                {/* Brand */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Brand</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", ...BRANDS].map((b) => (
                      <FilterChipBtn key={b} active={brandFilter === b} onClick={() => setBrandFilter(b)}>
                        {b}
                      </FilterChipBtn>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Network Provider */}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Network Carrier Partner</label>
                  <div className="flex flex-wrap gap-1.5">
                    <FilterChipBtn active={networkFilter === "All"} onClick={() => setNetworkFilter("All")}>
                      All Networks
                    </FilterChipBtn>
                    {ALL_NETWORK_NAMES.map((name) => {
                      const partner = NETWORK_PARTNERS.find((n) => n.name === name)!;
                      return (
                        <FilterChipBtn key={name} active={networkFilter === name} onClick={() => setNetworkFilter(name)}>
                          {partner.logo} {name}
                        </FilterChipBtn>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results & Active Filter Summary Bar ── */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs font-bold text-slate-500">
            Showing <span className="font-black text-[#0f172a]">{filtered.length}</span> preorder campaigns {regionFilter !== "All" && `in ${regionFilter}`}
          </p>
          {(activeFilterCount > 0 || search || regionFilter !== "All" || sellerFilter !== "All") && (
            <button onClick={clearFilters} className="text-xs text-[#04a1c6] font-black hover:underline cursor-pointer flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Reset All Filters
            </button>
          )}
        </div>

        {/* ── Campaign Cards Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((campaign, i) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                index={i}
                onSelect={() => { setSelectedCampaign(campaign); setSelectedColor(0); setShowTradeIn(false); }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 glass-panel rounded-3xl"
          >
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-[#0f172a] mb-2">No matching preorder campaigns</h3>
            <p className="text-xs text-slate-500 mb-6">Try clearing your filters or selecting &quot;All Regions&quot;.</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#04a1c6] text-white text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-[#0390b0] shadow-md"
            >
              <RefreshCw className="w-4 h-4" /> Reset Filters
            </button>
          </motion.div>
        )}

        {/* Campaign Detail Modal */}
        <AnimatePresence>
          {selectedCampaign && (
            <CampaignModal
              campaign={selectedCampaign}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              showTradeIn={showTradeIn}
              setShowTradeIn={setShowTradeIn}
              onClose={() => setSelectedCampaign(null)}
              session={session}
              router={router}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Campaign Card ──────────────────────────────────────────────────────────

function CampaignCard({
  campaign, index, onSelect,
}: {
  campaign: PreorderCampaign; index: number; onSelect: () => void;
}) {
  const pct = Math.round((campaign.slotsFilled / campaign.maxSlots) * 100);
  const slotsLeft = campaign.maxSlots - campaign.slotsFilled;
  const isAlmostFull = pct >= 80;
  const meta = SELLER_META[campaign.seller.type];
  const cardBadge = SELLER_CARD_BADGE[campaign.seller.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-[2.5rem] border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#04a1c6]/40 transition-all duration-300 group cursor-pointer hover:-translate-y-1 flex flex-col sm:flex-row"
      onClick={onSelect}
    >
      {/* Left Column: Product Image & Badges Overlay */}
      <div className="sm:w-2/5 relative aspect-square sm:aspect-auto bg-gradient-to-br from-slate-50 via-slate-100/70 to-slate-200/50 overflow-hidden min-h-[220px] flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100">
        <Image 
          src={campaign.image} 
          alt={campaign.product} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700" 
        />

        {/* Top Badges Overlay - Non-overlapping Flex Header */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none gap-2">
          {/* Left Deal / Queue Badge */}
          <div className="pointer-events-auto shrink-0">
            {isAlmostFull ? (
              <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md bg-rose-500 text-white">
                🔥 {slotsLeft} left
              </span>
            ) : (
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md ${cardBadge.className}`}>
                {cardBadge.label}
              </span>
            )}
          </div>

          {/* Right Region Badge */}
          <div className="pointer-events-auto shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 border backdrop-blur-md ${
              campaign.country === "US/CA" 
                ? "bg-slate-900/95 text-white border-white/30" 
                : campaign.country === "US" 
                ? "bg-blue-900/95 text-white border-blue-400/30" 
                : "bg-red-900/95 text-white border-red-400/30"
            }`}>
              <span>{campaign.country === "US/CA" ? "🇺🇸🇨🇦 Cross-Border" : campaign.country === "US" ? "🇺🇸 US Direct" : "🇨🇦 CA Direct"}</span>
            </span>
          </div>
        </div>

        {/* Bottom Specs Pill */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-black text-slate-700 shadow-sm border border-white">
            Release: {campaign.releaseDate.split(",")[0]}
          </span>
        </div>
      </div>

      {/* Right Column: Campaign Details & Purchase Actions */}
      <div className="sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#04a1c6]">{campaign.brand}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Preorder Queue</span>
          </div>

          {/* Product Title */}
          <h3 className="text-xl font-black text-[#0f172a] tracking-tight leading-snug group-hover:text-[#04a1c6] transition-colors mb-1.5">
            {campaign.product}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-3">
            {campaign.subtitle}
          </p>

          {/* Seller Identity Card */}
          <div className={`p-3.5 rounded-2xl ${meta.bgColor} border ${meta.borderColor} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">{meta.emoji}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-black truncate ${meta.color}`}>{campaign.seller.name}</span>
                  {campaign.seller.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#04a1c6] shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-500 font-bold block truncate">{campaign.seller.type}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-black text-slate-800">⭐ {campaign.seller.rating}</div>
              <div className="text-[9px] font-bold text-slate-400">{campaign.seller.totalSales.toLocaleString()} sales</div>
            </div>
          </div>

          {/* Compatible Carriers */}
          <div className="mt-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Carrier eSIM Support</span>
            <div className="flex flex-wrap gap-1">
              {campaign.networkPartners.map((np) => (
                <span key={np.name} className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-50/80 border border-cyan-100 text-[10px] font-bold text-cyan-800">
                  <span>{np.logo}</span>
                  <span>{np.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Queue Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-slate-500 flex items-center gap-1 font-bold">
                <Users className="w-3.5 h-3.5 text-[#04a1c6]" /> 
                <span>{campaign.slotsFilled.toLocaleString()} reserved ({pct}%)</span>
              </span>
              <span className={`font-black ${isAlmostFull ? "text-rose-500" : "text-[#04a1c6]"}`}>
                {slotsLeft.toLocaleString()} spots left
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isAlmostFull ? "bg-gradient-to-r from-rose-400 to-rose-500" : "bg-gradient-to-r from-[#04a1c6] to-cyan-500"}`}
              />
            </div>
          </div>

          {/* Price & CTA Button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Deposit Required</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#0f172a]">${campaign.deposit}</span>
                <span className="text-[10px] font-bold text-slate-400 line-through">${campaign.fullPrice}</span>
              </div>
            </div>

            <button
              onClick={onSelect}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0f172a] text-white font-black text-xs group-hover:bg-[#04a1c6] transition-all shadow-md cursor-pointer active:scale-95"
            >
              <span>Reserve Spot</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Campaign Detail Modal ──────────────────────────────────────────────────

function CampaignModal({
  campaign, selectedColor, setSelectedColor, showTradeIn, setShowTradeIn, onClose, session, router,
}: {
  campaign: PreorderCampaign;
  selectedColor: number;
  setSelectedColor: (i: number) => void;
  showTradeIn: boolean;
  setShowTradeIn: (v: boolean) => void;
  onClose: () => void;
  session: { user?: { id: string } } | null;
  router: AppRouterInstance;
}) {
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState<{ queuePosition: number; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pct = Math.round((campaign.slotsFilled / campaign.maxSlots) * 100);
  const slotsLeft = campaign.maxSlots - campaign.slotsFilled;
  const meta = SELLER_META[campaign.seller.type];

  const handleReserve = async () => {
    if (!session?.user) {
      router.push("/login?callbackUrl=/preorder");
      return;
    }

    setReserving(true);
    setError(null);

    try {
      const res = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          campaignId: campaign.id,
        }),
      });

      const data = await safeFetchJson(res);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to reserve");
      }

      setReserved({
        queuePosition: data.preorder.queuePosition,
        id: data.preorder.id,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setReserving(false);
    }
  };

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
        className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-white/50"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left — Image & Region Info */}
          <div className="lg:w-[40%] relative bg-slate-100 overflow-hidden rounded-t-[2.5rem] lg:rounded-l-[2.5rem] lg:rounded-tr-none min-h-[320px]">
            <Image src={campaign.image} alt={campaign.product} fill className="object-cover" />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <span className="px-4 py-2 rounded-2xl bg-[#04a1c6] text-white text-xs font-black uppercase tracking-widest shadow-xl">
                ⭐ Preorder Queue
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border border-white/20">
                {campaign.country === "US/CA" ? "🇺🇸🇨🇦 Cross-Border US & CA" : campaign.country === "US" ? "🇺🇸 United States Direct" : "🇨🇦 Canada Direct"}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 flex gap-2">
              {campaign.colors.map((color, i) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(i)}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${selectedColor === i ? "border-[#04a1c6] scale-110 shadow-lg" : "border-white/50"}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                />
              ))}
            </div>
          </div>

          {/* Right — Campaign Details */}
          <div className="lg:w-[60%] p-7 lg:p-9 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#04a1c6] block mb-1">{campaign.brand}</span>
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">{campaign.product}</h2>
                <p className="text-xs text-slate-500 mt-1">{campaign.subtitle}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer" aria-label="Close">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="text-xs text-slate-400 mb-5">
              Color: <span className="font-black text-[#0f172a]">{campaign.colors[selectedColor].name}</span>
            </div>

            {/* Seller Identity */}
            <div className={`p-4 rounded-2xl ${meta.bgColor} border ${meta.borderColor} mb-5`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black ${meta.color}`}>{campaign.seller.name}</span>
                    {campaign.seller.verified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#04a1c6]/10 text-[#04a1c6] text-[10px] font-bold">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{campaign.seller.type}</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs font-bold">
                <span className={meta.color}>⭐ {campaign.seller.rating} rating</span>
                <span className={meta.color}>{campaign.seller.totalSales.toLocaleString()} total sales</span>
                <span className={meta.color}>{campaign.seller.country === "US/CA" ? "🇺🇸🇨🇦 US & Canada" : campaign.seller.country === "US" ? "🇺🇸 US" : "🇨🇦 Canada"}</span>
              </div>
            </div>

            {/* Reserved Confirmation */}
            {reserved ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3 mb-5">
                <div className="flex items-center gap-2 text-lg font-black">
                  <BadgeCheck className="w-6 h-6 text-emerald-600" />
                  <span>Spot Reserved Successfully!</span>
                </div>
                <p className="text-xs font-medium">
                  Your queue position is <strong className="font-black text-emerald-900">#{reserved.queuePosition}</strong>. We will notify you when launch day arrives!
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-4">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleReserve}
                  disabled={reserving}
                  className="w-full py-4 rounded-2xl bg-[#04a1c6] text-white font-black text-sm uppercase tracking-wider hover:bg-[#0390b0] transition-all shadow-xl shadow-[#04a1c6]/30 cursor-pointer disabled:opacity-50 mb-4"
                >
                  {reserving ? "Reserving Spot..." : `Deposit $${campaign.deposit} to Reserve Spot`}
                </button>
              </>
            )}

            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
              🔒 Escrow-Protected Deposit · Refundable Anytime Before Release
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
