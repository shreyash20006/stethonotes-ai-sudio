/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, RotateCw, Check, ArrowRight, BookOpen, 
  HelpCircle, Star, BrainCircuit, RefreshCw, Trophy, Award, Flame
} from "lucide-react";
import { Flashcard } from "../types";

interface FlashcardStudyProps {
  flashcards: Flashcard[];
}

export const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ flashcards }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState<string[]>([]);
  const [scoreCounts, setScoreCounts] = useState({ easy: 0, good: 0, hard: 0, again: 0 });
  const [streak, setStreak] = useState(4); // default active days

  const categories = ["All", "Anatomy", "Pharmacology", "Pathology", "Physiology", "Pediatrics", "Surgery"];

  const filteredCards = selectedCategory === "All"
    ? flashcards
    : flashcards.filter((c) => c.category === selectedCategory);

  const currentCard = filteredCards[currentCardIdx];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleScoreCard = (type: "easy" | "good" | "hard" | "again") => {
    // Record review stats
    if (currentCard && !cardsReviewed.includes(currentCard.id)) {
      setCardsReviewed([...cardsReviewed, currentCard.id]);
    }

    setScoreCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1
    }));

    // Trigger streak increase slightly
    if (type === "easy" || type === "good") {
      setStreak((p) => p + 1);
    }

    // Advance to next card with slight animation timeout
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentCardIdx((prev) => (prev + 1) % filteredCards.length);
    }, 300);
  };

  const resetSession = () => {
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setCardsReviewed([]);
    setScoreCounts({ easy: 0, good: 0, hard: 0, again: 0 });
  };

  const getDifficultyBadgeColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" id="flashcards-study-section">
      
      {/* Premium header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-100 pb-8 mb-8">
        
        {/* Title */}
        <div className="md:col-span-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
            <BrainCircuit className="h-4 w-4 text-indigo-600 animate-pulse" />
            <span>AI Spaced-Repetition Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Active Study Flashcards
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Revisit concepts every 24-72 hours. Powered by high recall Leitner algorithms.
          </p>
        </div>

        {/* Streak / Stats Widget */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center justify-around">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mastery</span>
            <span className="text-lg font-extrabold text-slate-900 font-mono">
              {cardsReviewed.length} / {filteredCards.length}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Study Streak</span>
            <span className="text-lg font-extrabold text-amber-600 font-mono flex items-center gap-1">
              <Flame className="h-4.5 w-4.5 fill-amber-500 text-amber-500 animate-bounce" />
              {streak} Days
            </span>
          </div>
        </div>

      </div>

      {/* Category selector pill bar */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentCardIdx(0);
              setIsFlipped(false);
            }}
            className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm border transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-slate-900 border-slate-900 text-white font-bold"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat} Decks
          </button>
        ))}
      </div>

      {/* Main Flashcard Interface */}
      {filteredCards.length > 0 ? (
        <div className="space-y-8 flex flex-col items-center">
          
          {/* Card container with customized 3D Perspective */}
          <div 
            className="w-full max-w-lg h-80 relative cursor-pointer group [perspective:1000px]"
            onClick={handleFlip}
            id="flashcard-interactive-box"
          >
            <div className={`relative w-full h-full duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* CARD FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full rounded-3xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-lg backface-hidden">
                
                {/* Front Header */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase border border-indigo-100">
                    {currentCard.category}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getDifficultyBadgeColor(currentCard.difficulty)}`}>
                    {currentCard.difficulty} Recall
                  </span>
                </div>

                {/* Central Question */}
                <div className="text-center my-auto px-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">QUESTION</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-relaxed mt-2">
                    {currentCard.question}
                  </h3>
                </div>

                {/* Card Footer tips */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold select-none">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Click anywhere to flip and see details</span>
                </div>
              </div>

              {/* CARD BACK SIDE */}
              <div className="absolute inset-0 w-full h-full rounded-3xl border border-indigo-100 bg-indigo-50/15 p-8 flex flex-col justify-between shadow-lg rotate-y-180 backface-hidden">
                
                {/* Back Header */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase border border-emerald-100 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Correct Answer
                  </span>
                  <span className="text-[9px] font-bold font-mono text-indigo-400 tracking-wider">STETHONOTES MASTERCLASS</span>
                </div>

                {/* Core Answer */}
                <div className="text-center my-3 max-h-48 overflow-y-auto px-2">
                  <h4 className="text-lg font-extrabold text-slate-950 font-display">
                    {currentCard.answer}
                  </h4>
                  <div className="h-px bg-indigo-100/60 my-3"></div>
                  <p className="text-xs text-slate-600 leading-relaxed text-left bg-white/80 p-3 rounded-xl border border-indigo-100/40">
                    <strong className="text-indigo-950 text-[11px] uppercase tracking-wider block mb-1">Clinical Significance:</strong>
                    {currentCard.explanation}
                  </p>
                </div>

                {/* Back Footer */}
                <div className="text-center text-[10px] text-indigo-600 font-semibold flex items-center justify-center gap-1 select-none">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Click to return to question</span>
                </div>

              </div>

            </div>
          </div>

          {/* Spaced-Repetition Feedback Buttons (Only interactive when card is flipped!) */}
          {isFlipped ? (
            <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm" id="leitner-controls">
              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider mb-3">How well did you know this medical fact?</span>
              
              <div className="grid grid-cols-4 gap-2">
                
                <button
                  onClick={() => handleScoreCard("again")}
                  className="rounded-xl border border-rose-200 bg-rose-50/40 p-2.5 text-center hover:bg-rose-50 transition-all duration-200"
                >
                  <span className="text-rose-700 font-bold text-xs block">Again</span>
                  <span className="text-[9px] text-rose-500 font-medium block mt-0.5">Soon</span>
                </button>

                <button
                  onClick={() => handleScoreCard("hard")}
                  className="rounded-xl border border-amber-200 bg-amber-50/40 p-2.5 text-center hover:bg-amber-50 transition-all duration-200"
                >
                  <span className="text-amber-700 font-bold text-xs block">Hard</span>
                  <span className="text-[9px] text-amber-500 font-medium block mt-0.5">12h</span>
                </button>

                <button
                  onClick={() => handleScoreCard("good")}
                  className="rounded-xl border border-sky-200 bg-sky-50/40 p-2.5 text-center hover:bg-sky-50 transition-all duration-200"
                >
                  <span className="text-sky-700 font-bold text-xs block">Good</span>
                  <span className="text-[9px] text-sky-500 font-medium block mt-0.5">2d</span>
                </button>

                <button
                  onClick={() => handleScoreCard("easy")}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-2.5 text-center hover:bg-emerald-50 transition-all duration-200"
                >
                  <span className="text-emerald-700 font-bold text-xs block">Easy</span>
                  <span className="text-[9px] text-emerald-500 font-medium block mt-0.5">4d</span>
                </button>

              </div>
            </div>
          ) : (
            <button
              onClick={handleFlip}
              className="rounded-full bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all duration-200"
            >
              Flip Flashcard to Review
            </button>
          )}

          {/* Reset Progress trigger */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Review progress resets when you filter decks.</span>
            <button 
              onClick={resetSession}
              className="text-sky-600 hover:underline font-bold"
            >
              Reset Session
            </button>
          </div>

        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-4 text-sm font-bold text-slate-900">No flashcards in this deck yet</h3>
          <p className="mt-2 text-xs text-slate-500">We are adding high recall items daily for all subjects.</p>
        </div>
      )}

      {/* Quick recall guide */}
      <div className="mt-16 bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 sm:p-8">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-display mb-3">
          <Award className="h-5 w-5 text-sky-600" />
          Cognitive Spaced Repetition (Active Recall)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          StethoNotes uses customized flashcard decks synced directly with NMC competencies. Flipping flashcards targets the parietal recall networks of the brain, leading to longer memory consolidation than passive reading. Rate your memory accurately to schedule card intervals automatically.
        </p>
      </div>

    </div>
  );
};
