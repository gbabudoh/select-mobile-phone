"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ShieldCheck, CreditCard, 
  ArrowRight, CheckCircle2, ShoppingBag, MapPin, 
  Mail, Phone, User, Info
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { Navigation } from "../../components/Navigation";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });

  if (cart.length === 0 && step < 3) {
    return (
      <main className="min-h-screen pb-24">
        <div className="animated-bg" />
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-32 text-center">
          <div className="glass-panel p-12 max-w-md mx-auto rounded-[3rem]">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-[#0f172a] mb-4">Your cart is empty</h1>
            <p className="text-[#0f172a]/40 mb-8 font-bold uppercase tracking-widest text-xs">Add some items before checking out</p>
            <Link href="/normal-order" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#04a1c6] text-white font-black hover:shadow-lg transition-all cursor-pointer">
              <ChevronLeft className="w-5 h-5" /> Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      handleNext();
    } else {
      // Simulate order placement
      setTimeout(() => {
        clearCart();
        setStep(3);
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen pb-24">
      <div className="animated-bg" />
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/normal-order" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f172a]/40 hover:text-[#04a1c6] transition-colors group cursor-pointer mb-4">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight">Checkout</h1>
          </div>

          {/* Progress Swiper */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                  step >= s ? "bg-[#04a1c6] text-white shadow-lg shadow-[#04a1c6]/20" : "bg-white text-gray-300 border border-gray-100"
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-8 h-0.5 mx-2 bg-gradient-to-r ${step > s ? "from-[#04a1c6] to-[#04a1c6]" : "from-gray-100 to-gray-50"}`} />}
              </div>
            ))}
          </div>
        </div>

        {step === 3 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-20 glass-panel rounded-[3rem] border-emerald-100/50"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-[#0f172a] mb-4">Order Secured!</h2>
            <p className="text-[#0f172a]/60 text-lg mb-12 max-w-sm mx-auto">
              Your order has been successfully placed under <strong>Escrow Protection</strong>. You&apos;ll receive an email with tracking details shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="px-8 py-4 rounded-2xl bg-[#0f172a] text-white font-black shadow-lg hover:shadow-[#0f172a]/20 transition-all cursor-pointer">
                Go to Dashboard
              </Link>
              <Link href="/normal-order" className="px-8 py-4 rounded-2xl bg-white border border-gray-100 text-[#0f172a] font-black hover:bg-gray-50 transition-all cursor-pointer">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Col: Forms */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-4 text-[#04a1c6]">
                      <MapPin className="w-6 h-6" />
                      <h2 className="text-2xl font-black text-[#0f172a]">Shipping Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            required
                            type="text" 
                            placeholder="John Doe"
                            className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 transition-all text-[#0f172a] font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            required
                            type="email" 
                            placeholder="john@example.com"
                            className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 transition-all text-[#0f172a] font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shipping Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="123 Luxury Lane"
                          className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 transition-all text-[#0f172a] font-medium"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                        <input 
                          required
                          type="text" 
                          placeholder="New York"
                          className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 transition-all text-[#0f172a] font-medium"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                        <input 
                          required
                          type="text" 
                          placeholder="10001"
                          className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 transition-all text-[#0f172a] font-medium"
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            required
                            type="tel" 
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 transition-all text-[#0f172a] font-medium"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-4 text-[#04a1c6]">
                      <CreditCard className="w-6 h-6" />
                      <h2 className="text-2xl font-black text-[#0f172a]">Payment Method</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-6 rounded-[2rem] border-2 border-[#04a1c6] bg-[#04a1c6]/5 relative group cursor-pointer">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-[#04a1c6] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#04a1c6]/20">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-[#0f172a]">Escrow Protected</h3>
                            <p className="text-xs font-bold text-[#04a1c6] uppercase tracking-widest">Recommended</p>
                          </div>
                        </div>
                        <p className="text-sm text-[#0f172a]/60 leading-relaxed">
                          Your funds are held securely and only released once you confirm receipt and verify the item. Full buyer protection included.
                        </p>
                        <div className="absolute top-6 right-6 w-6 h-6 rounded-full border-2 border-[#04a1c6] flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#04a1c6]" />
                        </div>
                      </div>

                      <div className="p-6 rounded-[2rem] border border-gray-100 bg-white relative group cursor-not-allowed opacity-50">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-gray-400">Credit / Debit Card</h3>
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Coming Soon</p>
                          </div>
                        </div>
                        <div className="absolute top-6 right-6 w-6 h-6 rounded-full border-2 border-gray-100" />
                      </div>
                    </div>

                    {/* Security Note */}
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                      <Info className="w-6 h-6 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-sm font-black text-amber-800 mb-1">Security Verification Required</h4>
                        <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest leading-relaxed">
                          For high-value mobile orders, we may request a quick ID verification after checkout to prevent fraud and protect your escrow account.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center gap-4 pt-8">
                  {step > 1 && (
                    <button 
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-4 rounded-2xl border border-gray-100 text-[#0f172a] font-black hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  <button className="flex-1 px-8 py-4 rounded-2xl bg-[#0f172a] text-white font-black hover:bg-[#04a1c6] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#0f172a]/10 cursor-pointer">
                    {step === 1 ? "Proceed to Payment" : "Verify & Secure Order"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Col: Summary */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-8 rounded-[3rem] sticky top-32">
                <h3 className="text-2xl font-black text-[#0f172a] mb-8">Order Summary</h3>
                
                <div className="space-y-6 max-h-[40vh] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden relative border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#04a1c6] text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-[#0f172a] line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.brand}</p>
                        <p className="text-xs font-black text-[#04a1c6] mt-1">${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-sm font-bold text-[#0f172a]/60 tracking-wider uppercase text-[10px]">
                    <span>Subtotal</span>
                    <span className="text-[#0f172a]">${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-emerald-600 tracking-wider uppercase text-[10px]">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#0f172a]/60 tracking-wider uppercase text-[10px]">
                    <span>Tax (Est.)</span>
                    <span className="text-[#0f172a]">$0.00</span>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-black text-[#0f172a]/40 uppercase tracking-[0.2em] block mb-1">Total Due</span>
                      <span className="text-4xl font-black text-[#0f172a]">${cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Select-Verified Escrow Protected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
