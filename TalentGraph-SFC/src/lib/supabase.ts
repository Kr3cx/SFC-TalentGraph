import { createClient } from '@supabase/supabase-js';

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Get environment variables
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase URL or Anon Key is missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables (Settings > Secrets).');
} else if (!isValidUrl(supabaseUrl)) {
  console.error('CRITICAL: Supabase URL is invalid! It must be a valid HTTP or HTTPS URL. Current value:', supabaseUrl);
}


