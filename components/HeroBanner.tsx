"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const SLIDES = [
  {
    id: 1,
    title: "iPhone 18 Pro Preorder",
    subtitle: "Lock in your trade-in value today.",
    cta: "Join the Queue",
    desktopImg:
      "https://images.unsplash.com/photo-1652887640398-4cdef235bc0c?q=80&w=2560&auto=format&fit=crop", // abstract/premium phone vibe
    mobileImg:
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1080&auto=format&fit=crop",
    color: "from-black/80 to-transparent",
  },
  {
    id: 2,
    title: "SelectMobile MVNO + Unlocked",
    subtitle: "Stop overpaying for contracts. Save up to $800 over 24 months.",
    cta: "Calculate Savings",
    desktopImg:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2560&auto=format&fit=crop",
    mobileImg:
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=1080&auto=format&fit=crop",
    color: "from-[#04a1c6]/80 to-black/40",
  },
  {
    id: 3,
    title: "Premium Accessories",
    subtitle: "Enhance your experience with Select-Verified gear.",
    cta: "Shop Accessories",
    desktopImg:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2560&auto=format&fit=crop",
    mobileImg:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1080&auto=format&fit=crop",
    color: "from-black/90 to-transparent",
  },
];

export function HeroBanner() {
  return (
    <div className="w-[98%] max-w-[1920px] mx-auto relative group pt-2 px-2 pb-2">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] min-h-[350px] rounded-3xl overflow-hidden shadow-2xl"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="relative w-full h-full overflow-hidden"
          >
            {/* Desktop Image */}
            <div
              className="hidden md:block absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
              style={{ backgroundImage: `url(${slide.desktopImg})` }}
            />
            {/* Mobile Image */}
            <div
              className="block md:hidden absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
              style={{ backgroundImage: `url(${slide.mobileImg})` }}
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.color} md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent`}
            />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
                  className="max-w-2xl"
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 tracking-tight mb-6 leading-tight drop-shadow-2xl"
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xl md:text-3xl text-white/90 mb-10 font-light tracking-wide drop-shadow-md"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(4,161,198,0.8)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="px-10 py-4 rounded-full bg-[#04a1c6] text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(4,161,198,0.4)] backdrop-blur-md border border-[#04a1c6]/50 cursor-pointer"
                  >
                    {slide.cta}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles for Swiper elements to match our theme */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #04a1c6;
          box-shadow: 0 0 10px #04a1c6;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
