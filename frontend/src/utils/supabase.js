import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl.length > 10;

let supabase = null;
if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
    console.log('[DB] Supabase connected');
  } catch (err) {
    console.warn('[DB] Supabase init failed:', err.message);
  }
} else {
  console.warn('[DB] Supabase not configured, using localStorage only');
}

export { supabase, isConfigured };
