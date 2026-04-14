"use client";
import React, { useState } from "react";
import { Activity, Save, Eye, EyeOff, Code, Globe, BarChart3, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TrackingConfig {
  provider: string;
  trackingId: string;
  isActive: boolean;
  metadata: Record<string, string>;
}

const DEFAULT_CONFIGS: TrackingConfig[] = [
  { provider: "GOOGLE_ANALYTICS", trackingId: "G-XXXXXXXXXX", isActive: true, metadata: { domain: "selectmobilephone.com" } },
  { provider: "MATOMO", trackingId: "", isActive: false, metadata: { siteId: "1", serverUrl: "https://analytics.example.com" } },
];

export default function AdminTrackingPage() {
  const [configs, setConfigs] = useState<TrackingConfig[]>(DEFAULT_CONFIGS);

  const updateConfig = (provider: string, updates: Partial<TrackingConfig>) => {
    setConfigs(configs.map(c => c.provider === provider ? { ...c, ...updates } : c));
  };

  const updateMetadata = (provider: string, key: string, value: string) => {
    setConfigs(configs.map(c => {
      if (c.provider !== provider) return c;
      return { ...c, metadata: { ...c.metadata, [key]: value } };
    }));
  };

  const gaConfig = configs.find(c => c.provider === "GOOGLE_ANALYTICS")!;
  const matomoConfig = configs.find(c => c.provider === "MATOMO")!;

  const generateGAScript = (config: TrackingConfig) => {
    if (!config.trackingId || !config.isActive) return "<!-- Google Analytics disabled -->";
    return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${config.trackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${config.trackingId}');
</script>`;
  };

  const generateMatomoScript = (config: TrackingConfig) => {
    if (!config.trackingId || !config.isActive) return "<!-- Matomo disabled -->";
    return `<!-- Matomo -->
<script>
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="${config.metadata.serverUrl || "//analytics.example.com"}/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '${config.metadata.siteId || "1"}']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
</script>`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Tracking & Analytics Integration</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure Google Analytics and Matomo tracking scripts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Analytics */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#dcdcdc] rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#dcdcdc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-black text-[#0f172a] uppercase tracking-tight">Google Analytics</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">GA4 Measurement Protocol</p>
              </div>
            </div>
            <button
              onClick={() => updateConfig("GOOGLE_ANALYTICS", { isActive: !gaConfig.isActive })}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                gaConfig.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-[#dcdcdc]"
              }`}
            >
              {gaConfig.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {gaConfig.isActive ? "Active" : "Disabled"}
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Measurement ID</label>
              <input
                type="text"
                value={gaConfig.trackingId}
                onChange={e => updateConfig("GOOGLE_ANALYTICS", { trackingId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Domain</label>
              <input
                type="text"
                value={gaConfig.metadata.domain || ""}
                onChange={e => updateMetadata("GOOGLE_ANALYTICS", "domain", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
            </div>

            {/* Script Preview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-3 h-3 text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Script Preview</span>
              </div>
              <pre className="p-4 bg-[#0f172a] text-emerald-400 rounded-xl text-[10px] leading-relaxed overflow-x-auto font-mono">
                {generateGAScript(gaConfig)}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Matomo */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-[#dcdcdc] rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#dcdcdc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <h3 className="font-black text-[#0f172a] uppercase tracking-tight">Matomo Analytics</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Self-hosted privacy analytics</p>
              </div>
            </div>
            <button
              onClick={() => updateConfig("MATOMO", { isActive: !matomoConfig.isActive })}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                matomoConfig.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-[#dcdcdc]"
              }`}
            >
              {matomoConfig.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {matomoConfig.isActive ? "Active" : "Disabled"}
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Site ID</label>
                <input
                  type="text"
                  value={matomoConfig.metadata.siteId || ""}
                  onChange={e => updateMetadata("MATOMO", "siteId", e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tracking ID</label>
                <input
                  type="text"
                  value={matomoConfig.trackingId}
                  onChange={e => updateConfig("MATOMO", { trackingId: e.target.value })}
                  placeholder="matomo-token"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Server URL</label>
              <input
                type="text"
                value={matomoConfig.metadata.serverUrl || ""}
                onChange={e => updateMetadata("MATOMO", "serverUrl", e.target.value)}
                placeholder="https://analytics.example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-3 h-3 text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Script Preview</span>
              </div>
              <pre className="p-4 bg-[#0f172a] text-teal-400 rounded-xl text-[10px] leading-relaxed overflow-x-auto font-mono">
                {generateMatomoScript(matomoConfig)}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">How Tracking Scripts Work</p>
          <p className="text-xs text-blue-500/70">Active tracking scripts are automatically injected into the &lt;head&gt; of every public page. Changes take effect immediately after saving. Google Analytics uses GA4 measurement protocol. Matomo provides self-hosted, GDPR-compliant analytics.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg shadow-[#0f172a]/20">
          <Save className="w-3.5 h-3.5" /> Save Tracking Config
        </button>
      </div>
    </div>
  );
}
