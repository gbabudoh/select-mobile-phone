"use client";
import React from "react";
import { Navigation } from "../../components/Navigation";
import { NormalOrder } from "../../components/NormalOrder";

export default function NormalOrderPage() {
  return (
    <main className="min-h-screen">
      <div className="animated-bg" />
      <Navigation />
      <div className="pt-24">
        <NormalOrder />
      </div>
    </main>
  );
}
