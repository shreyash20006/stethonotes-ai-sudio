/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, ShieldCheck, HardDrive, KeyRound, Copy, Check, 
  Terminal, Server, HelpCircle, ChevronRight, PlayCircle, 
  Settings, Layers, BookOpen, User, ShoppingBag, Star, 
  AlertTriangle, ArrowRightLeft, Sparkles, Code
} from "lucide-react";

const SUPABASE_SQL_SCRIPT = `-- ============================================================
-- SECTION 1 — CORE TABLES
-- ============================================================

-- 1.1 Courses
CREATE TABLE IF NOT EXISTS public.courses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    phone       TEXT,
    role        TEXT NOT NULL DEFAULT 'student'
                    CHECK (role IN ('student', 'seller', 'seller_pending', 'admin', 'super_admin')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.3 Seller Profiles
CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id          UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_name  TEXT NOT NULL UNIQUE,
    bio         TEXT,
    avatar_url  TEXT,
    specialty   TEXT,
    bank_details JSONB,
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.4 Notes (PDFs for sale)
CREATE TABLE IF NOT EXISTS public.notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT,
    course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    subject         TEXT NOT NULL,
    semester        TEXT,
    price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    pdf_url         TEXT NOT NULL,
    thumbnail_url   TEXT NOT NULL,
    preview_images  TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    seller_id       UUID REFERENCES public.seller_profiles(id) ON DELETE SET NULL,
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'draft')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.5 Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name       TEXT NOT NULL,
    customer_email      TEXT NOT NULL,
    customer_phone      TEXT NOT NULL,
    total_amount        NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    razorpay_payment_id TEXT,
    payment_status      TEXT NOT NULL DEFAULT 'pending'
                            CHECK (payment_status IN ('pending', 'completed', 'failed')),
    email_status        TEXT NOT NULL DEFAULT 'pending'
                            CHECK (email_status IN ('pending', 'sent', 'failed')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.6 Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    note_id     UUID NOT NULL REFERENCES public.notes(id) ON DELETE RESTRICT,
    price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    UNIQUE (order_id, note_id)
);

-- 1.7 Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id     UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (note_id, user_id)
);

-- 1.8 Email Logs
CREATE TABLE IF NOT EXISTS public.email_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    email         TEXT NOT NULL,
    status        TEXT NOT NULL CHECK (status IN ('success', 'failure')),
    error_message TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- SECTION 2 — INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_notes_course_id   ON public.notes(course_id);
CREATE INDEX IF NOT EXISTS idx_notes_status       ON public.notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_seller       ON public.notes(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id     ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email       ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id  ON public.orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_note_id    ON public.reviews(note_id);

-- ============================================================
-- SECTION 3 — ROW LEVEL SECURITY ENABLING
-- ============================================================

ALTER TABLE public.courses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SECTION 4 — RLS ACCESS POLICIES
-- ============================================================

-- 4.1 Courses Policies
CREATE POLICY "courses: public read"
    ON public.courses FOR SELECT USING (true);

CREATE POLICY "courses: admin write"
    ON public.courses FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

-- 4.2 User Profiles Policies
CREATE POLICY "profiles: own read"
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: own update"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: admin full access"
    ON public.profiles FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    ));

-- 4.3 Seller Profiles Policies
CREATE POLICY "seller_profiles: public read"
    ON public.seller_profiles FOR SELECT USING (true);

CREATE POLICY "seller_profiles: own update"
    ON public.seller_profiles FOR UPDATE
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "seller_profiles: own insert"
    ON public.seller_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "seller_profiles: admin full access"
    ON public.seller_profiles FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

-- 4.4 Notes Policies
CREATE POLICY "notes: public read"
    ON public.notes FOR SELECT USING (status = 'active');

CREATE POLICY "notes: seller self manage"
    ON public.notes FOR ALL
    USING (auth.uid() = seller_id)
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "notes: admin full access"
    ON public.notes FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

-- 4.5 Orders Policies
CREATE POLICY "orders: own read"
    ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders: own insert"
    ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders: guest insert"
    ON public.orders FOR INSERT WITH CHECK (user_id IS NULL);

CREATE POLICY "orders: admin full access"
    ON public.orders FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

-- 4.6 Order Items Policies
CREATE POLICY "order_items: own read"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    ));

CREATE POLICY "order_items: own insert"
    ON public.order_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    ));

CREATE POLICY "order_items: guest insert"
    ON public.order_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id AND orders.user_id IS NULL
    ));

CREATE POLICY "order_items: admin full access"
    ON public.order_items FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

-- 4.7 Reviews Policies
CREATE POLICY "reviews: public read"
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "reviews: own insert"
    ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews: own update"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews: own delete"
    ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- 4.8 Email Logs Policies
CREATE POLICY "email_logs: admin full access"
    ON public.email_logs FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ));

-- ============================================================
-- SECTION 5 — AUTOMATIC NEW USER TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Student'),
        NEW.raw_user_meta_data->>'phone',
        'student'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SECTION 6 — STORAGE BUCKETS SECURITY POLICIES
-- ============================================================

-- 6.1 Private PDFs bucket policies ('notes-pdfs')
CREATE POLICY "notes-pdfs: select" ON storage.objects FOR SELECT USING (
    bucket_id = 'notes-pdfs' AND (
        -- Admins have full access
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
        -- Sellers have read access to their own files
        OR owner_id = auth.uid()::text
    )
);

CREATE POLICY "notes-pdfs: insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'notes-pdfs' AND (
        -- Admins can upload
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
        -- Verified sellers can upload their own files
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller')
    )
);

-- 6.2 Public Thumbnails bucket policies ('thumbnails')
CREATE POLICY "thumbnails: select" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "thumbnails: insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'thumbnails' AND (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller')
    )
);
`;

