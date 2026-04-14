"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

interface TrackingConfig {
  id: string;
  provider: "GOOGLE_ANALYTICS" | "MATOMO";
  trackingId: string;
  isActive: boolean;
  metadata?: { url?: string };
}

export function TrackingScripts() {
  const pathname = usePathname();
  const [configs, setConfigs] = useState<TrackingConfig[]>([]);

  useEffect(() => {
    // Only fetch on client
    fetch("/api/admin/tracking")
      .then(res => res.json())
      .then(data => {
        if (data.configs) {
          setConfigs(data.configs.filter((c: TrackingConfig) => c.isActive));
        }
      })
      .catch(err => console.error("Tracking fetch error:", err));
  }, []);

  if (configs.length === 0) return null;

  return (
    <>
      {configs.map(config => {
        if (config.provider === "GOOGLE_ANALYTICS") {
          return (
            <React.Fragment key={config.id}>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${config.trackingId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.trackingId}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </React.Fragment>
          );
        }
        
        if (config.provider === "MATOMO") {
          return (
            <Script key={config.id} id="matomo-tracking" strategy="afterInteractive">
              {`
                var _paq = window._paq = window._paq || [];
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                  var u="${config.metadata?.url || 'https://analytics.example.com/'}";
                  _paq.push(['setTrackerUrl', u+'matomo.php']);
                  _paq.push(['setSiteId', '${config.trackingId}']);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                })();
              `}
            </Script>
          );
        }
        
        return null;
      })}
    </>
  );
}
