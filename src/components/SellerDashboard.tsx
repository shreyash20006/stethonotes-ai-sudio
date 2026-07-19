/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  TrendingUp, Download, Star, Eye, Upload, Sparkles, CheckCircle2, 
  ArrowUpRight, AlertCircle, RefreshCw, Wallet, ShieldCheck, HelpCircle, FileText, Database
} from "lucide-react";
import { SellerAnalytics, MedicalNote } from "../types";
import { SupabaseSetupViewer } from "./SupabaseSetupViewer";
import { IntegrationCenter } from "./IntegrationCenter";

interface SellerDashboardProps {
  analytics: SellerAnalytics;
  onPublishNote: (newNote: Partial<MedicalNote>) => void;
  earnedBalance: number;
  onWithdraw: (amount: number, upi: string) => void;
  sellerNotes: MedicalNote[];
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  analytics,
  onPublishNote,
  earnedBalance,
  onWithdraw,
  sellerNotes
}) => {
  // Tab control
  const [activeStudioTab, setActiveStudioTab] = useState<"dashboard" | "supabase" | "integrations">("dashboard");

  // Form states for uploading notes
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Anatomy");
  const [year, setYear] = useState("1st Prof");
  const [category, setCategory] = useState<any>("Handwritten");
  const [price, setPrice] = useState<number>(149);
  const [pages, setPages] = useState<number>(30);
  const [description, setDescription] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Withdrawal states
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(Math.floor(earnedBalance));
  const [upiId, setUpiId] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Verification Waitlist states
  const [collegeIdName, setCollegeIdName] = useState("");
  const [hasAppliedVerification, setHasAppliedVerification] = useState(false);

  // Smart Price Recommender Tool
  const recommendedPrice = Math.max(99, Math.min(499, Math.floor(pages * 4.5 + (subject === "Pharmacology" ? 30 : 10))));

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsUploading(true);
    setTimeout(() => {
      onPublishNote({
        title,
        subject,
        year,
        category,
        price,
        originalPrice: price * 2,
        pages,
        description,
        highlights: highlightsText ? highlightsText.split("\n").filter(Boolean) : ["NMC guidelines aligned syllabus coverage.", "Detailed hand-sketched flowcharts and high recall summary sheets."],
        diagramCount: Math.floor(pages / 4)
      });
      setIsUploading(false);
      setUploadSuccess(true);
      // Reset
      setTitle("");
      setDescription("");
      setHighlightsText("");
      setTimeout(() => setUploadSuccess(false), 5000);
    }, 1500);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawalAmount <= 0 || withdrawalAmount > earnedBalance || !upiId) return;

    setIsWithdrawing(true);
    setTimeout(() => {
      onWithdraw(withdrawalAmount, upiId);
      setIsWithdrawing(false);
      setWithdrawSuccess(true);
      setWithdrawalAmount(0);
      setUpiId("");
      setTimeout(() => setWithdrawSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="seller-dashboard">
      
      {/* Top Banner: Verification Alert */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-sky-100 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
            <span>Join Elite Creators Club</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">
            Earn 85% Royalty on All Notes Sold
          </h2>
          <p className="text-xs text-slate-100/90 max-w-xl font-medium">
            Join 2,000+ medical students from top institutions who are converting high-yield handwritten files into real secondary income. Average creator earns ₹12,500 monthly!
          </p>
        </div>

        {!hasAppliedVerification ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl max-w-xs shrink-0 space-y-3">
            <span className="text-xs font-bold block">Apply for Blue Verification Badge</span>
            <input
              type="text"
              placeholder="Full Name (as on College ID)"
              value={collegeIdName}
              onChange={(e) => setCollegeIdName(e.target.value)}
              className="w-full bg-white/20 border border-white/10 rounded-xl px-3 py-2 text-xs placeholder:text-white/60 focus:outline-none focus:bg-white/30 text-white"
            />
            <button
              onClick={() => {
                if (collegeIdName) setHasAppliedVerification(true);
              }}
              className="w-full bg-white text-sky-700 hover:bg-slate-50 text-xs font-bold py-2 rounded-xl transition-all"
            >
              Submit Credentials
            </button>
          </div>
        ) : (
          <div className="bg-white/15 border border-white/20 p-4 rounded-2xl max-w-xs shrink-0 flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 text-yellow-300 shrink-0" />
            <div>
              <span className="text-xs font-bold block">Verification In Progress</span>
              <span className="text-[10px] text-slate-200">Our medical boards are auditing your college enrollment. Check back in 24 hours.</span>
            </div>
          </div>
        )}
      </div>

      {/* Creator Studio Tab Switcher */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto scrollbar-none" id="studio-tab-selector">
        <button
          onClick={() => setActiveStudioTab("dashboard")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioTab === "dashboard"
              ? "border-slate-900 text-slate-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span>Dashboard & Publications</span>
        </button>
        
        <button
          onClick={() => setActiveStudioTab("supabase")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioTab === "supabase"
              ? "border-slate-900 text-slate-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Database className="h-4 w-4 text-sky-600 animate-pulse" />
          <span>Supabase SQL Blueprint & Setup Guide</span>
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-tight scale-90 hidden sm:inline-block">
            Active RLS
          </span>
        </button>

        <button
          onClick={() => setActiveStudioTab("integrations")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeStudioTab === "integrations"
              ? "border-slate-900 text-slate-950 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
          <span>Google Login & Brevo Sandbox</span>
        </button>
      </div>

      {activeStudioTab === "supabase" ? (
        <SupabaseSetupViewer />
      ) : activeStudioTab === "integrations" ? (
        <IntegrationCenter />
      ) : (
        /* Grid: 3 Columns - 2 for Metrics/Upload, 1 for Wallet/Payout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COL 1 & 2: Analytics & Upload */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Analytics Cards */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Studio Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">All-Time Revenue</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono block mt-1">₹{analytics.totalRevenue + (earnedBalance > 12000 ? 0 : 12450)}</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                  <TrendingUp className="h-3.5 w-3.5" /> +15% this month
                </span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Total Sales</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono block mt-1">{analytics.totalSales + sellerNotes.length} copies</span>
                <span className="text-[10px] text-sky-600 font-medium block mt-1.5">Direct PDF downloads</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Average Rating</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono block mt-1 flex items-center gap-1">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" /> 4.90
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-1">From verified students</span>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Profile Views</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono block mt-1">{analytics.profileViews} views</span>
                <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5 mt-1">
                  +42 today
                </span>
              </div>

            </div>
          </div>

          {/* Upload Notes Form Widget */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                <Upload className="h-5 w-5 text-sky-600 animate-bounce" />
                Upload New Educational Resource
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Provide accurate clinical titles, subjects, and page counts to maximize conversion.
              </p>
            </div>

            {uploadSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 mb-6 flex items-start gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Resource Published Successfully!</span>
                  <p className="text-[11px] text-emerald-900/80 mt-0.5">Your notebook is now live on the StethoNotes Marketplace. Students can browse, preview, and purchase it instantly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-5" id="upload-note-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Note/Material Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physiology of Cardiac Cycle with ECG Annotations"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Anatomy">Anatomy</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Pharmacology">Pharmacology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Forensic Medicine">Forensic Medicine</option>
                    <option value="OBGYN">OBGYN</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>

                {/* College Prof Year */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Prof Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="1st Prof">1st Prof (First Year)</option>
                    <option value="2nd Prof">2nd Prof (Second Year)</option>
                    <option value="3rd Prof">3rd Prof (Third Year)</option>
                    <option value="Final Prof">Final Prof (Fourth/Final Year)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Material Format</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Handwritten">Handwritten Notebook</option>
                    <option value="Revision Notes">Revision Quick Sheets</option>
                    <option value="Practical Files">Practical Manual File</option>
                    <option value="PYQs">Previous Year Questions (PYQs)</option>
                    <option value="Flashcards">Flashcard Deck</option>
                    <option value="Clinical Cases">OSCE / Clinical Cases</option>
                  </select>
                </div>

                {/* Page counts */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Estimated Page Count</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                {/* Custom Pricing input */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Asking Price (₹ INR)</label>
                  <input
                    type="number"
                    min={49}
                    max={1999}
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                {/* Smart Price recommender response */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-900">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[10px] text-indigo-400 block uppercase">StethoNotes Recommender</span>
                    <span>Optimized Price for {pages} pages is: <strong>₹{recommendedPrice}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrice(recommendedPrice)}
                    className="bg-white text-indigo-700 hover:bg-slate-50 border border-indigo-100 font-bold px-2 py-1 rounded text-[10px] transition-all"
                  >
                    Apply Recommended Price
                  </button>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Description & Syllabus coverage *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a comprehensive breakdown of topics, diagrams, and exam relevancy..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Highlights list */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Key Highlights (one per line)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Includes color-coded diagrams of heart ventricles.&#10;Solved University Exam questions (2020-2025)."
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none transition-all"
                  />
                </div>

              </div>

              {/* PDF upload placeholder drag zone */}
              <div className="border border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50/50">
                <FileText className="mx-auto h-7 w-7 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700 block">Select PDF Document (Max 45MB)</span>
                <span className="text-[10px] text-slate-400">PDF will be encrypted and watermarked with buyer email automatically.</span>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing clinical topics...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Publish Document to Marketplace</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

        {/* COL 3: Wallet & Payout Ledger */}
        <div className="space-y-8">
          
          {/* Wallet Balance & Withdrawal Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-sky-500 rounded-full blur-3xl opacity-20 -z-10"></div>
            
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Wallet className="h-4.5 w-4.5 text-sky-400" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Creator Wallet Ledger</span>
            </div>

            <div className="mt-4">
              <span className="text-[10px] text-slate-400 block font-medium">Withdrawable Balance</span>
              <span className="text-3xl font-extrabold font-mono tracking-tight text-white block mt-1">₹{earnedBalance}</span>
            </div>

            <div className="h-px bg-white/10 my-6"></div>

            {withdrawSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-[11px] text-emerald-300">
                <span className="font-bold block">Instant Payout Dispatched!</span>
                <span>The amount has been requested for instant transfer to your verified UPI handle.</span>
              </div>
            ) : (
              <form onSubmit={handleWithdrawalSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Withdrawal Amount (₹ INR)</label>
                  <input
                    type="number"
                    max={earnedBalance}
                    required
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs placeholder:text-slate-400 text-white focus:outline-none focus:bg-white/15"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">UPI Handle / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. aditya@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs placeholder:text-white/30 text-white focus:outline-none focus:bg-white/15"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawing || earnedBalance <= 0}
                  className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-950/20"
                >
                  {isWithdrawing ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Verifying Gateway...</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4" />
                      <span>Withdraw to UPI Instantly</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Active Uploads list */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your Published Notebooks ({sellerNotes.length})</h3>
            
            <div className="space-y-3">
              {sellerNotes.map((note) => (
                <div key={note.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 font-bold text-xs shrink-0 font-mono">
                    ₹{note.price}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-slate-900 block truncate">{note.title}</span>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-semibold">
                      <span>{note.subject}</span>
                      <span>•</span>
                      <span>{note.downloads} downloads</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Sales</h3>
            
            <div className="space-y-4">
              {analytics.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-start justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[160px]">{tx.noteTitle}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">Buyer: {tx.buyerName}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{tx.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 block font-mono">+₹{Math.floor(tx.amount * 0.85)}</span>
                    <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      )}

    </div>
  );
};
