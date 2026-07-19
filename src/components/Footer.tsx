/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GraduationCap, Heart, Mail, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: "marketplace" | "flashcards" | "seller" | "library") => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-20" id="platform-footer">
      
      {/* Upper Footer section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("marketplace")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-150 p-1 shadow-sm">
              <img 
                src="https://res.cloudinary.com/dsqxboxoc/image/upload/v1783892715/file_00000000358871fa8e36ace7e1a4f3ab_fml8e3.png" 
                alt="StethoNotes Logo" 
                className="h-full w-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-white">
              Stetho<span className="text-sky-400">Notes</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Notes That Diagnose Your Doubts. Redefining medical EdTech with high-yield, handwritten blueprints and spaced repetition.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Mail className="h-3.5 w-3.5" />
            <span>support@stethonotes.in</span>
          </div>
        </div>

        {/* Quick Links column */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Academic Hub</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setActiveTab("marketplace")} className="hover:text-white transition-colors">
                Marketplace
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("flashcards")} className="hover:text-white transition-colors">
                Flashcard Decks
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("library")} className="hover:text-white transition-colors">
                My Vault Library
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("seller")} className="hover:text-white transition-colors">
                Creator Studio
              </button>
            </li>
          </ul>
        </div>

        {/* Credentials Column */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Quality Standards</h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>NMC Guidelines Aligned</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Gold-Medalist Audited</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>No AI-Slop Plagiarism</span>
            </li>
            <li className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-sky-400" />
              <span>MBBS / BDS / Paramedical</span>
            </li>
          </ul>
        </div>

        {/* Disclaimers Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Medical Disclaimer</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            All educational resources, notes, flowcharts, case presentation templates, and flashcards provided on StethoNotes are strictly compiled by verified medical students for preparation and study reference purposes only. They are NOT a substitute for formal professional medical diagnosis, advice, or treatment guidelines.
          </p>
        </div>

      </div>

      {/* Bottom Footer section */}
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 StethoNotes. All Rights Reserved. Crafted with love by medical students, for medical students.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> in India
          </span>
        </div>
      </div>

    </footer>
  );
};
