"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, BarChart3, Megaphone, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("sm_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true, timestamp: Date.now() };
    localStorage.setItem("sm_cookie_consent", JSON.stringify(consent));
    setVisible(false);
  };

  const handleRejectOptional = () => {
    const consent = { necessary: true, analytics: false, marketing: false, timestamp: Date.now() };
    localStorage.setItem("sm_cookie_consent", JSON.stringify(consent));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    const consent = { ...preferences, timestamp: Date.now() };
    localStorage.setItem("sm_cookie_consent", JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
            onClick={handleRejectOptional}
          />

          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-[201] bg-white rounded-3xl shadow-2xl border border-[#dcdcdc] overflow-hidden"
          >
            {/* Header */}
            <div className="px-7 pt-7 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <Cookie className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a] tracking-tight">Cookie Preferences</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">US &amp; Canada Privacy Compliance</p>
                </div>
              </div>
              <button onClick={handleRejectOptional} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Description */}
            <div className="px-7 pb-4">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                We use cookies to keep Select Mobile Phone running securely and to understand how you use the platform.
                You choose which optional cookies to allow.{" "}
                <Link href="/cookies" className="text-amber-600 font-bold hover:underline">Learn more</Link>
              </p>
            </div>

            {/* Expandable Details */}
            <div className="px-7">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0f172a] transition-colors cursor-pointer mb-3"
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showDetails ? "Hide Details" : "Customize Cookies"}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2.5 pb-4">
                      {/* Necessary */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-[#dcdcdc]/50">
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <div>
                            <span className="text-[11px] font-extrabold text-[#0f172a] uppercase tracking-wide">Strictly Necessary</span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Login, cart, security</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Always On</span>
                      </div>

                      {/* Analytics */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-[#dcdcdc]/50">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-4 h-4 text-emerald-500" />
                          <div>
                            <span className="text-[11px] font-extrabold text-[#0f172a] uppercase tracking-wide">Analytics</span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Usage insights, performance</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${preferences.analytics ? "bg-emerald-500" : "bg-slate-200"}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${preferences.analytics ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                      </div>

                      {/* Marketing */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-[#dcdcdc]/50">
                        <div className="flex items-center gap-3">
                          <Megaphone className="w-4 h-4 text-violet-500" />
                          <div>
                            <span className="text-[11px] font-extrabold text-[#0f172a] uppercase tracking-wide">Marketing</span>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Personalized promotions</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                          className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${preferences.marketing ? "bg-violet-500" : "bg-slate-200"}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${preferences.marketing ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="px-7 py-5 bg-slate-50/50 border-t border-[#dcdcdc]/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {showDetails ? (
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-6 py-3.5 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95 cursor-pointer shadow-lg"
                >
                  Save Preferences
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRejectOptional}
                    className="flex-1 px-6 py-3.5 bg-white border border-[#dcdcdc] text-[#0f172a] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                  >
                    Necessary Only
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-6 py-3.5 bg-[#0f172a] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95 cursor-pointer shadow-lg"
                  >
                    Accept All Cookies
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
