"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, Plus, Search, Filter, X, ShieldCheck,
  Tag, DollarSign, CheckCircle2, Edit3, Trash2, Eye,
  Building2, Globe, AlertTriangle, Check, Layers, Image as ImageIcon,
  Upload, Camera, ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface RetailerListing {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  condition: string;
  status: "ACTIVE" | "PENDING" | "SOLD";
  image: string;
  images?: string[];
  views: number;
  likes: number;
  createdAt: string;
  imei?: string;
  country: "US" | "CA" | "US/CA";
}

const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop";

export default function RetailerListingsPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<RetailerListing[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SOLD">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Apple");
  const [category, setCategory] = useState("HANDSET");
  const [condition, setCondition] = useState("New");
  const [price, setPrice] = useState("");
  const [imei, setImei] = useState("");
  const [country, setCountry] = useState<"US" | "CA" | "US/CA">("US/CA");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const filteredListings = listings.filter((item) => {
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.condition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setPrice("");
    setImei("");
    setDescription("");
    setUploadedImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const remainingSlots = 4 - uploadedImages.length;

    if (remainingSlots <= 0) {
      showToast("Maximum 4 images allowed per retailer listing.");
      return;
    }

    const filesToProcess = fileList.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUploadedImages((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, reader.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      showToast("Please enter a device title and price.");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const primaryImage = uploadedImages[0] || DEFAULT_PLACEHOLDER;

    const newListing: RetailerListing = {
      id: `rtl-${Date.now().toString().slice(-4)}`,
      title,
      brand,
      category,
      price: Number(price),
      condition,
      status: "ACTIVE",
      image: primaryImage,
      images: uploadedImages.length > 0 ? uploadedImages : [DEFAULT_PLACEHOLDER],
      views: 1,
      likes: 0,
      createdAt: new Date().toISOString().split("T")[0],
      imei: imei || undefined,
      country,
    };

    setListings((prev) => [newListing, ...prev]);
    setSubmitting(false);
    handleCloseModal();
    showToast(`Retailer Listing "${title}" created successfully!`);
  };

  const handleDeleteListing = (id: string, itemTitle: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    showToast(`Removed "${itemTitle}" from retailer listings.`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-[#0f172a] text-white shadow-2xl border border-white/20 flex items-center gap-3 text-xs font-bold pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4 text-[#04a1c6]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Link 
        href="/retailer/dashboard" 
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-[#04a1c6] transition-colors uppercase tracking-widest gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Retailer Hub
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Retail Store Inventory &amp; Listings</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Publish verified retail products across US &amp; Canadian regional buyer channels.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#04a1c6] text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#0390b0] transition-all cursor-pointer shadow-lg shadow-[#04a1c6]/30 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Retail Listing
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search retail store listings..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#04a1c6]/30"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["ALL", "ACTIVE", "SOLD"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                statusFilter === st
                  ? "bg-[#0f172a] text-white border-[#0f172a] shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md ${
                      item.status === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-slate-700 text-white"
                    }`}>
                      {item.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-black text-slate-700 shadow-sm border border-white">
                      {item.condition}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[9px] font-black text-white shadow-sm border border-white/20">
                      {item.country === "US/CA" ? "🇺🇸🇨🇦 US & CA" : item.country === "US" ? "🇺🇸 US" : "🇨🇦 CA"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#04a1c6]">{item.brand}</span>
                    <span className="text-[10px] font-bold text-slate-400">Listed {item.createdAt}</span>
                  </div>

                  <h3 className="font-extrabold text-[#0f172a] text-base leading-snug line-clamp-2">{item.title}</h3>

                  {item.imei && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <ShieldCheck className="w-3 h-3 text-[#04a1c6]" /> IMEI: {item.imei}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                    <span>👁️ {item.views} views</span>
                    <span>❤️ {item.likes} saves</span>
                    {item.images && item.images.length > 1 && (
                      <span className="text-[#04a1c6] font-bold">🖼️ {item.images.length} photos</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Price</span>
                  <span className="text-2xl font-black text-[#0f172a]">${item.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/product/${item.id}`} className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#04a1c6] hover:text-white transition-colors cursor-pointer" title="View Listing">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDeleteListing(item.id, item.title)} 
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 p-16 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-[#0f172a]">No retail store listings active</h3>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            List smartphones, tablets, or store accessories to target verified cross-border buyers instantly.
          </p>
          <button
            onClick={handleOpenModal}
            className="px-8 py-3.5 bg-[#04a1c6] text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#0390b0] cursor-pointer shadow-lg shadow-[#04a1c6]/30 transition-all active:scale-95"
          >
            Create Retail Listing
          </button>
        </div>
      )}

      {/* ── Create Retail Listing Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-7 md:p-9 shadow-2xl relative border border-white/50 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#04a1c6]/10 text-[#04a1c6] flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0f172a]">Create Retail Listing</h3>
                    <p className="text-xs text-slate-500 font-medium">Publish a verified retail store item</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Product Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Galaxy S26 Ultra 512GB - Titanium Silver"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#04a1c6]/30 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["Apple", "Samsung", "Google", "OnePlus", "Nothing", "Motorola"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      {["New", "Certified Pre-Owned", "Refurbished", "Used — Like New", "Good", "Fair"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Retail Price ($)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 1199"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#04a1c6]/30 focus:outline-none"
                    />
                  </div>

                  {/* Region Selector */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Target Shipping Region</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value as "US" | "CA" | "US/CA")}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="US/CA">🇺🇸🇨🇦 US &amp; Canada (Cross-Border)</option>
                      <option value="US">🇺🇸 United States Only</option>
                      <option value="CA">🇨🇦 Canada Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Device IMEI Number (Optional)</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={imei}
                    onChange={(e) => setImei(e.target.value.replace(/\D/g, ""))}
                    placeholder="15-digit device IMEI number"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                {/* ── Custom Image Upload Section (Max 4 Photos) ── */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#04a1c6]" /> Product Photos (Maximum 4 Images)
                    </label>
                    <span className="text-[10px] font-black text-[#04a1c6]">
                      {uploadedImages.length} / 4 Uploaded
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedImages.map((imgSrc, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                        <Image src={imgSrc} alt={`Retail upload ${idx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-500 transition-colors shadow-md cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-900/70 text-[8px] font-black text-white uppercase">
                          {idx === 0 ? "Main" : `#${idx + 1}`}
                        </span>
                      </div>
                    ))}

                    {uploadedImages.length < 4 && (
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#04a1c6] bg-slate-50/50 hover:bg-[#04a1c6]/5 transition-all flex flex-col items-center justify-center cursor-pointer text-center p-2 group">
                        <div className="w-9 h-9 rounded-xl bg-white text-[#04a1c6] flex items-center justify-center shadow-sm mb-1 group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-slate-700">Upload Photo</span>
                        <span className="text-[8px] font-bold text-slate-400">PNG, JPG, WEBP</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Description &amp; Store Guarantee</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details on store warranty, original box contents, battery percentage..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-[#04a1c6] text-white font-black text-xs uppercase tracking-wider hover:bg-[#0390b0] transition-all shadow-xl shadow-[#04a1c6]/30 cursor-pointer active:scale-95 mt-4"
                >
                  {submitting ? "Publishing Retail Listing..." : "Publish Retail Listing"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
