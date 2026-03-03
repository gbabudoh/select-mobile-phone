import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Select Mobile | The Intelligent Mobile Marketplace",
  description: "Beyond simple buying. Compare, Preorder, and Experience Intentional Indulgence.",
  icons: {
    icon: '/favicon.png',
  },
};

import { CartProvider } from "../context/CartContext";
import { Footer } from "../components/Footer";
import { SessionProvider } from "../components/SessionProvider";
import { CookieBanner } from "../components/CookieBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            {children}
            <Footer />
            <CookieBanner />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
