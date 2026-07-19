/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Author {
  id: string;
  name: string;
  avatar: string;
  university: string;
  verified: boolean;
  rating: number;
  salesCount: number;
  bio: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface MedicalNote {
  id: string;
  title: string;
  author: Author;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  pages: number;
  subject: string;
  year: string; // "1st Prof", "2nd Prof", etc.
  category: "Handwritten" | "Revision Notes" | "Practical Files" | "PYQs" | "Flashcards" | "Clinical Cases" | "Diagrams";
  tags: string[];
  downloads: number;
  description: string;
  highlights: string[];
  reviews: Review[];
  samplePages: string[]; // text/content or simulated preview content
  diagramCount: number;
  coverImage?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  category: string; // "Anatomy" | "Pharmacology" | "Pathology" | "Physiology"
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface CartItem {
  note: MedicalNote;
  quantity: number;
}

export interface SellerAnalytics {
  totalRevenue: number;
  totalSales: number;
  profileViews: number;
  activeNotesCount: number;
  monthlyRevenue: { month: string; amount: number }[];
  recentTransactions: {
    id: string;
    noteTitle: string;
    buyerName: string;
    amount: number;
    date: string;
    status: "Success" | "Pending";
  }[];
}
