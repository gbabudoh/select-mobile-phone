"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, ShieldAlert, Plus, Mail, ShieldCheck, 
  Trash2, Loader2, X, CheckCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminTeamPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Admin created successfully!");
        setNewAdmin({ name: "", email: "", password: "" });
        setTimeout(() => {
          setShowAddModal(false);
          setSuccess("");
          fetchAdmins();
        }, 1500);
      } else {
        setError(data.error || "Failed to create admin");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  if (!isSuperAdmin && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-black text-[#0f172a] uppercase">Access Denied</h1>
        <p className="text-slate-400 mt-2">Only Super Admins can manage the admin team.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tight">Admin Team</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage platform administrators and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Admin
        </button>
      </div>

      <div className="bg-white border border-[#dcdcdc] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#dcdcdc]">
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Admin</th>
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Role</th>
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                <th className="text-right px-5 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-[#04a1c6] animate-spin mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading admins...</p>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">No admins found.</td>
                </tr>
              ) : (
                admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-sm border border-orange-100 shadow-sm shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-[#0f172a]">{admin.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        admin.role === "SUPER_ADMIN" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {admin.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {admin.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {admin.role !== "SUPER_ADMIN" && (
                        <button className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#dcdcdc]"
            >
              <div className="p-6 border-b border-[#dcdcdc] flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-black text-lg text-[#0f172a] uppercase tracking-tight">Add New Admin</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Create a basic admin account</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-[#0f172a] transition-all cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-[10px] font-bold uppercase tracking-widest">
                    <ShieldAlert className="w-4 h-4" /> {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                    <CheckCircle className="w-4 h-4" /> {success}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdmin.name}
                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
                    placeholder="admin@selectmobilephone.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newAdmin.password}
                    onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#dcdcdc] rounded-xl text-sm font-bold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/20 focus:border-[#04a1c6] transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#04a1c6] transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    {submitting ? "Creating..." : "Create Admin Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
