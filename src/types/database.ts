export type UserRole = 'admin' | 'supervisor' | 'student';

export type AttendanceType = 'present' | 'excused' | 'unexcused';

export interface TajProfile {
  id: string;
  name: string;
  role: UserRole;
  group_id: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  track?: string | null;
  level?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  // joined fields
  group_name?: string;
  email?: string;
}

export interface TajGroup {
  id: string;
  name: string;
  supervisor_id?: string | null;
  category?: string;
  session_time?: string;
  location?: string;
  created_at?: string;
  // joined fields
  supervisor_name?: string;
  students_count?: number;
}

export interface TajMemorization {
  id: string;
  student_id: string;
  date: string;
  surah: string;
  from_ayah: number;
  to_ayah: number;
  pages_count: number;
  score: number;
  verbal_errors: number;
  warnings: number;
  rating: string;
  notes?: string | null;
  created_by?: string | null;
  created_at?: string;
}

export interface TajNearReview {
  id: string;
  student_id: string;
  date: string;
  surah: string;
  from_ayah: number;
  to_ayah: number;
  score: number;
  rating: string;
  notes?: string | null;
  created_by?: string | null;
  created_at?: string;
}

export interface TajFarReview {
  id: string;
  student_id: string;
  date: string;
  surah: string;
  from_ayah: number;
  to_ayah: number;
  score: number;
  rating: string;
  has_sanad_badge?: boolean;
  notes?: string | null;
  created_by?: string | null;
  created_at?: string;
}

export interface TajOldMemorization {
  id: string;
  student_id: string;
  date: string;
  surah: string;
  from_ayah: number;
  to_ayah: number;
  score: number;
  rating: string;
  notes?: string | null;
  created_by?: string | null;
  created_at?: string;
}

export interface TajAttendance {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceType;
  note?: string | null;
  created_by?: string | null;
  created_at?: string;
}
