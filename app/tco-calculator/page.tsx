"use client";
import React from "react";
import { Navigation } from "../../components/Navigation";
import { TCOCalculatorFull } from "../../components/tco/TCOCalculatorFull";

export default function TCOCalculatorPage() {
  return (
    <main className="min-h-screen">
      <div className="animated-bg" />
      <Navigation />
      <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <TCOCalculatorFull />
      </section>
    </main>
  );
}
