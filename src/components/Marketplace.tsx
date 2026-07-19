/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Filter, Star, Download, Eye, Tag, FileText, ShoppingCart, 
  Sparkles, CheckCircle2, ChevronRight, Info, Heart, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MedicalNote } from "../types";
import { getNoteDegree } from "./DegreePrograms";

interface MarketplaceProps {
  notes: MedicalNote[];
  onSelectNote: (note: MedicalNote) => void;
  onAddToCart: (note: MedicalNote, e: React.MouseEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlist: string[];
  onToggleWishlist: (noteId: string) => void;
  selectedDegree: string;
  setSelectedDegree: (degree: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  notes,
  onSelectNote,
  onAddToCart,
  searchQuery,
  setSearchQuery,
  wishlist,
  onToggleWishlist,
  selectedDegree,
  setSelectedDegree
}) => {
  // Advanced Filter states
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Subject list extracted dynamically
  const subjects = ["All", ...Array.from(new Set(notes.map((n) => n.subject)))];
  const categories = ["All", ...Array.from(new Set(notes.map((n) => n.category)))];
  const years = ["All", ...Array.from(new Set(notes.map((n) => n.year)))];

  // Filter & Sort logic
  const filteredNotes = notes
    .filter((note) => {
      const matchSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        note.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchYear = selectedYear === "All" || note.year === selectedYear;
      const matchSubject = selectedSubject === "All" || note.subject === selectedSubject;
      const matchCategory = selectedCategory === "All" || note.category === selectedCategory;
      const matchDegree = selectedDegree === "All" || getNoteDegree(note) === selectedDegree;

      return matchSearch && matchYear && matchSubject && matchCategory && matchDegree;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.downloads - a.downloads; // "popular" default
    });

  // Get color styles for medical subjects
  const getSubjectColorStyles = (sub: string) => {
    switch (sub.toLowerCase()) {
      case "anatomy":
        return "from-amber-400 to-amber-500 bg-amber-50 text-amber-700 border-amber-200/50";
      case "pharmacology":
        return "from-emerald-400 to-emerald-500 bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "pathology":
        return "from-rose-400 to-rose-500 bg-rose-50 text-rose-700 border-rose-200/50";
      case "obgyn":
        return "from-cyan-400 to-cyan-500 bg-cyan-50 text-cyan-700 border-cyan-200/50";
      case "pediatrics":
        return "from-violet-400 to-violet-500 bg-violet-50 text-violet-700 border-violet-200/50";
      case "forensic medicine":
        return "from-slate-400 to-slate-500 bg-slate-50 text-slate-700 border-slate-200/50";
      case "mbbs":
        return "from-sky-400 to-sky-500 bg-sky-50 text-sky-700 border-sky-200/50";
      case "bams":
        return "from-emerald-400 to-emerald-500 bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "bhms":
        return "from-teal-400 to-teal-500 bg-teal-50 text-teal-700 border-teal-200/50";
      case "bpt":
        return "from-orange-400 to-orange-500 bg-orange-50 text-orange-700 border-orange-200/50";
      case "bsc nursing":
        return "from-pink-400 to-pink-500 bg-pink-50 text-pink-700 border-pink-200/50";
      case "bds":
        return "from-indigo-400 to-indigo-500 bg-indigo-50 text-indigo-700 border-indigo-200/50";
      default:
        return "from-sky-400 to-sky-500 bg-sky-50 text-sky-700 border-sky-200/50";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="marketplace-section">
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        
        {/* Left Side: Advanced Filter Panel */}
        <aside className="hidden lg:block lg:col-span-1" id="filter-sidebar">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100/50">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <Filter className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase font-display">Filters</h3>
              {(selectedYear !== "All" || selectedSubject !== "All" || selectedCategory !== "All" || selectedDegree !== "All") && (
                <button
                  onClick={() => {
                    setSelectedYear("All");
                    setSelectedSubject("All");
                    setSelectedCategory("All");
                    setSelectedDegree("All");
                  }}
                  className="ml-auto text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Group: Prof / Year */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">College Prof / Year</label>
              <div className="space-y-1.5">
                {years.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      selectedYear === yr
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{yr === "All" ? "All Proffs" : yr}</span>
                    {selectedYear === yr && <div className="h-1.5 w-1.5 rounded-full bg-sky-400"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Subject */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">High Yield Subjects</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      selectedSubject === sub
                        ? "bg-sky-50 text-sky-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{sub}</span>
                    {selectedSubject === sub && <div className="h-1.5 w-1.5 rounded-full bg-sky-600"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Category */}
            <div className="mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Material Type</label>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{cat === "All" ? "All Formats" : cat}</span>
                    {selectedCategory === cat && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Side: Main Grid Area */}
        <main className="lg:col-span-3">
          
          {/* Top Sorting Bar & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-8">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold font-display text-slate-950">
                Premium Clinical study assets
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Showing {filteredNotes.length} curated resources matching your curriculum
              </p>
            </div>
            
            {/* Sort Toggle & Small Screens Filter Toggles */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
              </select>
            </div>
          </div>

          {/* Quick Stats Banner */}
          {filteredNotes.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center" id="no-notes-fallback">
              <Info className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="mt-4 text-sm font-bold text-slate-900">No medical resources found</h3>
              <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your filters or search keywords. We have notebooks uploaded daily by elite creators!
              </p>
              <button
                onClick={() => {
                  setSelectedYear("All");
                  setSelectedSubject("All");
                  setSelectedCategory("All");
                  setSelectedDegree("All");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all duration-200"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* The Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="notes-grid-container">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => {
                const colorStyle = getSubjectColorStyles(note.subject);
                const isWishlisted = wishlist.includes(note.id);

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    key={note.id}
                    onClick={() => onSelectNote(note)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm hover:shadow-xl hover:border-sky-500/55 transition-all duration-300 cursor-pointer"
                    id={`note-card-${note.id}`}
                  >
                  {/* Card Thumbnail / Header - simulated handwritten blueprint */}
                  <div className="relative h-44 overflow-hidden border-b border-slate-100 bg-slate-50 p-4 flex flex-col justify-between select-none">
                    
                    {/* Floating top bar tags */}
                    <div className="flex items-center justify-between z-10">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-tight uppercase border ${
                        note.coverImage 
                          ? "bg-slate-950/80 text-white border-slate-700/60 backdrop-blur-md" 
                          : `${colorStyle.split(" ")[2]} ${colorStyle.split(" ")[3]} ${colorStyle.split(" ")[4]}`
                      }`}>
                        {note.subject}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(note.id);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow-sm text-slate-400 hover:text-rose-500 hover:scale-105 transition-all duration-200"
                        id={`wishlist-toggle-${note.id}`}
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                      </button>
                    </div>

                    {note.coverImage ? (
                      <div className="absolute inset-0 z-0 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {/* Blurred background version of the cover image for deep premium feel */}
                        <img 
                          src={note.coverImage} 
                          alt="" 
                          className="absolute inset-0 h-full w-full object-cover blur-md opacity-30 scale-110 pointer-events-none select-none"
                          referrerPolicy="no-referrer"
                        />
                        {/* 100% visible, non-cropped high definition cover photo */}
                        <img 
                          src={note.coverImage} 
                          alt={note.title} 
                          className="h-full max-h-full object-contain z-10 group-hover:scale-105 transition-all duration-500 relative"
                          referrerPolicy="no-referrer"
                        />
                        {/* Elegant dark gradient overlay to guarantee text readability inside headers */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-slate-950/25 z-0"></div>
                      </div>
                    ) : (
                      /* Simulated handwritten style diagram background */
                      <div className="absolute inset-0 opacity-15 group-hover:scale-105 group-hover:opacity-20 transition-all duration-500 p-2">
                        <svg viewBox="0 0 100 80" className="w-full h-full text-slate-600">
                          {/* Anatomy heart outline pattern or general note lines */}
                          <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
                          <line x1="10" y1="35" x2="90" y2="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
                          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
                          <line x1="10" y1="65" x2="90" y2="65" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
                          
                          {note.subject === "Anatomy" && (
                            <circle cx="50" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.75" />
                          )}
                          {note.subject === "Pharmacology" && (
                            <path d="M40 25 H60 V55 H40 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
                          )}
                          {note.subject === "Pathology" && (
                            <circle cx="45" cy="40" r="10" fill="none" stroke="currentColor" strokeWidth="0.75" />
                          )}
                        </svg>
                      </div>
                    )}

                    {/* Quick Stats overlays */}
                    <div className="flex items-center justify-between z-10">
                      <span className="flex items-center gap-1 rounded bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white">
                        <Layers className="h-3 w-3 text-sky-400" />
                        {note.pages} Pages
                      </span>
                      <span className="flex items-center gap-0.5 rounded bg-amber-500/90 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white">
                        <Star className="h-3 w-3 fill-white text-white" />
                        {note.rating}
                      </span>
                    </div>

                  </div>

                  {/* Card Metadata Details */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Prof & Category indicators */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{note.year}</span>
                        <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{note.category}</span>
                      </div>

                      {/* Note Title */}
                      <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors duration-200">
                        {note.title}
                      </h4>

                      {/* Author credentials */}
                      <div className="flex items-center gap-2 mt-3">
                        <img
                          src={note.author.avatar}
                          alt={note.author.name}
                          className="h-6 w-6 rounded-full border border-slate-100 bg-slate-50"
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] font-semibold text-slate-800 flex items-center gap-0.5">
                            {note.author.name}
                            {note.author.verified && (
                              <CheckCircle2 className="h-3 w-3 text-sky-600 fill-sky-50" />
                            )}
                          </span>
                          <span className="text-[9px] text-slate-400 truncate">{note.author.university}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Add to Cart Section */}
                    <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through font-mono">₹{note.originalPrice}</span>
                        <span className="text-base font-extrabold text-slate-950 font-mono flex items-center">
                          ₹{note.price}
                        </span>
                      </div>

                      {/* Direct action button */}
                      <button
                        onClick={(e) => onAddToCart(note, e)}
                        className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-slate-700 hover:bg-sky-600 hover:border-sky-600 hover:text-white transition-all duration-200 shadow-sm"
                        id={`add-to-cart-quick-${note.id}`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </main>
      </div>
    </div>
  );
};
