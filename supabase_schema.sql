-- =========================================================================
-- مشروع تاج الوقار – منصة حلقات الحافظات
-- السكربت الشامل لإعداد قاعدة البيانات (Supabase SQL Script)
-- =========================================================================

-- تفعيل امتداد uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1) جدول المجموعات / الحلقات (taj_groups)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taj_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category TEXT DEFAULT 'حلقة مكثف إتقان',
    session_time TEXT DEFAULT 'فترة الفجر (٥:٣٠ ص - ٧:٠٠ ص)',
    location TEXT DEFAULT 'قاعة الإمام نافع',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2) جدول الملفات الشخصية والمستخدمين (taj_profiles)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taj_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'student')),
    group_id UUID REFERENCES public.taj_groups(id) ON DELETE SET NULL,
    phone TEXT,
    avatar_url TEXT,
    track TEXT DEFAULT 'ختمة الإجازة',
    level TEXT DEFAULT 'متقنة',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ربط المفتاح الأجنبي لمشرفة المجموعة بجدول profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_taj_groups_supervisor_profile'
    ) THEN
        ALTER TABLE public.taj_groups
        ADD CONSTRAINT fk_taj_groups_supervisor_profile
        FOREIGN KEY (supervisor_id) REFERENCES public.taj_profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- -------------------------------------------------------------------------
-- 3) جدول الحفظ الجديد (taj_memorization)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taj_memorization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.taj_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    surah TEXT NOT NULL,
    from_ayah INT NOT NULL DEFAULT 1,
    to_ayah INT NOT NULL DEFAULT 10,
    pages_count NUMERIC(4, 2) DEFAULT 1.0,
    score NUMERIC(4, 2) NOT NULL DEFAULT 10.0,
    verbal_errors INT DEFAULT 0,
    warnings INT DEFAULT 0,
    rating TEXT DEFAULT 'ممتاز مرتفع',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4) جدول المراجعة القريبة (الصغرى) (taj_near_review)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taj_near_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.taj_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    surah TEXT NOT NULL,
    from_ayah INT NOT NULL DEFAULT 1,
    to_ayah INT NOT NULL DEFAULT 10,
    score NUMERIC(4, 2) NOT NULL DEFAULT 10.0,
    rating TEXT DEFAULT 'متقن جداً',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5) جدول المراجعة البعيدة (الكبرى) (taj_far_review)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taj_far_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.taj_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    surah TEXT NOT NULL,
    from_ayah INT NOT NULL DEFAULT 1,
    to_ayah INT NOT NULL DEFAULT 10,
    score NUMERIC(4, 2) NOT NULL DEFAULT 10.0,
    rating TEXT DEFAULT 'ممتاز',
    has_sanad_badge BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6) جدول الحفظ القديم (taj_old_memorization)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taj_old_memorization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.taj_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    surah TEXT NOT NULL,
    from_ayah INT NOT NULL DEFAULT 1,
    to_ayah INT NOT NULL DEFAULT 10,
    score NUMERIC(4, 2) NOT NULL DEFAULT 10.0,
    rating TEXT DEFAULT 'متقن كالفاتحة',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7) جدول الحضور والغياب (taj_attendance)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.taj_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.taj_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('present', 'excused', 'unexcused')),
    note TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT taj_attendance_unique_day UNIQUE(student_id, date)
);

-- -------------------------------------------------------------------------
-- دوال المساعدة الأمنية (Security Definer Functions) لتجنب التكرار وحماية RLS
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.taj_get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT role FROM public.taj_profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.taj_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.taj_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.taj_is_supervisor_of_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.taj_profiles s
        JOIN public.taj_groups g ON g.id = s.group_id
        WHERE s.id = p_student_id
          AND g.supervisor_id = auth.uid()
    );
$$;

-- -------------------------------------------------------------------------
-- تفعيل أمان الصفوف (Row Level Security - RLS) على جميع الجداول
-- -------------------------------------------------------------------------
ALTER TABLE public.taj_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taj_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taj_memorization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taj_near_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taj_far_review ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taj_old_memorization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taj_attendance ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- سياسات RLS: taj_groups
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "taj_groups_select" ON public.taj_groups;
CREATE POLICY "taj_groups_select" ON public.taj_groups
    FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "taj_groups_admin_all" ON public.taj_groups;
CREATE POLICY "taj_groups_admin_all" ON public.taj_groups
    FOR ALL TO authenticated
    USING (public.taj_is_admin())
    WITH CHECK (public.taj_is_admin());

-- -------------------------------------------------------------------------
-- سياسات RLS: taj_profiles
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "taj_profiles_select" ON public.taj_profiles;
CREATE POLICY "taj_profiles_select" ON public.taj_profiles
    FOR SELECT TO authenticated
    USING (
        public.taj_is_admin()
        OR id = auth.uid()
        OR public.taj_is_supervisor_of_student(id)
        OR role = 'supervisor'
    );

