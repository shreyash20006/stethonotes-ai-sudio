/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Sparkles, TrendingUp, Zap, HelpCircle, Activity, Award, Compass, Heart, Flame } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubjectClick: (subject: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSubjectClick
}) => {
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);

  const mockPurchasedAlerts = [
    { name: "Dr. Rahul V.", college: "AIIMS Delhi", item: "Anatomy of the Mediastinum", time: "2 mins ago" },
    { name: "Dr. Aarushi K.", college: "KGMU Lucknow", item: "High-Yield Pharmacology Mnemonics", time: "5 mins ago" },
    { name: "Dr. Simran S.", college: "MAMC New Delhi", item: "OBGYN Clinical Case Taking", time: "8 mins ago" },
    { name: "Dr. Vikas D.", college: "AFMC Pune", item: "Pathology Histopath Practical Manual", time: "11 mins ago" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % mockPurchasedAlerts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const alert = mockPurchasedAlerts[activeAlertIndex];

  return (
    <div className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-200/60 bg-transparent" id="hero-classic-console">
      
      {/* Subtle background grids */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"></div>
      
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-sky-400/10 via-indigo-400/5 to-transparent blur-3xl -z-20 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Dynamic Activity / Transaction Ticker */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white/95 px-4 py-2 text-xs shadow-sm shadow-slate-150/50 backdrop-blur-md">
            <div className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></div>
            <span className="text-slate-400 font-medium">Activity:</span>
            <span className="font-bold text-slate-800">{alert.name}</span>
            <span className="text-slate-400">({alert.college})</span>
            <span className="text-slate-400">unlocked</span>
            <span className="font-bold text-sky-700 flex items-center gap-1">
              {alert.item} <Zap className="h-3 w-3 text-amber-500 fill-amber-300" />
            </span>
            <span className="text-slate-400 text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-mono">
              {alert.time}
            </span>
          </div>
        </div>

        {/* Brand Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50/50 px-3 py-1 text-[11px] font-bold tracking-tight text-sky-800 mb-4 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-sky-500 animate-spin-slow" />
            <span>NMC GUIDELINE ALIGNED BLUEPRINTS</span>
          </div>

          <h1 className="font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-tight">
            Notes That <span className="relative inline-block"><span className="absolute -inset-1.5 -rotate-1 rounded-2xl bg-sky-500/10 opacity-70 blur-xs"></span><span className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Diagnose</span></span> Your Doubts.
          </h1>
          
          <p className="mt-5 text-sm sm:text-base text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
            Redefining medical education with elite, handwritten blueprints, high-yield clinical schematics, and active-recall templates. Audited by board gold medalists.
          </p>
        </div>

        {/* Search & Subject Filters Panel */}
        <div className="max-w-3xl mx-auto bg-white/85 backdrop-blur-md border border-slate-200 rounded-3xl p-6 shadow-xl relative z-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 text-center">Diagnostics Search Engine</span>
          
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner">
            <Search className="ml-3 h-5.5 w-5.5 text-slate-400" />
            <input
              type="text"
              placeholder="Query any symptom, concept, or author (e.g. mediastinum, GPCR, heart...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
              id="hero-search-input"
            />
            <button 
              onClick={() => {
                document.getElementById("marketplace-section")?.scrollIntoView({ behavior: "smooth" });
              }} 
              className="rounded-xl bg-slate-950 hover:bg-slate-800 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200 shrink-0"
            >
              Scan Catalog
            </button>
          </div>

          <div className="mt-5 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2.5">Jump to Subject:</span>
            <div className="inline-flex flex-wrap justify-center gap-1.5 mt-2">
              {[
                { name: "Anatomy", label: "💀 Anatomy" },
                { name: "Pharmacology", label: "💊 Pharmacology" },
                { name: "Pathology", label: "🔬 Pathology" },
                { name: "OBGYN", label: "🤰 OBGYN" },
                { name: "Pediatrics", label: "👶 Pediatrics" },
                { name: "Forensic Medicine", label: "⚖️ Forensic Medicine" }
              ].map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => {
                    onSubjectClick(sub.name);
                    document.getElementById("marketplace-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full border border-slate-200 bg-white hover:border-sky-500 hover:bg-sky-50/50 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
