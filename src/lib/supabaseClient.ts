import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://gotckxgdnybpstbvrmwr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseAnonKey &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE' &&
  supabaseAnonKey.length > 20
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
