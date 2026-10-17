import { supabase } from '../lib/supabaseClient';
import {
  TajProfile,
  TajGroup,
  TajMemorization,
  TajNearReview,
  TajFarReview,
  TajOldMemorization,
  TajAttendance,
  AttendanceType,
  UserRole,
} from '../types/database';

export const tajService = {
  // -------------------------------------------------------------
  // GROUPS
  // -------------------------------------------------------------
  async getGroups(): Promise<TajGroup[]> {
    const { data: groups, error } = await supabase
      .from('taj_groups')
      .select(`
        *,
        supervisor:taj_profiles!fk_taj_groups_supervisor_profile(id, name)
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('getGroups error:', error.message);
      return [];
    }

    // Get student count per group
    const { data: counts } = await supabase
      .from('taj_profiles')
      .select('group_id')
      .eq('role', 'student');

    const countMap: Record<string, number> = {};
    counts?.forEach((row) => {
      if (row.group_id) {
        countMap[row.group_id] = (countMap[row.group_id] || 0) + 1;
      }
    });

    return (groups || []).map((g) => ({
      ...g,
      supervisor_name: g.supervisor?.name || 'غير محددة',
      students_count: countMap[g.id] || 0,
    }));
  },

  async createGroup(group: Partial<TajGroup>): Promise<{ data: TajGroup | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('taj_groups')
      .insert({
        name: group.name,
        supervisor_id: group.supervisor_id || null,
        category: group.category || 'حلقة إتقان',
        session_time: group.session_time || 'فترة الفجر (٥:٣٠ ص - ٧:٠٠ ص)',
        location: group.location || 'قاعة الإمام نافع',
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data, error: null };
  },

  async updateGroup(id: string, updates: Partial<TajGroup>): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('taj_groups')
      .update(updates)
      .eq('id', id);

    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  async deleteGroup(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_groups').delete().eq('id', id);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  // -------------------------------------------------------------
  // PROFILES / USERS
  // -------------------------------------------------------------
  async getAllProfiles(): Promise<TajProfile[]> {
    const { data, error } = await supabase
      .from('taj_profiles')
      .select(`
        *,
        group:taj_groups(id, name)
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('getAllProfiles error:', error.message);
      return [];
    }

    return (data || []).map((p) => ({
      ...p,
      group_name: p.group?.name || null,
    }));
  },

  async getSupervisors(): Promise<TajProfile[]> {
    const { data, error } = await supabase
      .from('taj_profiles')
      .select('*')
      .eq('role', 'supervisor')
      .order('name', { ascending: true });

    if (error) {
      console.error('getSupervisors error:', error.message);
      return [];
    }
    return data || [];
  },

  async getStudentsByGroup(groupId: string): Promise<TajProfile[]> {
    const { data, error } = await supabase
      .from('taj_profiles')
      .select('*')
      .eq('role', 'student')
      .eq('group_id', groupId)
      .order('name', { ascending: true });

    if (error) {
      console.error('getStudentsByGroup error:', error.message);
      return [];
    }
    return data || [];
  },

  async getSupervisorGroup(supervisorId: string): Promise<TajGroup | null> {
    const { data, error } = await supabase
      .from('taj_groups')
      .select('*')
      .eq('supervisor_id', supervisorId)
      .maybeSingle();

    if (error) {
      console.error('getSupervisorGroup error:', error.message);
      return null;
    }
    return data;
  },

  async updateUserRoleAndGroup(
    profileId: string,
    role: UserRole,
    groupId: string | null
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('taj_profiles')
      .update({
        role,
        group_id: groupId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  async updateProfile(profileId: string, updates: Partial<TajProfile>): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('taj_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  // -------------------------------------------------------------
  // MEMORIZATION (الحفظ الجديد)
  // -------------------------------------------------------------
  async getStudentMemorization(studentId: string): Promise<TajMemorization[]> {
    const { data, error } = await supabase
      .from('taj_memorization')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('getStudentMemorization error:', error.message);
      return [];
    }
    return data || [];
  },

  async addMemorization(entry: Omit<TajMemorization, 'id' | 'created_at'>): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_memorization').insert(entry);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  async deleteMemorization(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_memorization').delete().eq('id', id);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  // -------------------------------------------------------------
  // NEAR REVIEW (المراجعة القريبة)
  // -------------------------------------------------------------
  async getStudentNearReviews(studentId: string): Promise<TajNearReview[]> {
    const { data, error } = await supabase
      .from('taj_near_review')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('getStudentNearReviews error:', error.message);
      return [];
    }
    return data || [];
  },

  async addNearReview(entry: Omit<TajNearReview, 'id' | 'created_at'>): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_near_review').insert(entry);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  async deleteNearReview(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_near_review').delete().eq('id', id);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  // -------------------------------------------------------------
  // FAR REVIEW (المراجعة البعيدة)
  // -------------------------------------------------------------
  async getStudentFarReviews(studentId: string): Promise<TajFarReview[]> {
    const { data, error } = await supabase
      .from('taj_far_review')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('getStudentFarReviews error:', error.message);
      return [];
    }
    return data || [];
  },

  async addFarReview(entry: Omit<TajFarReview, 'id' | 'created_at'>): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_far_review').insert(entry);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  async deleteFarReview(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_far_review').delete().eq('id', id);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  // -------------------------------------------------------------
  // OLD MEMORIZATION (الحفظ القديم)
  // -------------------------------------------------------------
  async getStudentOldMemorization(studentId: string): Promise<TajOldMemorization[]> {
    const { data, error } = await supabase
      .from('taj_old_memorization')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('getStudentOldMemorization error:', error.message);
      return [];
    }
    return data || [];
  },

  async addOldMemorization(entry: Omit<TajOldMemorization, 'id' | 'created_at'>): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_old_memorization').insert(entry);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  async deleteOldMemorization(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.from('taj_old_memorization').delete().eq('id', id);
    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  // -------------------------------------------------------------
  // ATTENDANCE (الحضور والغياب)
  // -------------------------------------------------------------
  async getStudentAttendance(studentId: string): Promise<TajAttendance[]> {
    const { data, error } = await supabase
      .from('taj_attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('getStudentAttendance error:', error.message);
      return [];
    }
    return data || [];
  },

  async recordAttendance(
    studentId: string,
    date: string,
    status: AttendanceType,
    note?: string
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('taj_attendance')
      .upsert(
        {
          student_id: studentId,
          date,
          status,
          note: note || null,
        },
        { onConflict: 'student_id,date' }
      );

    if (error) return { error: new Error(error.message) };
    return { error: null };
  },

  async getGroupAttendanceForDate(studentIds: string[], date: string): Promise<Record<string, TajAttendance>> {
    if (!studentIds.length) return {};

    const { data, error } = await supabase
      .from('taj_attendance')
      .select('*')
      .in('student_id', studentIds)
      .eq('date', date);

    if (error) {
      console.error('getGroupAttendanceForDate error:', error.message);
      return {};
    }

    const map: Record<string, TajAttendance> = {};
    data?.forEach((att) => {
      map[att.student_id] = att;
    });
    return map;
  },

  async markAllPresent(studentIds: string[], date: string): Promise<{ error: Error | null }> {
    if (!studentIds.length) return { error: null };

    const records = studentIds.map((id) => ({
      student_id: id,
      date,
      status: 'present' as AttendanceType,
      note: 'حاضرة في الموعد',
    }));

    const { error } = await supabase
      .from('taj_attendance')
      .upsert(records, { onConflict: 'student_id,date' });

    if (error) return { error: new Error(error.message) };
    return { error: null };
  },
};
