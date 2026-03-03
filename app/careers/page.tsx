"use client";
import React from "react";
import {
  Briefcase, MapPin, Clock, ArrowRight,
  Heart, Zap, Globe, Code2,
  Users, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navigation } from "../../components/Navigation";

const openRoles = [
  { title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote (US/CA)", type: "Full-time", desc: "Build the next generation of our marketplace platform using Next.js, TypeScript, and Prisma." },
  { title: "AI/ML Engineer — Mobile Guide", team: "AI & Data", location: "New York, NY", type: "Full-time", desc: "Design and train the AI recommendation engine that powers personalized device and plan suggestions." },
  { title: "Product Designer (Senior)", team: "Design", location: "Remote (US/CA)", type: "Full-time", desc: "Craft premium, high-fidelity interfaces for buyer, seller, and network provider experiences." },
  { title: "DevOps / Platform Engineer", team: "Infrastructure", location: "Remote (US)", type: "Full-time", desc: "Scale our cloud infrastructure, eSIM provisioning pipelines, and CI/CD systems." },
  { title: "Partnership Manager — MVNOs", team: "Business Dev", location: "Arlington, VA", type: "Full-time", desc: "Build relationships with mobile virtual network operators and negotiate carrier agreements." },
  { title: "Customer Success Lead", team: "Operations", location: "Remote (US/CA)", type: "Full-time", desc: "Onboard and support retailers and wholesalers joining the Select Mobile ecosystem." },
];

const perks = [
  { icon: Heart, title: "Health & Wellness", desc: "Full medical, dental, vision. $150/mo wellness stipend." },
  { icon: Zap, title: "Latest Devices", desc: "Annual device allowance — test what we sell." },
  { icon: Globe, title: "Remote-First", desc: "Work from anywhere in the US or Canada." },
  { icon: Code2, title: "Growth Budget", desc: "$3K/yr for conferences, courses, and books." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white antialiased font-sans">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-32 pb-24">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full mb-6">
              <Briefcase className="w-4 h-4 text-violet-500" />
              <span className="text-[11px] font-black text-violet-600 uppercase tracking-widest">Careers at Select Mobile</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] tracking-tight mb-6 leading-[0.9]">
              Build The Future<br />of <span className="text-violet-500">Mobile Commerce</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Join a team of builders, designers, and operators who are creating the most intelligent mobile marketplace in North America.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 border-y border-[#dcdcdc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-center">
                <div className="p-3 bg-violet-50 rounded-2xl w-fit mx-auto mb-3">
                  <perk.icon className="w-5 h-5 text-violet-500" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wide mb-1">{perk.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Open Positions</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tight mt-3 mb-2">{openRoles.length} Roles Available</h2>
            <p className="text-slate-500 font-medium">Find your next chapter with us.</p>
          </div>
          <div className="space-y-4">
            {openRoles.map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="p-6 bg-white border border-[#dcdcdc] rounded-2xl hover:shadow-lg hover:border-violet-100 transition-all group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0f172a] uppercase tracking-wide group-hover:text-violet-600 transition-colors">{role.title}</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{role.desc}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Users className="w-3 h-3" /> {role.team}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin className="w-3 h-3" /> {role.location}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {role.type}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-violet-600 transition-all">
                      Apply <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Sparkles className="w-8 h-8 text-violet-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">Don&apos;t See Your Role?</h2>
          <p className="text-slate-500 font-medium mb-8">We&apos;re always looking for exceptional talent. Send us your resume and we&apos;ll keep you in mind.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-violet-600 transition-all shadow-lg active:scale-95">
            Get In Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
