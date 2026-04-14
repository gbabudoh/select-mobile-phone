"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "../components/Navigation";
import {
  Calculator,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Search,
  BadgeCheck,
  Truck,
  Star,
} from "lucide-react";
import { HeroBanner } from "../components/HeroBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="animated-bg" />
      <Navigation />

      {/* Hero Banner Section */}
      <section className="relative w-full pt-24 pb-12 overflow-hidden">
        <HeroBanner />
      </section>

      {/* Stats Bar */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "50K+", label: "Devices Sold" },
            { value: "$4.2M", label: "Saved by Buyers" },
            { value: "98%", label: "Escrow Success Rate" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel rounded-2xl p-5 text-center border border-white/10"
            >
              <p className="text-3xl font-extrabold text-[#04a1c6]">{stat.value}</p>
              <p className="text-sm text-foreground/60 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Built for smarter mobile buying
          </h2>
          <p className="text-foreground/60 text-lg max-w-xl mx-auto">
            Every tool you need to buy, sell, and switch — without the guesswork.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<Calculator className="w-8 h-8 text-[#04a1c6]" />}
            title="Compare & Save"
            description="See the real cost of carrier contracts vs. buying unlocked. Our calculator breaks down 24-month savings so you always know what you're actually paying."
            href="/tco-calculator"
            cta="Run the numbers"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-[#04a1c6]" />}
            title="Verified Escrow Protection"
            description="Every transaction is backed by a 50-point remote diagnostic check. Funds are held in escrow until the IMEI is verified and your SIM activates successfully."
            href="/escrow-policy"
            cta="How escrow works"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-[#04a1c6]" />}
            title="Instant eSIM Activation"
            description="No waiting for a physical SIM in the mail. Get activated at the point of purchase — whether you're a consumer or a business buying in bulk."
            href="/normal-order"
            cta="Shop unlocked phones"
          />
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#04a1c6]/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-foreground/60 text-lg max-w-xl mx-auto">
              From browsing to activated — in four simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: <Search className="w-6 h-6 text-[#04a1c6]" />,
                title: "Find your device",
                desc: "Browse verified listings or use the AI Guide to find the right phone for your needs and budget.",
              },
              {
                step: "02",
                icon: <Calculator className="w-6 h-6 text-[#04a1c6]" />,
                title: "Compare real costs",
                desc: "Run the cost calculator to see carrier contract vs. unlocked savings over 24 months.",
              },
              {
                step: "03",
                icon: <BadgeCheck className="w-6 h-6 text-[#04a1c6]" />,
                title: "Buy with escrow",
                desc: "Your payment is held securely. Funds only release after IMEI verification and SIM activation.",
              },
              {
                step: "04",
                icon: <Zap className="w-6 h-6 text-[#04a1c6]" />,
                title: "Activate instantly",
                desc: "Get your eSIM provisioned on the spot — no shipping delays, no waiting.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#04a1c6]/10 border border-[#04a1c6]/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-black text-[#04a1c6] bg-white border border-[#04a1c6]/20 rounded-full w-5 h-5 flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Why buyers choose Select Mobile
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 text-[#04a1c6]" />,
              title: "50-Point Diagnostics",
              desc: "Every device is remotely checked before funds are released.",
            },
            {
              icon: <RefreshCw className="w-6 h-6 text-[#04a1c6]" />,
              title: "Hassle-Free Trade-In",
              desc: "Get a fair quote, ship your old device, and receive credit instantly.",
            },
            {
              icon: <Truck className="w-6 h-6 text-[#04a1c6]" />,
              title: "Fast Shipping",
              desc: "Orders dispatched within 24 hours. Track every step of the way.",
            },
            {
              icon: <Star className="w-6 h-6 text-[#04a1c6]" />,
              title: "4.9 Star Reviews",
              desc: "Thousands of verified buyers across the US and Canada trust us.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#04a1c6]/10 border border-[#04a1c6]/20 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto glass-panel rounded-3xl p-12 text-center border border-[#04a1c6]/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#04a1c6]/10 to-transparent pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10">
            Ready to pay less and get more?
          </h2>
          <p className="text-foreground/60 text-lg mb-8 max-w-xl mx-auto relative z-10">
            Join thousands of buyers who have ditched overpriced contracts and switched to smarter mobile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/register">
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(4,161,198,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#04a1c6] text-white font-bold text-lg shadow-[0_0_20px_rgba(4,161,198,0.4)] cursor-pointer"
              >
                Get started free <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
            <Link href="/tco-calculator">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#04a1c6]/40 text-[#04a1c6] font-bold text-lg cursor-pointer hover:bg-[#04a1c6]/5 transition-colors"
              >
                Calculate my savings
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(4,161,198,0.15)" }}
      className="glass-panel p-8 rounded-3xl flex flex-col gap-5 border border-white/10 transition-shadow duration-300 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#04a1c6]/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-4 bg-[#04a1c6]/10 rounded-2xl w-fit relative z-10 border border-[#04a1c6]/20">
        {icon}
      </div>
      <h3 className="text-2xl font-bold tracking-tight relative z-10">{title}</h3>
      <p className="text-foreground/70 leading-relaxed relative z-10 text-lg flex-1">{description}</p>
      <Link href={href} className="relative z-10">
        <span className="inline-flex items-center gap-1 text-[#04a1c6] font-semibold text-sm hover:gap-2 transition-all">
          {cta} <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </motion.div>
  );
}