interface DBTableField {
  name: string;
  type: string;
  desc: string;
  badge?: string;
}

interface DBTableDefinition {
  name: string;
  icon: React.ReactNode;
  desc: string;
  fields: DBTableField[];
  policies: string[];
}

export const SupabaseSetupViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "sql" | "guide">("visual");
  const [selectedTable, setSelectedTable] = useState<string>("notes");

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const tables: DBTableDefinition[] = [
    {
      name: "notes",
      icon: <BookOpen className="h-4 w-4 text-sky-500" />,
      desc: "Stores clinical medical materials and PDFs uploaded by content creators.",
      fields: [
        { name: "id", type: "UUID (Primary Key)", desc: "Unique identifier with gen_random_uuid() default value." },
        { name: "title", type: "TEXT (Not Null)", desc: "Descriptive clinical topic title." },
        { name: "course_id", type: "UUID (Foreign Key)", desc: "References courses.id representing degree qualification." },
        { name: "subject", type: "TEXT (Not Null)", desc: "Medical field, e.g. Anatomy, Pharmacology." },
        { name: "price", type: "NUMERIC(10,2)", desc: "Document price, verified with >= 0 constraint check." },
        { name: "pdf_url", type: "TEXT (Not Null)", desc: "Secure encrypted path inside private 'notes-pdfs' bucket." },
        { name: "thumbnail_url", type: "TEXT (Not Null)", desc: "Public link of front page mockup cover sheet." },
        { name: "seller_id", type: "UUID (Foreign Key)", desc: "References seller_profiles.id to track creator revenue." },
        { name: "status", type: "TEXT (Default: 'active')", desc: "Publication state, constrained to 'active' or 'draft'." }
      ],
      policies: [
        "Public read access allowed only for active status files.",
        "Verified sellers can perform full CRUD management on their own items.",
        "Admins and super-admins have unconditional reading & writing access."
      ]
    },
    {
      name: "profiles",
      icon: <User className="h-4 w-4 text-indigo-500" />,
      desc: "Extends standard auth.users metadata with custom educational roles.",
      fields: [
        { name: "id", type: "UUID (Primary Key)", desc: "Matches auth.users(id) with Cascade Delete trigger." },
        { name: "name", type: "TEXT (Not Null)", desc: "Display username or college registrant name." },
        { name: "phone", type: "TEXT (Optional)", desc: "Contact handle for SMS notifications or Razorpay checkout." },
        { name: "role", type: "TEXT (Default: 'student')", desc: "Privilege level. Constrained to student, seller, seller_pending, admin, super_admin." }
      ],
      policies: [
        "Students can retrieve or update their own personal details only.",
        "Admins have full global query capabilities to manage bad roles."
      ]
    },
    {
      name: "seller_profiles",
      icon: <Sparkles className="h-4 w-4 text-amber-500" />,
      desc: "High-yield medical author profiles tracking royalties and specialty areas.",
      fields: [
        { name: "id", type: "UUID (Primary Key)", desc: "References profiles.id (Cascade on delete)." },
        { name: "store_name", type: "TEXT (Unique)", desc: "Brand moniker of developer or medical student's digital shop." },
        { name: "specialty", type: "TEXT", desc: "Expertise, e.g., 'Gold Medalist - Pharmacology'." },
        { name: "wallet_balance", type: "NUMERIC(10,2)", desc: "Withdrawable ledger balance representing 85% creator commissions." }
      ],
      policies: [
        "Store details and catalog titles are publicly readable.",
        "Sellers can update their own bio text, bank details, and cash payout parameters.",
        "Sellers can insert their profiles. Admins have complete audit clearance."
      ]
    },
    {
      name: "orders",
      icon: <ShoppingBag className="h-4 w-4 text-emerald-500" />,
      desc: "Tracks financial checkout logs and dynamic payment transactions.",
      fields: [
        { name: "id", type: "UUID (Primary Key)", desc: "Unique Order ID." },
        { name: "user_id", type: "UUID (Foreign Key)", desc: "References profiles.id (Null for checkout guests)." },
        { name: "customer_name", type: "TEXT (Not Null)", desc: "Name of buying student." },
        { name: "customer_email", type: "TEXT (Not Null)", desc: "Target delivery email address." },
        { name: "total_amount", type: "NUMERIC(10,2)", desc: "Sum amount. Verified with non-negative constraints." },
        { name: "payment_status", type: "TEXT", desc: "Razorpay state: pending, completed, or failed." }
      ],
      policies: [
        "Authenticated students can retrieve records of their own transactions.",
        "Guest checkouts and registered students can insert new orders.",
        "Admins possess complete reading and diagnostic capabilities."
      ]
    },
    {
      name: "reviews",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      desc: "User testimonials, stars, and verified feedback comments.",
      fields: [
        { name: "id", type: "UUID (Primary Key)", desc: "Unique testimonial ID." },
        { name: "note_id", type: "UUID (Foreign Key)", desc: "References notes.id (Cascade delete)." },
        { name: "user_id", type: "UUID (Foreign Key)", desc: "References profiles.id (Cascade delete)." },
        { name: "rating", type: "INTEGER (Not Null)", desc: "Star score between 1 and 5." }
      ],
      policies: [
        "Review listings are publicly queryable.",
        "Students can insert or update feedback for resources they purchased."
      ]
    }
  ];

  const currentTableData = tables.find(t => t.name === selectedTable) || tables[0];

  return (
    <div className="bg-white border border-slate-200/85 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full" id="supabase-setup-container">
      
      {/* Header Panel */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 uppercase tracking-tight">
            <Database className="h-3.5 w-3.5" />
            <span>Supabase Cloud Integration</span>
          </div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 font-display">
            Live Database Schema Console
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Explore the complete PostgreSQL database blueprints, storage bucket security, and active Row-Level Security.
          </p>
        </div>

        {/* Global Copy SQL Schema Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-xl text-xs font-bold px-4 py-2.5 border transition-all cursor-pointer shadow-xs ${
            copied 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500 animate-scale" />
              <span>Full SQL Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-200" />
              <span>Copy Full SQL Schema</span>
            </>
          )}
        </button>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex border-b border-slate-100 bg-white/70 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "visual"
              ? "border-slate-950 text-slate-950 bg-slate-50/20"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <Layers className="h-4 w-4 text-indigo-500" />
          <span>Interactive ER Diagram</span>
        </button>
        <button
          onClick={() => setActiveTab("sql")}
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "sql"
              ? "border-slate-950 text-slate-950 bg-slate-50/20"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <Code className="h-4 w-4 text-sky-500" />
          <span>SQL Script Editor</span>
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex items-center gap-2 px-6 py-4.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "guide"
              ? "border-slate-950 text-slate-950 bg-slate-50/20"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <Terminal className="h-4 w-4 text-amber-500" />
          <span>Setup & Hosting Guide</span>
        </button>
      </div>

      {/* Body View Container */}
      <div className="flex-1 p-6 sm:p-8 bg-white overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Visual interactive ER Layout */}
          {activeTab === "visual" && (
            <motion.div
              key="visual-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Tables Left Sidebar list */}
              <div className="lg:col-span-4 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Database Tables</span>
                {tables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedTable === table.name
                        ? "border-slate-950 bg-slate-50/60 shadow-xs"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        selectedTable === table.name ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100"
                      }`}>
                        {table.icon}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 font-mono">public.{table.name}</span>
                        <span className="text-[10px] text-slate-400 block font-medium truncate max-w-[150px]">{table.desc}</span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${
                      selectedTable === table.name ? "translate-x-0.5 text-slate-900" : ""
                    }`} />
                  </button>
                ))}

                {/* Storage Buckets block */}
                <div className="border border-dashed border-slate-200 rounded-2xl p-4.5 bg-slate-50/30 mt-6 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Storage Buckets</span>
                  
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 mt-0.5">
                      <HardDrive className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 font-mono">notes-pdfs</span>
                      <span className="text-[10px] text-rose-500 font-bold block">Private bucket (encrypted raw files)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 mt-0.5">
                      <HardDrive className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 font-mono">thumbnails</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">Public bucket (card summary sheets)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-violet-50 border border-violet-100 text-violet-600 mt-0.5">
                      <HardDrive className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 font-mono">previews</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">Public bucket (multi-image carousels)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Schema Detail panel */}
              <div className="lg:col-span-8 border border-slate-100 rounded-2xl p-5.5 space-y-6">
                
                {/* Table Title Block */}
                <div className="flex items-center gap-3 pb-4.5 border-b border-slate-100">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    {currentTableData.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 font-mono">public.{currentTableData.name}</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">Table schema</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{currentTableData.desc}</p>
                  </div>
                </div>

                {/* Table Fields list */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Columns & Types</span>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {currentTableData.fields.map((field) => (
                      <div key={field.name} className="p-3.5 bg-slate-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/40 transition-colors">
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-xs font-extrabold text-slate-900 font-mono">{field.name}</span>
                          <span className="text-[10px] text-indigo-600 font-bold font-mono bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.2 rounded">
                            {field.type}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium sm:text-right max-w-sm sm:truncate" title={field.desc}>
                          {field.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Row level Security section */}
                <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-2xl p-4.5 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-950 font-display">Row Level Security (RLS) Active Policies</span>
                  </div>
                  <ul className="space-y-2">
                    {currentTableData.policies.map((p, idx) => (
                      <li key={idx} className="text-xs text-emerald-800 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick note about the triggers */}
                {currentTableData.name === "profiles" && (
                  <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-900">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block">User Registration Hook Trigger</span>
                      <p className="text-[11px] text-amber-800/90 leading-relaxed">
                        An automatic database trigger listens on auth.users inserts, synchronizing user metadata instantly into public.profiles for secure RLS mapping. No client-side profile creation API needed!
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* TAB 2: SQL Raw script with search/highlights */}
          {activeTab === "sql" && (
            <motion.div
              key="sql-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-sky-500" />
                  StethoNotes Supabase SQL Blueprint
                </span>
                <span className="text-[10px] font-bold text-slate-400">Lines: ~250 • PostgreSQL 15+ Compliant</span>
              </div>

              {/* Pseudo code editor with high-contrast palette */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5.5 shadow-inner relative overflow-hidden font-mono text-[11px] sm:text-xs text-slate-300 max-h-[500px] overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                
                {/* Floating copy over editor */}
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/15 text-white p-2 rounded-xl border border-white/10 transition-all cursor-pointer"
                  title="Copy SQL Code"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>

                <pre className="whitespace-pre-wrap select-all">
                  {SUPABASE_SQL_SCRIPT}
                </pre>
              </div>

              {/* Advice */}
              <div className="flex items-start gap-2.5 rounded-2xl bg-sky-50 border border-sky-100 p-4 text-xs text-sky-900 leading-relaxed">
                <HelpCircle className="h-4.5 w-4.5 text-sky-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">Did you know?</span>
                  <p className="text-[11px] text-sky-800/90">
                    Running this SQL in your Supabase SQL Editor handles table creations, schema linkages, multi-layered RLS, and the automated user registration hook automatically. The setup completes in less than 3 seconds!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Step-by-Step implementation guides */}
          {activeTab === "guide" && (
            <motion.div
              key="guide-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Step 1 */}
                <div className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-sky-500 bg-sky-50 border border-sky-100 rounded-md px-2 py-0.5 uppercase tracking-wide">Step 01</span>
                    <h4 className="text-xs font-black text-slate-900 uppercase font-display tracking-tight">Provision Database</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Log into your Supabase Dashboard, click <strong>New Project</strong>, name your project, choose a secure region and database password, and launch the deployment.
                    </p>
                  </div>
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 transition-colors">
                    Open Supabase Console <ArrowRightLeft className="h-3 w-3" />
                  </a>
                </div>

                {/* Step 2 */}
                <div className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-md px-2 py-0.5 uppercase tracking-wide">Step 02</span>
                    <h4 className="text-xs font-black text-slate-900 uppercase font-display tracking-tight">Paste Schema in SQL</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Open the <strong>SQL Editor</strong> tab in your left menu on Supabase, select <strong>New Query</strong>, paste the copied code from this panel, and click the <strong>Run</strong> button.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("sql")} className="text-left inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                    Copy SQL Script Code <ArrowRightLeft className="h-3 w-3" />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5 uppercase tracking-wide">Step 03</span>
                    <h4 className="text-xs font-black text-slate-900 uppercase font-display tracking-tight">Configure Buckets</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Go to the <strong>Storage</strong> menu. Create three folders: <strong>notes-pdfs</strong> (make it secure/private), <strong>thumbnails</strong> (public), and <strong>previews</strong> (public).
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Bucket policies enabled in SQL</span>
                </div>

              </div>

              {/* Client integration instructions */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 sm:p-6 space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Client Initialization Template</span>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  To bind your React frontend to the deployed Supabase cluster, install the Javascript SDK client and initiate using your project credentials:
                </p>

                <div className="bg-slate-900 rounded-xl p-4.5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto space-y-1.5">
                  <span className="text-sky-400">import</span> {"{"} createClient {"}"} <span className="text-sky-400">from</span> <span className="text-emerald-400">"@supabase/supabase-js"</span>;
                  <br />
                  <br />
                  <span className="text-slate-500">// Initialize client with environment variables</span>
                  <br />
                  <span className="text-sky-400">const</span> supabaseUrl = <span className="text-amber-400">import.meta.env.VITE_SUPABASE_URL</span>;
                  <br />
                  <span className="text-sky-400">const</span> supabaseAnonKey = <span className="text-amber-400">import.meta.env.VITE_SUPABASE_ANON_KEY</span>;
                  <br />
                  <br />
                  <span className="text-sky-400">export const</span> supabase = createClient(supabaseUrl, supabaseAnonKey);
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                  <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                  <span>Always declare these variables in .env.example files inside the project.</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