DROP POLICY IF EXISTS "taj_profiles_insert" ON public.taj_profiles;
CREATE POLICY "taj_profiles_insert" ON public.taj_profiles
    FOR INSERT TO authenticated
    WITH CHECK (
        public.taj_is_admin()
        OR id = auth.uid()
    );

DROP POLICY IF EXISTS "taj_profiles_update" ON public.taj_profiles;
CREATE POLICY "taj_profiles_update" ON public.taj_profiles
    FOR UPDATE TO authenticated
    USING (
        public.taj_is_admin()
        OR id = auth.uid()
        OR public.taj_is_supervisor_of_student(id)
    )
    WITH CHECK (
        public.taj_is_admin()
        OR (id = auth.uid() AND (SELECT role FROM public.taj_profiles WHERE id = auth.uid()) = role)
        OR public.taj_is_supervisor_of_student(id)
    );

DROP POLICY IF EXISTS "taj_profiles_delete" ON public.taj_profiles;
CREATE POLICY "taj_profiles_delete" ON public.taj_profiles
    FOR DELETE TO authenticated
    USING (public.taj_is_admin());

-- -------------------------------------------------------------------------
-- سياسات RLS لجداول الحفظ والمراجعات والغياب
-- (المديرة ترى وتعدل الكل، المشرفة ترى وتعدل طالبات حلقتها، الحافظة تقرأ بياناتها فقط)
-- -------------------------------------------------------------------------

-- 1) taj_memorization
DROP POLICY IF EXISTS "taj_memorization_select" ON public.taj_memorization;
CREATE POLICY "taj_memorization_select" ON public.taj_memorization
    FOR SELECT TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
        OR student_id = auth.uid()
    );

DROP POLICY IF EXISTS "taj_memorization_modify" ON public.taj_memorization;
CREATE POLICY "taj_memorization_modify" ON public.taj_memorization
    FOR ALL TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    )
    WITH CHECK (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    );

-- 2) taj_near_review
DROP POLICY IF EXISTS "taj_near_review_select" ON public.taj_near_review;
CREATE POLICY "taj_near_review_select" ON public.taj_near_review
    FOR SELECT TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
        OR student_id = auth.uid()
    );

DROP POLICY IF EXISTS "taj_near_review_modify" ON public.taj_near_review;
CREATE POLICY "taj_near_review_modify" ON public.taj_near_review
    FOR ALL TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    )
    WITH CHECK (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    );

-- 3) taj_far_review
DROP POLICY IF EXISTS "taj_far_review_select" ON public.taj_far_review;
CREATE POLICY "taj_far_review_select" ON public.taj_far_review
    FOR SELECT TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
        OR student_id = auth.uid()
    );

DROP POLICY IF EXISTS "taj_far_review_modify" ON public.taj_far_review;
CREATE POLICY "taj_far_review_modify" ON public.taj_far_review
    FOR ALL TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    )
    WITH CHECK (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    );

-- 4) taj_old_memorization
DROP POLICY IF EXISTS "taj_old_memorization_select" ON public.taj_old_memorization;
CREATE POLICY "taj_old_memorization_select" ON public.taj_old_memorization
    FOR SELECT TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
        OR student_id = auth.uid()
    );

DROP POLICY IF EXISTS "taj_old_memorization_modify" ON public.taj_old_memorization;
CREATE POLICY "taj_old_memorization_modify" ON public.taj_old_memorization
    FOR ALL TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    )
    WITH CHECK (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    );

-- 5) taj_attendance
DROP POLICY IF EXISTS "taj_attendance_select" ON public.taj_attendance;
CREATE POLICY "taj_attendance_select" ON public.taj_attendance
    FOR SELECT TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
        OR student_id = auth.uid()
    );

DROP POLICY IF EXISTS "taj_attendance_modify" ON public.taj_attendance;
CREATE POLICY "taj_attendance_modify" ON public.taj_attendance
    FOR ALL TO authenticated
    USING (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    )
    WITH CHECK (
        public.taj_is_admin()
        OR public.taj_is_supervisor_of_student(student_id)
    );

-- -------------------------------------------------------------------------
-- Trigger: إنشاء ملف شخصي تلقائي عند تسجيل أي مستخدم جديد عبر Supabase Auth
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.taj_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role TEXT;
    v_name TEXT;
BEGIN
    -- استخراج الدور والاسم من الـ user_metadata إن وجد
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    v_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

    -- التأكد من صحة الدور
    IF v_role NOT IN ('admin', 'supervisor', 'student') THEN
        v_role := 'student';
    END IF;

    INSERT INTO public.taj_profiles (id, name, role)
    VALUES (NEW.id, v_name, v_role)
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.taj_handle_new_user();

-- تم بحمد الله إنشاء جميع الجداول والسياسات والدوال
