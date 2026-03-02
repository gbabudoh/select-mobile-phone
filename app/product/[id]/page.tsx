"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, Truck, Star, 
  ChevronLeft, ShoppingCart, Zap, BadgeCheck, Globe, 
  ArrowRight, CheckCircle2, Info, AlertTriangle, Scale, 
  Clock, Heart, Building2, Radio, User, Store
} from "lucide-react";
import { Navigation } from "../../../components/Navigation";
import { getProductById, PRODUCTS } from "../../../lib/products";
import { ProductCard } from "../../../components/ProductCard";
import { useCart } from "../../../context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const product = useMemo(() => getProductById(id), [id]);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWished, setIsWished] = useState(false);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="animated-bg" />
        <div className="relative z-10 glass-panel p-12 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-[#0f172a] mb-4">Product Not Found</h1>
          <p className="text-[#0f172a]/60 mb-8">The device you&apos;re looking for might have been sold or removed.</p>
          <Link href="/normal-order" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#04a1c6] text-white font-bold hover:shadow-lg transition-all cursor-pointer">
            <ChevronLeft className="w-5 h-5 cursor-pointer" /> Back to Marketplace
          </Link>
        </div>
      </main>
    );
  }

  const images = [product.image]; // In a real app, this would be an array

  return (
    <main className="min-h-screen pb-24">
      <div className="animated-bg" />
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32">
        {/* Breadcrumbs / Back button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/normal-order" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f172a]/40 hover:text-[#04a1c6] transition-colors group cursor-pointer">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform cursor-pointer" /> Back to Normal Order
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-white/80 border border-white/50 shadow-2xl group"
            >
              <Image 
                src={images[selectedImage]} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {/* Trust Badges on Image */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white flex items-center gap-2 text-xs font-black text-[#0f172a] uppercase tracking-wider cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-[#04a1c6] cursor-pointer" /> Select-Verified
                </div>
                {product.diagnosticScore && (
                  <div className="px-4 py-2 rounded-full bg-[#04a1c6] shadow-lg flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider cursor-pointer">
                    <Zap className="w-4 h-4 cursor-pointer" /> {product.diagnosticScore}/50 Score
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsWished(!isWished)}
                className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer"
              >
                <Heart className={`w-5 h-5 cursor-pointer ${isWished ? "fill-rose-500 text-rose-500" : "text-[#0f172a]/40"}`} />
              </button>
            </motion.div>

            {/* Thumbnail Navigation (Placeholder) */}
            <div className="flex gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === idx ? "border-[#04a1c6] shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Category & Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black text-[#04a1c6] uppercase tracking-[0.2em]">{product.category}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs font-bold text-[#0f172a]/40 uppercase tracking-widest">{product.condition}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 cursor-pointer">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 cursor-pointer" />
                  <span className="text-sm font-black text-amber-700 cursor-pointer">{product.rating}</span>
                  <span className="text-xs font-bold text-amber-600/60 cursor-pointer">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0f172a]/40 font-bold cursor-pointer">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 cursor-pointer" /> {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              {/* Price Panel */}
              <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#04a1c6]/20 blur-[80px] group-hover:bg-[#04a1c6]/30 transition-all" />
                <div className="relative z-10">
                  <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Checkout Price</div>
                  <div className="flex items-end gap-4 mb-6">
                    <span className="text-5xl font-black">${product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xl font-bold text-white/30 line-through mb-1.5">${product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-5 rounded-2xl bg-[#04a1c6] text-white font-black text-lg hover:shadow-[0_20px_40px_-15px_rgba(4,161,198,0.5)] transition-all flex items-center justify-center gap-3 active:scale-95 group/btn cursor-pointer"
                  >
                    <ShoppingCart className="w-6 h-6 group-hover/btn:scale-110 transition-transform cursor-pointer" /> Add to Secured Order
                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all cursor-pointer" />
                  </button>
                  <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2 cursor-pointer">
                    <ShieldCheck className="w-3 h-3 cursor-pointer" /> Escrow-Secure Payments Protected
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Seller Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Seller Badge */}
              <div className={`p-6 rounded-[2rem] border ${
                product.sellerType === "Wholesaler" ? "bg-indigo-50/50 border-indigo-100" :
                product.sellerType === "Network Provider" ? "bg-cyan-50/50 border-cyan-100" :
                product.sellerType === "Individual" ? "bg-amber-50/50 border-amber-100" :
                "bg-white border-gray-100"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                      product.sellerType === "Wholesaler" ? "bg-indigo-100 text-indigo-600" :
                      product.sellerType === "Network Provider" ? "bg-cyan-100 text-cyan-600" :
                      product.sellerType === "Individual" ? "bg-amber-100 text-amber-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {product.sellerType === "Wholesaler" ? <Building2 className="w-6 h-6" /> :
                       product.sellerType === "Network Provider" ? <Radio className="w-6 h-6" /> :
                       product.sellerType === "Individual" ? <User className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{product.sellerType}</div>
                      <div className="font-black text-[#0f172a]">{product.seller}</div>
                    </div>
                  </div>
                  <BadgeCheck className={`w-6 h-6 cursor-pointer ${
                    product.sellerType === "Wholesaler" ? "text-indigo-500" :
                    product.sellerType === "Network Provider" ? "text-cyan-600" :
                    product.sellerType === "Individual" ? "text-amber-500" : "text-emerald-500"
                  }`} />
                </div>

                {/* Seller Specific details */}
                {product.bulkAvailable && (
                  <div className="mt-4 p-4 rounded-2xl bg-white/60 border border-indigo-100">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Wholesale Tier Info</div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-lg font-black text-indigo-700">Min {product.minOrderQty} units</div>
                        <div className="text-[10px] font-bold text-indigo-400">Inventory Reserved</div>
                      </div>
                      <Link href="#" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-all cursor-pointer">
                        Request Quote
                      </Link>
                    </div>
                  </div>
                )}

                {product.planDetails && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="p-3 rounded-xl bg-white/60 border border-cyan-100 text-center">
                      <div className="text-[10px] font-black text-cyan-400 uppercase">Data</div>
                      <div className="text-xs font-black text-cyan-700">{product.planDetails.data}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/60 border border-cyan-100 text-center">
                      <div className="text-[10px] font-black text-cyan-400 uppercase">Contract</div>
                      <div className="text-xs font-black text-cyan-700">{product.planDetails.contract}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 cursor-pointer">
                    <Truck className="w-5 h-5 cursor-pointer" />
                  </div>
                  <div className="cursor-pointer">
                    <div className="text-[10px] font-black text-gray-400 uppercase cursor-pointer">Shipping</div>
                    <div className="text-xs font-black text-[#0f172a] cursor-pointer">{product.shipping}</div>
                  </div>
                </div>
                <div className="p-5 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 cursor-pointer">
                    <Globe className="w-5 h-5 cursor-pointer" />
                  </div>
                  <div className="cursor-pointer">
                    <div className="text-[10px] font-black text-gray-400 uppercase cursor-pointer">Region</div>
                    <div className="text-xs font-black text-[#0f172a] cursor-pointer">{product.country}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Detailed Specs Section */}
        <div className="mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Specs Table */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-[1.25rem] bg-[#04a1c6]/10 flex items-center justify-center text-[#04a1c6]">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-[#0f172a]">Technical Specifications</h2>
              </div>
              
              <div className="space-y-3">
                {product.specs ? Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={key} className={`flex items-center justify-between p-5 rounded-2xl ${idx % 2 === 0 ? "bg-white/50 border border-white" : ""}`}>
                    <span className="text-sm font-bold text-[#0f172a]/40 uppercase tracking-widest">{key}</span>
                    <span className="text-sm font-black text-[#0f172a]">{value}</span>
                  </div>
                )) : (
                  <div className="p-12 text-center glass-panel rounded-3xl text-gray-400 italic">
                    Specifications not available for this {product.category.toLowerCase()}.
                  </div>
                )}
              </div>
            </div>

            {/* Trust & Verification Information */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-[#0f172a]">Why Buy Verified?</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: ShieldCheck, title: "50-Point Check", desc: "Rigorous testing of screen, battery, sensors, and internal components.", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Zap, title: "Escrow Protection", desc: "Funds are only released when you confirm device match and activation.", color: "text-amber-500", bg: "bg-amber-50" },
                  { icon: Clock, title: "Warranty Included", desc: "90-day Select-Shield warranty on every verified handset.", color: "text-emerald-500", bg: "bg-emerald-50" },
                  { icon: Info, title: "Carrier Clear", desc: "IMEI checked against global blacklists and finance blocks.", color: "text-purple-500", bg: "bg-purple-50" },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer`}>
                      <item.icon className="w-6 h-6 cursor-pointer" />
                    </div>
                    <h3 className="text-lg font-black text-[#0f172a] mb-2 cursor-pointer">{item.title}</h3>
                    <p className="text-xs text-[#0f172a]/60 font-medium leading-relaxed cursor-pointer">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-[#0f172a]">You Might Also Like</h2>
            <Link href="/normal-order" className="text-sm font-black text-[#04a1c6] hover:underline flex items-center gap-2 cursor-pointer">
              View all marketplace <ArrowRight className="w-4 h-4 cursor-pointer" />
            </Link>
          </div>
          
          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-20 text-center glass-panel rounded-[2rem] text-gray-400 italic">
              No similar products found at this time.
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 md:hidden z-50 flex items-center justify-between shadow-2xl"
      >
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</div>
          <div className="text-xl font-black text-[#0f172a]">${product.price.toLocaleString()}</div>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="px-8 py-4 rounded-2xl bg-[#04a1c6] text-white font-black text-sm shadow-lg shadow-[#04a1c6]/30 cursor-pointer"
        >
          Secure Order
        </button>
      </motion.div>
    </main>
  );
}
