"use client";
import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { Calculator, ShieldCheck, Zap } from "lucide-react";
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

      {/* TCO & Features Preview */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<Calculator className="w-8 h-8 text-[#04a1c6]" />}
            title="TCO Calculator"
            description="Our AI breaks down Carrier Contracts vs. Unlocked + BYOP so you know the true cost over 24 months."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-[#04a1c6]" />}
            title="Select-Verified Escrow"
            description="50-point remote diagnostic check and Escrow payments. Funds held until IMEI matches and SIM activates."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-[#04a1c6]" />}
            title="Embedded eSIM Provisioning"
            description="No waiting for mail. Instant activation across B2B and consumer devices at the point of purchase."
          />
        </motion.div>
      </section>


    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(4,161,198,0.15)" }}
      className="glass-panel p-8 rounded-3xl flex flex-col gap-5 border border-white/10 transition-shadow duration-300 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#04a1c6]/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-4 bg-[#04a1c6]/10 rounded-2xl w-fit relative z-10 border border-[#04a1c6]/20">
        {icon}
      </div>
      <h3 className="text-2xl font-bold tracking-tight relative z-10">{title}</h3>
      <p className="text-foreground/70 leading-relaxed relative z-10 text-lg">
        {description}
      </p>
    </motion.div>
  );
}
