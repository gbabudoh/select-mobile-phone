"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "../../components/Navigation";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  LogIn
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid credentials");
      }

      // Fetch the updated session to get the user role
      const session = await getSession();
      const role = (session?.user as { role?: string })?.role;

      // Determine redirect path based on role
      let dashboardPath = "/buyer/dashboard";
      if (role === "RETAILER") dashboardPath = "/retailer/dashboard";
      else if (role === "WHOLESALER") dashboardPath = "/wholesaler/dashboard";
      else if (role === "NETWORK_PROVIDER") dashboardPath = "/network-provider/dashboard";
      else if (role === "INDIVIDUAL_SELLER") dashboardPath = "/individual/dashboard";

      router.push(dashboardPath);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-white text-slate-900">
      <div className="animated-bg" />
      <Navigation />

      <div className="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          <Link 
            href="/"
            className="group flex items-center gap-3 text-slate-400 hover:text-[#04a1c6] mb-10 transition-all font-black uppercase tracking-widest text-sm"
          >
            <div className="p-2 rounded-full bg-slate-100 border border-slate-200 group-hover:border-[#04a1c6]/30 transition-all">
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#04a1c6]" />
            </div>
            Back to Home
          </Link>

          <div className="glass-panel p-12 rounded-[3.5rem] border border-black/5 relative overflow-hidden shadow-2xl bg-white/80">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#04a1c6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-3xl bg-[#04a1c6]/10 border border-[#04a1c6]/20 text-[#04a1c6]">
                  <LogIn className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">Welcome Back</h2>
                  <p className="text-slate-500 font-medium">Log in to your SelectMobile account</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-600 text-sm font-bold flex gap-3 items-start"
                >
                  <div className="mt-0.5 p-1 rounded-full bg-rose-500/10">
                    <CheckCircle2 className="w-4 h-4 rotate-45" />
                  </div>
                  {error}
                </motion.div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#04a1c6] text-slate-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:border-[#04a1c6] focus:bg-white transition-all duration-300 text-lg placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Security Phrase</label>
                  <Link href="/forgot-password" title="Coming soon!" className="text-xs font-black uppercase tracking-widest text-[#04a1c6] hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#04a1c6] text-slate-300">
                    <Lock className="w-6 h-6" />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Secure Password"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:border-[#04a1c6] focus:bg-white transition-all duration-300 text-lg placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#04a1c6] to-[#0284a5] text-white font-black py-6 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer uppercase tracking-widest"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <>
                      Sign In to Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                New to SelectMobile?{" "}
                <Link href="/register" className="text-[#04a1c6] font-black uppercase tracking-widest text-sm hover:underline ml-2">
                  Initialize Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
