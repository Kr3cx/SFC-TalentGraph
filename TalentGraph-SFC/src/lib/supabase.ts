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
const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Hardcoded fallbacks
const fallbackUrl = 'https://gbbeguojswhjhqvcvaxo.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiYmVndW9qc3doamhxdmN2YXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODc1MDksImV4cCI6MjA5MTU2MzUwOX0.RK5r6OIxHYLfL9KOuCHCLeUajhzFyTFnizLjSNqoDPI';

// Choose the best available credentials
const supabaseUrl = isValidUrl(envUrl) ? envUrl : fallbackUrl;
const supabaseAnonKey = (envKey && envKey.length > 20) ? envKey : fallbackKey;

// Log initialization status (helpful for debugging)
if (isValidUrl(envUrl)) {
  console.log('Supabase: Using environment variables');
} else {
  console.warn('Supabase: Environment URL is invalid or missing, using fallback URL');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase URL or Anon Key is missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables (Settings > Secrets).');
} else if (!isValidUrl(supabaseUrl)) {
  console.error('CRITICAL: Supabase URL is invalid! It must be a valid HTTP or HTTPS URL. Current value:', supabaseUrl);
}


