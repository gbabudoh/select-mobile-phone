"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "../../components/Navigation";
import { 
  User as UserIcon, 
  ShoppingBag, 
  Store, 
  Truck, 
  Signal, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Mail,
  Lock
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "ROLE_SELECTION" | "ACCOUNT_DETAILS" | "SUCCESS";

const ROLES = [
  {
    id: "BUYER",
    title: "Buyer",
    description: "Looking for verified devices and best network plans.",
    icon: <ShoppingBag className="w-8 h-8" />,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "INDIVIDUAL_SELLER",
    title: "Individual Seller",
    description: "Want to sell my personal device through Select-Verified escrow.",
    icon: <UserIcon className="w-8 h-8" />,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "RETAILER",
    title: "Retailer",
    description: "Scaling my mobile business with a premium storefront.",
    icon: <Store className="w-8 h-8" />,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    id: "WHOLESALER",
    title: "Wholesaler",
    description: "Moving bulk inventory to retailers and providers.",
    icon: <Truck className="w-8 h-8" />,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
  },
  {
    id: "NETWORK_PROVIDER",
    title: "Network Provider",
    description: "Offering MVNO / Carrier plans with eSIM provisioning.",
    icon: <Signal className="w-8 h-8" />,
    color: "from-rose-500/20 to-red-500/20",
    borderColor: "border-rose-500/30",
  },
];

const STEPS = [
  { id: "ROLE_SELECTION", label: "Role" },
  { id: "ACCOUNT_DETAILS", label: "Details" },
  { id: "SUCCESS", label: "Finish" },
];

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("ROLE_SELECTION");
  const [direction, setDirection] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setDirection(1);
    setStep("ACCOUNT_DETAILS");
  };

  const goBack = () => {
    if (step === "ACCOUNT_DETAILS") {
      setDirection(-1);
      setStep("ROLE_SELECTION");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setDirection(1);
      setStep("SUCCESS");
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

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-white text-slate-900">
      <div className="animated-bg" />
      <Navigation />

      {/* Progress Stepper */}
      <div className="relative z-20 pt-32 px-6 flex justify-center">
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl px-8 py-4 rounded-full border border-black/5 shadow-xl">
          {STEPS.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                      isActive 
                        ? "bg-[#04a1c6] text-white scale-110 shadow-[0_0_15px_rgba(4,161,198,0.3)]" 
                        : isCompleted 
                        ? "bg-emerald-500 text-white" 
                        : "bg-black/5 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-sm font-bold tracking-tight ${isActive ? "text-slate-900" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="w-8 h-[1px] bg-black/5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 pt-16 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center min-h-[calc(100vh-12rem)]">
        <AnimatePresence mode="wait" custom={direction}>
          {step === "ROLE_SELECTION" && (
            <motion.div
              key="role-selection"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full text-center"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
                Join <span className="text-[#04a1c6]">SelectMobile</span>
              </h1>
              <p className="text-xl text-slate-500 mb-16 max-w-2xl mx-auto font-medium">
                The ultimate marketplace for certified devices and global network connectivity.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {ROLES.map((role, idx) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`glass-panel glow-effect p-10 rounded-[3rem] border ${role.borderColor.replace('500/30', '500/20')} bg-white cursor-pointer group transition-all duration-500 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:bg-[#04a1c6] hover:border-[#04a1c6]`}
                  >
                    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 mb-8 group-hover:scale-110 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-500 shadow-sm text-[#04a1c6] group-hover:text-white">
                      {role.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-4 text-slate-900 transition-colors uppercase tracking-tight group-hover:text-white">{role.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-lg font-medium group-hover:text-white/90 transition-colors">
                      {role.description}
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-[#04a1c6] font-black uppercase tracking-widest text-xs translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:text-white">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "ACCOUNT_DETAILS" && (
            <motion.div
              key="account-details"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-xl"
            >
              <button 
                onClick={goBack}
                className="group flex items-center gap-3 text-slate-400 hover:text-[#04a1c6] mb-10 transition-all cursor-pointer font-black uppercase tracking-widest text-sm"
              >
                <div className="p-2 rounded-full bg-slate-100 border border-slate-200 group-hover:border-[#04a1c6]/30 transition-all">
                  <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#04a1c6]" />
                </div>
                Change Role
              </button>

              <div className="glass-panel p-12 rounded-[3.5rem] border border-black/5 relative overflow-hidden shadow-2xl bg-white/80">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#04a1c6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                
                <div className="mb-12">
                  <h2 className="text-4xl font-black mb-3 text-slate-900 tracking-tight">Set Up Profile</h2>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <span>Creating as</span>
                    <span className="px-3 py-1 rounded-full bg-[#04a1c6]/10 border border-[#04a1c6]/20 text-[#04a1c6] text-xs font-black uppercase tracking-wider">
                      {selectedRole?.replace('_', ' ')}
                    </span>
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
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Identity Information</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-focus-within:text-[#04a1c6] text-slate-300">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name or Business Entity"
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:border-[#04a1c6] focus:bg-white transition-all duration-300 text-lg placeholder:text-slate-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Communication</label>
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
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Security</label>
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
                        minLength={8}
                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:border-[#04a1c6] focus:bg-white transition-all duration-300 text-lg placeholder:text-slate-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#04a1c6] to-[#0284a5] text-white font-black py-6 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer uppercase tracking-widest"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finalizing...
                      </div>
                    ) : (
                      <>
                        Initialize Account <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {step === "SUCCESS" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="text-center max-w-2xl px-6"
            >
              <div className="relative inline-block mb-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 relative z-10 shadow-inner"
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-400/20 blur-[60px] rounded-full animate-pulse" />
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black mb-6 text-slate-900 tracking-tighter">Access Granted.</h1>
              <p className="text-xl text-slate-500 mb-12 max-w-lg mx-auto leading-relaxed font-medium">
                Welcome to the <span className="text-slate-900 font-black">SelectMobile</span> ecosystem. Your identity has been verified.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    let dashboardPath = "/buyer/dashboard";
                    if (selectedRole === "RETAILER") dashboardPath = "/retailer/dashboard";
                    else if (selectedRole === "WHOLESALER") dashboardPath = "/wholesaler/dashboard";
                    else if (selectedRole === "NETWORK_PROVIDER") dashboardPath = "/network-provider/dashboard";
                    else if (selectedRole === "INDIVIDUAL_SELLER") dashboardPath = "/individual/dashboard";
                    router.push(dashboardPath);
                  }}
                  className="px-8 py-5 bg-[#04a1c6] text-white font-black rounded-3xl shadow-xl cursor-pointer uppercase tracking-tighter"
                >
                  Go to Dashboard
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/")}
                  className="px-8 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-3xl shadow-sm cursor-pointer uppercase tracking-tighter hover:bg-slate-50 transition-colors"
                >
                  Explore Market
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
