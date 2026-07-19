/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, Star, Calendar, Download, FileText, CheckCircle2, 
  ShoppingCart, Heart, Award, Shield, MessageSquare, AlertCircle, Sparkles, BookOpen
} from "lucide-react";
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

  const isWishlisted = wishlist.includes(note.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" id="note-details-modal">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700 uppercase border border-sky-100">
              {note.subject}
            </span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-500">{note.year} Curriculum</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(note.id)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all duration-200"
              id="modal-wishlist-toggle"
            >
              <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
              id="modal-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Core Body */}
        <div className="flex-1 overflow-y-auto lg:grid lg:grid-cols-3">
          
          {/* Left / Middle: Tabs & Content (col-span-2) */}
          <div className="lg:col-span-2 border-r border-slate-100 p-6 flex flex-col">
            
            {/* Notes Primary Titles */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-950 leading-tight">
                {note.title}
              </h1>
              
              {/* Star reviews quick rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-900">{note.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({note.reviewCount} Verified Reviews)</span>
                <div className="h-3 w-px bg-slate-200"></div>
                <span className="text-xs text-sky-600 font-semibold">{note.downloads}+ Purchased downloads</span>
              </div>
            </div>

            {/* Premium Tab Navigation buttons */}
            <div className="flex border-b border-slate-100 gap-1.5 mb-6" id="modal-tabs">
              <button
                onClick={() => setActiveTab("preview")}
                className={`pb-3 text-xs font-bold relative transition-all px-2 ${
                  activeTab === "preview"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-slate-400 hover:text-slate-900"
                }`}
                id="tab-preview"
              >
                Interactive Preview ({note.samplePages.length} Pages)
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-3 text-xs font-bold relative transition-all px-2 ${
                  activeTab === "details"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-slate-400 hover:text-slate-900"
                }`}
                id="tab-details"
              >
                Highlights & Details
              </button>
              <button
                onClick={() => setActiveTab("seller")}
                className={`pb-3 text-xs font-bold relative transition-all px-2 ${
                  activeTab === "seller"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-slate-400 hover:text-slate-900"
                }`}
                id="tab-seller"
              >
                Verified Creator
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 text-xs font-bold relative transition-all px-2 ${
                  activeTab === "reviews"
                    ? "text-sky-600 border-b-2 border-sky-600"
                    : "text-slate-400 hover:text-slate-900"
                }`}
                id="tab-reviews"
              >
                Reviews ({note.reviews.length})
              </button>
            </div>

            {/* Dynamic Content Switching */}
            <div className="flex-1">
              
              {/* Tab: Preview */}
              {activeTab === "preview" && (
                <div className="space-y-4" id="preview-tab-content">
                  <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 relative min-h-[300px]">
                    
                    {/* Simulated paper view */}
                    <div className="relative">
                      <div dangerouslySetInnerHTML={{ __html: note.samplePages[previewPageIdx] || "" }} />
                      
                      {/* Interactive Paper Watermark overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent h-24 flex items-end justify-center pb-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                          STETHONOTES WATERMARK PREVIEW
                        </span>
                      </div>
                    </div>

                    {/* Pagination indicators */}
                    {note.samplePages.length > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-200/40">
                        {note.samplePages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPreviewPageIdx(idx)}
                            className={`h-2 w-8 rounded-full transition-all ${
                              previewPageIdx === idx ? "bg-sky-600" : "bg-slate-300 hover:bg-slate-400"
                            }`}
                          ></button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Watermark notice */}
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/70 border border-amber-100 p-3.5 text-xs text-amber-800">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Watermarked Demonstration Pages</span>
                      <p className="text-[11px] text-amber-900/80 mt-0.5">
                        These are selected high-yield pages of the notebook. Upon checkout, you will receive full, non-watermarked ultra-HD PDF files, complete with printable files and device compatibility keys.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Details */}
              {activeTab === "details" && (
                <div className="space-y-6" id="details-tab-content">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">Deep Overview</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">{note.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">Key Highlights Included</h3>
                    <ul className="mt-3 space-y-2.5">
                      {note.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                    <div className="bg-slate-50/50 rounded-xl border border-slate-200/60 p-3 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-sky-600" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Size</span>
                        <span className="text-xs font-bold text-slate-900">{note.pages} Fully Drafted Pages</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl border border-slate-200/60 p-3 flex items-center gap-3">
                      <Award className="h-5 w-5 text-indigo-600" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Diagrams</span>
                        <span className="text-xs font-bold text-slate-900">{note.diagramCount} High-yield Sketches</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Seller */}
              {activeTab === "seller" && (
                <div className="space-y-5" id="seller-tab-content">
                  <div className="flex items-start gap-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 p-5">
                    <img
                      src={note.author.avatar}
                      alt={note.author.name}
                      className="h-16 w-16 rounded-full border border-slate-200 bg-white"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        {note.author.name}
                        {note.author.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 fill-sky-50" />
                        )}
                      </h4>
                      <span className="text-xs font-semibold text-sky-600 block">{note.author.university}</span>
                      <div className="flex items-center gap-2.5 mt-2">
                        <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          <span>{note.author.rating}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-medium text-slate-500">{note.author.salesCount}+ Sales</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Creator Bio</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">{note.author.bio}</p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-sky-50/30 p-4">
                    <div className="flex items-center gap-2 text-sky-800">
                      <Shield className="h-4.5 w-4.5 text-sky-600" />
                      <span className="text-xs font-bold">StethoNotes Verified Creator Promise</span>
                    </div>
                    <p className="text-[11px] text-sky-900/80 mt-1 leading-relaxed">
                      This creator is verified with official MBBS academic credentials, past board grades audits, and maintains an average review score of &gt;4.5 stars. 100% genuine syllabus mapping.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-4" id="reviews-tab-content">
                  {note.reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="h-8 w-8 rounded-full border border-slate-100 bg-slate-50"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{rev.userName}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                              {rev.verifiedPurchase && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Verified Student</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2.5 pl-10">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Right: Checkout Sidebar panel */}
          <div className="p-6 bg-slate-50/60 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Direct Purchase</h3>
              
              {/* Pricing Cards */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
                <span className="text-xs font-medium text-slate-400">Exclusive Academic Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-950">₹{note.price}</span>
                  <span className="text-sm font-medium text-slate-400 line-through font-mono">₹{note.originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">50% OFF</span>
                </div>

                <div className="border-t border-slate-100 my-4 pt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-slate-600 text-[11px] font-medium">
                    <CheckCircle2 className="h-4 w-4 text-sky-600" />
                    <span>Instant high-definition printable PDF</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-[11px] font-medium">
                    <CheckCircle2 className="h-4 w-4 text-sky-600" />
                    <span>Synced in "My Library" companion app</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-[11px] font-medium">
                    <CheckCircle2 className="h-4 w-4 text-sky-600" />
                    <span>Lifetime updates and additions</span>
                  </div>
                </div>

                {/* Primary CTA Action Buttons */}
                <div className="space-y-2.5 mt-4">
                  <button
                    onClick={() => onInstantBuy(note)}
                    className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:from-sky-500 hover:to-indigo-500 transition-all duration-200 flex items-center justify-center gap-1.5"
                    id="modal-unlock-btn"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300 fill-amber-400" />
                    <span>Unlock Instantly</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(note)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-1.5"
                    id="modal-add-to-cart-btn"
                  >
                    <ShoppingCart className="h-4 w-4 text-slate-500" />
                    <span>Add To Cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Security Seals */}
            <div className="mt-6 border-t border-slate-200/60 pt-5 space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Secure 256-bit encrypted checkout with UPI & Cards</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <BookOpen className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>Official NMC Guidelines Aligned Syllabus</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
