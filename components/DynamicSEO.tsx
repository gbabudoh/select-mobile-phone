"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
interface SEOConfig {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robotsDirective?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
}

export function DynamicSEO() {
  const pathname = usePathname();
  const [seo, setSeo] = useState<SEOConfig | null>(null);

  useEffect(() => {
    // We can either fetch specific page SEO or a list
    // Fetching by path is cleaner for runtime
    fetch(`/api/admin/seo?pagePath=${encodeURIComponent(pathname)}`)
      .then(res => res.json())
      .then(data => {
        if (data.seo) setSeo(data.seo);
      })
      .catch(err => console.error("SEO fetch error:", err));
  }, [pathname]);

  if (!seo) return null;

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description || ""} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.ogTitle || seo.title} />
      <meta property="og:description" content={seo.ogDescription || seo.description} />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      
      {/* Robots */}
      <meta name="robots" content={seo.robotsDirective || "index,follow"} />
      
      {/* Canonical */}
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      
      {/* Structured Data */}
      {seo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData) }}
        />
      )}
    </>
  );
}
