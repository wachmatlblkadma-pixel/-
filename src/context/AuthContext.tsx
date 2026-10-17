import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { TajProfile, UserRole } from '../types/database';

interface AuthContextType {
  user: User | null;
  profile: TajProfile | null;
  role: UserRole | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: UserRole,
    groupId?: string | null
  ) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TajProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string): Promise<TajProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('taj_profiles')
        .select(`
          *,
          group:taj_groups(name)
        `)
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching taj_profile:', error.message);
        return null;
      }

      if (data) {
        const profileObj: TajProfile = {
          ...data,
          group_name: data.group?.name || null,
        };
        setProfile(profileObj);
        return profileObj;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session: Session | null) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { error };
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('حدث خطأ أثناء تسجيل الدخول');
      return { error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole = 'student',
    groupId: string | null = null
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role,
          },
        },
      });

      if (error) return { error, user: null };

      // Ensure profile exists in taj_profiles table (in case trigger hasn't fired yet)
      if (data.user) {
        const newUserId = data.user.id;
        const { error: profileError } = await supabase
          .from('taj_profiles')
          .upsert({
            id: newUserId,
            name: name.trim(),
            role,
            group_id: groupId || null,
          });

        if (profileError) {
          console.warn('Profile upsert warning:', profileError.message);
        }
        await fetchProfile(newUserId);
      }

      return { error: null, user: data.user };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('حدث خطأ أثناء إنشاء الحساب');
      return { error, user: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role ?? null,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
