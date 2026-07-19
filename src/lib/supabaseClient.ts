/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";
import { MedicalNote } from "../types";

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Check if credentials have been configured by the developer
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Provide fallback values to prevent build-time/init crashes when env variables are blank
export const supabase = createClient(
  supabaseUrl || "https://your-project-id.supabase.co",
  supabaseAnonKey || "your-supabase-anon-key"
);

/**
 * Maps a raw Supabase database row from the `notes` table to the frontend's `MedicalNote` representation.
 */
export function mapDbNoteToMedicalNote(dbNote: any): MedicalNote {
  const price = parseFloat(dbNote.price || "149");
  // Some schemas have originalPrice or original_price. We default to double the price if not present.
  const originalPrice = dbNote.original_price 
    ? parseFloat(dbNote.original_price) 
    : (dbNote.originalPrice ? parseFloat(dbNote.originalPrice) : price * 2);
  
  // Custom interactive preview layout rendered inside our document viewer
  const dynamicPreviewHtml = `
    <div class="p-6 bg-sky-50/45 border border-sky-100 rounded-2xl font-sans relative overflow-hidden shadow-sm">
      <div class="absolute top-0 right-0 bg-sky-600 text-white text-[10px] uppercase tracking-wider font-mono px-3.5 py-1.5 rounded-bl-xl shadow-xs">Live Preview</div>
      <div class="border-b border-sky-200/40 pb-3 mb-4">
        <h4 class="text-xs font-mono text-sky-800 tracking-wider uppercase font-bold">Live Supabase Database Material</h4>
        <h2 class="text-lg font-display font-black text-sky-950 mt-1">${dbNote.title || "Untitled Study Resource"}</h2>
      </div>
      <div class="space-y-4 text-xs text-slate-700 leading-relaxed">
        <p class="font-semibold text-slate-800">${dbNote.description || "No description provided. This is a live high-yield study material queried straight from your cloud-connected Supabase tables!"}</p>
        
        <div class="bg-white p-4 rounded-xl border border-slate-150 space-y-2.5 shadow-xs">
          <span class="font-extrabold text-sky-700 uppercase tracking-wider text-[9px] block">Resource Specifications:</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-medium">
            <div>• <strong>Subject:</strong> <span class="text-slate-900">${dbNote.subject || "Medical Studies"}</span></div>
            <div>• <strong>Academic Tier:</strong> <span class="text-slate-900">${dbNote.semester || dbNote.year || "General Board"}</span></div>
            <div>• <strong>Price / Offer:</strong> <span class="text-slate-900">INR ${price} (M.R.P INR ${originalPrice})</span></div>
            <div>• <strong>Database Unique ID:</strong> <span class="text-slate-500 font-mono text-[9px] break-all">${dbNote.id}</span></div>
          </div>
        </div>

        <p class="text-[11px] text-slate-500 italic mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          💡 This preview is generated directly from your live database row. The unlocked document is accessible securely via: <a href="${dbNote.pdf_url || "#"}" target="_blank" class="text-sky-600 hover:underline font-mono text-[10px] break-all">${dbNote.pdf_url || "Direct Download Link"}</a>.
        </p>
      </div>
    </div>
  `;

  const authorInfo = dbNote.seller_profiles || {};
  const profileInfo = authorInfo.profiles || {};
  
  const author = {
    id: dbNote.seller_id || "db-author-default",
    name: profileInfo.name || authorInfo.store_name || "Verified Peer Creator",
    avatar: authorInfo.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=peer",
    university: authorInfo.specialty || "Top Tier Medical University",
    verified: true,
    rating: 5.0,
    salesCount: authorInfo.wallet_balance ? Math.floor(parseFloat(authorInfo.wallet_balance) / 100) + 1 : 12,
    bio: authorInfo.bio || "Passionate medical creator sharing high-yield clinical guides and peer reviewed blueprints."
  };

  return {
    id: dbNote.id || `db-note-${Date.now()}`,
    title: dbNote.title || "Untitled Premium Study Guide",
    author: author,
    price: price,
    originalPrice: originalPrice,
    rating: 5.0,
    reviewCount: 1,
    pages: dbNote.pages || 35,
    subject: dbNote.subject || "General Medicine",
    year: dbNote.year || dbNote.semester || "1st Prof",
    category: (dbNote.category as any) || "Handwritten",
    tags: dbNote.tags || [dbNote.subject || "MBBS", "Supabase Live"],
    downloads: dbNote.downloads || 15,
    description: dbNote.description || "Premium study material connected in real-time from Supabase.",
    highlights: dbNote.highlights || [
      "Secured inside database cloud tables.",
      "Instant checkout enabled.",
      "Verified handwritten peer syllabus content."
    ],
    reviews: [
      {
        id: "rev-db-1",
        userName: "Live Database Buyer",
        userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=db",
        rating: 5,
        date: "2026-07-19",
        comment: "Excellent high-yield layout. Verified peer notes directly from the cloud database!",
        verifiedPurchase: true
      }
    ],
    samplePages: dbNote.preview_images && dbNote.preview_images.length > 0 
      ? dbNote.preview_images.map((img: string, idx: number) => `
          <div class="p-2 border border-slate-150 rounded-2xl overflow-hidden bg-white text-center">
            <span class="text-[10px] font-mono text-slate-400 block mb-1">Preview Page ${idx + 1}</span>
            <img src="${img}" alt="Preview Page" class="mx-auto rounded-xl max-h-96 object-contain" referrerPolicy="no-referrer" />
          </div>
        `)
      : [dynamicPreviewHtml],
    diagramCount: dbNote.diagram_count || dbNote.diagramCount || 4,
    coverImage: dbNote.thumbnail_url || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=60"
  };
}

/**
 * Fetches notes from your live Supabase database if credentials are configured.
 */
export async function fetchNotesFromSupabase(): Promise<MedicalNote[]> {
  if (!isSupabaseConfigured) return [];
  
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*");
      
    if (error) {
      console.warn("Error fetching live products from Supabase:", error);
      return [];
    }
    
    if (data && data.length > 0) {
      return data.map(mapDbNoteToMedicalNote);
    }
  } catch (err) {
    console.error("Failed to query notes from Supabase:", err);
  }
  return [];
}

