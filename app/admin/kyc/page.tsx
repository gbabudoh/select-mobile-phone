"use client";
import React, { useState } from "react";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Download,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock KYC Queue Data ---
const MOCK_KYC = [
  { 
    id: "KYC-942", 
    userId: "USR-003", 
    userName: "Ahmed Hassan", 
    type: "PASSPORT", 
    country: "US", 
    submitted: "2 hours ago", 
    status: "PENDING", 
    docUrl: "https://example.com/passport_preview.jpg" 
  },
  { 
    id: "KYC-881", 
    userId: "USR-005", 
    userName: "Elena Rodriguez", 
    type: "BUSINESS_INCORPORATION", 
    country: "US", 
    submitted: "5 hours ago", 
    status: "REJECTED", 
    docUrl: "https://example.com/inc_preview.jpg" 
  },
  { 
    id: "KYC-721", 
    userId: "USR-009", 
    userName: "Javier Garcia", 
    type: "SSN", 
    country: "CA", 
    submitted: "1 day ago", 
    status: "PENDING", 
    docUrl: "https://example.com/ssn_preview.jpg" 
  },
];

export default function AdminKycPage() {
  const [selectedKyc, setSelectedKyc] = useState<typeof MOCK_KYC[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">KYC Verification Queue</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review identity documents for USA & Canada sellers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-[#0f172a] uppercase tracking-widest">Pending Documents</h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black">{MOCK_KYC.filter(k => k.status === "PENDING").length}</span>
          </div>
          {MOCK_KYC.map((kyc) => (
            <motion.div
              key={kyc.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedKyc(kyc)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedKyc?.id === kyc.id 
                  ? "bg-white border-[#04a1c6] shadow-lg shadow-[#04a1c6]/5" 
                  : "bg-white border-[#dcdcdc] hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                  kyc.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                }`}>
                  {kyc.status}
                </span>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {kyc.submitted}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-[#0f172a] mb-1">{kyc.userName}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <FileText className="w-3 h-3" /> {kyc.type.replace("_", " ")}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedKyc ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#dcdcdc] rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-[#dcdcdc] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center font-black text-xl">
                    {selectedKyc.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#0f172a] uppercase tracking-tight">{selectedKyc.userName}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User ID: {selectedKyc.userId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-slate-50 border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] transition-all cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-3 bg-slate-50 border border-[#dcdcdc] rounded-xl text-slate-400 hover:text-[#0f172a] transition-all cursor-pointer">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <DocStat label="Document Type" value={selectedKyc.type.replace("_", " ")} />
                    <DocStat label="Issuing Region" value={selectedKyc.country} />
                    <DocStat label="Submission ID" value={selectedKyc.id} />
                    <DocStat label="Received At" value={selectedKyc.submitted} />
                  </div>
                  
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                    <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verification Checklist
                    </h4>
                    <ul className="space-y-2">
                      <CheckItem label="Name matches account profile" checked />
                      <CheckItem label="Document is not expired" checked />
                      <CheckItem label="Image clarity acceptable" checked />
                      <CheckItem label="No signs of digital tampering" />
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Preview</h4>
                  <div className="aspect-[4/3] bg-slate-100 rounded-2xl border border-[#dcdcdc] flex flex-col items-center justify-center relative group overflow-hidden">
                    <FileText className="w-12 h-12 text-slate-300 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure View Enabled</p>
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-6 py-3 bg-white text-[#0f172a] rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl cursor-pointer">View full document</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-[#dcdcdc] flex items-center justify-between gap-4">
                <button className="flex-1 py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all cursor-pointer shadow-sm">
                  <XCircle className="w-4 h-4 inline mr-2" /> Reject Submission
                </button>
                <button className="flex-1 py-4 bg-[#0f172a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-xl shadow-[#0f172a]/20">
                  <CheckCircle className="w-4 h-4 inline mr-2" /> Verify & Activate
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed border-[#dcdcdc] rounded-3xl flex flex-col items-center justify-center text-center p-12">
              <Eye className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="font-extrabold text-[#0f172a] mb-2 uppercase tracking-wide">Select a submission</h3>
              <p className="text-[11px] font-bold text-slate-400 max-w-xs uppercase tracking-widest">Pick a KYC request from the left panel to begin auditing their documents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-extrabold text-[#0f172a] uppercase">{value}</p>
    </div>
  );
}

function CheckItem({ label, checked = false }: { label: string; checked?: boolean }) {
  return (
    <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight ${checked ? "text-blue-600" : "text-slate-400"}`}>
      {checked ? <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-300" />}
      {label}
    </li>
  );
}
