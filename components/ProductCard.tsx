"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, Star, Eye, Package, Zap, Truck, ShoppingCart
} from "lucide-react";
import { Product } from "../lib/products";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
  onTagClick?: (tag: string) => void;
}

export function ProductCard({ product, onQuickView, onTagClick }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#04a1c6]/10 transition-all duration-300 group relative flex flex-col hover:-translate-y-1"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isSelectVerified && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#04a1c6] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-md">
              -{discount}%
            </span>
          )}
          {product.condition !== "New" && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-md">
              {product.condition}
            </span>
          )}
        </div>

        {/* Quick view button */}
        {onQuickView && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-[#0f172a] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#04a1c6] hover:text-white cursor-pointer shadow-lg z-10"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Country badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-[#0f172a]/70 shadow-sm border border-white">
            {product.country === "US/CA" ? "🇺🇸🇨🇦" : product.country === "US" ? "🇺🇸" : "🇨🇦"}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Brand + Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#04a1c6]">{product.brand}</span>
          <span className="text-[10px] font-bold text-[#0f172a]/40 uppercase tracking-wider">
            {product.category === "ESIM_PLAN" ? "eSIM" : product.category === "SIM_CARD" ? "SIM" : product.category.charAt(0) + product.category.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Name */}
        <Link href={`/product/${product.id}`} className="block group/title">
          <h3 className="font-extrabold text-[#0f172a] text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem] group-hover/title:text-[#04a1c6] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Tags */}
        {product.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-[#04a1c6]/10 hover:text-[#04a1c6] text-[10px] font-bold text-[#0f172a]/50 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-black text-[#0f172a]">{product.rating}</span>
          <span className="text-xs font-bold text-[#0f172a]/40">({product.reviews})</span>
          {product.diagnosticScore && (
            <>
              <span className="text-[#0f172a]/20 mx-1">·</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-10 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(product.diagnosticScore / 50) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-emerald-600">{product.diagnosticScore}/50</span>
              </div>
            </>
          )}
        </div>

        {/* Seller */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[10px] text-[#0f172a]/40 font-bold">by</span>
          <span className="text-xs font-bold text-[#0f172a]/70">{product.seller}</span>
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
            product.sellerType === "Wholesaler" ? "bg-indigo-100 text-indigo-600" :
            product.sellerType === "Network Provider" ? "bg-cyan-100 text-cyan-700" :
            product.sellerType === "Individual" ? "bg-amber-100 text-amber-700" :
            "bg-slate-100 text-[#0f172a]/50"
          }`}>
            {product.sellerType}
          </span>
        </div>

        {/* Wholesaler bulk badge */}
        {product.bulkAvailable && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80 mb-3">
            <Package className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600">Bulk: Min {product.minOrderQty} units — B2B</span>
          </div>
        )}

        {/* Network Provider plan details */}
        {product.planDetails && (
          <div className="grid grid-cols-2 gap-1 mb-3">
            <span className="text-[10px] px-2 py-1 rounded-lg bg-cyan-50 text-cyan-700 font-bold">📶 {product.planDetails.data}</span>
            <span className="text-[10px] px-2 py-1 rounded-lg bg-cyan-50 text-cyan-700 font-bold">📞 {product.planDetails.talk}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#0f172a]">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs font-bold text-[#0f172a]/30 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.category === "ESIM_PLAN" && (
                <span className="text-[10px] text-[#0f172a]/40 font-bold">/month</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {product.shipping === "Instant eSIM" ? (
                <Zap className="w-3 h-3 text-[#04a1c6]" />
              ) : (
                <Truck className="w-3 h-3 text-emerald-500" />
              )}
              <span className="text-[10px] font-bold text-emerald-600">{product.shipping}</span>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-95 text-xs font-black tracking-wide ${
              added 
                ? "bg-emerald-500 text-white shadow-emerald-500/30" 
                : "bg-[#0f172a] text-white hover:bg-[#04a1c6] shadow-slate-900/10"
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            {added ? "Added to Cart ✓" : "Add to Secured Order"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
