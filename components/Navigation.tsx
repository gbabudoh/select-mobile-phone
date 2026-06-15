"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, User, UserPlus, Menu, X, LogIn, ShoppingBag, ChevronLeft, RefreshCw, Smartphone, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { CartDrawer } from "./CartDrawer";

export function Navigation() {
  const pathname = usePathname() || "/";
  const router = useRouter();
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

  const rootPaths = [
    "/",
    "/normal-order",
    "/preorder",
    "/trade-in",
    "/ask-selma",
    "/login",
    "/register",
    "/buyer/dashboard",
    "/retailer/dashboard",
    "/wholesaler/dashboard",
    "/network-provider/dashboard",
    "/individual/dashboard"
  ];
  const showBackButton = !rootPaths.includes(pathname);

  const navItems = [
    {
      label: "Shop",
      href: "/normal-order",
      icon: Smartphone,
      active: pathname === "/normal-order",
    },
    {
      label: "Preorder",
      href: "/preorder",
      icon: Calendar,
      active: pathname === "/preorder",
    },
    {
      label: "Trade-In",
      href: "/trade-in",
      icon: RefreshCw,
      active: pathname === "/trade-in",
    },
    {
      label: "SELMA",
      href: "/ask-selma",
      icon: Cpu,
      active: pathname === "/ask-selma",
    },
    {
      label: "Account",
      href: dashboardPath,
      icon: User,
      active: pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.includes("/dashboard"),
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-panel py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="md:hidden p-1.5 hover:bg-[#0f172a]/5 rounded-xl cursor-pointer text-[#0f172a] transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image src="/logo.png" alt="Select Mobile Logo" width={200} height={48} className="h-12 w-auto object-contain cursor-pointer" priority />
          </Link>
        </div>
        
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
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 cursor-pointer">
            <Menu className="w-6 h-6 text-[#0f172a]" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Slide Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/45 z-50 md:hidden"
            />

            {/* Sidebar Menu Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-dvh w-[80%] max-w-[320px] bg-white shadow-2xl z-[60] md:hidden flex flex-col p-6 pb-24 border-l border-slate-100"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-[#04a1c6]">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer text-[#0f172a]"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex flex-col gap-4 font-semibold text-slate-700">
                <a href="/normal-order" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#04a1c6] transition-colors border-b border-slate-100 cursor-pointer">Shop Phones</a>
                <a href="/preorder" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#04a1c6] transition-colors border-b border-slate-100 cursor-pointer">Preorder</a>
                <a href="/trade-in" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#04a1c6] transition-colors border-b border-slate-100 cursor-pointer">Trade-In</a>
                <a href="/tco-calculator" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#04a1c6] transition-colors border-b border-slate-100 cursor-pointer">Compare &amp; Save</a>
                <a href="/ask-selma" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:text-[#04a1c6] flex items-center gap-2 border-b border-slate-100 cursor-pointer">
                  <Cpu className="w-4 h-4" /> Ask SELMA
                </a>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto flex flex-col gap-3">
                {session ? (
                  <>
                    <Link href={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <button className="w-full py-3.5 rounded-xl bg-[#04a1c6] text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#04a1c6]/20 hover:bg-[#0390b0] transition-colors">
                        <User className="w-5 h-5" />
                        {dashboardText}
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-rose-500 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <button className="w-full py-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[#0f172a] font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                        <LogIn className="w-5 h-5 text-[#04a1c6]" />
                        Sign In
                      </button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <button className="w-full py-3.5 rounded-xl bg-[#04a1c6] text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#04a1c6]/20 hover:bg-[#0390b0] transition-colors">
                        <UserPlus className="w-5 h-5" />
                        Create Account
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </motion.nav>

    {/* Bottom Mobile Navigation */}
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-100/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,12px)] pt-3 px-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer relative"
          >
            <div className="relative flex items-center justify-center">
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  item.active ? "text-[#04a1c6]" : "text-slate-400"
                }`}
              />
              {item.active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#04a1c6]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </div>
            <span
              className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                item.active ? "text-[#04a1c6] font-semibold" : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
    </>
  );
}
