-- ============================================================
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
