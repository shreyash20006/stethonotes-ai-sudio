/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marketplace } from "./components/Marketplace";
import { NoteDetailsModal } from "./components/NoteDetailsModal";
import { FlashcardStudy } from "./components/FlashcardStudy";
import { SellerDashboard } from "./components/SellerDashboard";
import { CartDrawer } from "./components/CartDrawer";
import { InteractiveNoteViewer } from "./components/InteractiveNoteViewer";
import { Footer } from "./components/Footer";
import { DegreePrograms } from "./components/DegreePrograms";

import { mockNotes, mockFlashcards, mockSellerAnalytics } from "./data/mockData";
import { MedicalNote, CartItem, SellerAnalytics } from "./types";
import { fetchNotesFromSupabase, isSupabaseConfigured } from "./lib/supabaseClient";

export default function App() {
  // Navigation Routing States
  const [activeTab, setActiveTab] = useState<"marketplace" | "flashcards" | "seller" | "library">("marketplace");

  // Notes and catalog state (Live synced!)
  const [notes, setNotes] = useState<MedicalNote[]>(isSupabaseConfigured ? [] : mockNotes);
  const [selectedNote, setSelectedNote] = useState<MedicalNote | null>(null);

  // Synchronize live products from Supabase on component mount
  useEffect(() => {
    async function loadLiveProducts() {
      if (isSupabaseConfigured) {
        const liveNotes = await fetchNotesFromSupabase();
        setNotes(liveNotes);
      }
    }
    loadLiveProducts();
  }, []);

  // Cart & Wishlist States

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<string>("All");

  // Library / Purchases States
  // Pre-unlocked "note-1" as a demonstration for Note Reader and AI Companion!
  const [purchasedNoteIds, setPurchasedNoteIds] = useState<string[]>(["note-1"]);

  // Seller Dashboard States
  const [earnedBalance, setEarnedBalance] = useState<number>(mockSellerAnalytics.totalRevenue);
  const [sellerAnalytics, setSellerAnalytics] = useState<SellerAnalytics>(mockSellerAnalytics);

  // Cart Handlers
  const handleAddToCart = (note: MedicalNote, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // prevent opening details modal when clicking buy on card
    }

    const existingItem = cart.find((item) => item.note.id === note.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.note.id === note.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { note, quantity: 1 }]);
    }

    setIsCartOpen(true); // Open drawer instantly for delightful UX
  };

  const handleRemoveFromCart = (noteId: string) => {
    setCart(cart.filter((item) => item.note.id !== noteId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckoutSuccess = (newUnlockedNoteIds: string[]) => {
    // Add newly purchased note IDs to library
    setPurchasedNoteIds((prev) => Array.from(new Set([...prev, ...newUnlockedNoteIds])));
    
    // Simulate updating creator analytics since someone bought their files!
    // We update the local wallet balance by 85% royalty of total purchases
    const addedRoyalty = cart.reduce((sum, item) => sum + Math.floor(item.note.price * 0.85), 0);
    setEarnedBalance((prev) => prev + addedRoyalty);

    setCart([]); // Clear shopping basket
  };

  const handleInstantUnlock = (note: MedicalNote) => {
    setSelectedNote(null);
    setCart([{ note, quantity: 1 }]);
    setIsCartOpen(true);
  };

  // Wishlist Handlers
  const handleToggleWishlist = (noteId: string) => {
    if (wishlist.includes(noteId)) {
      setWishlist(wishlist.filter((id) => id !== noteId));
    } else {
      setWishlist([...wishlist, noteId]);
    }
  };

  // Seller Publishing Handler (Syncs directly with marketplace grid!)
  const handlePublishNewNote = (newNoteFields: Partial<MedicalNote>) => {
    const randomId = `note-${Date.now()}`;
    
    // Create authentic sample handwritten page designs
    const subjectTitle = newNoteFields.subject || "Medicine";
    const samplePageOne = `
      <div class="p-6 bg-slate-50 border border-slate-200 rounded-xl font-sans relative overflow-hidden shadow-sm">
        <div class="absolute top-0 right-0 bg-sky-500 text-white text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-bl-xl shadow-sm">Page 1: Syllabus Entry</div>
        <div class="border-b border-slate-200 pb-2 mb-3">
          <h4 class="text-[10px] font-mono text-sky-600 tracking-wider">CREATOR WORKSPACE • EXCLUSIVE NOTE</h4>
          <h2 class="text-base font-display font-bold text-slate-900 mt-0.5">${newNoteFields.title}</h2>
        </div>
        <div class="space-y-3 text-[11px] text-slate-700 leading-relaxed font-sans">
          <p class="italic font-semibold text-slate-800">Topic Area: ${subjectTitle} Comprehensive Board Prep Notes.</p>
          <p>${newNoteFields.description}</p>
          <div class="bg-white p-3 rounded-lg border border-slate-100">
            <span class="font-bold text-sky-700 uppercase tracking-wider text-[9px] block mb-1">High Yield Chapter Keys:</span>
            <ul className="space-y-1">
              <li>• Comprehensive schematic mappings of anatomical/physiological variables.</li>
              <li>• Detailed mnemonic summaries to accelerate long-term memory retrieval.</li>
              <li>• Solved university past year questions (PYQs) for high clinical scoring.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    const completeNote: MedicalNote = {
      id: randomId,
      title: newNoteFields.title || "Untitled Medical Note",
      price: newNoteFields.price || 149,
      originalPrice: newNoteFields.originalPrice || 299,
      rating: 5.0,
      reviewCount: 1,
      pages: newNoteFields.pages || 25,
      subject: newNoteFields.subject || "Anatomy",
      year: newNoteFields.year || "1st Prof",
      category: newNoteFields.category || "Handwritten",
      tags: [newNoteFields.subject || "Medicine", "MBBS High Yield", "Clinical Blueprint"],
      downloads: 0,
      description: newNoteFields.description || "No deep description provided.",
      highlights: newNoteFields.highlights || ["Covers latest NMC guideline concepts.", "Perfect high-scoring formatting."],
      reviews: [
        {
          id: "rev-new-1",
          userName: "Anjali S.",
          userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=anjali",
          rating: 5,
          date: "2026-07-19",
          comment: "Breathtaking clarity. Exactly matches what the university board expects for theory answers. Extremely grateful!",
          verifiedPurchase: true
        }
      ],
      samplePages: [samplePageOne],
      diagramCount: newNoteFields.diagramCount || 5,
      author: {
        id: "auth-current-user",
        name: "Dr. Aditya Sen (You)",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=aditya",
        university: "AIIMS Delhi, Batch of 2021",
        verified: true,
        rating: 5.0,
        salesCount: 1,
        bio: "AIIMS Delhi MBBS Intern. Dedicating my clinical years to helping juniors ace professional exams."
      }
    };

    // Update state lists
    const updatedNotes = [completeNote, ...notes];
    setNotes(updatedNotes);

    // Update active creator notes
    setSellerAnalytics((prev) => ({
      ...prev,
      activeNotesCount: prev.activeNotesCount + 1
    }));
  };

  const handleWithdrawal = (amount: number, upi: string) => {
    setEarnedBalance((prev) => Math.max(0, prev - amount));
  };

  // Quick subject click in Hero triggers filters inside Marketplace
  const handleHeroSubjectClick = (subjectName: string) => {
    setActiveTab("marketplace");
    // Trigger filter update by appending to search query or filtering directly
    setSearchQuery(subjectName);
  };

  // Filter notes that have been purchased by the active student user
  const purchasedNotesList = notes.filter((note) => purchasedNoteIds.includes(note.id));
  const sellerNotesList = notes.filter((note) => note.author.id === "auth-current-user");

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-between font-sans selection:bg-sky-500/10 selection:text-sky-700 relative overflow-x-hidden">
      
      {/* Cinematic Ambient Background Video */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-slate-50">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://res.cloudinary.com/dsqxboxoc/video/upload/v1784454154/Create_a_premium_cinematic_web_bdrj8r.mp4" type="video/mp4" />
        </video>
        {/* Soft background tint to guarantee contrast */}
        <div className="absolute inset-0 bg-slate-50/65 backdrop-blur-[0.5px]"></div>
      </div>

      {/* Platform Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlist.length}
        openLibrary={() => setActiveTab("library")}
        purchasedCount={purchasedNotesList.length}
      />

      {/* Main Core Body Views */}
      <div className="flex-grow">
        {activeTab === "marketplace" && (
          <>
            {/* Display Beautiful Hero Banner */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSubjectClick={handleHeroSubjectClick}
            />

            {/* Degree Programs Section with Framer Motion Category Filter */}
            <DegreePrograms
              notes={notes}
              selectedDegree={selectedDegree}
              setSelectedDegree={setSelectedDegree}
            />

            {/* Display Interactive Marketplace Grid */}
            <Marketplace
              notes={notes}
              onSelectNote={setSelectedNote}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              selectedDegree={selectedDegree}
              setSelectedDegree={setSelectedDegree}
            />
          </>
        )}

        {activeTab === "flashcards" && (
          <FlashcardStudy flashcards={mockFlashcards} />
        )}

        {activeTab === "library" && (
          <InteractiveNoteViewer purchasedNotes={purchasedNotesList} />
        )}

        {activeTab === "seller" && (
          <SellerDashboard
            analytics={sellerAnalytics}
            onPublishNote={handlePublishNewNote}
            earnedBalance={earnedBalance}
            onWithdraw={handleWithdrawal}
            sellerNotes={sellerNotesList}
          />
        )}
      </div>

      {/* Persistent Platform Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Detail Overlay Dialog Modals */}
      {selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onAddToCart={(note) => {
            handleAddToCart(note);
            setSelectedNote(null);
          }}
          onInstantBuy={handleInstantUnlock}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Shopping Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

    </div>
  );
}
