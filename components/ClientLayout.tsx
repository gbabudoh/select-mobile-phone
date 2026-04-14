"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { TrackingScripts } from "@/components/TrackingScripts";
import { DynamicSEO } from "@/components/DynamicSEO";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes that should NOT show the marketplace navigation/footer
  const MINIMAL_ROUTES = [
    "/login",
    "/register",
    "/forgot-password",
    "/admin",
    "/dashboard",
    "/buyer",
    "/individual",
    "/retailer",
    "/wholesaler",
    "/network-provider",
  ];

  const isMinimal = MINIMAL_ROUTES.some((route) => 
    pathname === route || pathname.startsWith(route + "/")
  );

  return (
    <>
      <TrackingScripts />
      <DynamicSEO />
      {children}
      {!isMinimal && (
        <>
          <Footer />
          <CookieBanner />
        </>
      )}
    </>
  );
}
