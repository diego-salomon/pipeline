import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Build a Supabase client for live mode. Uses the anon key + RLS. */
export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      'Live mode requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See .env.example.',
    )
  }
  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}
