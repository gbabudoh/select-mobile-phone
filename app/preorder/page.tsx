"use client";
import React from "react";
import { Navigation } from "../../components/Navigation";
import { PreorderEngine } from "../../components/PreorderEngine";

export default function PreorderPage() {
  return (
    <main className="min-h-screen">
      <div className="animated-bg" />
      <Navigation />
      <div className="pt-24">
        <PreorderEngine />
      </div>
    </main>
  );
}
