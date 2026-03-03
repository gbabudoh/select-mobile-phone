"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const NAV_COLS = [
  {
    heading: "Marketplace",
    links: [
      { label: "Normal Order", href: "/normal-order" },
      { label: "Preorder Engine", href: "/preorder" },
      { label: "TCO Calculator", href: "/tco-calculator" },
      { label: "Trade-In", href: "/trade-in" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/help-center" },
      { label: "Escrow Policy", href: "/escrow-policy" },
      { label: "Shipping Info", href: "/shipping-info" },
      { label: "Returns", href: "/returns" },
    ],
  },
];

const SOCIALS = [
  {
    label: "X (Twitter)",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname ? (
    pathname.startsWith("/buyer/dashboard") || 
    pathname.startsWith("/retailer/dashboard") || 
    pathname.startsWith("/wholesaler/dashboard") || 
    pathname.startsWith("/network-provider/dashboard") || 
    pathname.startsWith("/individual/dashboard")
  ) : false;

  if (isDashboard) return null;

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Animated gradient top border */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #04a1c6 30%, #04a1c6 70%, transparent 100%)",
        }}
      />

      <div className="bg-[#f1f5f9] text-[#0f172a]/70 relative">
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#04a1c6]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#04a1c6]/3 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="max-w-7xl mx-auto px-6 pt-16 pb-10 relative z-10"
        >
          {/* Top row: brand + nav columns */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            {/* Brand block — spans 2 cols */}
            <motion.div variants={fadeUp} className="md:col-span-2 space-y-5">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Select Mobile"
                  width={160}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <p className="text-sm leading-relaxed text-[#0f172a]/50 max-w-xs">
                The intelligent mobile marketplace. Compare, preorder, and
                experience intentional indulgence across the US and Canada.
              </p>

              {/* Social row */}
              <div className="flex gap-3 pt-2">
                {SOCIALS.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    whileHover={{ scale: 1.15, backgroundColor: "rgba(4,161,198,0.12)" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full border border-[#0f172a]/10 flex items-center justify-center text-[#0f172a]/40 hover:text-[#04a1c6] transition-colors cursor-pointer"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Nav columns */}
            {NAV_COLS.map((col) => (
              <motion.div key={col.heading} variants={fadeUp} className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]/30">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#0f172a]/50 hover:text-[#04a1c6] transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#0f172a]/5" />

          {/* Bottom bar */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-[#0f172a]/30"
          >
            <p>&copy; 2026 Select Mobile Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-[#04a1c6] transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[#04a1c6] transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-[#04a1c6] transition-colors">Cookies</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
