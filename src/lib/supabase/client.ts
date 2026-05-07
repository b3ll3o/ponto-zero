import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

// Guard: prevent Supabase client creation when credentials are placeholder/missing.
// This must be checked BEFORE calling createBrowserClient/createServerClient,
// otherwise @supabase/ssr throws "URL and API key are required" at build time.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const configured = isSupabaseConfigured();

export function createClient() {
  if (!configured) {
    // Return a no-op mock during builds before env vars are set.
    // Auth operations will be no-ops until real credentials are provided.
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
        signUp: async () => ({ data: { session: null, user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}