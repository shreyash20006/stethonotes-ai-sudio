/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  X, Star, Calendar, FileText, CheckCircle2, 
  ShoppingCart, Heart, Award, Shield, MessageSquare, AlertCircle, Sparkles, BookOpen,
  Zap, Check, Users, TrendingUp, Sparkle, Eye, ShieldCheck, Flame, BookMarked, Layers, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MedicalNote } from "../types";

interface NoteDetailsModalProps {
  note: MedicalNote;
  onClose: () => void;
  onAddToCart: (note: MedicalNote) => void;
  onInstantBuy: (note: MedicalNote) => void;
  wishlist: string[];
  onToggleWishlist: (noteId: string) => void;
}

export const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  note,
  onClose,
  onAddToCart,
  onInstantBuy,
  wishlist,
  onToggleWishlist
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "details" | "seller" | "reviews">("preview");
  const [previewPageIdx, setPreviewPageIdx] = useState(0);
  const [liveViewers, setLiveViewers] = useState(3);
  const [copiedLink, setCopiedLink] = useState(false);

  // Security DRM Protection States
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const [showScreenshotAlert, setShowScreenshotAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Security listeners to block screenshot/record mechanisms
  useEffect(() => {
    // 1. Monitor focus loss to blur the screen when snip tools or recorders open
    const handleBlur = () => {
      setIsScreenBlurred(true);
    };
    const handleFocus = () => {
      setIsScreenBlurred(false);
    };

    // 2. Intercept keyboard keys representing screenshot, print, save, DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print screen key
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        triggerAlert("Screenshot Attempt Blocked! Clipboard cleared under DMCA.");
        navigator.clipboard.writeText("STETHONOTES DRM SECURE AREA: UNAUTHORIZED SCREEN CAPTURE PREVENTED");
      }

      // Print: Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        triggerAlert("Printing is restricted on trial previews. Unlock the complete note first!");
      }

      // Save: Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        triggerAlert("Save-page is restricted. Use our secure download dashboard after purchase!");
      }

      // Inspect/DevTools hotkeys: F12, Ctrl+Shift+I, Cmd+Option+I, Cmd+Option+J, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "C" || e.key === "c" || e.key === "J" || e.key === "j")) ||
        ((e.metaKey || e.ctrlKey) && e.altKey && (e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J"))
      ) {
        e.preventDefault();
        triggerAlert("Developer Tools shortcut blocked to protect creator materials.");
      }
    };

    const triggerAlert = (msg: string) => {
      setAlertMessage(msg);
      setShowScreenshotAlert(true);
      setTimeout(() => setShowScreenshotAlert(false), 4500);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);

    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerAlert("Right-click menu disabled under StethoShield DRM.");
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // Prevent text copying/cutting
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerAlert("Content copy prohibited. Secure DRM system is active.");
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
    };
  }, []);

  // Simulate subtle random changes in live viewers to create a delightful, realistic live platform feel
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 2 ? 2 : next > 8 ? 7 : next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const isWishlisted = wishlist.includes(note.id);

  // Dynamic aesthetic themes, gradients, and custom medical sketch SVGs based on the subject
  const getSubjectTheme = (sub: string) => {
    const lowerSub = sub.toLowerCase();
    if (lowerSub.includes("anatomy")) {
      return {
        primary: "text-amber-600 bg-amber-50 border-amber-200",
        darkAccent: "text-amber-700 bg-amber-500/10 border-amber-500/20",
        accentGradient: "from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600",
        glowColor: "rgba(245, 158, 11, 0.12)",
        glowColorHex: "#f59e0b",
        badgeStyle: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/10",
        bulletColor: "text-amber-500",
        sketch: (
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500/20 stroke-current fill-none stroke-[1.5] transition-all duration-300">
            {/* Cardiac Heart Schematic drawing */}
            <path d="M50,25 C35,10 15,25 15,45 C15,65 50,85 50,85 C50,85 85,65 85,45 C85,25 65,10 50,25 Z" />
            <path d="M50,25 L50,85" strokeDasharray="3 3" />
            <circle cx="50" cy="45" r="8" />
            <path d="M35,40 C35,40 40,35 50,45" />
            <path d="M65,40 C65,40 60,35 50,45" />
            <text x="50" y="93" textAnchor="middle" className="text-[7px] font-mono font-bold tracking-wider fill-amber-500/40">Anatomy: Cor</text>
          </svg>
        )
      };
    } else if (lowerSub.includes("pharmacology") || lowerSub.includes("pharma")) {
      return {
        primary: "text-emerald-600 bg-emerald-50 border-emerald-200",
        darkAccent: "text-emerald-700 bg-emerald-500/10 border-emerald-500/20",
        accentGradient: "from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
        glowColor: "rgba(16, 185, 129, 0.12)",
        glowColorHex: "#10b981",
        badgeStyle: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/10",
        bulletColor: "text-emerald-500",
        sketch: (
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-500/20 stroke-current fill-none stroke-[1.5] transition-all duration-300">
            {/* Synaptic Cleft Neurotransmitter drawing */}
            <path d="M15,25 C30,30 45,35 50,15 C55,35 70,30 85,25" />
            <path d="M15,75 C30,70 45,65 50,85 C55,65 70,70 85,75" />
            {/* Synaptic vesicles */}
            <circle cx="35" cy="30" r="3" className="fill-emerald-500/10" />
            <circle cx="50" cy="25" r="3" className="fill-emerald-500/10" />
            <circle cx="65" cy="30" r="3" className="fill-emerald-500/10" />
            {/* Receptor sites */}
            <path d="M35,71 L35,67 M50,65 L50,61 M65,71 L65,67" strokeWidth="2" />
            {/* Receptor neurotransmitters */}
            <circle cx="35" cy="50" r="1.5" className="fill-emerald-500" />
            <circle cx="48" cy="45" r="1.5" className="fill-emerald-500" />
            <circle cx="60" cy="52" r="1.5" className="fill-emerald-500" />
            <text x="50" y="93" textAnchor="middle" className="text-[7px] font-mono font-bold tracking-wider fill-emerald-500/40">Pharma: Synapse</text>
          </svg>
        )
      };
    } else if (lowerSub.includes("pathology") || lowerSub.includes("microbiology")) {
      return {
        primary: "text-rose-600 bg-rose-50 border-rose-200",
        darkAccent: "text-rose-700 bg-rose-500/10 border-rose-500/20",
        accentGradient: "from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700",
        glowColor: "rgba(244, 63, 94, 0.12)",
        glowColorHex: "#f43f5e",
        badgeStyle: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-500/10",
        bulletColor: "text-rose-500",
        sketch: (
          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500/20 stroke-current fill-none stroke-[1.5] transition-all duration-300">
            {/* Cellular structure and pathogens */}
            <circle cx="50" cy="50" r="30" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="10" />
            {/* Cytoplasm granules */}
            <circle cx="38" cy="42" r="2" className="fill-rose-500/35" />
            <circle cx="62" cy="45" r="1.5" className="fill-rose-500/35" />
            <circle cx="45" cy="64" r="2.5" className="fill-rose-500/35" />
            {/* Extracellular bacteria */}
            <path d="M22,30 Q25,25 28,30" strokeWidth="2" />
            <path d="M78,65 Q81,60 84,65" strokeWidth="2" />
            <text x="50" y="93" textAnchor="middle" className="text-[7px] font-mono font-bold tracking-wider fill-rose-500/40">Pathology: Cell</text>
          </svg>
        )
      };
    } else if (lowerSub.includes("obgyn") || lowerSub.includes("gynaecology")) {
      return {
        primary: "text-cyan-600 bg-cyan-50 border-cyan-200",
        darkAccent: "text-cyan-700 bg-cyan-500/10 border-cyan-500/20",
        accentGradient: "from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
        glowColor: "rgba(6, 182, 212, 0.12)",
        glowColorHex: "#06b6d4",
        badgeStyle: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/10",
        bulletColor: "text-cyan-500",
        sketch: (
          <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-500/20 stroke-current fill-none stroke-[1.5] transition-all duration-300">
            {/* Chromosome / DNA helix drawing */}
            <path d="M30,20 Q50,50 70,20" />
            <path d="M30,80 Q50,50 70,80" />
            <path d="M30,50 Q50,20 70,50" />
            <line x1="38" y1="35" x2="62" y2="35" strokeDasharray="2 2" />
            <line x1="45" y1="50" x2="55" y2="50" strokeDasharray="2 2" />
            <line x1="38" y1="65" x2="62" y2="65" strokeDasharray="2 2" />
            <text x="50" y="93" textAnchor="middle" className="text-[7px] font-mono font-bold tracking-wider fill-cyan-500/40">OBGYN: Helix</text>
          </svg>
        )
      };
    } else if (lowerSub.includes("pediatrics") || lowerSub.includes("pedia")) {
      return {
        primary: "text-violet-600 bg-violet-50 border-violet-200",
        darkAccent: "text-violet-700 bg-violet-500/10 border-violet-500/20",
        accentGradient: "from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700",
        glowColor: "rgba(139, 92, 246, 0.12)",
        glowColorHex: "#8b5cf6",
        badgeStyle: "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-violet-500/10",
        bulletColor: "text-violet-500",
        sketch: (
          <svg viewBox="0 0 100 100" className="w-full h-full text-violet-500/20 stroke-current fill-none stroke-[1.5] transition-all duration-300">
            {/* Growth & Development chart schematic */}
            <path d="M15,85 L85,85 M15,85 L15,15" strokeWidth="2" />
            <path d="M15,85 Q40,65 55,40 T85,20" strokeWidth="2" />
            <path d="M15,85 Q40,75 60,55 T85,35" strokeDasharray="3 2" />
            <line x1="55" y1="40" x2="55" y2="85" strokeDasharray="2 2" />
            <line x1="15" y1="40" x2="55" y2="40" strokeDasharray="2 2" />
            <text x="50" y="93" textAnchor="middle" className="text-[7px] font-mono font-bold tracking-wider fill-violet-500/40">Pedia: Growth Percentile</text>
          </svg>
        )
      };
    } else {
      return {
        primary: "text-sky-600 bg-sky-50 border-sky-200",
        darkAccent: "text-sky-700 bg-sky-500/10 border-sky-500/20",
        accentGradient: "from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700",
        glowColor: "rgba(14, 165, 233, 0.12)",
        glowColorHex: "#0ea5e9",
        badgeStyle: "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/10",
        bulletColor: "text-sky-500",
        sketch: (
          <svg viewBox="0 0 100 100" className="w-full h-full text-sky-500/20 stroke-current fill-none stroke-[1.5] transition-all duration-300">
            {/* Clinical stethoscope drawing */}
            <circle cx="50" cy="30" r="12" />
            <path d="M38,30 C38,50 62,50 62,30" />
            <path d="M50,42 L50,75" />
            <circle cx="50" cy="80" r="5" className="fill-sky-500/10" />
            <text x="50" y="93" textAnchor="middle" className="text-[7px] font-mono font-bold tracking-wider fill-sky-500/40">Clinical: Auscultate</text>
          </svg>
        )
      };
    }
  };

  const theme = getSubjectTheme(note.subject);

  const copyProductLink = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(`${window.location.origin}/?note=${note.id}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const reviewStats = {
    average: note.rating,
    totalCount: note.reviewCount,
    fiveStar: Math.floor(note.reviewCount * 0.90),
    fourStar: Math.ceil(note.reviewCount * 0.08),
    threeStar: Math.floor(note.reviewCount * 0.02),
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6" 
      id="note-details-modal"
    >
      {/* Immersive background ambient glow matched to subject colors */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700" 
        style={{
          background: `radial-gradient(circle at 50% 25%, ${theme.glowColor} 0%, rgba(15, 23, 42, 0) 80%)`
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 190 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100/80"
      >
        
        {/* Top Header Navigation Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase border tracking-wider shadow-xs transition-colors ${theme.primary}`}>
              {note.subject}
            </span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {note.year} Curriculum
            </span>
            <div className="hidden sm:flex h-4 w-px bg-slate-200"></div>
            <span className="hidden sm:flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
              {note.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyProductLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-xs active:scale-95 transition-all"
              id="modal-share-btn"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
              <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
            </button>
            <button
              onClick={() => onToggleWishlist(note.id)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-xs active:scale-95 transition-all duration-200"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              id="modal-wishlist-toggle"
            >
              <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-rose-500 text-rose-500 stroke-rose-500" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-xs active:scale-95 transition-all duration-200"
              id="modal-close-btn"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Core Split Content Area */}
        <div className="flex-1 overflow-y-auto lg:grid lg:grid-cols-12">
          
          {/* LEFT COLUMN: Main interactive tabs and detail views (col-span-8) */}
          <div className="lg:col-span-8 border-r border-slate-100 p-6 sm:p-8 flex flex-col min-h-0 bg-white">
            
            {/* Notes Primary Title and High-Yield Highlights Header */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 mb-1.5 text-sky-600 font-mono text-[10px] font-black tracking-widest uppercase">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-sky-500" />
                NMC Syllabus Compliant & Peer Reviewed Blueprint
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-slate-900 leading-tight">
                {note.title}
              </h1>
              
              {/* Star reviews quick rating & purchase indicators */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-3.5 mt-3">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-lg">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-extrabold text-amber-9ab">{note.rating}</span>
                </div>
                <span className="text-xs text-slate-500 font-bold">
                  ({note.reviewCount} Verified Student Reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {note.downloads}+ Active Activations
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
                  <Flame className="h-3 w-3" />
                  {liveViewers} peers viewing right now
                </span>
              </div>
            </div>

            {/* Custom Tabbed Navigation Bar */}
            <div className="flex border-b border-slate-100 gap-2 mb-6 overflow-x-auto scrollbar-none" id="modal-tabs">
              {[
                { id: "preview", label: `Interactive Book Preview (${note.samplePages?.length || 1} Sheets)` },
                { id: "details", label: "NMC Specs & Syllabus" },
                { id: "seller", label: "Author Verification & Bio" },
                { id: "reviews", label: `Student Reviews (${note.reviews?.length || 0})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3.5 text-xs font-bold relative transition-all px-3 shrink-0 ${
                    activeTab === tab.id
                      ? "text-slate-950 font-extrabold"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                  id={`tab-${tab.id}`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabIndicator" 
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-slate-950 rounded-full" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Dynamic Content Panels */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                
                {/* TAB 1: INTERACTIVE PREVIEW */}
                {activeTab === "preview" && (
                  <motion.div
                    key="preview-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                    id="preview-tab-content"
                  >
                    {/* Clean Cover Photo / Sheet Container */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white transition-all duration-300 select-none print-hidden min-h-[380px]">
                      
                      {/* Interactive Repeating Anti-Piracy Watermark Grid */}
                      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.04] flex flex-wrap justify-center items-center gap-12 z-10 font-mono text-[9px] font-bold text-slate-800 rotate-[-15deg] scale-110">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="whitespace-nowrap select-none">
                            STETHONOTES DRM • sb108750@gmail.com • IP DETECTED • NO COPY
                          </div>
                        ))}
                      </div>

                      {/* Top-aligned watermark block */}
                      <div className="absolute top-2.5 right-4 text-[7px] font-mono font-bold text-slate-300 tracking-widest select-none pointer-events-none uppercase z-10">
                        STUDENT ACADEMIC PREVIEW ONLY • WATERMARKED
                      </div>

                      {/* Display either coverImage (if on first page and coverImage exists) or sample HTML */}
                      {note.coverImage && previewPageIdx === 0 ? (
                        <div className="relative w-full h-[380px] bg-slate-900 flex items-center justify-center overflow-hidden">
                          <img 
                            src={note.coverImage} 
                            alt={note.title} 
                            className="w-full h-full object-cover opacity-85"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                            <span className="text-[10px] font-bold tracking-wider uppercase text-sky-400 mb-1">{note.subject} STUDY GUIDE</span>
                            <h3 className="text-lg font-black font-display leading-tight">{note.title}</h3>
                            <p className="text-xs text-slate-300 mt-1">{note.pages} Premium Sheets • Verified by Peer Authors</p>
                          </div>
                        </div>
                      ) : (
                        /* Preview Content Insert - render the styled sample page directly */
                        <div className="relative z-10 font-sans text-slate-800 text-xs sm:text-sm select-none pointer-events-none">
                          <div dangerouslySetInnerHTML={{ __html: note.samplePages?.[previewPageIdx] || "" }} />
                        </div>
                      )}

                      {/* Interactive Paper Watermark overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/85 to-transparent h-28 flex items-end justify-center pb-4 z-10 pointer-events-none">
                        <span className="text-[9px] font-mono font-black tracking-widest uppercase text-slate-400 bg-white border border-slate-200 shadow-xs px-3.5 py-1.5 rounded-full pointer-events-auto">
                          STETHONOTES DIRECT DOWNLOAD DIGITAL COPY
                        </span>
                      </div>

                      {/* StethoShield Blur Overlay */}
                      {isScreenBlurred && (
                        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center select-none">
                          <Shield className="h-10 w-10 text-sky-400 animate-pulse mb-3" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            StethoShield Security Active
                          </h4>
                          <p className="text-[10px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                            Content blurred to protect intellectual rights. Click back inside the window to resume reading.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pagination Controls */}
                    {note.samplePages && note.samplePages.length > 1 && (
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[11px] text-slate-500 font-bold font-mono">
                          Showing preview page {previewPageIdx + 1} of {note.samplePages.length}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {note.samplePages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setPreviewPageIdx(idx)}
                              className={`h-2.5 rounded-full transition-all duration-300 ${
                                previewPageIdx === idx ? "w-7 bg-slate-950" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                              }`}
                              aria-label={`Go to preview page ${idx + 1}`}
                            ></button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Watermark Notice */}
                    <div className="flex items-start gap-3 rounded-2xl bg-amber-50/50 border border-amber-100 p-4 text-xs text-amber-900 shadow-xs">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-amber-950 flex items-center gap-1">
                          NMC Standards Confirmed Preview
                        </span>
                        <p className="text-[11px] text-amber-900/80 mt-1 leading-relaxed">
                          This is a hand-annotated excerpt matching the core syllabus criteria. When purchased, you'll instantly unlock high-definition, un-watermarked printable digital sheets with complete chapter indexes, custom mnemonics lists, and study companion cards.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: HIGHLIGHTS & SPECS */}
                {activeTab === "details" && (
                  <motion.div
                    key="details-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                    id="details-tab-content"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                      
                      {/* Main Syllabus Description */}
                      <div className="md:col-span-7 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                            <BookMarked className="h-4 w-4 text-slate-500" />
                            Syllabus Overview
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4">
                            {note.description}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex items-center gap-3 bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                          <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide block">100% Core Competency Guaranteed</span>
                            <span className="text-[10px] text-slate-500 block">Formulated with current textbooks (Bailey & Love, Gray's, KDT)</span>
                          </div>
                        </div>
                      </div>

                      {/* Syllabus compliance radar list */}
                      <div className="md:col-span-5 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-2">
                            <Sparkle className="h-3.5 w-3.5 animate-pulse" />
                            Academic Yield stats
                          </div>
                          <span className="text-sm font-extrabold block mb-4">Conformity Metrics</span>
                          
                          <div className="space-y-3">
                            {[
                              { label: "NMC Curriculum Fit", val: 100 },
                              { label: "High-Yield Schema Density", val: 95 },
                              { label: "Theory-Answer Accuracy", val: 98 },
                              { label: "Mnemonics & Shortcuts", val: 90 }
                            ].map((met) => (
                              <div key={met.label} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-300">
                                  <span>{met.label}</span>
                                  <span className="font-mono text-sky-400">{met.val}%</span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-sky-500" style={{ width: `${met.val}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-[9px] text-slate-400 font-mono mt-4 text-center border-t border-slate-800/60 pt-3">
                          NMC SECTION ALIGNMENT ID: {note.id.toUpperCase()}
                        </div>
                      </div>

                    </div>

                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-slate-500" />
                        Exclusive Core Chapter Keys Included
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {note.highlights?.map((highlight, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-2.5 text-xs text-slate-700 bg-white border border-slate-100 rounded-xl p-3 hover:border-slate-200 hover:shadow-xs transition duration-200"
                          >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                            <span className="leading-relaxed font-medium">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                      <div className="bg-slate-50/70 rounded-xl border border-slate-100 p-3.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Notebook Sheets</span>
                        <span className="text-sm font-black text-slate-900 block mt-1">{note.pages} Printable Pages</span>
                      </div>
                      <div className="bg-slate-50/70 rounded-xl border border-slate-100 p-3.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Diagram count</span>
                        <span className="text-sm font-black text-slate-900 block mt-1">{note.diagramCount || 4} HD Schematics</span>
                      </div>
                      <div className="bg-slate-50/70 rounded-xl border border-slate-100 p-3.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Format Category</span>
                        <span className="text-sm font-black text-slate-900 block mt-1 truncate">{note.category}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: CREATOR PROFILE */}
                {activeTab === "seller" && (
                  <motion.div
                    key="seller-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-5"
                    id="seller-tab-content"
                  >
                    {/* Professional Creator Profile Card */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-slate-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
                      
                      {/* Ambient background accent bubble */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-full blur-3xl opacity-20 -mr-12 -mt-12 pointer-events-none" />

                      <div className="relative">
                        <img
                          src={note.author.avatar}
                          alt={note.author.name}
                          className="h-16 w-16 rounded-2xl border-2 border-white/20 bg-slate-900 shadow-md object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-sky-500 text-white p-1 rounded-lg border-2 border-slate-950">
                          <ShieldCheck className="h-3.5 w-3.5 fill-white text-sky-500" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                          <h4 className="text-base font-bold font-display tracking-tight flex items-center justify-center sm:justify-start gap-1">
                            {note.author.name}
                          </h4>
                          <span className="inline-flex self-center items-center gap-1 rounded bg-sky-500/10 border border-sky-400/25 px-2 py-0.5 text-[9px] font-bold text-sky-400 tracking-wider uppercase">
                            Verified Academic Expert
                          </span>
                        </div>
                        <span className="text-xs text-sky-300 font-bold block">{note.author.university}</span>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 pt-1 border-t border-white/10 mt-2">
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-400" />
                            <span>{note.author.rating} Peer Rating</span>
                          </div>
                          <span className="text-white/10">•</span>
                          <span className="text-xs text-slate-300 font-semibold">{note.author.salesCount || 100}+ Copies Distributed</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Creator Bio & Mission</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-slate-50 rounded-xl border border-slate-100 p-4">
                        {note.author.bio}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-sky-50/10 p-4.5 flex items-start gap-3">
                      <Shield className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-sky-950 block">StethoNotes Quality Seal</span>
                        <p className="text-[11px] text-sky-900/80 mt-1 leading-relaxed">
                          This author has officially uploaded their proof of university enrollment and board credentials. Content is systematically audited for correctness against the newest curricula under our zero-error mandate.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: STUDENT REVIEWS */}
                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                    id="reviews-tab-content"
                  >
                    {/* Rating Distribution Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 rounded-2xl border border-slate-200/50 p-5 items-center">
                      <div className="text-center md:border-r md:border-slate-200 pr-2">
                        <span className="text-3xl font-extrabold text-slate-900 block font-mono">
                          {reviewStats.average}
                        </span>
                        <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mt-2.5">
                          Verified Peer Reviews ({reviewStats.totalCount})
                        </span>
                      </div>

                      <div className="col-span-2 space-y-1.5 text-xs">
                        {[
                          { stars: 5, percentage: 92, count: reviewStats.fiveStar },
                          { stars: 4, percentage: 6, count: reviewStats.fourStar },
                          { stars: 3, percentage: 2, count: reviewStats.threeStar }
                        ].map((row) => (
                          <div key={row.stars} className="flex items-center gap-3">
                            <span className="w-2.5 font-bold font-mono text-slate-600 text-right">{row.stars}</span>
                            <Star className="h-3 w-3 fill-slate-400 text-slate-400 shrink-0" />
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.percentage}%` }} />
                            </div>
                            <span className="w-8 text-[11px] font-bold text-slate-500 text-right font-mono">{row.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review list */}
                    <div className="space-y-3.5">
                      {note.reviews?.map((rev) => (
                        <div key={rev.id} className="border border-slate-100 bg-white shadow-xs p-4.5 rounded-2xl flex flex-col gap-2.5 hover:border-slate-200 transition">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={rev.userAvatar}
                                alt={rev.userName}
                                className="h-8 w-8 rounded-full border border-slate-200 object-cover bg-slate-50"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">{rev.userName}</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <div className="flex items-center">
                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    ))}
                                    {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 text-slate-200" />
                                    ))}
                                  </div>
                                  {rev.verifiedPurchase && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Verified Buyer</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold font-mono">{rev.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed italic pl-2 border-l-2 border-slate-200">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Checkout Sidebar Action Box (col-span-4) */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between h-full border-t lg:border-t-0 border-slate-100 min-h-[480px]">
            <div className="space-y-5">
              <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                Active Student Enrollment
              </div>
              
              {/* Premium Direct Purchase Box card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Single License Pricing</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black font-mono text-slate-900">₹{note.price}</span>
                    <span className="text-xs font-semibold text-slate-400 line-through font-mono">₹{note.originalPrice}</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded ml-auto">50% DISCOUNT</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex items-start gap-2.5 text-slate-700 text-xs font-semibold">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-sky-50 text-sky-600 shrink-0 mt-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>HD printable, non-watermarked PDF files</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-700 text-xs font-semibold">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-sky-50 text-sky-600 shrink-0 mt-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>Synced in offline library companion</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-700 text-xs font-semibold">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-sky-50 text-sky-600 shrink-0 mt-0.5">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>Free lifetime updates and board keys</span>
                  </div>
                </div>

                {/* Direct Checkout CTA Buttons */}
                <div className="space-y-3.5 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onInstantBuy(note)}
                    className={`w-full rounded-xl bg-gradient-to-r ${theme.accentGradient} py-3 text-xs font-black text-white shadow-md shadow-sky-600/10 transition-all flex items-center justify-center gap-2`}
                    id="modal-unlock-btn"
                  >
                    <Zap className="h-4 w-4 text-amber-300 fill-amber-300 animate-pulse" />
                    <span>Instant Unlock with Cashfree</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onAddToCart(note)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    id="modal-add-to-cart-btn"
                  >
                    <ShoppingCart className="h-4 w-4 text-slate-500" />
                    <span>Add To Cart Basket</span>
                  </motion.button>
                </div>

                {/* Accepted Gateways info */}
                <div className="text-center pt-1 border-t border-slate-100/60 mt-3">
                  <span className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">Secure Payment Gateways</span>
                  <div className="flex items-center justify-center gap-2 mt-1.5 opacity-65">
                    {["UPI", "GPay", "PhonePe", "Paytm", "Cards"].map((p) => (
                      <span key={p} className="text-[8px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Safe Escrow Trust Badges */}
            <div className="mt-6 border-t border-slate-200/50 pt-4 space-y-2.5 bg-white/40 p-3.5 rounded-xl border border-slate-150">
              <div className="flex items-start gap-2 text-[10px] text-slate-500 font-semibold">
                <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[8px]">Encrypted Processing</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Secure checkout under PCI-DSS standards. Real-time access key generation.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-[10px] text-slate-500 font-semibold">
                <BookOpen className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[8px]">Official Compliance</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Materials curated by peer toppers in absolute conformity with NMC guidelines.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Dynamic StethoShield Anti-Piracy Threat Alert */}
      <AnimatePresence>
        {showScreenshotAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md border border-rose-500/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-white max-w-sm"
          >
            <Shield className="h-6 w-6 text-rose-400 shrink-0 animate-bounce" />
            <div className="text-left">
              <span className="text-xs font-black text-rose-300 uppercase block tracking-wider">StethoShield DRM Shield</span>
              <span className="text-[11px] text-rose-100 font-medium block mt-0.5">{alertMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
