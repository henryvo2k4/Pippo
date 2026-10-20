import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'pippo_supabase_url';
const STORAGE_ANON_KEY = 'pippo_supabase_anon_key';
const LEGACY_URL_KEY = 'wonderverse_supabase_url';
const LEGACY_ANON_KEY = 'wonderverse_supabase_anon_key';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const localUrl = typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_URL_KEY) || localStorage.getItem(LEGACY_URL_KEY)
    : null;
  const localKey = typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_ANON_KEY) || localStorage.getItem(LEGACY_ANON_KEY)
    : null;

  const url = (localUrl || envUrl || '').trim();
  const anonKey = (localKey || envKey || '').trim();
  const isConfigured = Boolean(url && anonKey && url.startsWith('http') && !url.includes('your-project-id'));

  return { url, anonKey, isConfigured };
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey);
  }
  return supabaseInstance;
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  supabaseInstance = null;
}

export function clearSupabaseConfig() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_ANON_KEY);
  supabaseInstance = null;
}
