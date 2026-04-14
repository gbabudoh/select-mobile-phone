"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Clock, ShieldCheck, ArrowLeftRight, Users,
  ChevronRight, X, Zap, Lock, Bell, BarChart3, Truck,
  Search, SlidersHorizontal, BadgeCheck, Package,
  Building2, Store, Radio, LayoutGrid
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";

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

const CAMPAIGNS: PreorderCampaign[] = [
  {
    id: "iphone-18-pro-max-wholesale",
    product: "iPhone 18 Pro Max",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    subtitle: "Titanium. A20 Pro chip. 48MP Fusion camera. The most advanced iPhone ever.",
    releaseDate: "September 19, 2026",
    deposit: 199, fullPrice: 1399, maxSlots: 2000, slotsFilled: 1247,
    features: ["A20 Pro Chip", "Titanium Design", "48MP Fusion Camera", "Dual eSIM"],
    specs: { Display: "6.9\" OLED", Chip: "A20 Pro", Storage: "256GB–1TB", Camera: "48MP Fusion", Battery: "All-Day", "5G": "Sub-6 + mmWave" },
    colors: [{ name: "Natural Titanium", hex: "#8a8680" }, { name: "Blue Titanium", hex: "#3d4f5f" }, { name: "White Titanium", hex: "#f0ede8" }, { name: "Black Titanium", hex: "#2c2c2e" }],
    tradeInBonus: 10, country: "US/CA", tier: "flagship",
    seller: { name: "TechWholesale Inc.", type: "Wholesaler", verified: true, rating: 4.9, totalSales: 14200, country: "US/CA" },
    networkPartners: [NETWORK_PARTNERS[0], NETWORK_PARTNERS[1], NETWORK_PARTNERS[2], NETWORK_PARTNERS[3], NETWORK_PARTNERS[4]],
    wholesalerDemand: 12400, retailerInterest: 340,
  },
  {
    id: "iphone-18-pro-max-retail",
    product: "iPhone 18 Pro Max",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    subtitle: "Same flagship, retail pricing. Verified store with 2-day shipping guarantee.",
    releaseDate: "September 19, 2026",
    deposit: 249, fullPrice: 1399, maxSlots: 500, slotsFilled: 312,
    features: ["A20 Pro Chip", "Titanium Design", "48MP Fusion Camera", "Dual eSIM"],
    specs: { Display: "6.9\" OLED", Chip: "A20 Pro", Storage: "256GB–1TB", Camera: "48MP Fusion", Battery: "All-Day", "5G": "Sub-6 + mmWave" },
    colors: [{ name: "Natural Titanium", hex: "#8a8680" }, { name: "Blue Titanium", hex: "#3d4f5f" }, { name: "White Titanium", hex: "#f0ede8" }, { name: "Black Titanium", hex: "#2c2c2e" }],
    tradeInBonus: 8, country: "US/CA", tier: "flagship",
    seller: { name: "MobileHub Retail", type: "Retailer", verified: true, rating: 4.7, totalSales: 3400, country: "US/CA" },
    networkPartners: [NETWORK_PARTNERS[0], NETWORK_PARTNERS[2], NETWORK_PARTNERS[4], NETWORK_PARTNERS[5]],
    wholesalerDemand: 0, retailerInterest: 0,
  },
  {
    id: "galaxy-s27-ultra-wholesale",
    product: "Galaxy S27 Ultra",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    subtitle: "Next-gen Galaxy AI. Snapdragon 8 Gen 6. 200MP camera system.",
    releaseDate: "January 2027",
    deposit: 149, fullPrice: 1349, maxSlots: 1500, slotsFilled: 423,
    features: ["Snapdragon 8 Gen 6", "Galaxy AI 2.0", "200MP Camera", "S Pen Pro"],
    specs: { Display: "6.9\" AMOLED", Chip: "SD 8 Gen 6", Storage: "256GB–1TB", Camera: "200MP", Battery: "5500mAh", "5G": "Sub-6 + mmWave" },
    colors: [{ name: "Titanium Silver", hex: "#c0c0c0" }, { name: "Titanium Black", hex: "#1a1a1a" }, { name: "Titanium Blue", hex: "#4a6fa5" }],
    tradeInBonus: 8, country: "US/CA", tier: "flagship",
    seller: { name: "NorthStar Wholesale", type: "Wholesaler", verified: true, rating: 4.8, totalSales: 8900, country: "US/CA" },
    networkPartners: [NETWORK_PARTNERS[0], NETWORK_PARTNERS[2], NETWORK_PARTNERS[5], NETWORK_PARTNERS[4]],
    wholesalerDemand: 8200, retailerInterest: 215,
  },
  {
    id: "galaxy-s27-ultra-network",
    product: "Galaxy S27 Ultra + Plan Bundle",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    subtitle: "Preorder the S27 Ultra bundled with an instant eSIM plan. Activate on arrival.",
    releaseDate: "January 2027",
    deposit: 99, fullPrice: 1349, maxSlots: 800, slotsFilled: 198,
    features: ["Snapdragon 8 Gen 6", "Instant eSIM Bundle", "Cross-Border Ready", "No Contract"],
    specs: { Display: "6.9\" AMOLED", Chip: "SD 8 Gen 6", Storage: "256GB–1TB", Camera: "200MP", Battery: "5500mAh", "5G": "Sub-6 + mmWave" },
    colors: [{ name: "Titanium Silver", hex: "#c0c0c0" }, { name: "Titanium Black", hex: "#1a1a1a" }],
    tradeInBonus: 12, country: "US/CA", tier: "flagship",
    seller: { name: "SelectMobile Network", type: "Network Provider", verified: true, rating: 4.6, totalSales: 24500, country: "US/CA" },
    networkPartners: [NETWORK_PARTNERS[0]],
    wholesalerDemand: 0, retailerInterest: 0,
  },
  {
    id: "pixel-11-pro-retail",
    product: "Pixel 11 Pro",
    brand: "Google",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
    subtitle: "Pure Google AI. Tensor G6. The smartest camera phone, period.",
    releaseDate: "October 2026",
    deposit: 99, fullPrice: 1049, maxSlots: 800, slotsFilled: 312,
    features: ["Tensor G6", "Gemini Nano 2", "50MP Triple Camera", "7 Years Updates"],
    specs: { Display: "6.4\" LTPO", Chip: "Tensor G6", Storage: "128GB–512GB", Camera: "50MP Triple", Battery: "5200mAh", "5G": "Sub-6" },
    colors: [{ name: "Porcelain", hex: "#f5f0e8" }, { name: "Obsidian", hex: "#1a1a1a" }, { name: "Wintergreen", hex: "#a8c5b8" }],
    tradeInBonus: 12, country: "US", tier: "flagship",
    seller: { name: "PixelDirect", type: "Retailer", verified: true, rating: 4.7, totalSales: 2100, country: "US" },
    networkPartners: [NETWORK_PARTNERS[1], NETWORK_PARTNERS[2], NETWORK_PARTNERS[6]],
    wholesalerDemand: 4100, retailerInterest: 128,
  },
  {
    id: "pixel-11-pro-mint",
    product: "Pixel 11 Pro + Mint Unlimited",
    brand: "Google",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop",
    subtitle: "Pixel 11 Pro bundled with Mint Mobile Unlimited. Activate instantly via eSIM.",
    releaseDate: "October 2026",
    deposit: 79, fullPrice: 1049, maxSlots: 400, slotsFilled: 156,
    features: ["Tensor G6", "Mint Unlimited eSIM", "Instant Activation", "No Contract"],
    specs: { Display: "6.4\" LTPO", Chip: "Tensor G6", Storage: "128GB–512GB", Camera: "50MP Triple", Battery: "5200mAh", "5G": "Sub-6" },
    colors: [{ name: "Porcelain", hex: "#f5f0e8" }, { name: "Obsidian", hex: "#1a1a1a" }],
    tradeInBonus: 15, country: "US", tier: "flagship",
    seller: { name: "Mint Mobile", type: "Network Provider", verified: true, rating: 4.5, totalSales: 89000, country: "US" },
    networkPartners: [NETWORK_PARTNERS[1]],
    wholesalerDemand: 0, retailerInterest: 0,
  },
  {
    id: "iphone-18-koodo",
    product: "iPhone 18 Pro + Koodo Bundle",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    subtitle: "iPhone 18 Pro with Koodo 20GB plan. Canada-exclusive preorder bundle.",
    releaseDate: "September 19, 2026",
    deposit: 149, fullPrice: 1199, maxSlots: 300, slotsFilled: 87,
    features: ["A20 Pro Chip", "Koodo 20GB eSIM", "Canada Exclusive", "No Contract"],
    specs: { Display: "6.3\" OLED", Chip: "A20 Pro", Storage: "256GB", Camera: "48MP Fusion", Battery: "All-Day", "5G": "Sub-6" },
    colors: [{ name: "Natural Titanium", hex: "#8a8680" }, { name: "Black Titanium", hex: "#2c2c2e" }],
    tradeInBonus: 10, country: "CA", tier: "flagship",
    seller: { name: "Koodo (Telus Flanker)", type: "Network Provider", verified: true, rating: 4.2, totalSales: 45000, country: "CA" },
    networkPartners: [NETWORK_PARTNERS[3]],
    wholesalerDemand: 0, retailerInterest: 0,
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const SELLER_TYPES: SellerType[] = ["Wholesaler", "Retailer", "Network Provider"];
const BRANDS = ["Apple", "Samsung", "Google"];
const REGIONS = ["US", "CA"];
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

// ─── Shared tab button helper ─────────────────────────────────────────────────

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
      if (regionFilter !== "All" && !c.country.includes(regionFilter)) return false;
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
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#04a1c6]/10 text-[#04a1c6] text-sm font-semibold mb-4">
            <Rocket className="w-4 h-4" /> Deposit-Based Queue — Lock Your Spot
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#0f172a] tracking-tight mb-4">
            Reserve Your Device
          </h2>
          <p className="text-lg text-[#0f172a]/60 max-w-3xl mx-auto mb-6">
            Reserve upcoming flagships before launch. Know exactly who you&apos;re buying from — wholesaler, retailer, or network provider — and which carriers you can bundle with.
          </p>
          {/* Urgency signal */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold">
            <Users className="w-4 h-4" />
            {totalSlotsLeft.toLocaleString()} spots remaining across {CAMPAIGNS.length} live campaigns
          </div>
        </motion.div>

        {/* ── How It Works ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
        >
          {[
            { step: "01", icon: <Rocket className="w-5 h-5" />, title: "Choose & Deposit", desc: "Pick your device, seller, and network bundle. Pay a refundable deposit." },
            { step: "02", icon: <Clock className="w-5 h-5" />, title: "Track Your Queue", desc: "Watch your position in real-time. Earlier deposits get priority." },
            { step: "03", icon: <ArrowLeftRight className="w-5 h-5" />, title: "Lock Trade-In", desc: "Lock your current phone's value months before launch as a guaranteed down payment." },
            { step: "04", icon: <Truck className="w-5 h-5" />, title: "Launch Day Ship", desc: "Your device ships on release day. Escrow-protected. eSIM activates instantly." },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm group hover:shadow-lg hover:border-[#04a1c6]/30 transition-all">
              <span className="text-5xl font-black text-[#04a1c6]/10 absolute top-4 right-4 group-hover:text-[#04a1c6]/20 transition-colors">{item.step}</span>
              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-[#04a1c6]/10 text-[#04a1c6] w-fit mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#0f172a] mb-1">{item.title}</h3>
                <p className="text-sm text-[#0f172a]/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Browse Filter Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f172a]/30 mb-3">Who are you buying from?</p>
          <div className="flex flex-wrap gap-2">
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

        {/* ── Search + More Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search devices, sellers, networks..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30 focus:border-[#04a1c6]/30 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full cursor-pointer">
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
            <SlidersHorizontal className="w-4 h-4" /> More Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-bold">{activeFilterCount}</span>
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
              className="overflow-hidden mb-4"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                {/* Brand */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#0f172a]/40 mb-2 block">Brand</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", ...BRANDS].map((b) => (
                      <FilterChipBtn key={b} active={brandFilter === b} onClick={() => setBrandFilter(b)}>
                        {b}
                      </FilterChipBtn>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Region */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#0f172a]/40 mb-2 block">Region</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", ...REGIONS].map((r) => (
                      <FilterChipBtn key={r} active={regionFilter === r} onClick={() => setRegionFilter(r)}>
                        {r === "All" ? "All Regions" : r === "US" ? "🇺🇸 US" : "🇨🇦 Canada"}
                      </FilterChipBtn>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Network Provider */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#0f172a]/40 mb-2 block">Network Provider</label>
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

        {/* Results bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#0f172a]/50">
            Showing <span className="font-semibold text-[#0f172a]">{filtered.length}</span> preorder campaigns
          </p>
          {(activeFilterCount > 0 || search) && (
            <button onClick={clearFilters} className="text-sm text-[#04a1c6] font-medium hover:underline cursor-pointer">
              Clear all filters
            </button>
          )}
        </div>

        {/* ── Campaign Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
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
            className="text-center py-20"
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No preorder campaigns found</h3>
            <p className="text-sm text-[#0f172a]/50 mb-6">Try adjusting your filters or search terms.</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#04a1c6] text-white text-sm font-bold cursor-pointer hover:bg-[#0390b0] transition-colors shadow-md"
            >
              <X className="w-4 h-4" /> Clear all filters
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
      className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#04a1c6]/20 transition-all group cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-2/5 relative aspect-square sm:aspect-auto bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden min-h-[200px]">
          <Image src={campaign.image} alt={campaign.product} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />

          {/* Meaningful badge — urgency or seller type */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {isAlmostFull ? (
              <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg bg-rose-500 text-white">
                🔥 {slotsLeft} spots left
              </span>
            ) : (
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${cardBadge.className}`}>
                {cardBadge.label}
              </span>
            )}
          </div>

          {/* Country */}
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#0f172a]/70 shadow-sm">
              {campaign.country === "US/CA" ? "🇺🇸🇨🇦" : campaign.country === "US" ? "🇺🇸" : "🇨🇦"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="sm:w-3/5 p-5 flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#04a1c6] mb-1">{campaign.brand}</span>
          <h3 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-1">{campaign.product}</h3>
          <p className="text-xs text-[#0f172a]/50 mb-3 line-clamp-2">{campaign.subtitle}</p>

          {/* Seller Identity */}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${meta.bgColor} border ${meta.borderColor} mb-3`}>
            <span className="text-lg">{meta.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-black ${meta.color}`}>{campaign.seller.name}</span>
                {campaign.seller.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#04a1c6]" />}
              </div>
              <span className="text-[10px] text-[#0f172a]/40">{campaign.seller.type} · ⭐ {campaign.seller.rating} · {campaign.seller.totalSales.toLocaleString()} sales</span>
            </div>
          </div>

          {/* Network Partners */}
          <div className="mb-3">
            <span className="text-[9px] font-bold text-[#0f172a]/30 uppercase tracking-wider block mb-1.5">Available Networks</span>
            <div className="flex flex-wrap gap-1">
              {campaign.networkPartners.map((np) => (
                <span key={np.name} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#04a1c6]/5 border border-[#04a1c6]/15 text-[10px] font-semibold text-[#04a1c6]">
                  {np.logo} {np.name}
                </span>
              ))}
            </div>
          </div>

          {/* Queue Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-[#0f172a]/50 flex items-center gap-1">
                <Users className="w-3 h-3" /> {campaign.slotsFilled.toLocaleString()} reserved
              </span>
              <span className={`font-bold ${isAlmostFull ? "text-rose-500" : "text-[#04a1c6]"}`}>
                {slotsLeft.toLocaleString()} left
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isAlmostFull ? "bg-gradient-to-r from-rose-400 to-rose-500" : "bg-gradient-to-r from-[#04a1c6] to-[#0390b0]"}`}
              />
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#0f172a]">${campaign.deposit}</span>
                <span className="text-xs text-[#0f172a]/30">deposit</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-[#04a1c6]" />
                <span className="text-[10px] font-semibold text-[#04a1c6]">{campaign.releaseDate}</span>
              </div>
            </div>
            {/* Visible CTA button */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#04a1c6]/10 text-[#04a1c6] font-bold text-xs group-hover:bg-[#04a1c6] group-hover:text-white transition-all">
              Reserve <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
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
  // null = no network plan chosen (skip)
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reserve");
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left — Image */}
          <div className="lg:w-[40%] relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none min-h-[300px]">
            <Image src={campaign.image} alt={campaign.product} fill className="object-cover" />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 rounded-2xl bg-[#04a1c6] text-white text-xs font-black uppercase tracking-widest shadow-xl">
                ⭐ Preorder
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

          {/* Right — Details */}
          <div className="lg:w-[60%] p-7 lg:p-9 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#04a1c6] block mb-1">{campaign.brand}</span>
                <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">{campaign.product}</h2>
                <p className="text-sm text-[#0f172a]/50 mt-1">{campaign.subtitle}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 cursor-pointer" aria-label="Close">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="text-xs text-[#0f172a]/40 mb-5">
              Color: <span className="font-bold text-[#0f172a]">{campaign.colors[selectedColor].name}</span>
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
                  <span className="text-xs text-[#0f172a]/40">{campaign.seller.type}</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs">
                <span className={meta.color}>⭐ {campaign.seller.rating} rating</span>
                <span className={meta.color}>{campaign.seller.totalSales.toLocaleString()} total sales</span>
                <span className={meta.color}>{campaign.seller.country === "US/CA" ? "🇺🇸🇨🇦 US & Canada" : campaign.seller.country === "US" ? "🇺🇸 US" : "🇨🇦 Canada"}</span>
              </div>
              <p className="text-[10px] text-[#0f172a]/40 mt-2">{meta.desc}</p>
            </div>

            {/* Queue Status */}
            <div className="bg-[#04a1c6]/5 rounded-2xl p-4 mb-5 border border-[#04a1c6]/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#04a1c6] flex items-center gap-2">
                  <Users className="w-4 h-4" /> Queue Status
                </span>
                <span className="text-sm font-black text-[#04a1c6]">{pct}% filled</span>
              </div>
              <div className="h-2.5 bg-[#04a1c6]/10 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#04a1c6] to-[#0390b0]"
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#04a1c6]/70">{campaign.slotsFilled.toLocaleString()} reserved</span>
                <span className="font-bold text-[#04a1c6]">{slotsLeft.toLocaleString()} slots remaining</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <span className="text-[9px] font-bold text-[#0f172a]/40 uppercase block mb-1">Deposit</span>
                <span className="text-2xl font-black text-[#04a1c6]">${campaign.deposit}</span>
                <span className="text-[9px] text-[#0f172a]/40 block">Refundable</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <span className="text-[9px] font-bold text-[#0f172a]/40 uppercase block mb-1">Full Price</span>
                <span className="text-2xl font-black text-[#0f172a]">${campaign.fullPrice.toLocaleString()}</span>
                <span className="text-[9px] text-[#0f172a]/40 block">Due at ship</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <span className="text-[9px] font-bold text-[#0f172a]/40 uppercase block mb-1">Release</span>
                <span className="text-sm font-black text-[#0f172a]">{campaign.releaseDate}</span>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {Object.entries(campaign.specs).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[9px] font-bold text-[#0f172a]/30 uppercase block">{key}</span>
                  <span className="text-xs font-bold text-[#0f172a]">{val}</span>
                </div>
              ))}
            </div>

            {/* Network Partner Selection */}
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#0f172a]/40 mb-1">Choose Your Network</p>
              <p className="text-[11px] text-[#0f172a]/40 mb-3">eSIM activates at checkout — or skip if you have a carrier.</p>
              <div className="space-y-2">
                {campaign.networkPartners.map((np, i) => (
                  <button
                    key={np.name}
                    onClick={() => setSelectedNetwork(selectedNetwork === i ? null : i)}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      selectedNetwork === i
                        ? "bg-[#04a1c6]/5 border-[#04a1c6]/40 shadow-md"
                        : "bg-white border-gray-100 hover:border-[#04a1c6]/30"
                    }`}
                  >
                    <span className="text-2xl">{np.logo}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#0f172a]">{np.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-[#0f172a]/40 uppercase">{np.type}</span>
                        {np.esimReady && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#04a1c6]/10 text-[#04a1c6]">
                            <Zap className="w-2.5 h-2.5" /> eSIM
                          </span>
                        )}
                        <span className="text-[10px] text-[#0f172a]/30">
                          {np.country === "US/CA" ? "🇺🇸🇨🇦" : np.country === "US" ? "🇺🇸" : "🇨🇦"}
                        </span>
                      </div>
                      <span className="text-xs text-[#0f172a]/50">{np.planName} — {np.data} data</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-[#0f172a]">${np.monthlyPrice}</span>
                      <span className="text-[10px] text-[#0f172a]/40 block">/mo</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedNetwork === i ? "border-[#04a1c6] bg-[#04a1c6]" : "border-gray-300"
                    }`}>
                      {selectedNetwork === i && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}

                {/* Skip option */}
                <button
                  onClick={() => setSelectedNetwork(null)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedNetwork === null
                      ? "bg-gray-100 border-gray-300"
                      : "bg-white border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedNetwork === null ? "border-gray-500 bg-gray-500" : "border-gray-300"
                  }`}>
                    {selectedNetwork === null && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs font-semibold text-[#0f172a]/50">I already have a carrier — skip for now</span>
                </button>
              </div>
            </div>

            {/* Trade-In Lock */}
            <button
              onClick={() => setShowTradeIn(!showTradeIn)}
              className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between mb-4 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-5 h-5 text-amber-600" />
                <div className="text-left">
                  <span className="text-sm font-bold text-amber-700 block">Lock In Your Trade-In Value</span>
                  <span className="text-xs text-amber-500">Get +{campaign.tradeInBonus}% bonus when you lock with this preorder</span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-amber-400 transition-transform ${showTradeIn ? "rotate-90" : ""}`} />
            </button>

            <AnimatePresence>
              {showTradeIn && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <TradeInLockPanel bonus={campaign.tradeInBonus} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* B2B Demand Forecast */}
            {(campaign.wholesalerDemand > 0 || campaign.retailerInterest > 0) && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">B2B Demand Forecast</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-white/80 text-center">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase block">Wholesaler Orders</span>
                    <span className="text-sm font-black text-indigo-700">{campaign.wholesalerDemand.toLocaleString()} units</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 text-center">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase block">Retailers Watching</span>
                    <span className="text-sm font-black text-indigo-700">{campaign.retailerInterest} stores</span>
                  </div>
                </div>
              </div>
            )}

            {/* CTAs */}
            {reserved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-emerald-800 mb-1">You&apos;re In the Queue</h3>
                <p className="text-sm text-emerald-600 mb-3">
                  Position <span className="font-black">#{reserved.queuePosition}</span> · Deposit of ${campaign.deposit} secured
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      const role = (session?.user as { role?: string })?.role;
                      let dashboardPath = "/buyer/dashboard/preorders";
                      if (role === "RETAILER") dashboardPath = "/retailer/dashboard";
                      else if (role === "WHOLESALER") dashboardPath = "/wholesaler/dashboard";
                      else if (role === "NETWORK_PROVIDER") dashboardPath = "/network-provider/dashboard";
                      else if (role === "INDIVIDUAL_SELLER") dashboardPath = "/individual/dashboard";
                      router.push(dashboardPath);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold cursor-pointer hover:bg-emerald-700 transition-colors"
                  >
                    View in Dashboard
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-bold cursor-pointer hover:bg-emerald-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium mb-3">
                    {error}
                  </div>
                )}
                <div className="flex gap-3 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReserve}
                    disabled={reserving}
                    className="flex-[2] py-4 rounded-2xl bg-[#04a1c6] text-white font-black text-sm uppercase tracking-widest hover:bg-[#0390b0] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-[#04a1c6]/20 disabled:opacity-50"
                  >
                    {reserving ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Reserving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Reserve My Spot — ${campaign.deposit}
                      </span>
                    )}
                  </motion.button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-[#0f172a]/60 font-black text-sm uppercase tracking-widest hover:border-gray-300 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Trade-In Lock Panel ────────────────────────────────────────────────────

function TradeInLockPanel({ bonus }: { bonus: number }) {
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("Good");

  const baseValues: Record<string, number> = {
    "iPhone 16 Pro Max": 850, "iPhone 16 Pro": 720, "iPhone 16": 580,
    "Samsung S25 Ultra": 780, "Samsung S25+": 650, "Pixel 9 Pro": 520,
  };

  const conditionMultipliers: Record<string, number> = {
    "Like New": 1.0, "Good": 0.85, "Fair": 0.7, "Poor": 0.5,
  };

  const baseValue = model ? (baseValues[model] || 400) : 0;
  const conditionValue = Math.round(baseValue * (conditionMultipliers[condition] || 0.85));
  const bonusValue = Math.round(conditionValue * bonus / 100);
  const totalValue = conditionValue + bonusValue;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
      <h4 className="text-sm font-black text-amber-800 mb-4 flex items-center gap-2">
        <ArrowLeftRight className="w-4 h-4" /> Trade-In Value Estimator
      </h4>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-[10px] font-bold text-amber-600 uppercase block mb-1">Your Device</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
          >
            <option value="">Select model...</option>
            {Object.keys(baseValues).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-amber-600 uppercase block mb-1">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
          >
            {["Like New", "Good", "Fair", "Poor"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {model && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-white rounded-xl border border-amber-100">
            <span className="text-[9px] font-bold text-amber-400 uppercase block">Base Value</span>
            <span className="text-lg font-black text-amber-700">${conditionValue}</span>
          </div>
          <div className="p-3 bg-amber-500 rounded-xl">
            <span className="text-[9px] font-bold text-amber-100 uppercase block">+{bonus}% Bonus</span>
            <span className="text-lg font-black text-white">+${bonusValue}</span>
          </div>
          <div className="p-3 bg-amber-700 rounded-xl">
            <span className="text-[9px] font-bold text-amber-200 uppercase block">Total</span>
            <span className="text-lg font-black text-white">${totalValue}</span>
          </div>
        </div>
      )}
    </div>
  );
}
