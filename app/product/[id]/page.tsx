"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, Truck, Star, 
  ChevronLeft, ShoppingCart, Zap, BadgeCheck, Globe, 
  ArrowRight, CheckCircle2, Info, AlertTriangle, Scale, 
  Clock, Heart, Building2, Radio, User, Store, Plus, Minus, Check, X
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
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const images = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) return product.images;
    if (product.colors && product.colors.some(c => c.image)) {
      return product.colors.map(c => c.image || product.image);
    }
    return [product.image];
  }, [product]);

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

  const handleColorChange = (idx: number) => {
    setSelectedColor(idx);
    const colorObj = product.colors?.[idx];
    if (colorObj?.image) {
      const foundIdx = images.indexOf(colorObj.image);
      if (foundIdx !== -1) setSelectedImage(foundIdx);
    } else if (images.length > 1) {
      setSelectedImage(idx % images.length);
    }
    showToast(`Color updated: ${colorObj?.name || "Selected"}`);
  };

  const handleAddToCart = () => {
    const activeColor = product.colors?.[selectedColor]?.name;
    addToCart(product, activeColor, quantity);
    setAddedSuccess(true);
    showToast(`Added ${quantity}x ${product.name} (${activeColor || "Default"}) to Secured Order`);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const toggleWishlist = () => {
    const nextState = !isWished;
    setIsWished(nextState);
    showToast(nextState ? "Added to your wishlist!" : "Removed from your wishlist");
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setIsQuoteModalOpen(false);
      showToast(`Quote request sent to ${product.seller}!`);
    }, 1800);
  };

  return (
    <main className="min-h-screen pb-24 relative">
      <div className="animated-bg" />
      <Navigation />

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-[#0f172a]/95 text-white backdrop-blur-xl shadow-2xl border border-white/20 flex items-center gap-3 text-xs font-bold pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 text-[#04a1c6]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-28">
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/normal-order" className="inline-flex items-center gap-2 text-xs font-bold text-[#0f172a]/50 hover:text-[#04a1c6] transition-colors group cursor-pointer">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform cursor-pointer" /> Back to Normal Order
          </Link>
        </motion.div>

        {/* Main Product Grid - Aligned Top & Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Compact Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-square max-h-[520px] rounded-[2.5rem] overflow-hidden bg-white/80 border border-white/60 shadow-xl group mx-auto w-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-full"
                >
                  <Image 
                    src={images[selectedImage] || product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Trust Badges */}
              <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-white flex items-center gap-2 text-[11px] font-black text-[#0f172a] uppercase tracking-wider cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#04a1c6] cursor-pointer" /> Select-Verified
                </div>
                {product.diagnosticScore && (
                  <div className="px-3.5 py-1.5 rounded-full bg-[#04a1c6] shadow-md flex items-center gap-2 text-[11px] font-black text-white uppercase tracking-wider cursor-pointer">
                    <Zap className="w-3.5 h-3.5 cursor-pointer" /> {product.diagnosticScore}/50 Score
                  </div>
                )}
              </div>

              <button 
                onClick={toggleWishlist}
                className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md shadow-md border border-white flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10 cursor-pointer"
              >
                <Heart className={`w-4 h-4 cursor-pointer transition-colors ${isWished ? "fill-rose-500 text-rose-500" : "text-[#0f172a]/40"}`} />
              </button>
            </motion.div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      selectedImage === idx 
                        ? "border-[#04a1c6] shadow-md scale-105 ring-2 ring-[#04a1c6]/30" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Compact, Aligned Product Details & Purchase Box */}
          <div className="lg:col-span-6 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              {/* Category & Condition Badge */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-[#04a1c6] uppercase tracking-[0.2em]">{product.category}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs font-bold text-[#0f172a]/40 uppercase tracking-widest">{product.condition}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-black text-[#0f172a] leading-tight tracking-tight">
                {product.name}
              </h1>
              
              {/* Rating & Stock */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-100/80 cursor-pointer">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 cursor-pointer" />
                  <span className="font-black text-amber-700 cursor-pointer">{product.rating}</span>
                  <span className="font-bold text-amber-600/60 cursor-pointer">({product.reviews})</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5 text-[#0f172a]/60 font-bold cursor-pointer">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 cursor-pointer" /> {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              {/* Compact Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/70 border border-white/60 shadow-sm backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-black text-[#0f172a]/40 uppercase tracking-widest">Color</span>
                    <span className="text-xs font-black text-[#04a1c6] px-2.5 py-0.5 rounded-full bg-[#04a1c6]/10">
                      {product.colors[selectedColor]?.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, idx) => {
                      const isSelected = selectedColor === idx;
                      const isLightColor = ["#f5f5f5", "#f0ede8", "#f5f0e8", "#f5f0e0", "#c0c0c0", "#a8c5b8"].includes(color.hex);
                      return (
                        <button
                          key={color.name}
                          onClick={() => handleColorChange(idx)}
                          aria-label={`Select ${color.name}`}
                          aria-pressed={isSelected}
                          className={`relative w-9 h-9 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${
                            isSelected
                              ? "ring-4 ring-[#04a1c6] ring-offset-2 scale-110 shadow-md"
                              : "ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <Check className={`w-4 h-4 ${isLightColor ? "text-[#0f172a]" : "text-white"}`} />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Compact Quantity Selector */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/50 border border-white">
                <span className="text-[11px] font-black text-[#0f172a]/50 uppercase tracking-widest">Quantity</span>
                <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-base font-black text-[#0f172a]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Compact Checkout Price Panel */}
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#04a1c6]/20 blur-[60px] group-hover:bg-[#04a1c6]/30 transition-all" />
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">Checkout Price</div>
                  <div className="flex items-end gap-3 mb-5">
                    <span className="text-4xl font-black">${(product.price * quantity).toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-lg font-bold text-white/30 line-through mb-1">
                        ${(product.originalPrice * quantity).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className={`w-full py-4 rounded-xl font-black text-base transition-all flex items-center justify-center gap-2.5 active:scale-95 group/btn cursor-pointer ${
                      addedSuccess 
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40" 
                        : "bg-[#04a1c6] text-white hover:shadow-[0_15px_30px_-10px_rgba(4,161,198,0.5)]"
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-5 h-5 animate-bounce" /> Added to Secured Order!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform cursor-pointer" /> Add to Secured Order
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all cursor-pointer" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5 cursor-pointer">
                    <ShieldCheck className="w-3 h-3 cursor-pointer text-[#04a1c6]" /> Escrow-Secure Payments Protected
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Seller Info Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              <div className={`p-4.5 rounded-2xl border ${
                product.sellerType === "Wholesaler" ? "bg-indigo-50/50 border-indigo-100" :
                product.sellerType === "Network Provider" ? "bg-cyan-50/50 border-cyan-100" :
                product.sellerType === "Individual" ? "bg-amber-50/50 border-amber-100" :
                "bg-white border-gray-100"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${
                      product.sellerType === "Wholesaler" ? "bg-indigo-100 text-indigo-600" :
                      product.sellerType === "Network Provider" ? "bg-cyan-100 text-cyan-600" :
                      product.sellerType === "Individual" ? "bg-amber-100 text-amber-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {product.sellerType === "Wholesaler" ? <Building2 className="w-5 h-5" /> :
                       product.sellerType === "Network Provider" ? <Radio className="w-5 h-5" /> :
                       product.sellerType === "Individual" ? <User className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.sellerType}</div>
                      <div className="font-black text-sm text-[#0f172a]">{product.seller}</div>
                    </div>
                  </div>
                  <BadgeCheck className={`w-5 h-5 cursor-pointer ${
                    product.sellerType === "Wholesaler" ? "text-indigo-500" :
                    product.sellerType === "Network Provider" ? "text-cyan-600" :
                    product.sellerType === "Individual" ? "text-amber-500" : "text-emerald-500"
                  }`} />
                </div>

                {/* Wholesale Tier Action */}
                {product.bulkAvailable && (
                  <div className="mt-3 p-3 rounded-xl bg-white/70 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-indigo-700">Min {product.minOrderQty} units</div>
                      <div className="text-[9px] font-bold text-indigo-400">Inventory Reserved</div>
                    </div>
                    <button 
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
                    >
                      Request Quote
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase">Shipping</div>
                    <div className="text-xs font-black text-[#0f172a]">{product.shipping}</div>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase">Region</div>
                    <div className="text-xs font-black text-[#0f172a]">{product.country}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Detailed Specs Section */}
        <div className="mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Specs Table */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#04a1c6]/10 flex items-center justify-center text-[#04a1c6]">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-[#0f172a]">Technical Specifications</h2>
              </div>
              
              <div className="space-y-2.5">
                {product.specs ? Object.entries(product.specs).map(([key, value], idx) => (
                  <div key={key} className={`flex items-center justify-between p-4 rounded-xl ${idx % 2 === 0 ? "bg-white/60 border border-white/80" : ""}`}>
                    <span className="text-xs font-bold text-[#0f172a]/50 uppercase tracking-wider">{key}</span>
                    <span className="text-xs font-black text-[#0f172a]">{value}</span>
                  </div>
                )) : (
                  <div className="p-10 text-center glass-panel rounded-2xl text-gray-400 italic text-sm">
                    Specifications not available for this {product.category.toLowerCase()}.
                  </div>
                )}
              </div>
            </div>

            {/* Trust Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-[#0f172a]">Why Buy Verified?</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, title: "50-Point Check", desc: "Rigorous testing of screen, battery, sensors, and internal components.", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Zap, title: "Escrow Protection", desc: "Funds are only released when you confirm device match and activation.", color: "text-amber-500", bg: "bg-amber-50" },
                  { icon: Clock, title: "Warranty Included", desc: "90-day Select-Shield warranty on every verified handset.", color: "text-emerald-500", bg: "bg-emerald-50" },
                  { icon: Info, title: "Carrier Clear", desc: "IMEI checked against global blacklists and finance blocks.", color: "text-purple-500", bg: "bg-purple-50" },
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform cursor-pointer`}>
                      <item.icon className="w-5 h-5 cursor-pointer" />
                    </div>
                    <h3 className="text-base font-black text-[#0f172a] mb-1 cursor-pointer">{item.title}</h3>
                    <p className="text-xs text-[#0f172a]/60 font-medium leading-relaxed cursor-pointer">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#0f172a]">You Might Also Like</h2>
            <Link href="/normal-order" className="text-xs font-black text-[#04a1c6] hover:underline flex items-center gap-1.5 cursor-pointer">
              View all marketplace <ArrowRight className="w-3.5 h-3.5 cursor-pointer" />
            </Link>
          </div>
          
          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-2xl text-gray-400 italic text-sm">
              No similar products found at this time.
            </div>
          )}
        </div>
      </div>

      {/* Request Quote Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-7 max-w-md w-full shadow-2xl relative border border-white/50"
            >
              <button 
                onClick={() => setIsQuoteModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0f172a]">Request Wholesale Quote</h3>
                  <p className="text-xs text-gray-500 font-medium">Contact {product.seller} for bulk pricing</p>
                </div>
              </div>

              {quoteSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="text-xl font-black text-[#0f172a]">Quote Request Sent!</h4>
                  <p className="text-xs text-gray-500">The seller will respond to your email with bulk tier rates shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-3.5 mt-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Device & Color</label>
                    <input 
                      type="text" 
                      disabled 
                      value={`${product.name} (${product.colors?.[selectedColor]?.name || "Standard"})`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Requested Quantity</label>
                    <input 
                      type="number" 
                      min={product.minOrderQty || 10}
                      defaultValue={product.minOrderQty || 10}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#0f172a] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Your Business Email</label>
                    <input 
                      type="email" 
                      placeholder="wholesale@yourcompany.com"
                      value={quoteEmail}
                      onChange={(e) => setQuoteEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#0f172a] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/30 cursor-pointer mt-3"
                  >
                    Submit Quote Request
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Mobile Purchase Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-5 md:hidden z-40 flex items-center justify-between shadow-2xl"
      >
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</div>
          <div className="text-lg font-black text-[#0f172a]">${(product.price * quantity).toLocaleString()}</div>
        </div>
        <button 
          onClick={handleAddToCart}
          className={`px-6 py-3 rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer ${
            addedSuccess ? "bg-emerald-500 text-white" : "bg-[#04a1c6] text-white shadow-[#04a1c6]/30"
          }`}
        >
          {addedSuccess ? "Added ✓" : "Secure Order"}
        </button>
      </motion.div>
    </main>
  );
}
