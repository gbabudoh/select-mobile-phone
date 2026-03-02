"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#04a1c6]/10 flex items-center justify-center text-[#04a1c6]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0f172a]">Your Cart</h2>
                  <p className="text-xs font-bold text-[#0f172a]/40 uppercase tracking-widest">{cartCount} items</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-[#0f172a]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0f172a]">Your cart is empty</h3>
                    <p className="text-sm text-[#0f172a]/40">Looks like you haven&apos;t added anything yet.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 rounded-xl bg-[#04a1c6] text-white font-bold text-sm hover:shadow-lg transition-all cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-black text-[#0f172a] line-clamp-1">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] font-bold text-[#04a1c6] uppercase tracking-widest">{item.brand}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-[#0f172a] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-[#0f172a] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-black text-[#0f172a]">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-[#0f172a]/60">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-emerald-600">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-black text-[#0f172a]/40 uppercase tracking-[0.2em] block mb-1">Total</span>
                      <span className="text-2xl font-black text-[#0f172a]">${cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[10px] font-bold text-[#0f172a]/60 shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-[#04a1c6]" /> Secure Escrow
                    </div>
                  </div>
                </div>

                <Link href="/checkout" onClick={onClose}>
                  <button className="w-full py-5 rounded-2xl bg-[#0f172a] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#0f172a]/20 hover:bg-[#04a1c6] transition-all flex items-center justify-center gap-3 group cursor-pointer">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <p className="text-[10px] text-center font-bold text-[#0f172a]/30 uppercase tracking-[0.2em]">
                  Taxes calculated at next step
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
