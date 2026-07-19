/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, ShoppingCart, BookOpen, Star, Sparkles, User, GraduationCap, ArrowUpRight, Heart } from "lucide-react";
import { CartItem } from "../types";

interface HeaderProps {
  activeTab: "marketplace" | "flashcards" | "seller" | "library";
  setActiveTab: (tab: "marketplace" | "flashcards" | "seller" | "library") => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistCount: number;
  openLibrary: () => void;
  purchasedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cart,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  wishlistCount,
  openLibrary,
  purchasedCount
}) => {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/85 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab("marketplace")} 
          className="flex cursor-pointer items-center gap-2.5 group"
          id="brand-logo"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-150 p-1 shadow-sm group-hover:scale-105 transition-all duration-300">
            <img 
              src="https://res.cloudinary.com/dsqxboxoc/image/upload/v1783892715/file_00000000358871fa8e36ace7e1a4f3ab_fml8e3.png" 
              alt="StethoNotes Logo" 
              className="h-full w-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors duration-200">
              Stetho<span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Notes</span>
            </span>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              Notes That Diagnose Doubts
            </span>
          </div>
        </div>

        {/* Desktop Middle Search bar & Quick actions */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Anatomy, Pharmacology, PYQs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== "marketplace") {
                  setActiveTab("marketplace");
                }
              }}
              className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all duration-300"
              id="header-search-input"
            />
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold tracking-tight transition-all duration-200 ${
              activeTab === "marketplace"
                ? "bg-sky-50 text-sky-700 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
            id="nav-marketplace"
          >
            Marketplace
          </button>
          
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold tracking-tight transition-all duration-200 ${
              activeTab === "flashcards"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
            id="nav-flashcards"
          >
            Flashcards
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`relative rounded-lg px-3 py-2 text-xs font-semibold tracking-tight transition-all duration-200 ${
              activeTab === "library"
                ? "bg-emerald-50 text-emerald-700 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
            id="nav-library"
          >
            <span>My Library</span>
            {purchasedCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-1 ring-white animate-pulse">
                {purchasedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("seller")}
            className={`group flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold tracking-tight transition-all duration-200 ${
              activeTab === "seller"
                ? "border-amber-200 bg-amber-50 text-amber-700 font-bold"
                : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
            id="nav-seller-studio"
          >
            <GraduationCap className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Creator Studio</span>
            <span className="sm:hidden">Sell</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1"></div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Wishlist Link */}
            {wishlistCount > 0 && (
              <button
                onClick={() => setActiveTab("marketplace")}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
                title="Wishlist"
                id="wishlist-btn"
              >
                <Heart className="h-4.5 w-4.5 fill-rose-500 text-rose-500" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 px-3 items-center gap-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-sky-500 hover:bg-sky-50/30 transition-all duration-200 cursor-pointer"
              id="header-cart-btn"
            >
              <ShoppingCart className="h-4.5 w-4.5 text-slate-600" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {totalCartItems > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-bold text-white">
                  {totalCartItems}
                </span>
              ) : (
                <span className="text-xs font-mono text-slate-400">0</span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
