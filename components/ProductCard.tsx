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
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#04a1c6]/5 transition-all duration-300 group relative flex flex-col"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isSelectVerified && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#04a1c6] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg cursor-pointer">
              <ShieldCheck className="w-3 h-3 cursor-pointer" /> Verified
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-bold shadow-lg">
              -{discount}%
            </span>
          )}
          {product.condition !== "New" && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-lg">
              {product.condition}
            </span>
          )}
        </div>

        {/* Quick view button */}
        {onQuickView && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-[#0f172a] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#04a1c6] hover:text-white cursor-pointer shadow-lg z-10"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-4 h-4 cursor-pointer" />
          </button>
        )}

        {/* Country badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#0f172a]/70 shadow-sm">
            {product.country === "US/CA" ? "🇺🇸🇨🇦" : product.country === "US" ? "🇺🇸" : "🇨🇦"}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand + Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#04a1c6]">{product.brand}</span>
          <span className="text-[10px] font-medium text-[#0f172a]/40 uppercase tracking-wider">
            {product.category === "ESIM_PLAN" ? "eSIM" : product.category === "SIM_CARD" ? "SIM" : product.category.charAt(0) + product.category.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Name */}
        <Link href={`/product/${product.id}`} className="block group/title cursor-pointer">
          <h3 className="font-bold text-[#0f172a] text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem] group-hover/title:text-[#04a1c6] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Tags */}
        {product.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-medium text-[#0f172a]/50">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 cursor-pointer" />
          <span className="text-xs font-semibold text-[#0f172a] cursor-pointer">{product.rating}</span>
          <span className="text-xs text-[#0f172a]/40 cursor-pointer">({product.reviews})</span>
          {product.diagnosticScore && (
            <>
              <span className="text-[#0f172a]/20 mx-1">·</span>
              <span className="text-[10px] font-semibold text-emerald-600">{product.diagnosticScore}/50 pts</span>
            </>
          )}
        </div>

        {/* Seller */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[10px] text-[#0f172a]/40">by</span>
          <span className="text-xs font-medium text-[#0f172a]/60">{product.seller}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
            product.sellerType === "Wholesaler" ? "bg-indigo-100 text-indigo-600" :
            product.sellerType === "Network Provider" ? "bg-cyan-100 text-cyan-700" :
            product.sellerType === "Individual" ? "bg-amber-100 text-amber-700" :
            "bg-gray-100 text-[#0f172a]/40"
          }`}>
            {product.sellerType}
          </span>
        </div>

        {/* Wholesaler bulk badge */}
        {product.bulkAvailable && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 mb-3">
            <Package className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-bold text-indigo-600">Bulk: Min {product.minOrderQty} units — B2B pricing</span>
          </div>
        )}

        {/* Network Provider plan details */}
        {product.planDetails && (
          <div className="grid grid-cols-2 gap-1 mb-3">
            <span className="text-[10px] px-2 py-1 rounded bg-cyan-50 text-cyan-700 font-semibold">📶 {product.planDetails.data}</span>
            <span className="text-[10px] px-2 py-1 rounded bg-cyan-50 text-cyan-700 font-semibold">📞 {product.planDetails.talk}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-50">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[#0f172a]">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#0f172a]/30 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.category === "ESIM_PLAN" && (
              <span className="text-[10px] text-[#0f172a]/40 font-medium">/month</span>
            )}
            <div className="flex items-center gap-1 mt-1">
              {product.shipping === "Instant eSIM" ? (
                <Zap className="w-3 h-3 text-[#04a1c6]" />
              ) : (
                <Truck className="w-3 h-3 text-emerald-500" />
              )}
              <span className="text-[10px] font-medium text-emerald-600">{product.shipping}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="p-2.5 rounded-xl bg-[#0f172a] text-white hover:bg-[#04a1c6] transition-colors cursor-pointer shadow-md active:scale-90"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
