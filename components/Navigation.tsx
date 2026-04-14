"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, User, UserPlus, Menu, X, LogIn, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";
import { CartDrawer } from "./CartDrawer";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();
  const { data: session } = useSession();

  const role = (session?.user as { role?: string })?.role;
  let dashboardPath = "/login";
  let dashboardText = "Dashboard";
  if (role === "BUYER") { dashboardPath = "/buyer/dashboard"; dashboardText = "Buyer's Dashboard"; }
  else if (role === "RETAILER") { dashboardPath = "/retailer/dashboard"; dashboardText = "Retailer's Dashboard"; }
  else if (role === "WHOLESALER") { dashboardPath = "/wholesaler/dashboard"; dashboardText = "Wholesaler's Dashboard"; }
  else if (role === "NETWORK_PROVIDER") { dashboardPath = "/network-provider/dashboard"; dashboardText = "Provider Dashboard"; }
  else if (role === "INDIVIDUAL_SELLER") { dashboardPath = "/individual/dashboard"; dashboardText = "Seller Dashboard"; }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image src="/logo.png" alt="Select Mobile Logo" width={200} height={48} className="h-12 w-auto object-contain cursor-pointer" priority />
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-medium">
          <motion.a whileHover={{ scale: 1.05 }} href="/normal-order" className="text-[#0f172a] hover:text-[#04a1c6] transition-colors cursor-pointer">Shop Phones</motion.a>
          <motion.a whileHover={{ scale: 1.05 }} href="/preorder" className="text-[#0f172a] hover:text-[#04a1c6] transition-colors cursor-pointer">Preorder</motion.a>
          <motion.a whileHover={{ scale: 1.05 }} href="/trade-in" className="text-[#0f172a] hover:text-[#04a1c6] transition-colors cursor-pointer">Trade-In</motion.a>
          <motion.a whileHover={{ scale: 1.05 }} href="/tco-calculator" className="text-[#0f172a] hover:text-[#04a1c6] transition-colors cursor-pointer">Compare &amp; Save</motion.a>
          <motion.a whileHover={{ scale: 1.05 }} href="/ask-selma" className="text-[#0f172a] hover:text-[#04a1c6] transition-colors flex items-center gap-1 cursor-pointer">
            <Cpu className="w-4 h-4" /> Ask SELMA
          </motion.a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setCartOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer relative"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#0f172a]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#04a1c6] text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </motion.button>

          {session ? (
            <>
              <Link href={dashboardPath}>
                <motion.button whileHover={{ scale: 1.05 }} title="Go to Dashboard" whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-[#0f172a] flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">{dashboardText}</span>
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                title="Sign Out" 
                whileTap={{ scale: 0.95 }} 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 rounded-full border border-[#0f172a]/20 hover:bg-[#0f172a] hover:text-white transition-colors cursor-pointer text-[#0f172a] flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
              >
                <span className="hidden lg:inline">Sign Out</span>
              </motion.button>
            </>
          ) : (
            <>
              <Link href="/login">
                <motion.button whileHover={{ scale: 1.1 }} title="Sign In" whileTap={{ scale: 0.95 }} className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-[#0f172a] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest hidden lg:inline">Sign In</span>
                </motion.button>
              </Link>
              <Link href="/register">
                <motion.button whileHover={{ scale: 1.1 }} title="Create Account" whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-full bg-[#04a1c6] text-white flex items-center gap-2 font-bold uppercase tracking-widest text-xs shadow-[0_0_12px_rgba(4,161,198,0.3)] cursor-pointer">
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </motion.button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setCartOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer relative"
          >
            <ShoppingBag className="w-5 h-5 text-[#0f172a]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#04a1c6] text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </motion.button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 cursor-pointer">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-white/10 mt-3"
          >
            <div className="flex flex-col p-6 gap-4 font-medium">
              <a href="/normal-order" className="py-2 text-[#0f172a] hover:text-[#04a1c6] cursor-pointer">Shop Phones</a>
              <a href="/preorder" className="py-2 text-[#0f172a] hover:text-[#04a1c6] cursor-pointer">Preorder</a>
              <a href="/trade-in" className="py-2 text-[#0f172a] hover:text-[#04a1c6] cursor-pointer">Trade-In</a>
              <a href="/tco-calculator" className="py-2 text-[#0f172a] hover:text-[#04a1c6] cursor-pointer">Compare &amp; Save</a>
              <a href="/ask-selma" className="py-2 text-[#0f172a] hover:text-[#04a1c6] flex items-center gap-2 cursor-pointer">
                <Cpu className="w-4 h-4" /> Ask SELMA
              </a>
              <hr className="border-[#0f172a]/10 my-2" />
              {session ? (
                <>
                  <Link href={dashboardPath} className="w-full">
                    <button className="w-full py-3 rounded-xl bg-[#04a1c6] text-white font-bold flex items-center justify-center gap-2 mb-2 cursor-pointer shadow-lg shadow-[#04a1c6]/20">
                      <User className="w-5 h-5" />
                      {dashboardText}
                    </button>
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full py-3 rounded-xl bg-white border border-slate-100 text-rose-500 font-bold flex items-center justify-center gap-2 mb-2 cursor-pointer shadow-sm">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full">
                    <button className="w-full py-3 rounded-xl bg-white border border-slate-100 text-[#0f172a] font-bold flex items-center justify-center gap-2 mb-2 cursor-pointer shadow-sm">
                      <LogIn className="w-5 h-5 text-[#04a1c6]" />
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <button className="w-full py-3 rounded-xl bg-[#04a1c6] text-white font-bold flex items-center justify-center gap-2 mb-2 cursor-pointer shadow-lg shadow-[#04a1c6]/20">
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </motion.nav>
  );
}
